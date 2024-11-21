<script setup>
import { ref, reactive, onMounted, computed, inject, getCurrentInstance, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'
import * as api from '@/axios/api'
import tableList from '@/components/table/index.vue'
import myModal from '@components/dialog.vue'
import {
  columns,
  columnsIPO,
  columnsPending,
  amtArray,
  tablePage,
  listType,
  ztsToText,
  statusToText,
  dialogConfig,
} from './config'
import { useAppStore } from '@/store/index'
import { stockType } from '@/constants/commonkey'
const message = inject('message')

const route = useRoute()
const router = useRoute()
const store = useAppStore()

const {
  proxy: { $t: textI18n },
} = getCurrentInstance()
const activeKey = ref(0)
const activeKeyList = ref(0)
const dataLists = ref([])
const confirmLoading = ref(false)
const stockTypeV = computed(() => {
  return [stockType.value[3], stockType.value[2]]
})
const amtArr = computed(() => store.amtArr)
let itemData = reactive({})
const urlParams = route.query //获取url参数type
if (urlParams?.type) activeKeyList.value = Number(urlParams?.type)

const init = () => {
  listFun(activeKeyList.value)
}
// 我的持仓/平仓  0 持仓  1平仓
const getListStock = async (currentPage, state) => {
  tablePage.pageNum = currentPage ? currentPage : tablePage.pageNum
  tablePage.isLoading = true
  let params = {
    state: activeKeyList.value, //0 持仓  1平仓
    pageNum: tablePage.pageNum,
    pageSize: tablePage.pageSize,
  }
  let { data } = await api.getOrderList(params)

  console.log(data, 'getOrderList')
  if (data) tablePage.apiLoading = false
  let dataList
  dataList = [...dataLists.value, ...data.list]
  let actionFun = [
    {
      text: textI18n('stockD.a22'),
      style: tablePage.actionStyle,
      key: 'sell',
    },
  ]
  dataLists.value = dataList.map((item, key) => {
    if (activeKeyList.value === 0) item.actionFun = actionFun
    return {
      ...item,
    }
  })

  tablePage.total = data.total
  tablePage.isLoading = dataLists.value.length === tablePage.total ? true : false
  console.log(dataLists.value)
}
// 申购记录
const getIpoList = async () => {
  // let params = {
  //     pageNum: tablePage.pageNum,
  //     pageSize: tablePage.pageSize,
  //     dataType: 1
  // };
  let { data } = await api.xingusgsList()
  console.log(data, 'getIpoList')
  if (data) tablePage.apiLoading = false
  let dataList
  dataList = [...dataLists.value, ...data]
  let actionFun = [
    {
      text: textI18n('stockD.a31'),
      style: tablePage.actionStyle,
      key: 'pay',
    },
  ]
  dataLists.value = dataList.map((item, key) => {
    if (item.zts == 1 && item.debit == 0) item.actionFun = actionFun

    return {
      ...item,
      statusStr:
        item.debit === 1 ? textI18n('stockD.a28') : ztsToText[item.zts] || textI18n('stockD.a28'),
    }
  })
  tablePage.isLoading = true //接口无分页
}
// 我的挂单
const getPendingOrder = async () => {
  tablePage.isPage = true
  let params = {
    pageNum: tablePage.pageNum,
    pageSize: tablePage.pageSize,
  }
  let { data } = await api.pendingOrderList(params)
  if (data) tablePage.apiLoading = false
  let dataList
  dataList = [...dataLists.value, ...data.list]
  dataLists.value = dataList.map((item, key) => {
    return {
      ...item,
      statusStr: statusToText[item.status],
    }
  })

  // tablePage.total = data.total;
  // 接口中 total总数为0  所以用 hasNextPage值也不对 无法 判断是否有分页
  // tablePage.isLoading = data.hasNextPage ? false : true
  tablePage.isLoading = true
}

const orderType = (item) => {
  listFun(item)
}
let columnsType
const listFun = (item) => {
  console.log(item, 'listFun')
  dataLists.value = []
  tablePage.apiLoading = true

  switch (item) {
    case 0:
      // columns.push({
      //     title: '',
      //     key: 'action',
      //     width: 100
      // })
      columnsType = computed(() => columns.value)
      getListStock(1, 0)
      break
    case 1:
      columnsType = computed(() => columns.value)
      getListStock(1, 1)
      break
    case 2:
      columnsType = computed(() => columnsIPO.value)
      getIpoList()
      break
    case 3:
      tablePage.pageNum = 1
      columnsType = computed(() => columnsPending.value)

      getPendingOrder()
      break
  }
}

const handleClick = (type, item) => {
  console.log(type, 'type11')
  console.log(item, 'item11')
  itemData = item
  switch (type.key) {
    case 'sell':
      pingCang()
      break
    case 'pay':
      handleCancelModal(true)
      break
  }
}

const pingCang = () => {
  Modal.confirm({
    title: textI18n('stockD.a22'),
    content: textI18n('stockTable.a18'),
    async onOk() {
      try {
        await sell()
        activeKeyList.value = 1
        init()
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

const sell = async () => {
  let params = {
    positionSn: itemData.positionSn,
  }
  let data = await api.sell(params)
  message.success(data.msg)
  return data
}

const openDialog = ref(false)
const handleCancelModal = (type) => {
  // 处理取消事件
  console.log('模态框被关闭')
  openDialog.value = type
}

const onConfirmDialog = async () => {
  confirmLoading.value = true
  // 认缴
  let params = {
    id: itemData.listsId,
  }
  try {
    let data = await api.xinguTransfer(params)
    if (data?.status === 1) {
      setTimeout(() => {
        openDialog.value = false
        confirmLoading.value = false
        message.success(data.msg)
        handleCancelModal(false)
        // 更新列表
        activeKeyList.value = 2
        listFun(2)
      }, 3000)
    }
  } catch (error) {
    confirmLoading.value = false
    // message.erro
  }
}
onMounted(() => {
  init()
})
</script>

<template>
  <div class="back">
    <div>
      <span @click="goBack">{{ $t('con.a1') }}</span>
    </div>
  </div>
  <div class="content-top">
    <div class="top">
      <a-tabs class="con-tabs" v-model:activeKey="activeKey">
        <a-tab-pane :tab="item.amt" :key="index" v-for="(item, index) in stockTypeV"></a-tab-pane>
      </a-tabs>
      <div class="top-content">
        <div>
          <p class="title">{{ $t('wallet.a1') }}</p>
          <p class="all-money">{{ amtArr[activeKey][0] }}</p>
        </div>
        <a-row>
          <a-col
            :xs="12"
            :sm="12"
            :md="6"
            :lg="6"
            :xl="6"
            v-for="(item, index) in amtArray"
            :key="index"
          >
            <div class="item">
              <div :class="'col-left-' + index"></div>
              <div>
                <p class="type-name">{{ item }}</p>
                <p class="type-money">{{ amtArr[activeKey][index + 1] }}</p>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>

  <div class="content-bot">
    <a-tabs class="con-tabs" v-model:activeKey="activeKeyList" @change="orderType(activeKeyList)">
      <a-tab-pane :tab="item.label" :key="index" v-for="(item, index) in listType"></a-tab-pane>
    </a-tabs>
    <div class="stock-div">
      <tableList
        :columnsData="columnsType"
        :dataLists="dataLists"
        :tablePage="tablePage"
        @getList="getListStock"
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
      <div class="top-title">
        <p>{{ itemData.xgname }}</p>
      </div>
      <div class="top-title">
        <span>{{ itemData.codes }}</span>
      </div>

      <div class="list">
        <p>{{ $t('other.a7') }}</p>
        <i>{{ itemData.winnLotteryNum }}</i>
      </div>
      <div class="list">
        <p>{{ $t('other.a8') }}</p>
        <i>{{ itemData.bzj }}</i>
      </div>
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
    &::before {
      content: '';
      position: absolute;
      width: 12px;
      height: 24px;
      background: url('@assets/img/common/back.png') 100% 100% no-repeat;
      transform: scale(0.5);
      left: 0;
      margin-top: 2px;
    }
    > span {
      cursor: pointer;
    }
  }
}
.content-top {
  margin: 0 auto;
  max-width: 1004px;
  background-color: #fff;
  padding: 0 38px 10px 38px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  .top {
    width: 100%;
    background: #ffffff;
    .con-tabs {
      ::v-deep .ant-tabs-tab {
        font-weight: bold;
        font-size: 24px;
        color: #56565b;
      }
      ::v-deep .ant-tabs-nav {
        &::before {
          border-bottom: none !important;
        }
      }
    }
    .top-content {
      .title {
        font-weight: bold;
        font-size: 20px;
        color: #000000;
      }
      .all-money {
        font-weight: bold;
        font-size: 40px;
        color: #000000;
      }
      .item {
        margin: 20px 0;
        display: flex;
        align-items: center;
        .type-name {
          font-weight: 500;
          font-size: 14px;
          color: #56565b;
        }
        .type-money {
          font-weight: bold;
          font-size: 25px;
          color: #000000;
          margin-top: 5px;
        }
      }
    }
  }
}

.content-bot {
  margin: 0 auto;
  margin-top: 8px;
  max-width: 1004px;
  background-color: #fff;
  padding: 0 38px 10px 38px;
  box-sizing: border-box;
  .con-tabs {
    ::v-deep .ant-tabs-tab {
      font-weight: bold;
      font-size: 24px;
      color: #56565b;
    }
    ::v-deep .ant-tabs-nav {
      &::before {
        border-bottom: none !important;
      }
    }
  }
}

.big-modal {
  ::v-deep .ant-modal {
    width: 784px !important;
    .ant-modal-content {
      padding: 100px 120px;
      .ant-modal-body {
        .top-title {
          display: flex;
          justify-content: space-between;
          height: 30px;
          line-height: 30px;
          > p {
            font-weight: bold;
            font-size: 20px;
            color: #252631;
          }
          > span {
            font-weight: 500;
            font-size: 16px;
            color: #707070;
          }
        }
        .list {
          display: flex;
          justify-content: space-between;
          height: 40px;
          line-height: 40px;
          > p {
            font-weight: 500;
            font-size: 16px;
            color: #919395;
          }
          > i {
            font-weight: bold;
            font-size: 16px;
            color: #000000;
            font-style: normal;
          }
        }
        .buy-btn {
          width: 100%;
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
</style>
