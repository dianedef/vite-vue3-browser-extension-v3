import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

type Messages = {
  [key: string]: {
    message: string
    description?: string
  }
}

/**
 * Fusionne les messages de traduction de base avec ceux de l'extension
 * @param locale - La locale (fr, en, etc.)
 * @param extensionName - Le nom de l'extension
 * @returns Les messages fusionnés
 */
export function resolveMessages(locale: string, extensionName: string): Messages {
  // Chemins des fichiers de messages
  const basePath = resolve(process.cwd(), '_locales', locale, 'messages.json')
  const extensionPath = resolve(process.cwd(), 'src/extensions', extensionName, '_locales', locale, 'messages.json')
  
  // Messages de base (s'ils existent)
  let baseMessages: Messages = {}
  if (existsSync(basePath)) {
    baseMessages = JSON.parse(readFileSync(basePath, 'utf-8'))
  }
  
  // Messages de l'extension (s'ils existent)
  let extensionMessages: Messages = {}
  if (existsSync(extensionPath)) {
    extensionMessages = JSON.parse(readFileSync(extensionPath, 'utf-8'))
  }
  
  // Fusion des messages (l'extension surcharge les messages de base)
  return {
    ...baseMessages,
    ...extensionMessages
  }
} 