import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { handleError } from '../handlers'
import type { ToastInterface } from 'vue-toastification'

// Les mocks doivent être après les imports
vi.mock('webextension-polyfill', () => ({
  default: {
    runtime: {
      id: 'test-extension-id',
      getManifest: () => ({ version: '1.0.0' }),
      connect: () => ({
        onMessage: { addListener: vi.fn() },
        onDisconnect: { addListener: vi.fn() },
        postMessage: vi.fn()
      })
    }
  }
}))

vi.mock('webext-bridge/content-script', () => ({
  sendMessage: vi.fn()
}))

vi.mock('../notifications', () => ({
  showErrorNotification: vi.fn()
}))

vi.mock('../storage', () => ({
  storeError: vi.fn()
}))

describe('error handlers', () => {
  let mockShowErrorNotification: ReturnType<typeof vi.fn>
  
  beforeEach(async () => {
    vi.clearAllMocks()
    
    // Récupérer le mock de showErrorNotification
    const notifications = await import('../notifications')
    mockShowErrorNotification = vi.mocked(notifications.showErrorNotification)
    
    // Mock des APIs d'extension
    const extensionAPI = {
      runtime: {
        id: 'test-extension-id',
        getManifest: vi.fn(() => ({
          version: '1.0.0',
          name: 'Test Extension'
        })),
        connect: vi.fn(() => ({
          onMessage: { addListener: vi.fn() },
          onDisconnect: { addListener: vi.fn() },
          postMessage: vi.fn()
        })),
        sendMessage: vi.fn()
      }
    }

    Object.defineProperty(global, 'chrome', {
      value: extensionAPI,
      writable: true
    })

    Object.defineProperty(global, 'browser', {
      value: extensionAPI,
      writable: true
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('handleError', () => {
    it('should handle errors correctly and show notification', async () => {
      const error = new Error('Test error')
      const message = 'Test error message'
      const source = 'test.js'
      const lineno = 1
      const colno = 1
      const context = 'test'

      await handleError(message, source, lineno, colno, error, context)

      expect(mockShowErrorNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message,
          source,
          lineno,
          colno,
          error: expect.objectContaining({
            message: error.message,
            name: error.name,
            stack: error.stack
          }),
          context,
          timestamp: expect.any(Number)
        })
      )
    })

    it('should handle unhandled rejections', async () => {
      const error = new Error('Test rejection')
      const context = 'test'
      
      await handleError(
        error.message,
        error.stack,
        0,
        0,
        error,
        context
      )

      expect(mockShowErrorNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: error.message,
          source: error.stack,
          error: expect.objectContaining({
            message: error.message,
            name: error.name,
            stack: error.stack
          }),
          context,
          timestamp: expect.any(Number)
        })
      )
    })

    it('should handle Vue errors', async () => {
      const error = new Error('Vue error')
      const context = 'test'
      
      await handleError(
        'Vue error',
        'vue-component.vue',
        1,
        1,
        error,
        context
      )

      expect(mockShowErrorNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Vue error',
          source: 'vue-component.vue',
          lineno: 1,
          colno: 1,
          error: expect.objectContaining({
            message: error.message,
            name: error.name,
            stack: error.stack
          }),
          context,
          timestamp: expect.any(Number)
        })
      )
    })
  })
}) 