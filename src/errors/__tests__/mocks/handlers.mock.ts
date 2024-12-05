import { vi } from 'vitest'

export const createHandlersMock = () => {
  const spy = vi.fn()
  return {
    spy,
    mock: {
      handleError: spy,
      setupErrorHandlers: vi.fn().mockImplementation((context) => {
        self.onerror = (message, source, lineno, colno, error) => {
          spy(message, source, lineno, colno, error, context)
          return false
        }
        self.onunhandledrejection = (event) => {
          spy(
            event.reason?.message || 'Unhandled Promise Rejection',
            event.reason?.stack,
            0,
            0,
            event.reason,
            context
          )
        }
      })
    }
  }
} 