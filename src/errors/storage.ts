import type { ErrorDetails } from './types'

const MAX_STORED_ERRORS = 100

export async function storeError(errorDetails: ErrorDetails): Promise<void> {
  try {
    const errors = await chrome.storage.local.get('errors')
    const errorList = errors.errors || []
    errorList.push(errorDetails)
    
    // Garder seulement les dernières erreurs
    if (errorList.length > MAX_STORED_ERRORS) {
      errorList.shift()
    }
    
    await chrome.storage.local.set({ errors: errorList })
  } catch (e) {
    console.error('Failed to store error:', e)
  }
}

export async function getStoredErrors(): Promise<ErrorDetails[]> {
  try {
    const errors = await chrome.storage.local.get('errors')
    return errors.errors || []
  } catch (e) {
    console.error('Failed to get stored errors:', e)
    return []
  }
}

export async function clearStoredErrors(): Promise<void> {
  try {
    await chrome.storage.local.remove('errors')
  } catch (e) {
    console.error('Failed to clear stored errors:', e)
  }
} 