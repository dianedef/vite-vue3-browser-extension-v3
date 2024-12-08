<script setup lang="ts">
import { onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useFeatureStore } from '@/stores/features.store'
import { useI18n } from '@/composables/useI18n'
import FeaturesList from '@/components/FeaturesList.vue'
import Card from 'primevue/card'

const featureStore = useFeatureStore()
const { t } = useI18n()
const toast = useToast()

onMounted(async () => {
  try { 
    await featureStore.initializeFeatures()
  } catch (error) {
    console.error('Error loading features:', error)
    toast.add({
      severity: 'error',
      summary: t('settings_loadError'),
      detail: t('settings_loadErrorDetail'),
      life: 5000
    })
  }
})
</script>

<template>
  <div>
    <Toast />
    
    <Card>
      <template #title>
        {{ t('settings_title') }}
      </template>
      
      <template #content>
        <FeaturesList />
      </template>
    </Card>
  </div>
</template>

