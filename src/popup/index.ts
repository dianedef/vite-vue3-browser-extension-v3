import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './app.vue'
import routes from '~pages'
import '@/core/base.scss'
import './index.scss'
import { setToastService } from '@/errors/notifications'

routes.push({
  path: '/',
  redirect: '/popup',
})

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

const app = createApp(App)

// Configuration de Vue Toastification
const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 3,
  newestOnTop: true
}

app.use(router)
   .use(createPinia())
   .use(Toast, toastOptions)
   .mount('#app')

// Initialiser le service de notification
setToastService(app.config.globalProperties.$toast)

console.log(router.getRoutes())

self.onerror = function (message, source, lineno, colno, error) {
  console.info(
    `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
  )
}
