import { sendMessage } from 'webext-bridge'
import type { ErrorDetails } from './types'
import { storeError } from './storage'
import { showErrorNotification } from './notifications'

export async function handleError(
  message: string | Event,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error | null,
  context: string = 'unknown'
): Promise<void> {
  const errorDetails: ErrorDetails = {
    message: message instanceof Event ? message.toString() : message,
    source: source || 'unknown',
    lineno: lineno || 0,
    colno: colno || 0,
    error: error || null,
    context,
    timestamp: Date.now()
  }

  // Afficher une notification d'erreur
  showErrorNotification(`Une erreur est survenue: ${errorDetails.message}`)

  // Log l'erreur dans la console
  console.error(
    `[${context}] Error: ${errorDetails.message}\n` +
    `Source: ${errorDetails.source}\n` +
    `Line: ${errorDetails.lineno}\n` +
    `Column: ${errorDetails.colno}\n` +
    `Error object: ${errorDetails.error}\n` +
    `Timestamp: ${new Date(errorDetails.timestamp).toISOString()}`
  )

  try {
    // Envoyer l'erreur au background script pour traitement
    await sendMessage('error:report', errorDetails, 'background')
  } catch (e) {
    // En cas d'échec de l'envoi, log l'erreur localement
    console.error('Failed to send error to background:', e)
  }

  // Stocker l'erreur
  await storeError(errorDetails)
}

export function setupErrorHandlers(context: string): void {
  // Gestionnaire d'erreurs global
  self.onerror = (message, source, lineno, colno, error) => {
    handleError(message, source, lineno, colno, error, context)
    return false // Permet à l'erreur de se propager
  }

  // Gestionnaire de rejets de promesses non gérés
  self.onunhandledrejection = (event) => {
    handleError(
      event.reason?.message || 'Unhandled Promise Rejection',
      event.reason?.stack,
      0,
      0,
      event.reason,
      context
    )
  }

  // Gestionnaire d'erreurs Vue
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      handleError(event.message, event.filename, event.lineno, event.colno, event.error, context)
    })
  }
} 