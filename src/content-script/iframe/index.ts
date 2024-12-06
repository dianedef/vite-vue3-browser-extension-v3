import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { onMessage, sendMessage } from 'webext-bridge/content-script'
import App from './app.vue'
import routes from '~pages'
import '../../assets/base.scss'
import './index.scss'

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

// Configuration du router
routes.push({
  path: '/',
  redirect: '/iframe',
})

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

// Créer l'application Vue
createApp(App).use(router).mount('#app')

// Écouter les messages du background
onMessage('ping', () => {
  return { success: true }
})
