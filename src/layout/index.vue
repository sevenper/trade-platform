<script setup>
import Skeleton from '@/components/skeleton/index.vue'
</script>
<template>
  <a-layout>
    <Skeleton></Skeleton>
    <!-- 内容 -->
    <a-layout-content class="container">
      <div class="container-div">
        <router-view v-slot="{ Component }" :key="$route.fullPath">
          <component :is="Component" />
        </router-view>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<style lang="scss" scoped>
.ant-layout {
  background: #f9f9f9;
  .header {
    background: #fff;
    height: 66px;
    line-height: 66px;
    display: flex;
    justify-content: space-between;
  }

  .container {
    min-height: calc(100vh - 66px);
  }
}
</style>
