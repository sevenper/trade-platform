<script setup>
import { ref, reactive, onMounted, computed, inject, getCurrentInstance } from 'vue'
import * as api from '@/axios/api'
import tableList from '@/components/table/index.vue'
import myModal from '@components/dialog.vue'
import { stockType } from '@/constants/commonkey'
import dayjs from 'dayjs'
import { tablePage, placementColumns, dialogConfig } from './config'
const message = inject('message')
import { Modal } from 'ant-design-vue'
import router from '@/router'
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()

const buyNum = ref(null)
const activeKey = ref('5')
const dataLists = ref([])
const stockTypeV = computed(() => {
  return [stockType.value[3], stockType.value[2]]
})
let itemData = reactive({})
const init = () => {
  getList('5')
}

const openDialog = ref(false)

const getList = async () => {
  tablePage.isLoading = true
  tablePage.apiLoading = true
  let params = {
    pageNum: 1,
    pageSize: 99,
    dataType: 2,
    ipoType: activeKey.value,
  }
  const { data } = await api.xingusg(params)
  if (data) tablePage.apiLoading = false
  let dataList
  dataList = [...dataLists.value, ...data.list]

  dataLists.value = dataList.map((item, key) => {
    return {
      ...item,
      actionFun: [
        {
          text: textI18n('stockTable.a12'),
          style: tablePage.actionStyle,
        },
      ], //操作
    }
  })

  tablePage.isLoading = true
}

const countryClick = (item) => {
  dataLists.value = []
  getList(item)
}
const handleClick = (type, item) => {
  console.log(type, 'type11')
  console.log(item, 'item11')
  itemData = item
  Modal.confirm({
    title: textI18n('stockTable.a12'),
    content: textI18n('stockTable.a17'),
    async onOk() {
      try {
        await buyApi()
        setTimeout(() => {
          router.replace('/myholding?type=2') //跳转我的持仓  申购记录
        }, 3000)
        // return true
      } catch {
        return console.log('err')
      }
    },

    onCancel() {
      message.warning(textI18n('con.a16'))
    },
  })
}
const handleCancelModal = (type) => {
  // 处理取消事件
  console.log('模态框被关闭')
  openDialog.value = false
}

const onConfirmDialog = () => {
  if (Number(payMoney.value) < itemData.minBuyAmt) {
    message.error(textI18n('tips.a1'))
    return false
  }
  buyApi()
}

const buyApi = async () => {
  let params = {
    id: itemData.id,
    sgname: itemData.stockName,
    sgdaima: itemData.stockCode,
    sgprice: itemData.price,
    tmes: dayjs().unix(),
    // tradePass: this.pass
  }
  let data = await api.xingusgs(params)
  message.success(data.msg)
  console.log(data, 'xingusgs')
  return data
}

const payMoney = computed(() => (buyNum.value * itemData.price).toFixed(2) || 0)

onMounted(() => {
  init()
})
</script>

<template>
  <div class="back">
    <div>
      <i>{{ $t('menu.a9') }}</i>
      <em>>{{ $t('menu.a20') }}</em>
    </div>
  </div>
  <div class="content">
    <a-tabs class="con-tabs" v-model:activeKey="activeKey" @change="countryClick(activeKey)">
      <a-tab-pane :tab="item.label" :key="item.key" v-for="item in stockTypeV"></a-tab-pane>
    </a-tabs>
    <div class="table-div">
      <tableList
        :columnsData="placementColumns"
        :dataLists="dataLists"
        :tablePage="tablePage"
        @getList="getList"
        @handleClick="handleClick"
      ></tableList>
    </div>
    <myModal
      class="big-modal"
      :open="openDialog"
      :dialogConfig="dialogConfig"
      @cancel="handleCancelModal"
      @confirmDialog="onConfirmDialog"
    >
      <div class="dis-flex">
        <p class="title-name">{{ itemData.stockName }}</p>
        <p class="title-code">{{ itemData.stockCode }}</p>
      </div>
      <div class="dis-flex">
        <p class="title-money">
          <i>{{ $t('stockTable.a7') }}：</i>
          <em>{{ itemData.priceMarket }}</em>
        </p>
        <p class="title-money title-right">
          <i>{{ $t('stockTable.a8') }}：</i>
          <em>{{ itemData.price }}</em>
        </p>
      </div>

      <a-input-number
        class="input-style"
        v-model:value="buyNum"
        size="large"
        :min="1"
        :placeholder="$t('placeholder.a9')"
      />

      <p class="bot-p">
        <i>{{ $t('stockTable.a10') }}：</i>
        <em> {{ payMoney }}</em>
      </p>

      <p class="bot-p">
        <i>{{ $t('stockTable.a9') }}：</i>
        <em> {{ itemData.minBuyAmt }}</em>
      </p>
    </myModal>
  </div>
</template>

<style lang="scss" scoped>
.back {
  width: 100%;
  height: 63px;
  background: rgba(56, 142, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  & > div {
    width: 1004px;
    height: 100%;
    position: relative;
    padding-left: 18px;
    display: flex;
    align-items: center;
    > i {
      font-weight: 500;
      font-size: 16px;
      color: #9aa5b5;
      font-style: normal;
      margin-right: 5px;
    }
    > em {
      font-weight: 500;
      font-size: 16px;
      color: #000000;
      font-style: normal;
    }
  }
}
.content {
  margin: 0 auto;
  max-width: 1004px;
  padding: 10px 38px 38px 38px;
  background-color: #fff;
  .con-tabs {
    :deep(.ant-tabs-tab) {
      font-weight: 500;
      font-size: 18px;
      color: #919395;
    }
    :deep(.ant-tabs-tab-active) {
      font-weight: bold;
    }
  }
  .big-modal {
    ::v-deep .ant-modal {
      width: 784px !important;
      .ant-modal-content {
        padding: 100px 120px;
        .ant-modal-body {
          .dis-flex {
            display: flex;
            align-items: end;
            .title-name {
              font-weight: bold;
              font-size: 24px;
              color: #000000;
            }
            .title-code {
              font-weight: 500;
              font-size: 16px;
              color: #707070;
              margin-left: 10px;
            }
            .title-right {
              margin-left: 86px;
            }
            .title-money {
              margin-top: 25px;
              > i {
                font-weight: 500;
                font-size: 16px;
                color: #919395;
                font-style: normal;
              }
              > em {
                font-weight: bold;
                font-size: 16px;
                color: #000000;
                font-style: normal;
                margin-left: 8px;
              }
            }
          }
          .input-style {
            width: 100%;
            margin: 20px 0;
          }
          .bot-p {
            > i {
              font-size: 14px;
              color: #707070;
              font-style: normal;
            }
            > em {
              font-weight: bold;
              font-size: 14px;
              color: #000000;
              font-style: normal;
            }
          }
        }

        .ant-modal-footer {
          margin-top: 44px;
          display: flex;
          .ant-btn {
            width: 49%;
            height: 56px;
            font-weight: 500;
            font-size: 18px;
            color: #ffffff;
          }
          .ant-btn-default {
            font-weight: 500;
            font-size: 18px;
            color: #919395;
            background: #e9eaed;
            border: none;
          }
        }
      }
    }
  }
}
</style>
