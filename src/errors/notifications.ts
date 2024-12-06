import type { ToastInterface } from 'vue-toastification'

let toastService: ToastInterface | null = null

export function setToastService(toast: ToastInterface) {
  toastService = toast
}

export function showErrorNotification(message: string) {
  if (toastService && typeof window !== 'undefined') {
    toastService.error(message, {
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
      rtl: false
    })
  }
} 