import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/core/base.scss'
import './index.scss'
import '@primevue/themes/lara'
import '@/styles/primevue.css'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ToggleButton from 'primevue/togglebutton'
import Toast from 'primevue/toast'
import Card from 'primevue/card'
import InputSwitch from 'primevue/inputswitch'
import PanelMenu from 'primevue/panelmenu'
import ProgressSpinner from 'primevue/progressspinner'
import App from './app.vue'
import routes from '~pages'
import { i18n } from '@/core/i18n/plugin'
import { NotificationsFeature } from '@/core/features/notifications.feature'
import { useFeatureStore } from '@/stores/features.store'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Initialisation des features
const featureStore = useFeatureStore()
featureStore.registry.register(new NotificationsFeature())

routes.push({
  path: '/',
  redirect: '/options',
})

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

// Configuration de l'application
app.use(PrimeVue)
app.use(ToastService)
app.use(i18n)
app.use(router)

// Composants PrimeVue globaux
app.component('PToast', Toast)
app.component('PCard', Card)
app.component('PInputSwitch', InputSwitch)
app.component('PPanelMenu', PanelMenu)
app.component('PProgressSpinner', ProgressSpinner)
app.component('PToggleButton', ToggleButton)
app.mount('#app')

