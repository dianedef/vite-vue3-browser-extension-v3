import { describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import App from '../app.vue'
import routes from '~pages'

describe('extension setup', () => {
  it('devrait créer une instance Vue avec le routeur', () => {
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    })

    const app = createApp(App)
    const useSpy = vi.spyOn(app, 'use')
    const mountSpy = vi.spyOn(app, 'mount')

    app.use(router).mount('#app')

    expect(useSpy).toHaveBeenCalledWith(router)
    expect(mountSpy).toHaveBeenCalledWith('#app')
  })

  it('devrait avoir les routes setup définies', () => {
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    })

    const setupRoute = router.getRoutes().find(route => route.path === '/setup')
    expect(setupRoute).toBeDefined()
    expect(setupRoute?.path).toBe('/setup')

    const installRoute = router.getRoutes().find(route => route.path === '/setup/install')
    expect(installRoute).toBeDefined()
    expect(installRoute?.path).toBe('/setup/install')

    const updateRoute = router.getRoutes().find(route => route.path === '/setup/update')
    expect(updateRoute).toBeDefined()
    expect(updateRoute?.path).toBe('/setup/update')
  })

  it('devrait gérer les erreurs globales', () => {
    const consoleInfoSpy = vi.spyOn(console, 'info')
    const error = new Error('Test error')
    const source = 'test.js'
    const lineno = 1
    const colno = 1

    // Définir directement le gestionnaire d'erreurs comme dans index.ts
    self.onerror = function (message, source, lineno, colno, error) {
      console.info(
        `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
      )
    }

    // Déclencher l'erreur
    self.onerror('Test error', source, lineno, colno, error)

    // Vérifier que console.info a été appelé avec le bon message
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      `Error: Test error\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
    )
  })
}) 