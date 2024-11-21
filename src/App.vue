<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { supportLangs } from './i18n'
import { useAppStore } from './store/index'
export default defineComponent({
  name: 'App',

  setup() {
    const { locale } = useI18n()

    const store = useAppStore()
    store.initApp()

    return {
      locale: supportLangs[locale.value].el,
    }
  },
})
</script>

<template>
  <a-config-provider
    :locale="locale"
    :theme="{
      token: {
        colorPrimary: '#0066FF',
      },
    }"
  >
    <RouterView />
  </a-config-provider>
</template>

<style scoped></style>
