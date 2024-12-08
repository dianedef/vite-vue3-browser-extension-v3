import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Résout le chemin d'un fichier en vérifiant d'abord dans l'extension spécifique,
 * puis dans les dossiers communs si le fichier n'existe pas dans l'extension.
 * 
 * @param basePath - Chemin de base (ex: 'views/options/index.html')
 * @param extensionName - Nom de l'extension
 * @param type - Type de ressource ('view' | 'background' | 'content-script')
 * @returns Le chemin résolu
 */
export function resolvePath(basePath: string, extensionName: string, type: 'view' | 'background' | 'content-script' = 'view'): string {
  // Chemins possibles par ordre de priorité
  const paths = [
    // 1. Dans l'extension
    `src/extensions/${extensionName}/${basePath}`,
    // 2. Dans le dossier src
    `src/${basePath}`
  ]

  // Pour les vues et scripts, on cherche le premier chemin qui existe
  for (const path of paths) {
    if (existsSync(resolve(process.cwd(), path))) {
      return path
    }
  }

  // Si aucun fichier n'existe, on utilise le chemin src par défaut
  return paths[1]
}

/**
 * Résout les chemins pour le manifest
 */
export function resolveManifestPaths(extensionName: string) {
  return {
    popup: resolvePath('popup/index.html', extensionName),
    options: resolvePath('options/index.html', extensionName),
    background: resolvePath('background/index.ts', extensionName),
    contentScript: resolvePath('content-script/index.ts', extensionName),
    setup: resolvePath('setup/index.html', extensionName)
  }
} 