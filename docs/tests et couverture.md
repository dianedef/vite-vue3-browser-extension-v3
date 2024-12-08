1. **Tests i18n** (`src/core/i18n/__tests__/i18n.service.test.ts`) :
   - Les tests utilisent des mocks de `browser.i18n`
   - Ils ne testent pas réellement l'intégration avec les fichiers de traduction
   - Ils vérifient uniquement le comportement du service avec les mocks

2. **Tests useI18n** (`src/composables/__tests__/useI18n.test.ts`) :
   - Le composable est mocké complètement
   - Les tests ne vérifient que la logique du composable, pas l'intégration

3. **Tests de Features** (`src/core/features/__tests__/base.feature.test.ts`) :
   - Tests unitaires purs qui ne dépendent pas des traductions
   - Testent uniquement la logique de base des features

4. **Tests du Registry** (`src/core/__tests__/feature-registry.test.ts`) :
   - Tests unitaires qui ne dépendent pas des traductions
   - Testent uniquement la logique d'enregistrement des features

Pour améliorer la couverture, nous devrions ajouter :

1. **Tests d'intégration pour i18n** :
```typescript
// src/core/i18n/__tests__/i18n-resolver.test.ts
import { resolveMessages } from '@/utils/i18n-resolver'

describe('i18n resolver', () => {
  it('should merge base and extension messages', () => {
    const messages = resolveMessages('fr', 'boilerplate')
    expect(messages.extensionName.message).toBe('Extension Boilerplate')
    expect(messages.settingsTitle.message).toBe('Paramètres')
  })
})
```

2. **Tests de build** :
```typescript
// tests/build/__tests__/manifest.test.ts
describe('manifest build', () => {
  it('should generate correct manifest with translations', async () => {
    // Tester la génération du manifest avec les traductions
  })
})
```

3. **Tests e2e** :
```typescript
// tests/e2e/__tests__/extension.test.ts
describe('extension e2e', () => {
  it('should display correct translations', async () => {
    // Tester l'affichage des traductions dans l'extension
  })
})
```



Je vais commencer par créer les tests d'intégration pour le résolveur i18n.
Maintenant, créons les tests de build pour le manifest :
Enfin, créons les tests e2e pour l'extension :