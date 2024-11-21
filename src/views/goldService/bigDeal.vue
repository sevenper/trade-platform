<script setup>
import { ref, reactive, onMounted, computed, inject, getCurrentInstance } from 'vue'
import * as api from '@/axios/api'
import tableList from '@/components/table/index.vue'
import myModal from '@/components/dialog.vue'
import { stockType } from '@/constants/commonkey'
import dayjs from 'dayjs'
import router from '@/router'
import { tablePage, bigDealColumns, dialogConfig } from './config'
const message = inject('message')
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()

const buyNum = ref(null)
const activeKey = ref('5')
const dataLists = ref([])
const confirmLoading = ref(false)
let itemData = reactive({})
const init = () => {
  getList('5')
}

const stockTypeV = computed(() => {
  return [stockType.value[3], stockType.value[2]]
})
const openDialog = ref(false)

const getList = async (countryId) => {
  tablePage.isLoading = true
  tablePage.apiLoading = true
  let params = {
    countryId,
    type: 0,
  }
  const { data } = await api.getPremiumList(params)
  if (data) tablePage.apiLoading = false
  let dataList
  dataList = [...dataLists.value, ...data]

  dataLists.value = dataList.map((item, key) => {
    return {
      ...item,
      actionFun: [
        {
          text: textI18n('stockTable.a11'),
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
  openDialog.value = true
}
const handleCancelModal = (type) => {
  // 处理取消事件
  console.log('模态框被关闭')
  openDialog.value = false
}

const onConfirmDialog = () => {
  if (!buyNum.value) {
    message.error(textI18n('tips.a1'))
    return false
  }
  if (buyNum.value < itemData.minBuyAmt) {
    message.error(textI18n('other.a25'))
    return false
  }
  confirmLoading.value = true
  buyApi()
}

const buyApi = async () => {
  let params = {
    premiumId: itemData.id,
    sgname: itemData.stockName,
    sgdaima: itemData.stockCode,
    sgprice: itemData.price,
    sgsumber: buyNum.value,
    buyNum: buyNum.value,
    tmes: dayjs().unix(),
    // tradePass: this.pass
  }

  try {
    let data = await api.premiumbuy(params)
    if (data?.status === 0) {
      setTimeout(() => {
        openDialog.value = false
        confirmLoading.value = false
        message.success(data.msg)
        router.push('/myholding?type=3')
      }, 3000)
    }
  } catch (error) {
    confirmLoading.value = false
    // message.error(error);
  }
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
      <em>>{{ $t('menu.a18') }}</em>
    </div>
  </div>
  <div class="content">
    <a-tabs class="con-tabs" v-model:activeKey="activeKey" @change="countryClick(activeKey)">
      <a-tab-pane :tab="item.label" :key="item.key" v-for="item in stockTypeV"></a-tab-pane>
    </a-tabs>
    <div class="table-div">
      <tableList
        :columnsData="bigDealColumns"
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
      :confirmLoading="confirmLoading"
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
