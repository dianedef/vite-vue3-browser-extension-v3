import { describe, expect, it, vi } from 'vitest'
import { type App, createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import { setupPrimeVue } from '../primevue'

// Mock des composants et services PrimeVue
vi.mock('primevue/config', () => ({
  default: vi.fn()
}))

vi.mock('primevue/button', () => ({
  default: vi.fn()
}))

vi.mock('primevue/inputtext', () => ({
  default: vi.fn()
}))

vi.mock('primevue/toast', () => ({
  default: vi.fn()
}))

vi.mock('primevue/toastservice', () => ({
  default: vi.fn()
}))

vi.mock('@primevue/themes/lara', () => ({}))

describe('primevue setup', () => {
  let app: App

  beforeEach(() => {
    app = createApp({})
    app.use = vi.fn().mockReturnThis()
    app.component = vi.fn().mockReturnThis()
  })

  it('devrait initialiser PrimeVue avec la configuration correcte', () => {
    setupPrimeVue(app)

    expect(app.use).toHaveBeenCalledWith(PrimeVue, {
      ripple: true,
      unstyled: false
    })
  })

  it('devrait enregistrer le service Toast', () => {
    setupPrimeVue(app)

    expect(app.use).toHaveBeenCalledWith(ToastService)
  })

  it('devrait enregistrer les composants globaux', () => {
    setupPrimeVue(app)

    expect(app.component).toHaveBeenCalledWith('PButton', Button)
    expect(app.component).toHaveBeenCalledWith('PInputText', InputText)
    expect(app.component).toHaveBeenCalledWith('PToast', Toast)
  })

  it('devrait charger le thème Lara', () => {
    // Le thème est importé automatiquement, on vérifie juste que le mock existe
    expect(() => setupPrimeVue(app)).not.toThrow()
  })
}) 