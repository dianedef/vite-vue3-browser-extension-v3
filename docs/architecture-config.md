# Architecture de Configuration

## Vue d'ensemble

Notre projet utilise Vite comme outil de build, avec une architecture de configuration en couches permettant de gérer plusieurs extensions navigateur.

## Structure des Fichiers de Configuration

```bash
.
├── vite.config.ts           # Configuration de base
├── vite.chrome.config.ts    # Configuration spécifique Chrome
└── vite.firefox.config.ts   # Configuration spécifique Firefox
```

## Configuration de Base (vite.config.ts)

### 1. Gestion des Chemins

```typescript
import { fileURLToPath, URL } from 'node:url'

// Création d'alias pour les chemins
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    '~': fileURLToPath(new URL('./src', import.meta.url)),
    '@ext': fileURLToPath(new URL(`./src/extensions/${extensionName}`, import.meta.url)),
  }
}
```

#### Explication du Système de Chemins
- **fileURLToPath** : Convertit une URL en chemin système
- **URL** : Classe native pour manipuler les URLs
- **import.meta.url** : URL absolue du fichier courant

Exemple concret :
```typescript
// Si le projet est dans C:/projets/mon-extension
import.meta.url                                    // -> 'file:///C:/projets/mon-extension/vite.config.ts'
new URL('./src', import.meta.url)                  // -> 'file:///C:/projets/mon-extension/src'
fileURLToPath(new URL('./src', import.meta.url))   // -> 'C:/projets/mon-extension/src'
```

### 2. Gestion des Extensions

```typescript
// Variable d'environnement pour sélectionner l'extension
const extensionName = process.env.EXT || 'boilerplate'

// Configuration du dossier de sortie
build: {
  outDir: `dist/${extensionName}`
}
```

#### Utilisation
```bash
# Développement d'une extension spécifique
pnpm dev:chrome --ext=mon-extension

# Build d'une extension spécifique
pnpm build:chrome --ext=mon-extension
```

### 3. Plugins Principaux

#### Vue et Outils de Développement
```typescript
plugins: [
  vue(),                    // Support de Vue 3
  vueDevTools(),           // Outils de développement Vue
]
```

#### Gestion des Pages
```typescript
Pages({
  dirs: [
    { dir: 'src/pages', baseRoute: 'common' },
    { dir: 'src/popup/pages', baseRoute: 'popup' },
    // ...
  ]
})
```

#### Auto-Import
```typescript
AutoImport({
  imports: ['vue', 'vue-router', '@vueuse/core'],
  dts: 'src/types/auto-imports.d.ts'
})
```

#### Composants
```typescript
Components({
  dirs: ['src/components'],
  dts: 'src/types/components.d.ts'
})
```

## Configurations Spécifiques aux Navigateurs

### Chrome (vite.chrome.config.ts)

```typescript
export default defineConfig(async () => {
  const manifest = await getManifest()
  return {
    ...baseConfig,
    plugins: [
      ...baseConfig.plugins,
      crx({ manifest, browser: 'chrome' })
    ]
  }
})
```

### Firefox (vite.firefox.config.ts)

Structure similaire à Chrome mais avec des configurations spécifiques à Firefox.

## Système d'Alias

Les alias permettent de simplifier les imports dans le code :

```typescript
// Sans alias
import Component from '../../../components/MyComponent.vue'

// Avec alias
import Component from '@/components/MyComponent.vue'
import ExtComponent from '@ext/components/ExtComponent.vue'
```

### Alias Disponibles
- `@` : Pointe vers `/src`
- `~` : Pointe vers `/src` (convention Vue)
- `@ext` : Pointe vers l'extension active (`/src/extensions/[extension-name]`)
- `@assets` : Pointe vers les assets de l'extension active (`/src/extensions/[extension-name]/assets`)

### Structure Type d'une Extension
```
src/extensions/mon-extension/
├── assets/              # Assets spécifiques à l'extension
│   ├── logo.png        # Logo requis pour le manifest (16, 24, 32, 128px)
│   ├── images/         # Autres images
│   └── styles/         # Styles spécifiques
├── features/           # Fonctionnalités de l'extension
├── _locales/          # Fichiers de traduction
├── manifest.config.ts  # Configuration du manifest
└── index.ts           # Point d'entrée
```

### Gestion des Assets

Le système utilise une approche dynamique pour les assets :

1. **Configuration de Base (manifest.config.ts)**
```typescript
// Récupération du nom de l'extension depuis les arguments
const extensionName = env.EXT || 'boilerplate'

// Utilisation dynamique dans le manifest
icons: {
  16: `src/extensions/${extensionName}/assets/logo.png`,
  24: `src/extensions/${extensionName}/assets/logo.png`,
  32: `src/extensions/${extensionName}/assets/logo.png`,
  128: `src/extensions/${extensionName}/assets/logo.png`,
}
```

2. **Dans les Extensions**
- Chaque extension doit fournir son propre dossier `assets`
- Le `logo.png` est requis pour le manifest
- Pas besoin de configurer les chemins dans le manifest de l'extension
- Les chemins sont automatiquement adaptés selon l'extension active

3. **Avantages**
- Isolation complète des assets par extension
- Configuration automatique des chemins
- Maintenance simplifiée
- Pas de duplication de configuration

## Build et Développement

### Structure de Build
```
dist/
├── chrome/
│   └── mon-extension/
│       ├── manifest.json
│       └── ...
└── firefox/
    └── mon-extension/
        ├── manifest.json
        └── ...
```

### Scripts Disponibles
```json
{
  "dev:chrome": "cross-env EXT=$npm_config_ext vite -c vite.chrome.config.ts",
  "build:chrome": "cross-env EXT=$npm_config_ext vite build -c vite.chrome.config.ts",
  "dev:firefox": "cross-env EXT=$npm_config_ext vite -c vite.firefox.config.ts",
  "build:firefox": "cross-env EXT=$npm_config_ext vite build -c vite.firefox.config.ts"
}
```

## Points Importants à Retenir

1. **Architecture en Couches**
   - Configuration de base commune
   - Configurations spécifiques aux navigateurs
   - Support multi-extensions

2. **Gestion des Chemins**
   - Utilisation de `fileURLToPath` et `URL` pour la compatibilité cross-platform
   - Système d'alias pour simplifier les imports

3. **Extensibilité**
   - Facilité d'ajout de nouvelles extensions
   - Configuration modulaire et réutilisable

4. **Développement**
   - Hot Module Replacement (HMR)
   - Outils de développement intégrés
   - Support TypeScript natif 