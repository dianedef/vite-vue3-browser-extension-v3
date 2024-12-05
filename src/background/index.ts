import { onMessage } from 'webext-bridge'
import type { ErrorDetails } from '@/errors'
import { setupErrorHandlers } from '@/errors'

// Configuration des gestionnaires d'erreurs
setupErrorHandlers('background')

chrome.runtime.onInstalled.addListener(async (opt) => {
  if (opt.reason === 'install') {
    await chrome.storage.local.clear()

    chrome.tabs.create({
      active: true,
      url: chrome.runtime.getURL('src/setup/index.html?type=install'),
    })
  }

  if (opt.reason === 'update') {
    chrome.tabs.create({
      active: true,
      url: chrome.runtime.getURL('src/setup/index.html?type=update'),
    })
  }
})

// Écoute des erreurs rapportées par les autres parties de l'extension
onMessage('error:report', async (payload) => {
  const errorDetails = payload.data as ErrorDetails
  
  // Log l'erreur dans la console du background
  console.error(
    `[${errorDetails.context}] Error received:`,
    errorDetails
  )

  // Ici, vous pourriez ajouter d'autres traitements :
  // - Envoi à un service de monitoring
  // - Notification à l'utilisateur pour les erreurs critiques
  // - Analytics
  // - etc.
})

console.log('hello world from background')

export {}
