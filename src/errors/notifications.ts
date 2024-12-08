import type { ToastServiceMethods } from 'primevue/toastservice'
import type { ErrorDetails } from './types'

let toastService: ToastServiceMethods | null = null

export function setToastService(toast: ToastServiceMethods | null) {
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
    toastService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: `Une erreur est survenue: ${errorDetails.message}`,
      life: 5000,
      closable: true,
      group: 'error-notifications'
    })
  }
} 