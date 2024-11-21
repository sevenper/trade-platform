<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
  defineProps,
  watch,
  inject,
  nextTick,
  getCurrentInstance,
} from 'vue'
import { init, dispose } from 'klinecharts'
import { config, timeConfig } from './klineConfig.js'
import * as api from '@/axios/api'
import { getCache } from '@/utils/cache'
import { CacheStockDetail, CacheLang } from '@/constants/cacheKey'
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()
const message = inject('message')
const props = defineProps({
  itemDetail: Object,
})
const chartContainer = ref(null)

// kline init 对象
let kline = null
const klineData = ref([])
const langV = getCache(CacheLang, { isParse: false }, '')
let lang
if (langV === 'zh-CN' || 'en-US') {
  lang = langV
} else {
  lang = 'en-US'
}

const activeKey = ref(timeConfig[0].key) //默认

const resizeChart = () => {
  if (kline) {
    kline.resize()
  }
}
// 分时 time:1  5分 time:5  15分 time:15 30分 time:30  日线 time:D 周线 time: W 月线 time: M
const getKlineData = async (time) => {
  let params = {
    code: props.itemDetail.stockGid || props.itemDetail.stock_gid || props.itemDetail.indexGid,
    time,
    type: props.itemDetail.indexGid ? 2 : 1, //指数为2  普通股票为1
  }

  try {
    let { data } = await api.getMinKEcharts(params)
    // console.log(JSON.parse(data), 'getMinKEcharts')
    const list = JSON.parse(data).map((item, key) => {
      return {
        close: item.c,
        high: item.h,
        low: item.l,
        open: item.o,
        timestamp: item.t * 1000,
        volume: item.v,
      }
    })
    klineData.value = list
    return data
  } catch (err) {
    klineData.value = []
    return {}
  }
}

// area  面积
const saveData = (type) => {
  kline.setStyles({
    candle: { type },
  })
}

const timeType = async (type) => {
  type === '1' ? saveData('area') : saveData('candle_solid')
  await getKlineData(type)
  kline.applyNewData(klineData.value)
}

onMounted(async () => {
  let data = await getKlineData(activeKey.value)
  if (data && data === '[]') {
    message.info(textI18n('tips.a3'))
    return
  }
})
watch(
  () => props.itemDetail,
  async (newVal) => {
    // console.log(newVal, 'watch')
    try {
      let { data } = await getKlineData(activeKey.value)
      // console.log(kline,'kline')
      if (kline) {
        kline.applyNewData(klineData.value)
      } else {
        kline = init('chart', { styles: config, locale: lang })
        saveData('area')

        kline.applyNewData(klineData.value)
        kline.createIndicator('MA', false, { id: 'candle_pane' })
        kline.createIndicator('VOL', false)

        window.addEventListener('resize', resizeChart)
      }
    } catch (err) {
      console.log(err, 'try')
      return err
    }
  },
  { deep: true, immediate: true },
)
onUnmounted(() => {
  dispose('kline')
  window.removeEventListener('resize', resizeChart)
})
</script>

<template>
  <div class="nav-div">
    <a-tabs class="con-tabs" v-model:activeKey="activeKey" @change="timeType(activeKey)">
      <a-tab-pane :tab="item.label" :key="item.key" v-for="item in timeConfig"></a-tab-pane>
    </a-tabs>
  </div>
  <div id="chart" ref="chartContainer" style="height: 50vh" />
</template>

<style lang="scss" scoped>
.nav-div {
  .con-tabs {
    padding-left: 20px;
    margin-bottom: 20px;
    border: 1px solid rgb(112, 112, 112, 0.2);
    :deep(.ant-tabs-nav) {
      margin: 0;
    }
    :deep(.ant-tabs-tab) {
      font-weight: bold;
      font-size: 14px;
      color: #56565b;
    }
    :deep(.ant-tabs-tab-active) {
      font-size: 14px;
      .ant-tabs-tab-btn {
        color: #ffffff;
      }
    }
    :deep(.ant-tabs-nav) {
      &::before {
        border-bottom: none !important;
      }
    }
  }
}
.chart-div {
  padding: 0 20px;
}
</style>
