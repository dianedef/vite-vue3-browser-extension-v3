<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <header
    aria-label="Site Header"
    class="bg-gray-50"
  >
    <h1>{{ t('extensionName') }}</h1>
  </header>

  <RouterView />

  <footer
    aria-label="Site Footer"
    class="bg-gray-50"
  >
    <nav>
      <a href="#settings">{{ t('settingsTitle') }}</a>
    </nav>
  </footer>
</template>

<style scoped></style>
