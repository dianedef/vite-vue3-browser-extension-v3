import { ScreenshotFeature } from './features/screenshot.feature'
import { useFeatureStore } from '@/stores/features.store'

export function initializeExtension() {
  const featureStore = useFeatureStore()
  const screenshotFeature = new ScreenshotFeature()
  
  // Enregistrement de la feature
  featureStore.registry.register(screenshotFeature)
  
  // Initialisation
  featureStore.initializeFeatures()
} 