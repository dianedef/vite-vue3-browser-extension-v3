import { describe, expect, it, vi, beforeEach } from 'vitest'
import { storeError, getStoredErrors, clearStoredErrors } from '../storage'
import type { ErrorDetails } from '../types'

describe('error storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})

    // Mock de chrome.storage.local
    global.chrome = {
      storage: {
        local: {
          get: vi.fn(),
          set: vi.fn(),
          remove: vi.fn()
        }
      }
    } as any
  })

  describe('storeError', () => {
    it('devrait stocker une nouvelle erreur', async () => {
      const mockError: ErrorDetails = {
        message: 'Test error',
        source: 'test.js',
        lineno: 1,
        colno: 1,
        error: null,
        context: 'test',
        timestamp: Date.now()
      }

      vi.mocked(chrome.storage.local.get).mockResolvedValue({ errors: [] })
      
      await storeError(mockError)

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        errors: [mockError]
      })
    })

    it('devrait limiter le nombre d\'erreurs stockées', async () => {
      const oldErrors = Array(100).fill(null).map((_, i) => ({
        message: `Error ${i}`,
        source: 'test.js',
        lineno: 1,
        colno: 1,
        error: null,
        context: 'test',
        timestamp: Date.now() - i
      }))

      const newError: ErrorDetails = {
        message: 'New error',
        source: 'test.js',
        lineno: 1,
        colno: 1,
        error: null,
        context: 'test',
        timestamp: Date.now()
      }

      vi.mocked(chrome.storage.local.get).mockResolvedValue({ errors: oldErrors })
      
      await storeError(newError)

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        errors: expect.arrayContaining([newError])
      })
      
      const setCall = vi.mocked(chrome.storage.local.set).mock.calls[0][0]
      expect(setCall.errors.length).toBe(100)
      expect(setCall.errors[99]).toEqual(newError)
    })

    it('devrait gérer les erreurs de stockage', async () => {
      const mockError: ErrorDetails = {
        message: 'Test error',
        source: 'test.js',
        lineno: 1,
        colno: 1,
        error: null,
        context: 'test',
        timestamp: Date.now()
      }

      vi.mocked(chrome.storage.local.get).mockRejectedValue(new Error('Storage error'))
      
      await storeError(mockError)

      expect(console.error).toHaveBeenCalledWith(
        'Failed to store error:',
        expect.any(Error)
      )
    })
  })

  describe('getStoredErrors', () => {
    it('devrait récupérer les erreurs stockées', async () => {
      const mockErrors = [
        {
          message: 'Test error',
          source: 'test.js',
          lineno: 1,
          colno: 1,
          error: null,
          context: 'test',
          timestamp: Date.now()
        }
      ]

      vi.mocked(chrome.storage.local.get).mockResolvedValue({ errors: mockErrors })
      
      const result = await getStoredErrors()

      expect(result).toEqual(mockErrors)
    })

    it('devrait retourner un tableau vide en cas d\'erreur', async () => {
      vi.mocked(chrome.storage.local.get).mockRejectedValue(new Error('Storage error'))
      
      const result = await getStoredErrors()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith(
        'Failed to get stored errors:',
        expect.any(Error)
      )
    })
  })

  describe('clearStoredErrors', () => {
    it('devrait supprimer toutes les erreurs stockées', async () => {
      await clearStoredErrors()

      expect(chrome.storage.local.remove).toHaveBeenCalledWith('errors')
    })

    it('devrait gérer les erreurs de suppression', async () => {
      vi.mocked(chrome.storage.local.remove).mockRejectedValue(new Error('Remove error'))
      
      await clearStoredErrors()

      expect(console.error).toHaveBeenCalledWith(
        'Failed to clear stored errors:',
        expect.any(Error)
      )
    })
  })
}) 