<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useToast } from 'primevue/usetoast'
import { onMounted } from 'vue'
import { setToastService } from '@/errors/notifications'

const { t } = useI18n()
const toast = useToast()

onMounted(() => {
  setToastService(toast)
})
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
