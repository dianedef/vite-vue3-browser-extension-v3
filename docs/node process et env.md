

Je vais expliquer la différence entre `process` et `env` :

1. **`process`**
```typescript
// C'est un objet global de Node.js qui fournit des informations et contrôle sur le processus Node.js en cours
// Il contient de nombreuses propriétés et méthodes utiles
process.cwd()           // Répertoire de travail actuel
process.version        // Version de Node.js
process.platform      // Système d'exploitation
```

2. **`process.env` / `env`**
```typescript
// C'est un objet qui contient les variables d'environnement du processus
// Dans notre cas :
env.EXT                // Variable définie par cross-env EXT=$npm_config_ext
env.NODE_ENV          // 'development' ou 'production'
env.mode             // Mode de l'application ('staging', etc.)
```

3. **Dans notre contexte**
```typescript
// Avant (non recommandé en ESM)
const extensionName = process.env.EXT || 'boilerplate'

// Après (meilleure pratique en ESM)
import { env } from 'node:process'
const extensionName = env.EXT || 'boilerplate'
```

4. **Utilisation pratique**
```bash
# Quand on lance la commande
pnpm dev:chrome --ext=mon-extension

# En interne
cross-env EXT=$npm_config_ext    # Définit env.EXT
vite -c vite.chrome.config.ts    # Utilise env.EXT
```

L'avantage d'utiliser `import { env }` plutôt que `process.env` est :
- Plus propre en ESM (modules ES)
- Meilleure gestion des types TypeScript
- Évite les avertissements du linter
- Suit les meilleures pratiques Node.js modernes


Oui exactement ! 

ESM = ECMAScript Modules, c'est le système de modules standard de JavaScript moderne.

Voici les principales différences :

1. **CommonJS (ancien)**
```javascript
// Importation
const module = require('module')
// Exportation
module.exports = something
```

2. **ESM (moderne)**
```javascript
// Importation
import module from 'module'
import { something } from 'module'
// Exportation
export default something
export { something }
```

Dans notre projet, nous utilisons ESM car :
1. C'est indiqué dans `package.json` : `"type": "module"`
2. C'est le standard moderne
3. Meilleur support des imports/exports statiques
4. Meilleure compatibilité avec Vite et Vue 3

C'est pour ça qu'on utilise :
```typescript
import { env } from 'node:process'
```
au lieu de :
```typescript
const process = require('process')
```
