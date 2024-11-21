<script setup>
import { reactive, defineProps, watch, computed, getCurrentInstance, inject } from 'vue'
import { useRouter } from 'vue-router'
import { menuData } from '@/router/menu'

import { useAppStore } from '@/store/index'
const emit = defineEmits(['onClose'])
const router = useRouter()
const store = useAppStore()
const message = inject('message')

const {
  proxy: { $t: textI18n },
} = getCurrentInstance()
const props = defineProps({
  defaultSelect: String,
  open: Boolean,
})
let state = reactive({
  selectedKeys: [props.defaultSelect],
  openKeys: ['1'],
})
const handleClick = (e) => {
  goPath(e.item.url)
}
const goPath = (path) => {
  const isIndexOrFindOrAbout =
    path === '/index' || path === '/find' || path === '/about' || path === '/home'
  console.log(tokenExists.value)
  if (tokenExists.value) {
    if (state.selectedKeys !== path && path) {
      router.push(path)
      onClose()
    }
  } else {
    if (isIndexOrFindOrAbout) {
      router.push(path)
      onClose()
    } else {
      message.warning(textI18n('login.a8'))
      // router.push('/login?type=1');
    }
  }
}

const onClose = () => {
  emit('onClose', false)
}
function updateMenuTitles(menu) {
  return menu.map((item) => ({
    ...item,
    title: textI18n(`${item.title}`),
    label: textI18n(`${item.label}`),
    children: item.children ? updateMenuTitles(item.children) : undefined,
  }))
}

const computedMenu = computed(() => {
  return updateMenuTitles(menuData)
})

const tokenExists = computed(() => {
  return store.$state.token
})
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

watch(
  () => router.currentRoute.value.path,
  (newVal) => {
    state.selectedKeys = [findMenuKeyByCurrentPath(newVal, menuData)]
    // console.log(state.selectedKeys, 'state.selectedKeys')

    state.openKeys = [findMenuKeyByCurrentPath(newVal, menuData)?.[0]]
    // console.log(state.openKeys, 'state.openKeys')
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div ref="basedrawer">
    <a-drawer
      :width="200"
      :closable="false"
      :getContainer="() => $refs['basedrawer']"
      placement="left"
      :open="props.open"
      @close="onClose"
    >
      <a-menu
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        :items="computedMenu"
        :open-keys="state.openKeys"
        @click="handleClick"
      ></a-menu>
    </a-drawer>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-drawer-header-title) {
  justify-content: end;
}

:deep(.ant-drawer-body) {
  padding: 20px 0 0 0 !important;
}

:deep(.ant-menu-inline) {
  border: none !important;
  background: none !important;
}
</style>
