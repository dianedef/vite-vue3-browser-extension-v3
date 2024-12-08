import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import App from './app.vue'
import routes from '~pages'

// Styles
import '@/core/base.scss'
import './index.scss'

import { setupPrimeVue } from '@/plugins/primevue'
import { setToastService } from '@/errors/notifications'
import { ChromeI18nService } from '@/core/i18n/service'

routes.push({
  path: '/',
  redirect: '/popup',
})

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

const app = createApp(App)

// Initialiser le service i18n
const i18nService = new ChromeI18nService()
app.provide('i18n', i18nService)

setupPrimeVue(app)
app.use(router).use(createPinia()).mount('#app')

console.log(router.getRoutes())

self.onerror = function (message, source, lineno, colno, error) {
  console.info(
    `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
  )
}
