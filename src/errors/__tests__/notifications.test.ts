/// <reference types="chrome"/>
import type { ToastInterface } from 'vue-toastification'
import { afterEach, beforeAll, beforeEach, describe, expect, it,  vi } from 'vitest'
import type { MockInstance } from 'vitest'
import { setToastService, showErrorNotification } from '../notifications'
import type { ErrorDetails } from '../types'

// Configuration de l'environnement de test
beforeAll(() => {
  // Simuler l'environnement d'extension Chrome
  Object.defineProperty(window, 'chrome', {
    value: {
      runtime: {
        id: 'test-extension-id',
        connect: () => ({
          onMessage: { addListener: vi.fn() },
          onDisconnect: { addListener: vi.fn() },
          postMessage: vi.fn()
        }),
        sendMessage: vi.fn(),
        onMessage: {
          addListener: vi.fn(),
          removeListener: vi.fn()
        }
      }
    },
    writable: true
  })
})

describe('notification service', () => {
  let mockToast: ToastInterface
  let consoleErrorSpy: MockInstance


  beforeEach(() => {
    // Créer un mock du service toast
    mockToast = {
      error: vi.fn(),
      success: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
      clear: vi.fn()
    } as unknown as ToastInterface

    // Espionner console.error
    consoleErrorSpy = vi.spyOn(console, 'error')

    // Reset le service avant chaque test
    setToastService(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('devrait logger l\'erreur dans la console', () => {
    const errorDetails: ErrorDetails = {
      message: 'Test error',
      source: 'test.js',
      lineno: 1,
      colno: 1,
      error: {
        message: 'Test error',
        name: 'Error',
        stack: 'Error: Test error'
      },
      context: 'test',
      timestamp: Date.now()
    }

    showErrorNotification(errorDetails)

    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(consoleErrorSpy.mock.calls[0][0]).toContain('[test] Error: Test error')
  })

  it('ne devrait pas afficher de toast si le service n\'est pas initialisé', () => {
    const errorDetails: ErrorDetails = {
      message: 'Test error',
      source: 'test.js',
      lineno: 1,
      colno: 1,
      error: {
        message: 'Test error',
        name: 'Error',
        stack: 'Error: Test error'
      },
      context: 'test',
      timestamp: Date.now()
    }

    showErrorNotification(errorDetails)
    expect(mockToast.error).not.toHaveBeenCalled()
  })

  it('devrait afficher un toast avec le message d\'erreur', () => {
    const errorDetails: ErrorDetails = {
      message: 'Test error',
      source: 'test.js',
      lineno: 1,
      colno: 1,
      error: {
        message: 'Test error',
        name: 'Error',
        stack: 'Error: Test error'
      },
      context: 'test',
      timestamp: Date.now()
    }

    setToastService(mockToast)
    showErrorNotification(errorDetails)

    expect(mockToast.error).toHaveBeenCalledWith(
      'Une erreur est survenue: Test error',
      expect.objectContaining({
        position: 'top-right',
        timeout: 5000,
        closeOnClick: true
      })
    )
  })
}) 