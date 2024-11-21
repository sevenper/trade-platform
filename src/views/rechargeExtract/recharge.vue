<script setup>
import { onMounted, ref, getCurrentInstance, computed } from 'vue'
import { useRouter } from 'vue-router'
import { moneyConfig, tablePage, rechargeColumns } from './config'
import * as api from '@/axios/api'
import tableList from '@/components/table/index.vue'
const router = useRouter()
import confirmImg from '@/assets/img/radio-confirm.png'
import normalImg from '@/assets/img/radio-normal.png'
import dayjs from 'dayjs'
import { useAppStore } from '@/store/index'
const store = useAppStore()
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()

const selectedMoney = ref(moneyConfig[0])
const selectType = ref('')
const dataLists = ref([])
const status = ref('') //error
const payType = ref([])
const inputMoney = ref(null)
const iconLoading = ref(false)

const goBack = () => {
  router.go(-1)
}

const changeMoney = (item) => {
  selectedMoney.value = item
  inputMoney.value = null
}
const changeType = (item) => {
  selectType.value = item.channelType
}

const init = () => {
  getPayType()
  rechargeList()
}
// 获取支付方式
const getPayType = async () => {
  let data = await api.getPayInfo()
  payType.value = data.data
  selectType.value = data.data[0].channelType
}

// 点击选择金额
const inputChange = (e) => {
  console.log(e.target.value)
  e.target.value ? (selectedMoney.value = 0) : (selectedMoney.value = moneyConfig[0])
}

const saveData = async () => {
  iconLoading.value = true
  let params = {
    amt: inputMoney.value ? inputMoney.value : selectedMoney.value,
    payType: selectType.value,
    // dataType
  }
  console.log(params)

  try {
    let data = await api.inMoney(params)
    setTimeout(async () => {
      iconLoading.value = false
      message.success(data.msg)
      rechargeList()
    }, 3000)
  } catch (error) {
    iconLoading.value = false
    // message.error(error);
  }
}

const rechargeList = async (currentPage) => {
  tablePage.pageNum = currentPage ? currentPage : tablePage.pageNum
  tablePage.isLoading = true
  tablePage.apiLoading = true
  let params = {
    pageNum: tablePage.pageNum,
    pageSize: tablePage.pageSize,
  }
  let { data } = await api.rechargeList(params)
  let dataList, actionFun
  dataList = [...dataLists.value, ...data.list]

  dataLists.value = dataList.map((item, key) => {
    if (item.orderStatus === 0) {
      actionFun = [
        {
          text: textI18n('con.a15'),
          style: tablePage.actionStyle,
        },
      ]
    }
    return {
      ...item,
      forTime: dayjs(item.addTime).format('YYYY-MM-DD HH:mm:ss'),
      actionFun,
    }
  })

  tablePage.total = data.total
  tablePage.isLoading = dataLists.value.length === tablePage.total ? true : false

  tablePage.apiLoading = false
}

const userInfo = computed(() => {
  return store.$state.userInfoData
})
const handleClick = (type, item) => {
  console.log(type, 'type11')
  console.log(item, 'item11')
}
const kefu = () => {
  let kefuAddr
  kefuAddr = userInfo.value.agentPhone //入金客服
  console.log(kefuAddr, 'kefuAddr')
  if (kefuAddr) window.open(kefuAddr)
}
onMounted(() => {
  store.userInfo()
  init()
})
</script>

<template>
  <div class="back">
    <div>
      <span @click="goBack">{{ $t('con.a1') }}</span>
    </div>
  </div>
  <div class="content">
    <div class="content-l">
      <p class="title">{{ $t('money.a3') }}</p>
      <p>{{ $t('money.a4') }}</p>
      <a-input
        :status="status"
        :placeholder="$t('placeholder.a5')"
        v-model:value="inputMoney"
        @change="inputChange"
      />
      <p class="mt-20">{{ $t('money.a5') }}</p>
      <div class="select-money">
        <div class="item" v-for="item in moneyConfig" :key="item" @click="changeMoney(item)">
          <a-image
            class="select-img"
            :preview="false"
            :src="item === selectedMoney ? confirmImg : normalImg"
          />
          <span>{{ item }}</span>
        </div>
      </div>
      <a-row>
        <a-col :span="24">
          <div class="paytype-div">
            <span>{{ $t('money.a8') }}: </span>
            <div class="item" v-for="item in payType" :key="item.id" @click="changeType(item)">
              <a-image
                class="select-img"
                :preview="false"
                :src="item.channelType === selectType ? confirmImg : normalImg"
              />
              {{ item.channelType }}
            </div>
          </div>
        </a-col>
      </a-row>
      <div class="end-pull">
        <a-button class="btn" type="primary" :loading="iconLoading" @click="saveData">
          {{ $t('money.a1') }}
        </a-button>
        <a-button class="btn" type="primary" @click="kefu">
          {{ $t('other.a16') }}
        </a-button>
      </div>
    </div>
    <!-- <div class="content-r">
            <p class="title" >{{ $t('money.a7') }}</p>
            <div class="tip" >
                <div><span>{{ $t('money.a27')}}</span><span>100000</span></div>
                <div><span>{{ $t('money.a28') }}</span><span>1.10%</span></div>
                <div><span>{{ $t('money.a29') }}</span><span>1-5h</span></div>
                <div><span>{{ $t('money.a30') }}</span><span>工作日10:00 到 15 :00 之间</span></div>
            </div>
            <div class="tip-text">
                · 请勿向上述地址充值任何非TRC20_USDT资产，否则资产将不可找回。<br/>
                · 您充值至上述地址后，需要整个网络节点的确认，1次网络确认后到账，1次网络确认后可提币。<br/>
                · 最小充值金额:1 USDT，小于最小金额的充值将不会上账且无法退回。<br/>
                · 您的充值地址不会经常改变，可以重复充值;如有更改，我们会尽量通过网站公告或邮件通知您。<br/>
            </div>
        </div> -->
  </div>

  <div class="record">
    <a-tabs>
      <a-tab-pane key="1" :tab="$t('money.a6')">
        <tableList
          :columnsData="rechargeColumns"
          :dataLists="dataLists"
          :tablePage="tablePage"
          @handleClick="handleClick"
          @getList="rechargeList"
        >
          <span v-for="(item, index) in dataLists" :key="index">
            {{
              item.orderStatus === 0
                ? $t('con.a29')
                : item.orderStatus === 1
                  ? $t('money.a35')
                  : item.orderStatus === 2
                    ? $t('money.a36')
                    : $t('money.a37')
            }}
          </span>
        </tableList>
      </a-tab-pane>
    </a-tabs>
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
.paytype-div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 10px;
  span {
    font-size: 16px;
  }
  .item {
    padding: 5px 10px;
    font-size: 18px;
    :deep(.select-img) {
      width: 20px;
    }
    // border-radius: 4px;
    // border: 1px solid #ddd;
  }
}
.flex-end {
  margin-top: 20px;
  text-align: right;
}
.end-pull {
  //   text-align: right;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  .btn {
    // width: 48%;
    font-size: 16px;
    height: auto;
  }
}
.content {
  margin: 0 auto;
  max-width: 1004px;
  background-color: #fff;
  padding: 38px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .content-l {
    width: 537px;
  }
  .content-r {
    width: 340px;
    color: #9aa5b5;
    .title::before {
      content: '2';
    }
    .tip {
      width: 100%;
      padding: 14px 18px;
      border-radius: 4px;
      box-sizing: border-box;
      background-color: #f5f8fd;
      font-size: 12px;
      & > div {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 6px;
      }
    }
    .tip-text {
      color: #9aa5b5;
      font-size: 12px;
      line-height: 21px;
      margin-top: 10px;
    }
  }
  p {
    font-size: 16px;
  }
  .mt-20 {
    margin-top: 20px;
    margin-bottom: 4px;
  }
  .title {
    padding-left: 28px;
    position: relative;
    font-size: 16px;
    padding-bottom: 18px;
    & + p {
      margin-bottom: 4px;
    }
    &::before {
      content: '1';
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #000000;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      line-height: 20px;
      left: 0;
    }
  }
}
.record {
  margin: 0 auto;
  max-width: 1004px;
  background-color: #fff;
  margin-top: 8px;
  /* 覆盖表头背景色 */
  :deep(.ant-tabs-nav) {
    margin-bottom: 0;
  }
  :deep(
      .ant-table-wrapper
        .ant-table.ant-table-bordered
        > .ant-table-container
        > .ant-table-content
        > table
        > thead
        > tr
        > th
    ) {
    border-inline-end: none;
  }
  :deep(.ant-table-thead > tr > th) {
    border: none;
    background-color: white; /* 你想要的颜色 */
    border-color: white; /* 你想要的颜色 */
    color: #979898;
    &::before {
      background-color: #fff;
    }
  }
  :deep(.ant-tabs-nav-wrap) {
    padding-left: 38px;
    .ant-tabs-tab-active .ant-tabs-tab-btn {
      font-weight: bold;
    }
  }
  :deep(.ant-tabs-content) {
    padding: 0 38px;
  }
}
.select-money {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .item {
    width: 264px;
    height: 40px;
    padding: 12px 14px;
    margin-bottom: 8px;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    cursor: pointer;
    border: 1px solid #ddd;
    align-items: center;
    justify-content: space-between;
    :deep(.select-img) {
      width: 20px;
    }
    span {
      font-size: 16px;
    }
  }
}
</style>
