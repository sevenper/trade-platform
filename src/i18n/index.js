import app from '@/constants/app'
import { getCache } from '@/utils/cache'
import elZh from 'ant-design-vue/es/locale/zh_CN'
import elTW from 'ant-design-vue/es/locale/zh_TW'
import elEn from 'ant-design-vue/es/locale/en_GB'

import zhCN from './locales/zhCN.js'
import zhTW from './locales/zhTW.js'
import enUS from './locales/enUS.js'

// import dayjs from 'dayjs';
// import 'dayjs/locale/zh-cn';
// dayjs.locale('zh-cn');
import { createI18n } from 'vue-i18n'
import { CacheLang } from '@/constants/cacheKey'
let dynamicPageLangs = {}
/**
 * 取默认语言
 * @returns
 */
export const getLocaleLang = () => {
  const lang = getCache(CacheLang, { isParse: false }, app.defaultLang)
  // console.log(lang, 'lang')
  return lang
}

/**
 *  src/i18n/locales 语言
 */
export const supportLangs = {
  'zh-CN': {
    langName: '简体中文',
    el: elZh,
    ...zhCN,
  },
  'en-US': {
    langName: 'English',
    el: elEn,
    ...enUS,
  },
  'zh-TW': {
    langName: '繁體中文',
    el: elTW,
    ...zhTW,
  },
}

/**
 * 取语言名称
 * @param lang
 * @returns
 */
export const getLangName = (lang) => {
  return supportLangs[lang]?.langName
}

export const initI18n = createI18n({
  legacy: false,
  locale: getLocaleLang(),
  fallbackLocale: app.defaultLang,
  messages: supportLangs,
})
