import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import App from '../app.vue'
import routes from '~pages'

describe('setup component', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    router = createRouter({
      history: createWebHashHistory(),
      routes,
    })
    // Réinitialiser le titre
    document.title = ''
  })

  it('devrait afficher le composant Install par défaut', async () => {
    // Simuler l'URL sans paramètre type
    const url = new URL('http://localhost/')
    Object.defineProperty(window, 'location', {
      value: url,
      writable: true
    })
    
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        mocks: {
          __DISPLAY_NAME__: 'Test Extension'
        }
      }
    })

    await router.isReady()
    await wrapper.vm.$nextTick()
    
    // Vérifier que le titre contient "Installed"
    expect(document.title).toBe('Test Extension | Installed!')
  })

  it('devrait afficher le composant Update quand type=update', async () => {
    // Simuler l'URL avec type=update
    const url = new URL('http://localhost/?type=update')
    Object.defineProperty(window, 'location', {
      value: url,
      writable: true
    })
    
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        mocks: {
          __DISPLAY_NAME__: 'Test Extension'
        }
      }
    })

    await router.isReady()
    await wrapper.vm.$nextTick()
    
    // Vérifier que le titre contient "Updated"
    expect(document.title).toBe('Test Extension | Updated!')
  })

  it('devrait gérer les paramètres URL invalides', async () => {
    // Simuler l'URL avec un type invalide
    const url = new URL('http://localhost/?type=invalid')
    Object.defineProperty(window, 'location', {
      value: url,
      writable: true
    })
    
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        mocks: {
          __DISPLAY_NAME__: 'Test Extension'
        }
      }
    })

    await router.isReady()
    await wrapper.vm.$nextTick()
    
    // Devrait utiliser Install comme fallback
    expect(document.title).toBe('Test Extension | Installed!')
  })
}) 