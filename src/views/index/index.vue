<script setup>
import { onMounted, onUnmounted, watch, reactive, ref, getCurrentInstance, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as api from '@/axios/api'
import { useObserver } from '@/utils/useObs'
import tableList from '@/components/table/index.vue'
import footerVue from '@/components/footer/index.vue'
import { stockType } from '@/constants/commonkey'
import { columnsCun, columnsZS, tablePage, proList } from './config'
import { getToken, setCache } from '@/utils/cache'
import { CacheStockDetail, CacheFindDetail } from '@/constants/cacheKey'
import { useAppStore } from '@/store/index'
const store = useAppStore()
const router = useRouter()
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()

const zsList = ref([])
import lineGreen from '@assets/img/home/line-green.png'
import lineRed from '@assets/img/home/line-red.png'

const activeKey = ref('5') //默认

// 展示tab
const dataLists = ref([])
const newsLists = ref([])
const currentNav = ref(1)
const elementRef = ref(null)
const { isIntersecting, observe } = useObserver()
let columns
// 默认国家
const getListStock = async (countryId) => {
  tablePage.apiLoading = true
  let params = {
    countryId,
    pageNum: 1,
    pageSize: 5,
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
          text: computed(() => textI18n('home.a11')),
          style: tablePage.actionStyle,
        },
      ],
    }
  })

  tablePage.isLoading = true
  // console.log(dataLists.value)
}
// 切换国家tab
const countryClick = (item) => {
  dataLists.value = []
  tablePage.apiLoading = true
  columns = computed(() => columnsCun.value)
  if (item === '0') {
    //指数
    tablePage.apiLoading = true
    tablePage.isPage = false
    columns = computed(() => columnsZS.value)
    getListMarket()
    return
  }
  // 国家
  getListStock(item)
}

const handleClick = (type, item) => {
  listClick(item)
}
const listClick = (item) => {
  store.$state.stockDetail = item
  setCache(CacheStockDetail, item, true)
  router.push('/stockdetail')
}

const getListMarket = async (str) => {
  const { data } = await api.getListMarket()
  zsList.value = data
  if (str) return
  if (data) tablePage.apiLoading = false
  let dataList
  dataList = data.slice(0, 6)
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

const register = () => {
  router.push('/login?type=2')
}
const seeMore = () => {
  router.push('/home')
}

const getNewsList = async (type) => {
  tablePage.isLoading = true
  let params = {
    type,
    pageNum: 1,
    pageSize: 4,
  }
  const { data } = await api.queryNewsList(params)
  newsLists.value = data.list
}
const goDetail = (item) => {
  console.log(item, '详情')
  setCache(CacheFindDetail, item, true)
  router.push('/finddetail')
}

const stockTypeV = computed(() => {
  return [stockType.value[1], stockType.value[3], stockType.value[2]]
})

// console.log(isIntersecting)
let observer
onMounted(() => {
  getListMarket('init')
  columns = computed(() => columnsCun.value)
  getListStock(activeKey.value)
  getNewsList('1')

  if (!getToken()) {
    // console.log(getToken(), 'token')
    store.$patch((state) => {
      ;(state.userInfoData = {}),
        (state.cardInfo = {}),
        (state.token = ''),
        (state.stockDetail = {})
    })
  }
  observe(elementRef.value)
})
watch(
  () => isIntersecting,
  (newVal) => {
    // console.log(newVal.value, 'newVal')
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div style="background: #ffffff">
    <div class="banner">
      <div class="banner-text">
        <Transition name="slide-fade" appear>
          <p class="title">{{ $t('home.a0') }}</p>
        </Transition>

        <p class="sub-title">{{ $t('home.a1') }}</p>
        <a-button type="primary" size="large" @click="register"
          >{{ $t('home.a2') }} <i class="right-icon"></i
        ></a-button>
      </div>
    </div>
    <div class="nav-wrap">
      <div class="nav-content">
        <div
          class="nav-item"
          v-for="(item, index) in zsList.slice(0, 3)"
          :key="index"
          @click="handleClick('', item)"
        >
          <div class="item-left">
            <p>{{ item.indexName }}</p>
            <p
              class="price"
              :class="[
                item.chg_pct === 0
                  ? 'f-text-normal'
                  : item.chg_pct > 0
                    ? 'f-text-up'
                    : 'f-text-down',
              ]"
            >
              {{ item.last }}
            </p>
            <p
              class="present"
              :class="[
                item.chg_pct === 0
                  ? 'f-text-normal'
                  : item.chg_pct > 0
                    ? 'f-text-up'
                    : 'f-text-down',
              ]"
            >
              {{ item.chg_pct }}%
            </p>
          </div>
          <div class="item-right">
            <img :src="item.chg_pct >= 0 ? lineGreen : lineRed" />
          </div>
        </div>
      </div>
    </div>
    <!--  最新 -->
    <div class="table-wrap">
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
          @listStockClick="listClick"
        >
        </tableList>
      </div>

      <div class="btn-wrap">
        <a-button type="link" @click="seeMore"
          >{{ $t('home.a12') }}<i class="icon right-icon"></i
        ></a-button>
      </div>
    </div>
  </div>
  <!-- product -->
  <div class="product">
    <p class="title">{{ $t('home.a13') }}</p>
    <p class="sub-title">{{ $t('home.a13') }}</p>
    <div class="product-box" v-for="(item, index) in proList" :key="index">
      <img class="img" v-if="index % 2 === 1" :src="$imgUrl(`/assets/img/home/bg${index}.png`)" />
      <div class="text">
        <div>
          <img class="icon" :src="$imgUrl(`/assets/img/home/icon${index}.png`)" />
          <p class="text-title">{{ item.title }}</p>
          <p class="text-sub">{{ item.text }}</p>
        </div>
      </div>
      <img class="img" v-if="index % 2 === 0" :src="$imgUrl(`/assets/img/home/bg${index}.png`)" />
    </div>
  </div>
  <div class="about-us" ref="elementRef">
    <p class="title">{{ $t('home.a21') }}</p>
    <a-button>{{ $t('home.a22') }}</a-button>
  </div>
  <div class="pay-about">
    <p class="title">{{ $t('home.a23') }}</p>
    <p class="desc">{{ $t('home.a24') }}</p>
    <img src="@assets/img/home/pay-bg.png" alt="bg" class="bg-img" />
    <div class="pay-type-wrap">
      <div class="pay-type w-200"><i class="icon icon_goole"></i>{{ $t('home.a25') }}</div>
      <div class="pay-type w-200"><i class="icon icon_apply"></i>{{ $t('home.a26') }}</div>
      <div class="pay-type"><i class="icon icon_qr"></i></div>
      <div class="pay-type">{{ $t('home.a27') }}</div>
    </div>
  </div>
  <div class="zf-news-wrap">
    <div class="zf-news-wrap-div">
      <p class="title">{{ $t('home.a28') }}</p>
      <p class="desc">{{ $t('home.a29') }}</p>
      <div class="list-box">
        <img class="bg" src="@assets/img/home/news-bg.png" />
        <div class="news-list">
          <div class="news-item" v-for="item in newsLists" :key="item.id" @click="goDetail(item)">
            <p>{{ item.title }}</p>
            <span>{{ $t('other.a9') }}</span>
          </div>
        </div>
      </div>
      <!-- <div class="list-box">
	      <div class="single-new">
	        <div class="inner-title">
	          平台公告<router-link to="/">更多></router-link>
	        </div>
	        <ul>
	          <li><router-link to="/">入局抖音商城实操小课全集</router-link></li>
	          <li><router-link to="/">入局抖音商城实操小课全集</router-link></li>
	        </ul>
	      </div>
	      <div class="single-new">
	        <div class="inner-title">
	          平台公告<router-link to="/">更多></router-link>
	        </div>
	        <ul>
	          <li><router-link to="/">入局抖音商城实操小课全集</router-link></li>
	          <li><router-link to="/">入局抖音商城实操小课全集</router-link></li>
	        </ul>
	      </div>
	    </div> -->
    </div>
  </div>

  <div class="lx-wrap">
    <p class="title">{{ $t('home.a30') }}</p>
    <p class="desc">{{ $t('home.a31') }}</p>
    <ul>
      <li v-for="(item, index) in 4" :key="item">
        <a href="javascript:void(0)"><img src="@assets/img/home/bg0.png" /></a>
      </li>
    </ul>
  </div>
  <div class="server-wrap">
    <div class="server-box">
      <div class="server-item" v-for="(_, index) in 4" :key="index">
        <i class="icon icon_"></i>
        <div class="server_container">
          <span class="item_title">{{ $t(`homefoot.a${index}`) }}</span>
          <span class="item_desc">{{ $t(`homefoot.a${index}_0`) }}</span>
        </div>
      </div>
    </div>
  </div>
  <footerVue></footerVue>
</template>

<style lang="scss" scoped>
/*
	  进入和离开动画可以使用不同
	  持续时间和速度曲线。
	*/
.slide-fade-enter-active {
  // transition: all 0.3s ease-out;
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

a {
  &:hover {
    background: transparent;
  }
}
.banner {
  width: 100%;
  height: 755px;
  background: url('@assets/img/home/banner.png') 100% 100% no-repeat;
  overflow: hidden;
  .banner-text {
    margin-top: 9vh;
    margin-left: 25vw;

    .ant-btn {
      height: 72px;
      font-size: 32px;
    }
  }
  .title {
    font-weight: 550;
    font-size: 58px;
    color: #000000;
    line-height: 81px;
  }
  .sub-title {
    margin: 13px 0 60px;
    font-weight: 500;
    font-size: 26px;
    color: #646870;
  }
  .right-icon {
    display: inline-block;
    width: 28px;
    height: 20px;
    margin-left: 14px;
    background: url('@assets/img/common/right.png') 100% 100% no-repeat;
    vertical-align: middle;
  }
}
.nav-wrap {
  display: flex;
  justify-content: center;
  margin-top: -90px;
  // margin-bottom: 72px;
  .nav-content {
    display: flex;
    width: 1040px;
    height: 180px;
    background: #ffffff;
    box-shadow: 0px 1px 30px 1px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 37px 31px;
    box-sizing: border-box;
    .nav-item {
      // flex: 1;
      width: 33.33%;
      padding-right: 50px;
      display: flex;
      justify-content: space-between;
      position: relative;
      cursor: pointer;
      &:last-child {
        padding-right: 0;
      }

      &::after {
        content: '';
        position: absolute;
        height: 100%;
        border: 1px solid #f3f3f3;
        right: 20px;
      }
      &:last-child {
        &::after {
          border: none;
        }
      }
      .item-left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 13px;
        width: 48%;
        > p {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        & > p:first-child {
          font-weight: bold;
          font-size: 24px;
          color: #000000;
        }
        .price {
          font-weight: bold;
          font-size: 28px;
        }
        .present {
          font-size: 20px;
        }
      }
      .item-right {
        display: flex;
        align-items: center;
        > img {
          width: 100%;
        }
      }
    }
  }
}

// .new-wrap {
//   display: flex;
//   justify-content: center;
//   // padding-bottom: 42px;
//   .new-content {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     .new-item {
//       margin-right: 58px;
//       font-weight: bold;
//       font-size: 24px;
//       color: #56565b;
//       &.active {
//         font-size: 36px;
//         color: #000000;
//       }
//       &:last-child {
//         margin-right: 0;
//       }
//       &.up {
//         padding-right: 32px;
//         background: url("@assets/img/common/up.png") 20px 20px / center
//           no-repeat;
//       }
//     }
//   }
// }

.table-wrap {
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #ffffff;
  padding-top: 60px;
  max-width: 1040px;
  margin: 0 auto;
  .con-tabs {
    background: #ffffff;
    margin-top: 16px;
    padding-left: 24px;
    :deep(.ant-tabs-tab) {
      font-weight: bold;
      font-size: 24px;
      color: #56565b;
    }
    :deep(.ant-tabs-tab-active) {
      font-weight: 800;
      font-size: 24px;

      .ant-tabs-tab-btn {
        color: #000000;
      }
    }
    ::v-deep .ant-tabs-nav {
      margin-bottom: 0;
      &::before {
        border-bottom: none !important;
      }
    }
  }
  .btn-wrap {
    margin: 38px auto 83px;
    .right-icon {
      display: inline-block;
      width: 28px;
      height: 20px;
      // margin-left: 14px;
      background: url('@assets/img/common/go.png') 100% 100% no-repeat;
      vertical-align: middle;
    }
  }

  .stock-div {
    ::v-deep {
      .ant-table-row {
        cursor: pointer;
      }
      .ant-table-tbody {
        td {
          font-weight: bold;
          font-size: 24px;
          color: #000000;
        }
      }
    }
  }
  .table-body,
  .table-header {
    width: 1202px;
  }
  .table-header,
  .tr {
    display: flex;
    .cell {
      flex: 1;
    }
  }
  .table-header .cell {
    font-weight: 500;
    font-size: 16px;
    color: #919395;
  }
  .tr {
    padding-top: 26px;
    align-items: center;
    .price {
      font-weight: 500;
      font-size: 24px;
      color: #000000;
    }
    .ant-btn {
      min-width: 96px;
    }
  }
  .name-wrap {
    width: 100%;
    padding-left: 73px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      width: 53px;
      height: 53px;
      border-radius: 50%;
      background-color: #56565b;
      left: 0;
    }
    .title {
      font-size: 24px;
      color: #000000;
      line-height: 33px;
      font-weight: 500;
    }
    .sub-title {
      font-weight: 500;
      font-size: 16px;
      color: #707070;
    }
  }
}

.product {
  width: 100%;
  background: linear-gradient(255deg, #e7f4fe 0%, #f6f9fe 45%, #eef6fb 100%);
  padding: 75px 0 0;
  .title {
    text-align: center;
    font-weight: 800;
    font-size: 56px;
    color: #000000;
    line-height: 78px;
  }
  .sub-title {
    font-weight: bold;
    font-size: 22px;
    color: #646870;
    margin-top: 8px;
    line-height: 30px;
    margin-bottom: 51px;
    text-align: center;
  }
  .product-box {
    display: flex;
    align-items: center;
    max-width: 1432px;
    margin: 0 auto 84px;

    .img {
      width: 50%;
      height: 489px;
    }
    .text {
      width: 50%;
      background-color: #fff;
      border-radius: 20px;
      height: 440px;
      padding: 0 5vw;
      display: flex;
      align-items: center;
      .icon {
        width: 92px;
        // margin-bottom: 20px;
      }
      .text-title {
        // font-weight: 800;
        font-size: 32px;
        color: #000000;
        line-height: 45px;
      }
      .text-sub {
        margin-top: 10px;
        font-weight: 500;
        font-size: 22px;
        color: #646870;
      }
    }
  }
}
.about-us {
  width: 100%;
  height: 307px;
  background: url('@assets/img/home/bg.png') 100% 100% no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title {
    font-weight: 800;
    font-size: 42px;
    color: #ffffff;
    margin-bottom: 2vh;
    padding: 0 20px;
  }
  .ant-btn {
    width: 150px;
    height: 48px;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #ffffff;
    background: transparent;
    font-size: 18px;
    color: #fff;
  }
}
@mixin common-head() {
  .title {
    font-size: 50px;
    font-weight: bold;
    line-height: 60px;
  }
  .desc {
    margin-top: 20px;
    color: #646870;
    font-size: 22px;
  }
}
.pay-about {
  overflow: hidden;
  padding-top: 80px;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 820px;
  position: relative;

  & > * {
    position: relative;
    z-index: 1;
  }

  .bg-img {
    z-index: 0;
    min-width: 100%;
    min-height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  @include common-head();

  .pay-type-wrap {
    margin-top: 50px;
    display: flex;
    align-items: center;

    .pay-type {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 20px;
      min-width: 58px;
      height: 58px;
      background: #000000;
      border-radius: 29px 29px 29px 29px;
      color: #fff;
      padding: 0 10px;

      &.w-200 {
        // width: 200px;

        i {
          margin-right: 10px;
        }
      }

      i.icon {
        width: 30px;
        height: 30px;

        &_goole {
          background: url('@assets/img/home/icon-goole.png') center center;
          background-size: 100% 100%;
        }
        &_apply {
          background: url('@assets/img/home/icon-apply.png') center center;
          background-size: 100% 100%;
        }

        &_qr {
          width: 100%;
          height: 100%;
          background: url('@assets/img/home/icon-qr.png') center center;
          background-size: 100% 100%;
        }
      }

      &:first-child {
        margin-left: 0;
      }
    }
  }
}
.zf-news-wrap {
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(180deg, #f7fafe 0%, #e3eff9 100%);
  padding: 80px 0;

  @include common-head();
  .zf-news-wrap-div {
    max-width: 1432px;
    margin: 0 auto;
  }
  .desc {
    margin-bottom: 47px;
  }

  .list-box {
    display: flex;
    width: 100%;
    img.bg {
      width: 50%;
      height: 498px;

      border-radius: 20px 20px 20px 20px;
    }
    .news-list {
      width: 49%;
      height: 498px;
      background: linear-gradient(89deg, #f8fbfe 0%, #eef7fe 43%, #f8fbfe 100%);
      margin-left: 1%;
      border: 1px solid #ffffff;
      border-radius: 20px 20px 20px 20px;
      .news-item {
        height: 25%;
        display: flex;
        align-items: center;
        font-weight: bold;
        cursor: pointer;
        padding-left: 44px;
        p {
          width: 70%;
          font-size: 24px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        span {
          font-size: 20px;
        }
      }
    }
    .single-new {
      margin-top: 24px;
      flex: 1;
      padding: 36px 38px;
      background: linear-gradient(89deg, #f8fbfe 0%, #eef7fe 43%, #f8fbfe 100%);
      border-radius: 20px 20px 20px 20px;
      border: 1px solid #ffffff;

      .inner-title {
        font-size: 30px;
        font-weight: bold;
        display: flex;
        align-items: center;

        .router-link-active {
          margin-left: auto;
          font-size: 20px;
          color: #56565b;

          &:hover {
            background: unset;
          }
        }
      }

      ul {
        margin: 0;
        padding: 0;
        li {
          list-style: none;
          margin-top: 20px;
          font-weight: 500;
          font-size: 20px;
          color: #000000;

          .router-link-active {
            color: #000000;
            &:hover {
              background: unset;
            }
          }
        }
      }

      &:first-child {
        margin-right: 20px;
      }
    }
  }
}
.lx-wrap {
  display: flex;
  align-items: center;
  flex-direction: column;

  @include common-head();
  background: rgb(247, 249, 252);
  padding: 80px 0;
  box-sizing: border-box;
  ul {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    max-width: 1180px;
    li {
      width: 178px;
      list-style: none;
      margin-right: 20px;
      border-radius: 20px;
      overflow: hidden;
      margin-top: 40px;
      background: #fff;
      border: 1px solid rgb(250, 250, 252);

      &:nth-child(6n) {
        margin-right: 0px;
      }

      img {
        width: 100%;
        height: 60px;
        object-fit: contain;
      }
    }
  }
}
.server-wrap {
  border-top: 2px solid #f3f6ff;
  width: 100%;
  height: 140px;
  margin: 0 auto;
  background: #fff;

  .server-box {
    display: flex;
    max-width: 1180px;
    height: 100%;
    margin: 0 auto;

    .server-item {
      // flex: 1;
      display: flex;
      align-items: center;
      padding: 0 20px;

      .icon {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: #f3f6ff;
      }

      .server_container {
        margin-left: 18px;
        span {
          display: block;

          &.item_title {
            font-weight: bold;
            font-size: 20px;
            color: #000000;
          }
          &.item_desc {
            margin-top: 4px;
            // width: 165px;

            color: #9aa5b5;
            font-size: 15px;
          }
        }
      }
    }
  }
}
</style>
