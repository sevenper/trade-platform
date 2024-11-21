<script setup>
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  defineProps,
  watch,
  getCurrentInstance,
  computed,
  h,
} from 'vue'
import { useRouter } from 'vue-router'
import { leftMenu } from '@/router/menu'
import i0 from '@assets/img/user/0.png'
import i1 from '@assets/img/user/1.png'
import i2 from '@assets/img/user/2.png'
import i3 from '@assets/img/user/3.png'
const router = useRouter()
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()
const props = defineProps({
  defaultSelect: String,
})
let state = reactive({
  selectedKeys: [props.defaultSelect],
  openKeys: ['1'],
  preOpenKeys: ['1'],
  collapsed: false,
})
const handleResize = () => {
  state.collapsed = window.innerWidth < 600 ? true : false
}

const imgArr = [i0, i1, i2, i3]
const handleClick = (e) => {
  router.push(e.item.url)
}

function updateMenuTitles(menu) {
  console.log(menu)
  return menu.map((item, index) => ({
    ...item,
    title: textI18n(`${item.title}`),
    label: textI18n(`${item.label}`),
    icon: item.key.length === 1 ? h('img', { src: imgArr[index] }) : '',
    children: item.children ? updateMenuTitles(item.children) : undefined,
  }))
}

const computedMenu = computed(() => updateMenuTitles(leftMenu))

const findMenuKeyByCurrentPath = (router, menu) => {
  for (const item of menu) {
    if (item.url && router === item.url) {
      return item.key
    }
    if (item.children) {
      const childKey = findMenuKeyByCurrentPath(router, item.children)
      if (childKey) {
        return childKey
      }
    }
  }
  return null
}
const toggleCollapsed = () => {
  state.collapsed = !state.collapsed
  state.openKeys = state.collapsed ? [] : state.preOpenKeys
}

watch(
  () => router.currentRoute.value.path,
  (newVal) => {
    state.selectedKeys = [findMenuKeyByCurrentPath(newVal, leftMenu)]
  },
  { deep: true, immediate: true },
)
onMounted(() => {
  handleResize() // 初始化判断
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="left-menu">
    <div class="left-menu-toggle" @click="toggleCollapsed">
      <MenuUnfoldOutlined v-if="state.collapsed" />
      <MenuFoldOutlined v-else />
    </div>
    <a-menu
      v-model:selectedKeys="state.selectedKeys"
      style="border: none"
      mode="inline"
      :items="computedMenu"
      :open-keys="state.openKeys"
      :inline-collapsed="state.collapsed"
      @click="handleClick"
    >
    </a-menu>
  </div>
</template>

<style lang="scss" scoped>
.left-menu {
  width: 256px;
  height: calc(100vh - 66px);
  background: #ffffff;
  border-right: 1px solid #dddddd;
  position: fixed;
  top: 66px;
  .left-menu-toggle {
    text-align: right;
    margin: 10px 10px 10px 0;
    color: #0066ff;
    font-size: 24px;
  }
}
:deep(.ant-menu-inline) {
  border: none !important;
  background: none !important;
  .ant-menu-item {
    height: 40px;
    line-height: 40px;
  }
  .ant-menu-submenu-title {
    height: 40px;
    line-height: 40px;
  }
  .ant-menu-title-content {
    font-size: 16px;
  }
  .ant-menu-item-icon {
    width: 22px;
    height: 22px;
  }
}
</style>
