import Layout from '@/layout/index.vue'
import { textI18n } from '@/utils/utils'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: { title: textI18n('menu.a1') },
    children: [
      {
        path: '/home', //快捷交易
        component: () => import('@/views/home/index.vue'),
        meta: { title: textI18n('menu.a6') },
      },
      {
        path: '/find', //发现
        component: () => import('@/views/find/index.vue'),
        meta: { title: textI18n('menu.a3') },
      },
      {
        path: '/finddetail', //资讯详情
        component: () => import('@/views/find/detail.vue'),
        meta: { title: textI18n('menu.a28') },
      },
      {
        path: '/stockdetail', //股票详情
        component: () => import('@/views/stockDetail/index.vue'),
        meta: { title: textI18n('menu.a5') },
      },
      {
        path: '/recharge', //充值
        component: () => import('@/views/rechargeExtract/recharge.vue'),
        meta: { title: textI18n('menu.a11') },
      },
      {
        path: '/extract', //提现
        component: () => import('@/views/rechargeExtract/extract.vue'),
        meta: { title: textI18n('menu.a12') },
      },
      {
        path: '/conversion', // 互转
        component: () => import('@/views/rechargeExtract/conversion.vue'),
        meta: { title: textI18n('menu.a13') },
      },
      {
        path: '/myholding', // 我的持仓
        component: () => import('@/views/myHolding/index.vue'),
        meta: { title: textI18n('menu.a17') },
      },
      {
        path: '/bigdeal', //大宗交易
        component: () => import('@/views/goldService/bigDeal.vue'),
        meta: { title: textI18n('menu.a18') },
      },
      {
        path: '/newstock', //新股认筹
        component: () => import('@/views/goldService/newStock.vue'),
        meta: { title: textI18n('menu.a19') },
      },
      {
        path: '/placement', //配售
        component: () => import('@/views/goldService/placement.vue'),
        meta: { title: textI18n('menu.a20') },
      },
      {
        path: '/fundmore', //资金概览
        component: () => import('@/views/userInfo/fundMore/index.vue'),
        meta: { title: textI18n('menu.a22') },
      },
      {
        path: '/funddetail', //资金明细
        component: () => import('@/views/userInfo/fundDetail/index.vue'),
        meta: { title: textI18n('menu.a23') },
      },
      {
        path: '/safety', //账户安全
        component: () => import('@/views/userInfo/safety/index.vue'),
        meta: { title: '' },
      },
      {
        path: '/notify', //系统消息
        component: () => import('@/views/userInfo/notify/index.vue'),
        meta: { title: textI18n('menu.a26') },
      },
      {
        path: '/auth', //认证
        component: () => import('@/views/userInfo/auth/index.vue'),
        meta: { title: textI18n('menu.a24') },
      },
      {
        path: '/card', //银行卡
        component: () => import('@/views/userInfo/card/index.vue'),
        meta: { title: textI18n('menu.a27') },
      },
      {
        path: '/index',
        component: () => import('@/views/index/index.vue'),
        meta: { title: textI18n('menu.a1') },
      },
      {
        path: '/about',
        component: () => import('@/views/about/index.vue'),
        meta: { title: textI18n('menu.a10') },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/login.vue'),
    meta: { title: textI18n('login.a5') },
  },
]

export default routes
