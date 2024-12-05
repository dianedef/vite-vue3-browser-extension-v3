import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createHandlersMock } from './mocks/handlers.mock'

vi.mock('../handlers', () => {
  return {
    handleError: vi.fn(),
    setupErrorHandlers: vi.fn()
  }
})

describe('Error Handlers', () => {
  let handlersMock: ReturnType<typeof createHandlersMock>

  beforeEach(() => {
    handlersMock = createHandlersMock()
    
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
  })

  it('should handle errors correctly', () => {
    const context = { someContext: 'test' }
    const error = new Error('Test error')
    const message = 'Test error message'
    const source = 'test.js'
    const lineno = 1
    const colno = 1

    handlersMock.mock.setupErrorHandlers(context)
    self.onerror(message, source, lineno, colno, error)

    expect(handlersMock.spy).toHaveBeenCalledWith(
      message,
      source,
      lineno,
      colno,
      error,
      context
    )
  })

  it('should handle unhandled rejections', async () => {
    const context = { someContext: 'test' }
    const error = new Error('Test rejection')
    const mockPromise = {
      then: () => mockPromise,
      catch: () => mockPromise
    }
    
    handlersMock.mock.setupErrorHandlers(context)
    self.onunhandledrejection({
      type: 'unhandledrejection',
      reason: error,
      promise: mockPromise,
      preventDefault: () => {}
    } as PromiseRejectionEvent)

    expect(handlersMock.spy).toHaveBeenCalledWith(
      error.message,
      error.stack,
      0,
      0,
      error,
      context
    )
  })
}) 