import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import postCssPxToRem from 'postcss-pxtorem'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  },
  server: {
    port: 9000,
  },
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          // 自适应，px>rem转换
          rootValue: 192, //pc端建议：192，移动端建议：75；设计稿宽度的1 / 10
          propList: ['*', '!border'], // 除 border 外所有px 转 rem // 需要转换的属性，这里选择全部都进行转换
          selectorBlackList: ['.norem'],
          // 过滤掉norem-开头的class，不进行rem转换，这个内容可以不写
          unitPrecision: 5, // 转换后的精度，即小数点位数
          replace: true, // 是否直接更换属性值而不添加备份属性
          mediaQuery: false, // 是否在媒体查询中也转换px为rem
          minPixelValue: 0, // 设置要转换的最小像素值
        }),
      ],
    },
  },
})
