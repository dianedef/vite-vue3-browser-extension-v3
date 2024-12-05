import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/setup',
    component: () => import('../setup/app.vue')
  },
  {
    path: '/setup/install',
    component: () => import('../components/install.vue')
  },
  {
    path: '/setup/update',
    component: () => import('../components/update.vue')
  }
]

export default routes 