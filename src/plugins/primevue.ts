import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import InputSwitch from 'primevue/inputswitch'
import Dropdown from 'primevue/dropdown'
import type { App } from 'vue'
import '@primevue/themes/lara'

export function setupPrimeVue(app: App) {
  app.use(PrimeVue, {
    ripple: true,
    unstyled: false
  })
  app.use(ToastService)

  // Enregistrement des composants globaux
  app.component('PButton', Button)
  app.component('PInputText', InputText)
  app.component('PToast', Toast)
  app.component('PInputSwitch', InputSwitch)
  app.component('PDropdown', Dropdown)
} 