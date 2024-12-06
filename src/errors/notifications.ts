import type { ToastInterface } from 'vue-toastification'
import { POSITION } from 'vue-toastification'
import type { ErrorDetails } from './types'

let toastService: ToastInterface | null = null

export function setToastService(toast: ToastInterface | null) {
  toastService = toast
}

export function showErrorNotification(errorDetails: ErrorDetails): void {
  // Log l'erreur dans la console
  console.error(
    `[${errorDetails.context}] Error: ${errorDetails.message}\n` +
    `Source: ${errorDetails.source}\n` +
    `Line: ${errorDetails.lineno}\n` +
    `Column: ${errorDetails.colno}\n` +
    `Error object: ${errorDetails.error}\n` +
    `Timestamp: ${new Date(errorDetails.timestamp).toISOString()}`
  )

  // Afficher une notification si le service est disponible
  if (toastService && typeof window !== 'undefined') {
    toastService.error(`Une erreur est survenue: ${errorDetails.message}`, {
      position: POSITION.TOP_RIGHT,
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