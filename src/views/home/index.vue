<script setup>
import { onMounted, reactive, ref, inject, computed, getCurrentInstance } from 'vue'
import * as api from '@/axios/api'
import { stockType } from '@/constants/commonkey'
import tableList from '@/components/table/index.vue'
import zsTop from '@/components/appCom/zs-top/index.vue'
import { columnsCun, columnsZS, columnsZX, tablePage } from './config'
import { setCache, getToken } from '@/utils/cache'
import { CacheStockDetail } from '@/constants/cacheKey'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useAppStore } from '@/store/index'
const store = useAppStore()
const message = inject('message')
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()

const tokenExists = computed(() => {
  return store.$state.token
})
const activeKey = ref('5') //默认
let columns
const stockTypeV = computed(() => {
  return tokenExists.value && getToken()
    ? [stockType.value[0], stockType.value[1], stockType.value[3], stockType.value[2]]
    : [stockType.value[1], stockType.value[3], stockType.value[2]]
})

const dataLists = ref([])

const init = () => {
  getListStock(1)
  columns = computed(() => columnsCun.value)
  // zixuanList()
}
// 默认国家
const getListStock = async (currentPage) => {
  tablePage.pageNum = currentPage ? currentPage : tablePage.pageNum
  tablePage.isLoading = true
  let params = {
    countryId: activeKey.value,
    pageNum: tablePage.pageNum,
    pageSize: tablePage.pageSize,
  }
  const { data } = await api.getStock(params)
  if (data) tablePage.apiLoading = false
  let dataList
  dataList = [...dataLists.value, ...data.list]

  dataLists.value = dataList.map((item, key) => {
    return {
      ...item,
      actionFun: [
        {
          text: computed(() => textI18n('stockD.a6')),
          style: tablePage.actionStyle,
        },
      ],
    }
  })
  if (tokenExists && getToken()) {
    dataLists.value.forEach((item) => {
      //检测是否已经添加了自选
      getOption(item.stockGid).then((status) => {
        item.isOptionOpt = status
      })
    })
  }

  tablePage.total = data.total
  tablePage.isLoading = dataLists.value.length === tablePage.total ? true : false
}

// 点击操作按钮
const handleClick = (type, item) => {
  console.log(type, 'type11') //按钮类型
  console.log(item, 'item11') //列表数据
  listClick(item)
}

const listClick = (item) => {
  store.$state.stockDetail = item
  setCache(CacheStockDetail, item, true)
  router.push('/stockdetail')
}

// 切换国家tab
const countryClick = (item) => {
  dataLists.value = []
  tablePage.apiLoading = true
  columns = computed(() => columnsCun.value)
  columns.value[0].dataIndex = 'stockName'
  if (item === '0') {
    //指数
    ;(tablePage.isPage = false), (columns = computed(() => columnsZS.value))
    columns.value[0].dataIndex = 'indexName'
    getListMarket()
    return
  }
  if (item === '-1') {
    //自选
    ;(tablePage.isPage = true), (columns = computed(() => columnsZX.value))
    zixuanList()
    return
  }
  ;(tablePage.isPage = true),
    // 国家
    getListStock(1)
}

// 指数
const getListMarket = async () => {
  const { data } = await api.getListMarket()
  if (data) tablePage.apiLoading = false
  let dataList
  dataList = [...dataLists.value, ...data]
  dataLists.value = dataList.map((item, key) => {
    return {
      ...item,
      actionFun: [
        {
          text: computed(() => textI18n('stockD.a7')),
          style: tablePage.actionStyle,
        },
      ], //操作
    }
  })
  tablePage.isLoading = true //指数没有分页
}
// 自选列表
const zixuanList = async () => {
  let params = {
    pageNum: tablePage.pageNum,
    pageSize: tablePage.pageSize,
  }
  let { data } = await api.getMyList(params)
  if (data) tablePage.apiLoading = false
  let dataList
  dataList = [...dataLists.value, ...data.list]
  dataLists.value = dataList.map((item, key) => {
    return {
      ...item,
      actionFun: [
        {
          text: computed(() => textI18n('stockD.a6')),
          style: tablePage.actionStyle,
        },
      ], //操作
    }
  })

  tablePage.total = data.total
  tablePage.isLoading = dataLists.value.length === tablePage.total ? true : false
}

const getOption = async (code) => {
  let params = { code }
  let data = await api.isOption(params)
  // 0 --> 未添加 1 已添加
  return data.status
}
// 点击添加/取消自选
const zixuanClick = async (gid, type, str) => {
  if (!tokenExists || !getToken()) {
    message.warning(textI18n('login.a8'))
    return
  }
  console.log(gid, type)
  try {
    let response
    if (type === 0) {
      response = await addAPI(gid)
    } else {
      response = await cancelAPI(gid)
    }
    console.log(response)
    if (response?.status === 0) {
      message.success(response.msg)
      // 更新列表数据,不请求接口
      if (str) {
        //如果是自选列表，
        // zixuanList()
        dataLists.value = dataLists.value.filter((item) => item.stock_gid !== gid)
        return
      }
      dataLists.value.forEach((item) => {
        if (item.stockGid === gid) {
          item.isOptionOpt = !item.isOptionOpt
        }
      })
      // getListStock(tablePage.pageNum)
    }
  } catch (error) {}
}
// 添加自选
const addAPI = async (code) => {
  let params = { code, type: 1 }
  let data = await api.addOption(params)
  return data
}
// 取消自选
const cancelAPI = async (code) => {
  let params = { code }
  let data = await api.delOption(params)
  return data
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="content">
    <div class="content-top">
      <zsTop></zsTop>
    </div>
    <div class="nav-div">
      <a-tabs class="con-tabs" v-model:activeKey="activeKey" @change="countryClick(activeKey)">
        <a-tab-pane :tab="item.label" :key="item.key" v-for="item in stockTypeV"></a-tab-pane>
      </a-tabs>
    </div>
    <div class="stock-div">
      <tableList
        :columnsData="columns"
        :dataLists="dataLists"
        :tablePage="tablePage"
        @getList="getListStock"
        @handleClick="handleClick"
        @zixuanClick="zixuanClick"
        @listStockClick="listClick"
      ></tableList>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  max-width: 1394px;
  padding: 0 40px;
  margin: 0 auto;
  .con-tabs {
    background: #ffffff;
    margin-top: 16px;
    padding-left: 24px;
    :deep(.ant-tabs-tab) {
      font-weight: 500;
      font-size: 18px;
      color: #919395;
    }
    :deep(.ant-tabs-tab-active) {
      font-size: 18px;
    }
    :deep(.ant-tabs-nav) {
      margin-bottom: 0;
      &::before {
        border-bottom: none !important;
      }
    }
  }
  .content-top {
    margin-top: 14px;
  }
}

.stock-div {
  margin-top: 10px;
  ::v-deep {
    .ant-table-row {
      cursor: pointer;
    }
    .ant-table-tbody td {
      font-weight: 500;
      font-size: 14px;
      color: #000000;
    }
  }
}
</style>
