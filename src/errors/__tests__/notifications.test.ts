import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setToastService, showErrorNotification } from '../notifications'
import type { ToastInterface } from 'vue-toastification'

describe('Notification Service', () => {
  let mockToast: ToastInterface

  beforeEach(() => {
    // Créer un mock du service toast
    mockToast = {
      error: vi.fn(),
      success: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
      clear: vi.fn()
    } as unknown as ToastInterface

    // Reset le service avant chaque test
    setToastService(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('ne devrait pas afficher de notification si le service n\'est pas initialisé', () => {
    showErrorNotification('Test message')
    expect(mockToast.error).not.toHaveBeenCalled()
  })

  it('devrait afficher une notification d\'erreur avec le message fourni', () => {
    setToastService(mockToast)
    const message = 'Test error message'
    
    showErrorNotification(message)
    
    expect(mockToast.error).toHaveBeenCalledWith(message, expect.objectContaining({
      position: 'top-right',
      timeout: 5000,
      closeOnClick: true
    }))
  })

  it('devrait utiliser les options de configuration par défaut', () => {
    setToastService(mockToast)
    showErrorNotification('Test message')
    
    expect(mockToast.error).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      position: 'top-right',
      timeout: 5000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: true,
      closeButton: 'button',
      icon: true,
      rtl: false
    }))
  })

  // Test d'intégration avec le gestionnaire d'erreurs
  it('devrait être appelé par le gestionnaire d\'erreurs', async () => {
    const { handleError } = await import('../handlers')
    setToastService(mockToast)
    
    await handleError('Test error', 'test.js', 1, 1, new Error('Test'), 'test')
    
    expect(mockToast.error).toHaveBeenCalledWith(
      'Une erreur est survenue: Test error',
      expect.any(Object)
    )
  })
}) 