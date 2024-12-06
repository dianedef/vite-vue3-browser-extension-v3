import './index.scss'
import { onMessage, sendMessage } from 'webext-bridge/content-script'

// Initialisation de la connexion webext-bridge
let isConnected = false

async function initBridge() {
  try {
    // Ping le background pour vérifier la connexion
    await sendMessage('ping', { }, 'background')
    isConnected = true
    console.info('webext-bridge: Connexion établie avec succès')
  } catch (e) {
    console.info('webext-bridge: Tentative de connexion échouée, nouvelle tentative dans 1s')
    setTimeout(initBridge, 1000)
  }
}

// Démarrer l'initialisation
initBridge()

// Écouter les messages du background
onMessage('ping', () => {
  return { success: true }
})

// Injecter l'iframe
const src = chrome.runtime.getURL('src/content-script/iframe/index.html')

const iframe = new DOMParser().parseFromString(
  `<iframe class="crx-iframe" src="${src}"></iframe>`,
  'text/html'
).body.firstElementChild

if (iframe) {
  document.body?.append(iframe)
}
