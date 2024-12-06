import { sendMessage } from 'webext-bridge/content-script'

export interface ErrorDetails {
  message: string
  source: string
  lineno: number
  colno: number
  error: Error | null
  context?: string
  timestamp: number
}

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
    // Sérialiser l'erreur avant l'envoi
    const serializedError = {
      message: errorDetails.message,
      source: errorDetails.source,
      lineno: errorDetails.lineno,
      colno: errorDetails.colno,
      timestamp: errorDetails.timestamp,
      ...(errorDetails.context ? { context: errorDetails.context } : {}),
      error: error ? {
        message: error.message,
        name: error.name,
        ...(error.stack ? { stack: error.stack } : {})
      } : null
    }
    
    // Envoyer l'erreur sérialisée au background script
    await sendMessage('error:report', { data: serializedError }, 'background')
  } catch (e) {
    // En cas d'échec de l'envoi, log l'erreur localement
    console.error('Failed to send error to background:', e)
  }

  // Stocker l'erreur dans le stockage local pour analyse ultérieure
  try {
    const errors = await chrome.storage.local.get('errors')
    const errorList = errors.errors || []
    
    // Utiliser le même format sérialisé pour le stockage
    const storableError = {
      message: errorDetails.message,
      source: errorDetails.source,
      lineno: errorDetails.lineno,
      colno: errorDetails.colno,
      timestamp: errorDetails.timestamp,
      ...(errorDetails.context ? { context: errorDetails.context } : {}),
      error: error ? {
        message: error.message,
        name: error.name,
        ...(error.stack ? { stack: error.stack } : {})
      } : null
    }
    
    errorList.push(storableError)
    
    // Garder seulement les 100 dernières erreurs
    if (errorList.length > 100) {
      errorList.shift()
    }
    
    await chrome.storage.local.set({ errors: errorList })
  } catch (e) {
    console.error('Failed to store error:', e)
  }
}

export function setupErrorHandlers(context: string): void {
  // Gestionnaire d'erreurs global
  globalThis.onerror = (message, source, lineno, colno, error) => {
    handleError(message, source, lineno, colno, error, context)
    return false // Permet à l'erreur de se propager
  }

  // Gestionnaire de rejets de promesses non gérés
  globalThis.onunhandledrejection = (event) => {
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
