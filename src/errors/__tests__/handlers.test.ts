// Créer le mock avant les imports
const mockShowErrorNotification = vi.fn()

// Mock du module notifications
vi.mock('../notifications', () => ({
  showErrorNotification: mockShowErrorNotification,
  setToastService: vi.fn()
}))

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createHandlersMock } from './mocks/handlers.mock'
import type { ToastInterface } from 'vue-toastification'

describe('Error Handlers', () => {
  let handlersMock: ReturnType<typeof createHandlersMock>
  let mockToast: ToastInterface

  beforeEach(() => {
    handlersMock = createHandlersMock()
    vi.clearAllMocks()
    
    // Créer un mock du service toast
    mockToast = {
      error: vi.fn(),
      success: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
      clear: vi.fn()
    } as unknown as ToastInterface
    
    // Définir les propriétés avant de les mocker
    self.onerror = () => false
    self.onunhandledrejection = () => {}
    
    vi.spyOn(self, 'onerror')
    vi.spyOn(self, 'onunhandledrejection')
  })

  afterEach(() => {
    // Nettoyer les propriétés après chaque test
    self.onerror = null
    self.onunhandledrejection = null
    vi.clearAllMocks()
    vi.resetModules()
  })

  describe('Error handling with mocks', () => {
    it('should handle errors correctly and show notification', async () => {
      const context = { someContext: 'test' }
      const error = new Error('Test error')
      const message = 'Test error message'
      const source = 'test.js'
      const lineno = 1
      const colno = 1

      const { handleError } = await import('../handlers')
      await handleError(message, source, lineno, colno, error, context)

      expect(mockShowErrorNotification).toHaveBeenCalledWith(
        'Une erreur est survenue: Test error message'
      )
    })

    it('should handle unhandled rejections and show notification', async () => {
      const context = { someContext: 'test' }
      const error = new Error('Test rejection')
      
      const { handleError } = await import('../handlers')
      await handleError(
        error.message,
        error.stack,
        0,
        0,
        error,
        context
      )

      expect(mockShowErrorNotification).toHaveBeenCalledWith(
        'Une erreur est survenue: Test rejection'
      )
    })
  })

  describe('Error handling with real implementation', () => {
    it('should handle Vue errors and show notification', async () => {
      const context = { someContext: 'test' }
      const error = new Error('Vue error')
      
      const { handleError } = await import('../handlers')
      await handleError(
        'Vue error',
        'vue-component.vue',
        1,
        1,
        error,
        context
      )

      expect(mockShowErrorNotification).toHaveBeenCalledWith(
        'Une erreur est survenue: Vue error'
      )
    })
  })
}) 