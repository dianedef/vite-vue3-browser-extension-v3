import { sendMessage } from 'webext-bridge/content-script'
import type { ErrorDetails } from './types'
import { storeError } from './storage'
import { showErrorNotification } from './notifications'

const isWindow = typeof window !== 'undefined'
let isHandlingError = false

// Vérifier si le background est disponible
async function isBackgroundAvailable(): Promise<boolean> {
  try {
    return chrome.runtime?.id != null
  } catch {
    return false
  }
}

export async function handleError(
  message: string | Event,
  source: string | undefined,
  lineno: number,
  colno: number,
  error: Error | null,
  context: string
): Promise<boolean> {
  if (isHandlingError) {
    return false
  }

  isHandlingError = true

  try {
    const errorDetails: ErrorDetails = {
      message: typeof message === 'string' ? message : message.type,
      source: source || 'unknown',
      lineno: lineno || 0,
      colno: colno || 0,
      error: error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : null,
      context,
      timestamp: Date.now()
    }

    // Stocker l'erreur localement d'abord
    await storeError(errorDetails)

    // Log l'erreur dans la console
    console.error(
      `[${context}] Error: ${errorDetails.message}\n` +
      `Source: ${errorDetails.source}\n` +
      `Line: ${errorDetails.lineno}\n` +
      `Column: ${errorDetails.colno}\n` +
      `Error object: ${errorDetails.error}\n` +
      `Timestamp: ${new Date(errorDetails.timestamp).toISOString()}`
    )

    // Afficher une notification si possible
    if (isWindow) {
      showErrorNotification(errorDetails)
    }

    // Vérifier si le background est disponible avant d'envoyer le message
    if (await isBackgroundAvailable()) {
      try {
        await sendMessage('error:report', { data: errorDetails }, 'background')
      } catch {
        // Ignorer silencieusement les erreurs de communication
      }
    }

    return false
  } finally {
    isHandlingError = false
  }
}

export function setupErrorHandlers(context: string): void {
  // Ne configurer les gestionnaires que dans un contexte window
  if (!isWindow) {
    return
  }

  // Gestionnaire d'erreurs global
  window.onerror = (message, source, lineno, colno, error) => {
    return handleError(
      message || 'Unknown error',
      source || 'unknown',
      lineno || 0,
      colno || 0,
      error || null,
      context
    )
  }

  // Gestionnaire de rejets de promesses non gérés
  window.onunhandledrejection = (event) => {
    handleError(
      event.reason?.message || 'Unhandled Promise Rejection',
      event.reason?.stack || 'unknown',
      0,
      0,
      event.reason || null,
      context
    )
  }
} 