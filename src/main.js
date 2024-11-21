import './assets/main.css'

import { initI18n } from './i18n'
import appConfig from '@/constants/app'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'amfe-flexible'
import '@/utils/rem.js'
import './assets/scss/common.scss'
import { message } from 'ant-design-vue'
import axios from 'axios'
import getAssetsFile from '@/utils/pub-ass.js'

const app = createApp(App)

app.config.globalProperties.$imagePrefix = appConfig.globalImg
app.config.globalProperties.$imgUrl = getAssetsFile

app.provide('message', message)
app.use(createPinia()).use(initI18n).use(router).mount('#app')

window.axios = axios
