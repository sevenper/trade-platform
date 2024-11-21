<script setup>
import { ref, reactive, onMounted, computed, inject, getCurrentInstance } from 'vue'
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()

import { useAppStore } from '@/store/index'
import leftMenu from '@/components/appCom/leftMenu.vue'
import { stockType } from '@/constants/commonkey'

import router from '@/router'
const activeKey = ref(0)
const store = useAppStore()
const stockTypeV = computed(() => {
  return [stockType.value[3], stockType.value[2]]
})
const amtArr = computed(() => store.amtArr)

const amtArray = computed(() => {
  return [
    textI18n('wallet.a2'),
    textI18n('wallet.a3'),
    textI18n('wallet.a4'),
    textI18n('wallet.a5'),
  ]
})
onMounted(() => {
  store.userInfo()
  store.getPriceInfo()
})
</script>

<template>
  <div class="body-warp">
    <div class="left-warp">
      <left-menu></left-menu>
    </div>

    <div class="right-warp">
      <div class="right-top-warp">
        <a-tabs class="con-tabs" v-model:activeKey="activeKey">
          <a-tab-pane :tab="item.amt" :key="index" v-for="(item, index) in stockTypeV"></a-tab-pane>
        </a-tabs>
        <div class="top-content">
          <p class="title-top">{{ $t('wallet.a1') }}</p>
          <p class="money-top">{{ amtArr[activeKey][0] }}</p>
        </div>

        <div class="top-button">
          <a-button
            class="btn-style"
            type="primary"
            size="large"
            @click="router.push(`/recharge`)"
            >{{ $t('menu.a11') }}</a-button
          >
        </div>
      </div>
      <div class="right-bottom-warp">
        <div class="bottom-content">
          <p class="title">{{ $t('wallet.a6') }}</p>

          <a-row>
            <a-col
              :xs="12"
              :sm="12"
              :md="12"
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
  </div>
</template>

<style lang="scss" scoped>
.body-warp {
  display: flex;
  .left-warp {
    width: 256px;
  }
  .right-warp {
    width: 1000px;
    margin-left: 12vw;
    // margin: 30px 100px 30px 100px;
    .right-top-warp {
      background: #ffffff;
      padding: 40px 5vw;

      border-radius: 30px 30px 30px 30px;
      .con-tabs {
        :deep(.ant-tabs-tab) {
          font-weight: bold;
          font-size: 24px;
          color: #56565b;
        }
        :deep(.ant-tabs-nav) {
          &::before {
            border-bottom: none !important;
          }
        }
      }
      .top-content {
        margin-top: 30px;
        .title-top {
          font-weight: bold;
          font-size: 20px;
          color: #000000;
        }
        .money-top {
          font-weight: bold;
          font-size: 40px;
          color: #000000;
        }
      }
      .top-button {
        text-align: center;
        margin-top: 80px;
        .btn-style {
          font-size: 16px;
          padding: 4px 14px;
          height: auto;
        }
      }
    }

    .right-bottom-warp {
      background: #ffffff;
      padding: 40px 5vw;
      border-radius: 30px 30px 30px 30px;
      margin-top: 30px;
      .bottom-content {
        .title {
          font-weight: bold;
          font-size: 20px;
          color: #000000;
          margin-bottom: 80px;
        }
        .item {
          margin: 20px 0;
          width: 240px;
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
}
</style>
