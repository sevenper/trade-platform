<script setup>
import { onMounted, ref, inject, getCurrentInstance, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { moneyConfig, tablePage, extractColumns } from './config'
import * as api from '@/axios/api'
import { useAppStore } from '@/store/index'
import tableList from '@/components/table/index.vue'
import { formatTime } from '@/utils/utils'
const router = useRouter()
const store = useAppStore()
const message = inject('message')
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()

import confirmImg from '@/assets/img/radio-confirm.png'
import normalImg from '@/assets/img/radio-normal.png'

const selectedMoney = ref(moneyConfig[0])
const status = ref('') //error
const statusPWD = ref('')
const inputMoney = ref(null)
const cashPwd = ref(null)
const dataLists = ref([])
const iconLoading = ref(false)

const cardInfo = computed(() => store.$state.cardInfo)
const amtArr = computed(() => store.amtArr)
const init = () => {
  store.userInfo()
  record()
}

const changeMoney = (item) => {
  selectedMoney.value = item
  inputMoney.value = null
}

// 点击选择金额
const inputChange = (e) => {
  // console.log(e.target.value);
  e.target.value ? (selectedMoney.value = 0) : (selectedMoney.value = moneyConfig[0])
}
const pwdChange = (e) => {
  statusPWD.value = ''
}
const goBack = () => {
  router.go(-1)
}

const allMoney = async () => {
  inputMoney.value = amtArr.value[0][1]
  selectedMoney.value = 0
}

const saveData = async () => {
  if (!cardInfo.value.bankNo) {
    message.info(textI18n('other.a18'))
    router.push('/card')
    return
  }
  if (!cashPwd.value) {
    statusPWD.value = 'error'
    message.error(textI18n('money.a12'))
    return
  }
  iconLoading.value = true
  let params = {
    amt: inputMoney.value ? inputMoney.value : selectedMoney.value,
    cashPwd: cashPwd.value,
  }
  // console.log(params, "params");
  try {
    let data = await api.outMoney(params)
    setTimeout(async () => {
      iconLoading.value = false
      message.success(data.msg)
      record()
    }, 3000)
  } catch (error) {
    iconLoading.value = false
    // message.error(error);
  }
}

const record = async () => {
  let params = {
    withStatus: '', // 提现状态 0已提交，1转账成功，2转账失败
    pageNum: tablePage.pageNum,
    pageSize: tablePage.pageSize,
  }
  let { data } = await api.withdrawList(params)
  let dataList
  dataList = [...dataLists.value, ...data.list]

  dataLists.value = dataList.map((item, key) => {
    return {
      ...item,
      forTime: formatTime(item.applyTime),
    }
  })

  tablePage.total = data.total
  tablePage.isLoading = true
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
  <div class="content">
    <div class="content-l">
      <div class="bank">
        <p>{{ $t('other.a17') }}：</p>
        <p>{{ cardInfo.bankNo ? cardInfo.bankNo : $t('other.a18') }}</p>
      </div>

      <p class="title">{{ $t('money.a31') }}</p>
      <p>{{ $t('money.a4') }}</p>
      <div class="flex-end">
        <a-input
          :status="status"
          :placeholder="$t('placeholder.a6')"
          v-model:value="inputMoney"
          allowClear
          @change="inputChange"
        />

        <a-button class="btn-style" type="primary" @click="allMoney">{{
          $t('money.a13')
        }}</a-button>
      </div>
      <p class="mt-20">{{ $t('money.a14') }}</p>
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
      <div class="flex-end">
        <a-input-password
          :status="statusPWD"
          :placeholder="$t('money.a12')"
          v-model:value="cashPwd"
          @change="pwdChange"
          allowClear
        />
        <a-button class="btn-style" type="primary" :loading="iconLoading" @click="saveData">{{
          $t('money.a2')
        }}</a-button>
      </div>
    </div>
    <div class="content-r">
      <p class="title">{{ $t('money.a16') }}</p>
      <div class="tip">
        <div>
          <span>{{ $t('money.a17') }}</span
          ><span>100000</span>
        </div>
        <div>
          <span>{{ $t('money.a18') }}</span
          ><span>1.10%</span>
        </div>
        <div>
          <span>{{ $t('money.a29') }}</span
          ><span>48h</span>
        </div>
        <div>
          <span>{{ $t('money.a30') }}</span
          ><span>10:00 - 17 :00</span>
        </div>
      </div>
      <div class="tip-text">
        · {{ $t('tips.a5') }}<br />
        · {{ $t('tips.a6') }}<br />
        · {{ $t('tips.a7') }}<br />
      </div>
    </div>
  </div>

  <div class="record">
    <a-tabs>
      <a-tab-pane key="1" :tab="$t('money.a15')">
        <tableList :columnsData="extractColumns" :dataLists="dataLists" :tablePage="tablePage">
          <span v-for="(item, index) in dataLists" :key="index">
            {{
              item.withStatus === 0
                ? $t('con.a29')
                : item.withStatus === 1
                  ? $t('other.a20')
                  : $t('other.a21')
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
.flex-end {
  display: flex;
  // margin-top: 20px;
  // text-align:right;
}

.content {
  margin: 0 auto;
  max-width: 1004px;
  background-color: #fff;
  padding: 38px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .btn-style {
    font-size: 16px;
    padding: 4px 14px;
    height: auto;
    margin-left: 10px;
  }
  .content-l {
    width: 537px;
    .bank {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
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
      font-size: 14px;
      line-height: 21px;
      margin-top: 10px;
      letter-spacing: 2px;
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
