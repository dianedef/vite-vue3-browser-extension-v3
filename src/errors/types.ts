export interface ErrorDetails {
  message: string
  source: string
  lineno: number
  colno: number
  error: null | {
    message?: string
    name?: string
    stack?: string
    [key: string]: unknown
  }
  context?: string
  timestamp: number
} 