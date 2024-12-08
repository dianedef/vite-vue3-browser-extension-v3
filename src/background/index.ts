import { onMessage } from 'webext-bridge/background'
import { createPinia } from 'pinia'
import type { ErrorDetails } from '../errors/types'
import { NotificationsFeature } from '@/core/features/notifications.feature'
import { useFeatureStore } from '@/stores/features.store'

// Initialisation de Pinia pour le background
const pinia = createPinia()

// Initialisation du store avec l'instance Pinia
const featureStore = useFeatureStore(pinia)
featureStore.registry.register(new NotificationsFeature())
featureStore.initializeFeatures().catch(error => {
  console.error('Failed to initialize features:', error)
})

// Gestionnaire de ping pour vérifier la connexion
onMessage('ping', () => {
  return { success: true }
})

// Gestionnaire pour les features
onMessage('feature:execute', async (message) => {
  const { featureId, options } = message.data as { featureId: string, options: any }
  try {
    await featureStore.executeFeature(featureId, options)
    return { success: true }
  } catch (error) {
    console.error(`Failed to execute feature ${featureId}:`, error)
    return { success: false, error }
  }
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

export {}

