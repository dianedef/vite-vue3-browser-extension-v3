export interface ErrorDetails {
  message: string
  source: string
  lineno: number
  colno: number
  error: Error | null
  context?: string
  timestamp: number
} 