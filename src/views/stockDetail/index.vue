<script setup>
import { onMounted, reactive, ref, getCurrentInstance, watch, inject, computed } from 'vue'
import { setCache, getToken } from '@/utils/cache'
import { CacheStockDetail } from '@/constants/cacheKey'
import KlineChart from '@/components/KlineChart/index.vue'
import alist from './alist.vue'
import { useRouter } from 'vue-router'
import { dialogConfig, numConfig, columns, tablePage } from './config'
import myModal from '@/components/dialog.vue'
import * as api from '@/axios/api'
import { useAppStore } from '@/store/index'
import { stockType } from '@/constants/commonkey'
import confirmImg from '@/assets/img/radio-confirm.png'
import normalImg from '@/assets/img/radio-normal.png'
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()

const router = useRouter()
const message = inject('message')
const store = useAppStore()

const openDialog = ref(false)
const activeKey = ref('5') //默认
const iconLoading = ref(false)

const tokenExists = computed(() => {
  return store.$state.token
})

const itemDetail = ref()

// 展示tab
const stockTypeV = computed(() => {
  return tokenExists.value && getToken()
    ? [stockType.value[0], stockType.value[1], stockType.value[3], stockType.value[2]]
    : [stockType.value[1], stockType.value[3], stockType.value[2]]
})
const moneyFun = (type) => {
  if (!tokenExists.value || !getToken()) {
    message.warning(textI18n('login.a8'))
    return
  }
  router.push(`/${type}`)
}
const inputNum = ref(numConfig[0])
const selectedNum = ref(numConfig[0])

// 加定时器实时刷新最新数据
const getDetail = async (item) => {
  // console.log(item)
  let params = {
    code: item.stockGid || item.indexGid || item.stock_gid,
    type: item.indexName ? 2 : 1, //指数为2  普通股票为1
  }
  let { data } = await api.getSingleStock(params)
  // console.log(data, 'getSingleStock')

  itemDetail.value = data
  store.$state.stockDetail = data
}

const buy = () => {
  if (!tokenExists.value || !getToken()) {
    message.warning(textI18n('login.a8'))
    return
  }
  openDialog.value = true
}
// 点击选择股数
const changeNum = (item) => {
  selectedNum.value = item
  inputNum.value = item
}
// 点击选择股数
const inputChange = (e) => {
  console.log(e.target.value)
  e.target.value ? (selectedNum.value = 0) : (selectedNum.value = numConfig[0])
}

const handleCancelModal = (type) => {
  // 处理取消事件
  console.log('模态框被关闭')
  openDialog.value = false
}

const saveData = async () => {
  iconLoading.value = true

  let params = {
    stockId: itemDetail.value.stockGid || itemDetail.value.stock_gid,
    buyNum: inputNum.value,
    buyType: 0, //字段功能目前没有用到
    lever: 1, //字段功能目前没有用到
    dataType: 1,
    // dataType: Number(localStorage.getItem('buyCode')) || 1
  }
  try {
    let { data } = await api.buy(params)
    setTimeout(async () => {
      iconLoading.value = false
      message.success(data)
      router.push('/myholding?type=0') //跳转我的持仓
    }, 3000)
  } catch (error) {
    iconLoading.value = false
    // message.error(error);
  }
}

// // 切换国家tab
const countryClick = (item) => {}

watch(
  () => store.$state.stockDetail,
  (newVal, oldVal) => {
    itemDetail.value = newVal
    // console.log(newVal, 'newVal')
  },
  // 配置选项
  { deep: true, immediate: true },
)
</script>

<template>
  <div class="container">
    <div class="container-left">
      <div class="container-left-top">
        <div class="nav-div">
          <a-tabs class="con-tabs" v-model:activeKey="activeKey" @change="countryClick(activeKey)">
            <a-tab-pane :tab="item.label" :key="item.key" v-for="item in stockTypeV"></a-tab-pane>
          </a-tabs>
        </div>
        <div class="list-title">
          <p>{{ $t('stockTable.a1') }}</p>
          <i>{{ $t('stockTable.a2') }}</i>
          <em>{{ $t('stockTable.a5') }}</em>
        </div>
        <alist class="stock-div" :country="activeKey" @listStockClick="getDetail"></alist>
      </div>
      <a-row class="container-left-bottom">
        <a-col :sm="24" :md="12" :xl="8">
          <a-button class="btn" @click="moneyFun('recharge')">{{ $t('money.a1') }}</a-button>
        </a-col>
        <a-col :sm="24" :md="12" :xl="8">
          <a-button class="btn" @click="moneyFun('extract')">{{ $t('money.a2') }}</a-button>
        </a-col>
        <a-col :sm="24" :md="12" :xl="8">
          <a-button class="btn" @click="moneyFun('conversion')">{{ $t('money.a20') }}</a-button>
        </a-col>
      </a-row>
    </div>
    <div class="container-center">
      <div class="container-center-text">
        <div class="left-div">
          <p class="name">
            {{ itemDetail.stockName || itemDetail.stock_name || itemDetail.indexName }}
          </p>
          <p class="code">
            {{ itemDetail.stockCode || itemDetail.stock_code || itemDetail.indexCode }}
          </p>
        </div>
        <div
          class="last-div"
          :class="[
            itemDetail.chg_pct > 0 ? 'f-text-up' : itemDetail.chg_pct < 0 ? 'f-text-down' : '',
          ]"
        >
          {{ itemDetail.last }}
        </div>
        <a-row>
          <a-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="chg-div">
              <i>{{ $t('stockD.a9') }}</i>
              <p
                :class="[
                  itemDetail.chg_pct > 0
                    ? 'f-text-up'
                    : itemDetail.chg_pct < 0
                      ? 'f-text-down'
                      : '',
                ]"
              >
                {{ itemDetail.chg }}
              </p>
            </div>
          </a-col>
          <a-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="chg-div">
              <i>{{ $t('stockTable.a5') }}</i>
              <p
                :class="[
                  itemDetail.chg_pct > 0
                    ? 'f-text-up'
                    : itemDetail.chg_pct < 0
                      ? 'f-text-down'
                      : '',
                ]"
              >
                {{ itemDetail.chg_pct }}
              </p>
            </div>
          </a-col>
          <a-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="normal-div">
              <i>{{ $t('stockD.a1') }}</i>
              <p>{{ itemDetail.open }}</p>
            </div>
          </a-col>
          <a-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="normal-div">
              <i>{{ $t('stockD.a2') }}</i>
              <p>{{ itemDetail.high }}</p>
            </div>
          </a-col>
          <a-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="normal-div">
              <i>{{ $t('stockD.a3') }}</i>
              <p>{{ itemDetail.low }}</p>
            </div>
          </a-col>
          <a-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="normal-div">
              <i>{{ $t('stockD.a8') }}</i>
              <p>{{ itemDetail.close }}</p>
            </div>
          </a-col>
        </a-row>
      </div>

      <KlineChart :itemDetail="itemDetail" />
      <div class="container-center-bottom" v-if="!itemDetail.indexGid">
        <a-button class="buy-btn" type="primary" size="large" @click="buy">{{
          $t('stockD.a6')
        }}</a-button>
      </div>
    </div>

    <myModal
      class="stock-detail"
      :open="openDialog"
      :dialogConfig="dialogConfig"
      @cancel="handleCancelModal"
    >
      <div class="top-title">
        <p>{{ itemDetail.stockName || itemDetail.stock_name || itemDetail.indexName }}</p>
        <i>{{ itemDetail.last }}</i>
      </div>
      <div class="top-title">
        <span>{{ itemDetail.stockCode }}</span>
        <em
          :class="[
            itemDetail.chg_pct > 0
              ? 'f-text-up'
              : itemDetail.chg_pct < 0
                ? 'f-text-down'
                : 'f-text-normal',
          ]"
          >{{ itemDetail.chg_pct }}</em
        >
      </div>
      <div class="select-title">{{ $t('stockD.a11') }}</div>
      <a-row class="select-div">
        <a-col :span="8" v-for="(item, index) in numConfig" :key="index" @click="changeNum(item)">
          <div class="select-item">
            <a-image
              :preview="false"
              :width="20"
              :src="item === selectedNum ? confirmImg : normalImg"
            />
            <span>{{ item }}{{ $t('stockD.a12') }}</span>
          </div>
        </a-col>
      </a-row>

      <a-input
        class="input-style"
        :placeholder="$t('placeholder.a9')"
        v-model:value="inputNum"
        @change="inputChange"
      />
      <a-button
        class="buy-btn"
        type="primary"
        @click="saveData"
        :loading="iconLoading"
        size="large"
        >{{ $t('stockD.a6') }}</a-button
      >
    </myModal>
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 66px);
  display: flex;
  background: #000000;
  .container-left {
    width: 22vw;
    background: #0c0d0e;
    .stock-div::-webkit-scrollbar {
      display: none;
    }
    .container-left-top {
      .con-tabs {
        padding-left: 24px;
        :deep(.ant-tabs-tab) {
          font-weight: 500;
          font-size: 16px;
          color: #7e8697;
        }
        :deep(.ant-tabs-tab-active) {
          font-size: 16px;
          .ant-tabs-tab-btn {
            color: #ffffff;
          }
        }
        :deep(.ant-tabs-nav) {
          margin-bottom: 0;
          &::before {
            border-bottom: none !important;
          }
        }
        :deep(.ant-tabs-nav-more) {
          background: #1b1e28;
          color: #ffffff;
          font-size: 24px;
          padding: 5px 10px;
          margin-left: 5px;
        }
      }
      .list-title {
        display: flex;
        justify-content: space-between;
        padding: 10px 15px;
        font-weight: 500;
        font-size: 12px;
        color: #7e8697;
        > p {
          display: flex;
          flex: 1;
          align-items: flex-start;
        }
        > i {
          font-style: normal;
          width: 26%;
          text-align: right;
        }
        > em {
          font-style: normal;
          width: 26%;
          text-align: right;
        }
      }
      .stock-div {
        height: 60vh;
        overflow-y: scroll;
      }
    }
    .container-left-bottom {
      padding: 10px;
      display: flex;
      justify-content: space-between;
      .btn {
        font-weight: 500;
        font-size: 14px;
        color: #ffffff;
        background: #1a1c24;
        border: none;
        padding: 4px 14px;
        height: auto;
        margin: 10px 5px;
      }
    }
  }

  .container-center {
    width: 78vw;
    margin-left: 10px;
    margin: 5px;
    background: #0c0d0e;
    > div {
      margin: 20px;
    }
    .container-center-text {
      display: flex;
      align-items: center;
      color: #ffffff;
      div {
        > i {
          font-weight: 500;
          font-size: 12px;
          color: #7e8697;
          font-style: normal;
        }
      }
      .left-div {
        padding-right: 20px;
        .name {
          font-weight: bold;
          font-size: 18px;
          color: #ffffff;
        }
        .code {
          font-weight: 500;
          font-size: 12px;
          color: #7e8697;
        }
      }
      .last-div {
        padding: 0 20px;
        font-weight: bold;
        font-size: 20px;
      }
      .chg-div {
        padding: 0 20px;
        text-align: right;
        > p {
          font-weight: 500;
          font-size: 12px;
        }
      }
      .normal-div {
        padding: 0 20px;
        text-align: right;
        > p {
          font-weight: 500;
          font-size: 12px;
          color: #ffffff;
        }
      }
    }

    .container-center-bottom {
      text-align: center;
      margin-top: 30px;
      .buy-btn {
        width: 100%;
      }
    }
  }

  .stock-detail {
    :deep(.ant-modal) {
      width: 784px !important;
      .ant-modal-content {
        padding: 100px 120px;
        .ant-modal-body {
          .top-title {
            display: flex;
            justify-content: space-between;
            height: 40px;
            line-height: 40px;
            > p {
              font-weight: bold;
              font-size: 18px;
              color: #252631;
            }
            > i {
              font-weight: bold;
              font-size: 18px;
              color: #262626;
              font-style: normal;
            }
            > span {
              font-weight: 500;
              font-size: 14px;
              color: #707070;
            }
            > em {
              font-weight: bold;
              font-size: 15px;
              font-style: normal;
            }
          }

          .select-title {
            font-weight: 500;
            font-size: 20px;
            color: #000000;
            margin: 10px 0;
          }
          .select-div {
            .select-item {
              padding: 10px 0;
              cursor: pointer;
              > span {
                margin-left: 20px;
              }
            }
          }
          .input-style {
            margin: 30px 0;
          }
          .buy-btn {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
