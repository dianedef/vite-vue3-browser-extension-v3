import { useFeatureStore } from '@/stores/features.store'
import registry from '@/core/features'

export function initializeExtension() {
  const featureStore = useFeatureStore()
  
  // Enregistrement des features dans le store
  featureStore.registry = registry
  
  // Initialisation
  featureStore.initializeFeatures()
} 