import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken } from '@/utils/cache'
import baseRoutes from './base'

const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(import.meta.env.BASE_URL),
  routes: baseRoutes,
})

const pathTo = ['/index', '/home', '/about', '/find', '/login', '/stockdetail']

// 路由加载前
router.beforeEach((to, from, next) => {
  document.title = `blhm_${to.meta.title}`
  const token = getToken()

  if (token) {
    next()
  } else if (!token && pathTo.includes(to.path)) {
    next()
  } else if (!token && !pathTo.includes(to.path)) {
    next('/index')
  } else {
    next('/index')
  }
})

export default router
