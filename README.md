based on [vite-vue3-browser-extension-v3](https://github.com/mubaidr/vite-vue3-browser-extension-v3)

## Features

- Vue 3 - Composition API, `Script setup` and more!
- Vue 3 app in Content Script too (template added)
- Vue devtools support
- HMR for extension pages and content scripts, with Firefox support
- Sample `onInstall` & `onUpdate` pages
- [`Tailwind`](https://tailwindcss.com/) css And [`daisyUI`](https://daisyui.com/)
- Tailwindcss plugins for Typography, forms, prettier and daisy ui
- Vue Router setup incuding `unplugin-vue-router` for automatic route registration
- vscode recommended settings and extensions for extension/ plugin development
- Effortless communications - powered by [`webext-bridge`](https://github.com/zikaari/webext-bridge)
- [Components auto importing](./src/components)
- [Icons](./src/components) - Access to icons from any iconset directly
  - By default [Material Design Icons](https://materialdesignicons.com/cdn/1.6.50-dev/) set is enabled
- [TypeScript](https://www.typescriptlang.org/) - type safe
- `Eslint` & `Prettier` configured for `vue`, `javascript`, `TypeScript`
- [CRXJS Vite Plugin](https://crxjs.dev/vite-plugin) Build Chrome, Firefox and Other Extensions with Vite
- Github build and release actions

### Testing Libraries

- [`Vitest`](https://vitest.dev/) - Framework de test unitaire compatible avec Vite
- [`@testing-library/vue`](https://testing-library.com/docs/vue-testing-library/intro/) - Utilitaires de test pour Vue
- [`chrome-mock`](https://github.com/acvetkov/chrome-mock) - Mocks modernes de l'API Chrome pour les tests

## Pre-packed

### Vite Plugins

- [`unplugin-vue-router`](https://github.com/posva/unplugin-vue-router) - File system based route generator for Vite
- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - Directly use `browser` and Vue Composition API without importing
- [`unplugin-vue-components`](https://github.com/antfu/vite-plugin-components) - components auto import
- [`unplugin-icons`](https://github.com/antfu/unplugin-icons) - icons as components

### Vue Plugins

- [Pinia](https://pinia.vuejs.org/) - Intuitive, type safe, light and flexible Store for Vue
- [VueUse](https://github.com/antfu/vueuse) - collection of useful composition APIs

### Plugins

- [Marked](https://github.com/markedjs/marked) - A markdown parser and compiler. Used for CHANGELOG.md to show in Update page

### UI Frameworks

- [tailwindcss](https://tailwindcss.com) - A utility-first CSS framework
- [daisyUI](https://daisyui.com/) - The most popular component library for Tailwind CSS

Tailwind css `forms` and `typography` plugins are enabled for default styling of form controls.

### WebExtension Libraries

- [`webext-bridge`](https://github.com/zikaari/webext-bridge) - effortlessly communication between contexts

### Coding Style

- Use Composition API with [`<script setup>` SFC syntax](https://github.com/vuejs/rfcs/pull/227)
- Use Composition API with [`setup` SFC syntax](https://pinia.vuejs.org/cookbook/composables.html#Setup-Stores) in Pinia stores

## Use the Template

### GitHub Template

[Create a repo from this template on GitHub](https://github.com/mubaidr/vite-vue3-browser-extension-v3/generate).

### Clone to local

If you prefer to do it manually with the cleaner git history

> If you don't have pnpm installed, run: npm install -g pnpm

```bash
pnpx degit mubaidr/vite-vue3-browser-extension-v3 my-webext
cd my-webext
pnpm i
```

## Usage

### Project Structure

- `src` - main source.
  - `content-script` - scripts and components to be injected as `content_script`
    - `iframe` content script iframe vue3 app which will be injected into page
  - `background` - scripts for background.
  - `popup` - popup vuejs application root
    - `pages` - popup pages
  - `options` - options vuejs application root
    - `pages` - options pages
  - `setup` - Page for Install and Update extension events
    - `pages` - pages for install and update events
  - `offscreen` - extension offscreen pages, can be used for audio, screen recording etc
  - `pages` - application pages, common to all views (About, Contact, Authentication etc)
  - `components` - auto-imported Vue components that are shared in popup and options page.
  - `assets` - assets used in Vue components
- `dist` - built files
  - `chrome` - Chrome extension, can be publishd to Opera, Edge and toher chromium based browsers store etc
  - `firefox` - Firefox extension

### Browser Related Configurations

- `manifest.config.ts` - Base extension manifest with common configuration
- `manifest.chrome.config.ts` - Chrome/ chromium based browsers specific manifest
- `manifest.firefox.config.ts` - Firefox spefic manifest
- `vite.config.ts` - Base vite configuration
- `vite.chrome.config.ts` - Chrome/ chromium based browsers specific vite configuration
- `vite.firefox.config.ts` - Firefox specific vite configuration

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build extension
- `pnpm lint` - Lint files

_You can also use pnpm dev:chrome, pnpm dev:firefox, pnpm build:chrome, pnpm build:firefox, pnpm lint:fix_

### Development

```bash
pnpm dev
```

Then **load extension in browser with the `dist/` folder**.

### Build

To build the extension, run

```bash
pnpm build
```

And then pack files under `dist/chrome` or `dist/firefox`, you can upload to appropriate extension store.
