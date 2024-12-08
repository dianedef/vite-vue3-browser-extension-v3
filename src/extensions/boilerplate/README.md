# Extension Boilerplate

Template pour créer rapidement une nouvelle extension Chrome.

## Comment utiliser

1. Copiez ce dossier et renommez-le avec le nom de votre extension
2. Modifiez `manifest.config.ts` avec vos informations
3. Modifiez les traductions dans `_locales/`
4. Ajoutez vos features dans `features/`

## Structure

```
boilerplate/
├── _locales/          # Traductions
├── features/          # Features spécifiques
├── manifest.config.ts # Configuration
└── README.md         # Documentation
```

## Build

```bash
# Développement
pnpm dev:votre-extension

# Production
pnpm build:votre-extension
```
