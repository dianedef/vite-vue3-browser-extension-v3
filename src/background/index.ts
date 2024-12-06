import { onMessage } from 'webext-bridge/background'
import type { ErrorDetails } from '../errors/types'

// Gestionnaire de ping pour vérifier la connexion
onMessage('ping', () => {
  return { success: true }
})

// Gestionnaire d'erreurs
onMessage('error:report', async (message) => {
  try {
    const errorDetails = message.data as unknown as ErrorDetails
    console.error(
      `[${errorDetails.context || 'unknown'}] Error received:`,
      errorDetails
    )
  } catch (e) {
    console.error('Failed to process error:', e)
  }
})

console.log('Background script initialized')

export {}

