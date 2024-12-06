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

// Ouvrir la page de bienvenue lors de l'installation/mise à jour
chrome.runtime.onInstalled.addListener(async (details) => {
  // Récupérer l'onglet actif (page des extensions)
  const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true })
  
  if (details.reason === 'install') {
    // Nouvelle installation
    const url = chrome.runtime.getURL('src/setup/index.html?type=install')
    await chrome.tabs.create({ 
      url, 
      active: true,
      openerTabId: currentTab?.id // Garder la page des extensions ouverte
    })
  } else if (details.reason === 'update') {
    // Mise à jour
    const url = chrome.runtime.getURL('src/setup/index.html?type=update')
    await chrome.tabs.create({ 
      url, 
      active: true,
      openerTabId: currentTab?.id // Garder la page des extensions ouverte
    })
  }
})

console.log('Background script initialized')

export {}

