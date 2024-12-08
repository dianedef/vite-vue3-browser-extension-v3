<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import PToast from 'primevue/toast'
import TreeTable from 'primevue/treetable'
import Column from 'primevue/column'
import PToggleButton from 'primevue/togglebutton'
import { useFeatureStore } from '@/stores/features.store'
import { useI18n } from '@/composables/useI18n'
import type { NotificationOptions } from '@/core/features/notifications.feature'

const featureStore = useFeatureStore()
const { t } = useI18n()
const toast = useToast()
const isLoading = ref(true)
const error = ref<Error | null>(null)

const debugInfo = ref<{
  hasFeatures: boolean
  featureCount: number
  firstFeature: any
}>({
  hasFeatures: false,
  featureCount: 0,
  firstFeature: null
})

const notificationOptions = ref<NotificationOptions>({
  enabled: false,
  sound: false,
  life: 3000
})

onMounted(async () => {
  try {
    await featureStore.initializeFeatures()
    if (featureStore.featureOptions.notifications) {
      notificationOptions.value = featureStore.featureOptions.notifications as NotificationOptions
    }
    const features = featureStore.registry.getAll()
    debugInfo.value = {
      hasFeatures: features.length > 0,
      featureCount: features.length,
      firstFeature: features[0]
    }
    console.log('Debug info:', debugInfo.value)
  } catch (err) {
    error.value = err as Error
    console.error('Error initializing features:', err)
    const loadError = String(err)
    toast.add({
      severity: 'error',
      summary: t('settings_loadError'),
      detail: loadError,
      life: 5000
    })
  } finally {
    isLoading.value = false
  }
})

const saveFeatureOptions = async (featureId: string, options: any) => {
  try {
    await featureStore.updateFeatureOptions(featureId, options)
    const featureIdStr = String(featureId)
    toast.add({
      severity: 'success',
      summary: t('settings_saveSuccess'),
      detail: featureIdStr,
      life: 3000
    })
  } catch (error) {
    console.error('Error saving feature options:', error)
    const loadError = String(error)
    toast.add({
      severity: 'error',
      summary: t('settings_saveError'),
      detail: loadError,
      life: 5000
    })
  }
}

// Transformation des features en nodes pour TreeTable
const nodes = computed(() => {
  return featureStore.registry.getAll().map(feature => ({
    key: feature.metadata.id,
    data: {
      name: t(feature.metadata.name),
      description: t(feature.metadata.description),
      version: feature.metadata.version,
      id: feature.metadata.id
    },
    children: feature.metadata.id === 'notifications' ? [
      {
        key: `${feature.metadata.id}-sound`,
        data: {
          name: t('settings_notifications_sound'),
          description: t('settings_notifications_soundDescription'),
          version: '',
          id: 'sound',
          parentId: feature.metadata.id
        }
      }
    ] : []
  }))
})

// Template personnalisé pour le toggle
const toggleTemplate = (slotProps: any) => {
  const isOption = slotProps.node.data.parentId
  if (isOption) {
    return h(PToggleButton, {
      modelValue: notificationOptions.value.sound,
      'onUpdate:modelValue': (value) => saveFeatureOptions(slotProps.node.data.parentId, { 
        ...notificationOptions.value, 
        sound: value 
      }),
      disabled: !featureStore.featureStates[slotProps.node.data.parentId],
      onIcon: 'pi pi-volume-up',
      offIcon: 'pi pi-volume-off'
    })
  }
  return h(PToggleButton, {
    modelValue: featureStore.featureStates[slotProps.node.data.id],
    'onUpdate:modelValue': (value) => featureStore.toggleFeature(slotProps.node.data.id),
    onIcon: 'pi pi-check',
    offIcon: 'pi pi-times'
  })
}
</script>

<template>
  <PToast />
  
  <TreeTable 
    :value="nodes" 
  >
    <Column 
      field="name" 
      :header="t('feature_name')" 
      expander 
      sortable
    />
    <Column 
      field="description" 
      :header="t('feature_description')" 
      sortable
    />
    <Column 
      field="version" 
      :header="t('feature_version')" 
      sortable
      style="width: 100px"
    />
    <Column 
      :header="t('feature_status')" 
      style="width: 100px"
    >
      <template #body="slotProps">
        <component :is="toggleTemplate(slotProps)" />
      </template>
    </Column>
  </TreeTable>
</template>

<style scoped>
</style>
