import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'
import { i18nPlugin } from '@/core/i18n'
import { useI18n } from '@/composables/useI18n'
import browser from 'webextension-polyfill'
import { nextTick, ref } from 'vue'

// Mock de l'API browser/chrome
vi.mock('webextension-polyfill', () => ({
  default: {
    i18n: {
      getMessage: vi.fn(),
      getUILanguage: vi.fn()
    }
  }
}))

describe('extension e2e', () => {
  // Configuration du router pour les tests
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: '/',
        component: { template: '<div>Home</div>' }
      }
    ]
  })

  beforeEach(() => {
    vi.clearAllMocks()
    router.push('/')
  })

  it('should display correct translations in components', async () => {
    // Mock des traductions
    vi.mocked(browser.i18n.getMessage).mockImplementation((key) => {
      const translations = {
        extensionName: 'Extension Test',
        settingsTitle: 'Paramètres',
        featuresTitle: 'Fonctionnalités'
      }
      return translations[key] || key
    })

    // Test du composable useI18n
    const wrapper = mount({
      template: `
        <div>
          <h1>{{ t('extensionName') }}</h1>
          <h2>{{ t('settingsTitle') }}</h2>
          <h3>{{ t('featuresTitle') }}</h3>
        </div>
      `,
      setup() {
        const { t } = useI18n()
        return { t }
      }
    }, {
      global: {
        plugins: [i18nPlugin, router]
      }
    })

    await router.isReady()

    // Vérification du rendu
    expect(wrapper.text()).toContain('Extension Test')
    expect(wrapper.text()).toContain('Paramètres')
    expect(wrapper.text()).toContain('Fonctionnalités')
  })

  it('should handle missing translations', async () => {
    vi.mocked(browser.i18n.getMessage).mockReturnValue('')

    const wrapper = mount({
      template: '<div>{{ t("nonexistent.key") }}</div>',
      setup() {
        const { t } = useI18n()
        return { t }
      }
    }, {
      global: {
        plugins: [i18nPlugin, router]
      }
    })

    await router.isReady()
    expect(wrapper.text()).toBe('nonexistent.key')
  })

  it('should handle language changes', async () => {
    const currentLang = ref('fr')
    const translations = {
      fr: {
        greeting: 'Bonjour'
      },
      en: {
        greeting: 'Hello'
      }
    }

    // Mock des fonctions i18n
    vi.mocked(browser.i18n.getUILanguage).mockImplementation(() => currentLang.value)
    vi.mocked(browser.i18n.getMessage).mockImplementation((key) => 
      translations[currentLang.value][key] || key
    )

    const wrapper = mount({
      template: '<div>{{ t("greeting") }}</div>',
      setup() {
        const { t } = useI18n()
        return { t }
      }
    }, {
      global: {
        plugins: [i18nPlugin, router]
      }
    })

    await router.isReady()
    expect(wrapper.text()).toBe('Bonjour')

    // Changement de langue
    currentLang.value = 'en'
    await nextTick()
    
    // Force un re-rendu du composant
    wrapper.vm.$forceUpdate()
    await nextTick()

    expect(wrapper.text()).toBe('Hello')
  })

  it('should integrate with extension popup', async () => {
    // Mock des traductions pour le popup
    vi.mocked(browser.i18n.getMessage).mockImplementation((key) => {
      const translations = {
        extensionName: 'Extension Test',
        settingsTitle: 'Paramètres'
      }
      return translations[key] || key
    })

    // Import et montage du composant Popup
    const { default: Popup } = await import('@/popup/app.vue')
    const wrapper = mount(Popup, {
      global: {
        plugins: [i18nPlugin, router],
        stubs: {
          'RouterView': true
        }
      }
    })

    await router.isReady()
    expect(wrapper.html()).toContain('Extension Test')
    expect(wrapper.html()).toContain('Paramètres')
  })
})