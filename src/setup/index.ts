import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import App from './app.vue'
import routes from '~pages'
import '@/assets/base.scss'
import './index.scss'
import { setupErrorHandlers } from '@/utils'

routes.push({
  path: '/',
  component: App
})

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

const app = createApp(App)

app.use(router).mount('#app')

// Configuration des gestionnaires d'erreurs
setupErrorHandlers('setup')
