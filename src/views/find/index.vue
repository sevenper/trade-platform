<script setup>
import { computed, onMounted, onUnmounted, ref, getCurrentInstance, reactive } from 'vue'
import * as api from '@/axios/api'
import { tablePage, typeConfig } from './config'
import { formatTime } from '@/utils/utils'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { setCache } from '@/utils/cache'
import { CacheFindDetail } from '@/constants/cacheKey'
const router = useRouter()
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()

const dataLists = ref([])
const activeKey = ref('3')

const init = () => {
  getNewsList(activeKey.value) // 1，3，4，6
}
const getNewsList = async (type) => {
  tablePage.isLoading = true
  let params = {
    type,
    pageNum: tablePage.pageNum,
    pageSize: tablePage.pageSize,
  }
  const { data } = await api.queryNewsList(params)
  dataLists.value = [...dataLists.value, ...data.list]
  tablePage.total = data.total
  tablePage.isLoading = false
}

const infoData = computed(() => {
  return [
    { name: textI18n('con.a10'), list: dataLists.value.slice(11, 16) },
    { name: textI18n('con.a19'), list: dataLists.value.slice(20, 25) },
  ]
})
// 监听滚动事件 当用户滚动到距离底部5px时，会自动加载更多数据
const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  if (
    clientHeight + scrollTop >= scrollHeight - 5 &&
    !tablePage.isLoading &&
    dataLists.value.length < tablePage.total
  ) {
    tablePage.pageNum++
    getNewsList(activeKey.value)
  }
}
const typeClick = (item) => {
  dataLists.value = []
  tablePage.pageNum = 1
  getNewsList(item)
}

const goDetail = (item) => {
  console.log(item, '详情')
  setCache(CacheFindDetail, item, true)
  router.push('/finddetail')
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  init()
})
// 卸载时移除滚动事件
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="back">
    <div>
      <i>{{ $t('menu.a1') }}</i>
      <em>>{{ $t('menu.a8') }}</em>
    </div>
  </div>
  <div class="content">
    <a-row justify="space-between">
      <a-col :span="16">
        <div class="left-div">
          <a-tabs class="con-tabs" v-model:activeKey="activeKey" @change="typeClick(activeKey)">
            <a-tab-pane :tab="item.label" :key="item.key" v-for="item in typeConfig"></a-tab-pane>
          </a-tabs>
          <div class="item" v-for="(item, index) in dataLists" :key="index" @click="goDetail(item)">
            <a-row justify="space-between">
              <a-col :span="16">
                <p class="item-title">{{ item.title }}</p>
                <p class="item-content">{{ item.content }}</p>
                <div class="item-bot">
                  <p>{{ $t('record.a1') }}：{{ formatTime(item.updateTime) }}</p>
                  <p>{{ $t('con.a22') }}：{{ item.views }}</p>
                </div>
              </a-col>
              <a-col :span="8">
                <img class="item-img" :src="$imagePrefix + item.imgurl" />
              </a-col>
            </a-row>
          </div>
          <div class="item-more">
            <p v-if="!tablePage.isLoading"><LoadingOutlined />{{ $t('con.a23') }}</p>
            <p v-else class="f-color">{{ $t('con.a24') }}</p>
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="right-div">
          <p class="right-div-title">{{ $t('con.a19') }}</p>
          <div
            class="right-item"
            v-for="(item, index) in dataLists.slice(5, 10)"
            :key="index"
            @click="goDetail(item)"
          >
            <div>
              <img
                class="top-i"
                v-if="index < 3"
                :src="$imgUrl(`/assets/img/find/num${index}.png`)"
              />
              <img class="bot-i" v-if="index > 2" :src="$imgUrl(`/assets/img/find/${index}.png`)" />
            </div>
            <p>{{ item.title }}</p>
          </div>
        </div>

        <div class="right-div" v-for="(el, i) in infoData" :key="i">
          <p class="right-div-title">{{ el.name }}</p>
          <div
            class="right-item"
            v-for="(item, index) in el.list"
            :key="index"
            @click="goDetail(item)"
          >
            <div class="right-item-img">
              <img
                :class="index < 1 ? 'top-ii' : 'bot-i'"
                :src="$imgUrl(`/assets/img/find/${index}.png`)"
              />
            </div>
            <p>{{ item.title }}</p>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>

  <div class="container"></div>
</template>

<style lang="scss" scoped>
.back {
  width: 100%;
  height: 63px;
  //   background: rgba(56, 142, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  & > div {
    width: 1200px;
    height: 100%;
    position: relative;
    padding-left: 38px;
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
  max-width: 1200px;
  padding: 10px 38px 38px 38px;
  .left-div {
    margin-right: 40px;

    .con-tabs {
      :deep(.ant-tabs-tab) {
        font-weight: bold;
        font-size: 24px;
        color: #56565b;
      }
      :deep(.ant-tabs-tab-active) {
        font-size: 30px;
      }
      :deep(.ant-tabs-nav) {
        &::before {
          border-bottom: none !important;
        }
      }
    }
    .item {
      margin-bottom: 60px;
      cursor: pointer;
      .item-title {
        font-weight: 500;
        font-size: 18px;
        color: #000000;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-right: 25px;
      }

      .item-content {
        font-weight: 500;
        font-size: 16px;
        color: #919395;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        margin-top: 10px;
        margin-right: 25px;
      }
      .item-bot {
        display: flex;
        justify-content: space-between;
        margin-right: 25px;
        margin-top: 20px;
        > p {
          font-weight: 500;
          font-size: 14px;
          color: #000000;
        }
      }
      .item-img {
        width: 100%;
        border-radius: 10px 10px 10px 10px;
        border: 1px solid #707070;
      }
    }
    .item-more {
      text-align: center;
    }
  }
  .right-div {
    background: linear-gradient(180deg, #f3f8fc 0%, #fefefe 100%);
    border-radius: 16px 16px 16px 16px;
    border: 2px solid #e5eff6;
    padding: 20px;
    margin-left: 40px;
    margin-top: 20px;
    .right-div-title {
      font-weight: bold;
      font-size: 24px;
      color: #000000;
      margin-bottom: 18px;
    }
    .right-item {
      display: flex;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      .right-item-img {
        justify-content: flex-start !important;
      }
      > div {
        width: 20px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        .top-i {
          width: 19px;
          height: 24px;
        }
        .bot-i {
          width: 9px;
          height: 13px;
        }
        .top-ii {
          width: 6px;
          height: 13px;
        }
      }

      > p {
        font-weight: 500;
        font-size: 17px;
        color: #000000;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
