<!--
    表格
    columnsData: 数据列
    dataLists: 表格行内容
    tablePage: 分页配置
-->
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
const emit = defineEmits(['getList', 'handleClick', 'zixuanClick', 'listStockClick'])
const props = defineProps({
  columnsData: Array,
  dataLists: Array,
  tablePage: Object,
})
const handleClick = (type, item) => {
  emit('handleClick', type, item)
}
import zixuan from '@assets/img/common/zixuan.png'
import zixuan1 from '@assets/img/common/zixuan1.png' //其他页面取消自选图标
import zixuan2 from '@assets/img/common/zixuan2.png' //详情页面取消自选图标

// 监听滚动事件 当用户滚动到距离底部Xpx时，会自动加载更多数据
const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  if (
    clientHeight + scrollTop >= scrollHeight - 5 &&
    !props.tablePage.isLoading &&
    props.dataLists.length < props.tablePage.total
  ) {
    console.log('11')
    let pageUp = props.tablePage.pageNum + 1
    emit('getList', pageUp)
  }
}

const zixuanFun = (gid, type, str) => {
  emit('zixuanClick', gid, type, str)
}

const rowClick = (record, index) => {
  return {
    onclick: () => {
      if (props.tablePage.source === 'stockDetail') {
        // console.log(record, index)
        emit('listStockClick', record)
      } else {
        return
      }
    },
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
// // 卸载时移除滚动事件
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <a-table
    class="table-style"
    :columns="columnsData"
    :data-source="dataLists"
    :pagination="false"
    :loading="tablePage.apiLoading"
    :customRow="rowClick"
  >
    <!-- 表格操作 -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <span v-for="(item, index) in record.actionFun" :key="index">
          <span class="action-btn" @click.stop="handleClick(item, record)" :style="item.style">
            {{ item.text }}
          </span>
        </span>
      </template>

      <!-- 自选列表取消自选 -->
      <template v-if="column.dataIndex === 'stock_name' && column.isZixuan">
        <a-tooltip>
          <template #title> {{ $t('other.a3') }}</template>

          <img
            class="zixuan-img"
            @click.stop="zixuanFun(record.stock_gid, 1, 'zixuanList')"
            :src="zixuan"
          />
        </a-tooltip>
        <a-tooltip>
          <template #title> {{ record.stock_name }}</template>
          <span>{{ record.stock_name }}</span>
        </a-tooltip>
      </template>

      <!-- 国家股票列表表格列添加自选 -->
      <template v-if="column.dataIndex === 'stockName' && column.isZixuan">
        <a-tooltip>
          <template #title> {{ record.isOptionOpt ? $t('other.a3') : $t('other.a2') }}</template>

          <img
            class="zixuan-img"
            @click.stop="zixuanFun(record.stockGid, record.isOptionOpt)"
            :src="record.isOptionOpt ? zixuan : zixuan1"
          />
        </a-tooltip>
        <a-tooltip>
          <template #title> {{ record.stockName }}</template>
          <span>{{ record.stockName }}</span>
        </a-tooltip>
      </template>
      <template v-if="column.dataIndex === 'indexName'">
        <a-tooltip>
          <template #title> {{ record.indexName }}</template>
          <span>{{ record.indexName }}</span>
        </a-tooltip>
      </template>

      <template v-if="column.dataIndex === 'statusStr'">
        <slot></slot>
      </template>

      <!-- 涨幅改变颜色 -->
      <template v-if="column.dataIndex === 'chg_pct'">
        <span :class="[record.chg_pct > 0 ? 'f-text-up' : record.chg_pct < 0 ? 'f-text-down' : '']">
          {{ record.chg_pct }}
        </span>
      </template>
    </template>
  </a-table>
  <div class="table-page" v-if="tablePage.isPage">
    <!-- 上滑加载 -->
    <p v-if="!tablePage.isLoading && dataLists.length" class="f-color">
      <LoadingOutlined />{{ $t('con.a23') }}
    </p>
    <!-- 加载完成 -->
    <p v-if="tablePage.isLoading" class="f-color">{{ $t('con.a24') }}</p>
  </div>
</template>

<style lang="scss" scoped>
.table-style {
  .zixuan-img {
    width: 15px;
    margin-right: 6px;
    cursor: pointer;
  }
  ::v-deep .ant-table-thead {
    th {
      font-weight: 500 !important;
      font-size: 12px;
      color: #979898;
      background: #ffffff;
      border-bottom: 0 !important;
      &::before {
        height: 0 !important;
      }
      //   .ant-table-column-sorters{
      // color: #7E8697;
      //     justify-content: flex-start;
      //     .ant-table-column-title{
      //       flex: none;
      //     }
      //   }
    }
  }
  ::v-deep .ant-table-tbody {
    td {
      font-size: 14px;
      padding: 20px 16px !important;
      border-bottom: 0 !important;
      border-top: 0 !important;
      .action-btn {
        // margin-right: 10px;
        padding: 4px 8px;
      }
    }
  }
}
.table-page {
  text-align: center;
  padding: 20px 0;
  .f-color {
    font-size: 12px;
    color: #999999;
  }
}
</style>
