import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { IFeature, IFeatureOptions } from '@/core/features/base.feature'
import { FeatureRegistry } from '@/core/feature-registry'
import { type IFeatureState, SettingsService } from '@/core/settings/settings.service'

/**
 * Store Pinia gérant l'état et les interactions avec les features
 */
export const useFeatureStore = defineStore('features', () => {
  /** État par défaut d'une feature */
  const DEFAULT_FEATURE_STATE: IFeatureState = {
    enabled: false,
    options: {}
  }

  /** Services utilisés par le store */
  const registry = new FeatureRegistry()  
  const settingsService = new SettingsService()

  /** État du store */
  const features = ref<Map<string, IFeature<IFeatureOptions>>>(new Map())
  const featureStates = ref<Record<string, boolean>>({})
  const featureOptions = ref<Record<string, IFeatureOptions>>({})

  /** 
   * Liste des features actuellement activées
   * @returns Array des features dont l'état est activé
   */
  const enabledFeatures = computed(() => 
    Array.from(features.value.values()).filter(feature => 
      featureStates.value[feature.metadata.id]
    )
  )

  /**
   * Initialise l'état des features depuis le storage
   */
  const initializeFeatures = async () => {
    const settings = await settingsService.getAllSettings()
    features.value = registry.features
    for (const [id] of features.value) {
      const state = settings[id] || DEFAULT_FEATURE_STATE
      featureStates.value[id] = state.enabled
      featureOptions.value[id] = state.options
    }
  }

  /**
   * Active ou désactive une feature
   * @param featureId - ID de la feature à basculer
   * @returns Nouvel état de la feature (true = activée, false = désactivée)
   */
  const toggleFeature = async (featureId: string): Promise<boolean> => {
    const currentState = featureStates.value[featureId] || false
    try {
      const newState = await settingsService.toggleFeature(featureId)
      featureStates.value[featureId] = newState
      return newState
    } catch (error) {
      // En cas d'erreur, on garde l'état initial
      featureStates.value[featureId] = currentState
      throw error
    }
  }

  /**
   * Met à jour les options d'une feature
   * @param featureId - ID de la feature à mettre à jour
   * @param options - Nouvelles options à appliquer
   */
  const updateFeatureOptions = async <T extends IFeatureOptions>(
    featureId: string, 
    options: T
  ) => {
    const currentState = await settingsService.getFeatureState<T>(featureId)
    await settingsService.setFeatureState(featureId, {
      ...currentState,
      options
    })
    featureOptions.value[featureId] = options
  }

  /**
   * Exécute une feature avec les options spécifiées
   * @param featureId - ID de la feature à exécuter
   * @param options - Options optionnelles pour l'exécution
   * @throws {Error} Si la feature n'existe pas ou n'est pas activée
   */
  const executeFeature = async <T extends IFeatureOptions>(
    featureId: string,
    options?: Partial<T>
  ) => {
    const feature = registry.get<T>(featureId)
    if (!feature) {
      throw new Error(`Feature ${featureId} not found`)
    }

    if (!featureStates.value[featureId]) {
      throw new Error(`Feature ${featureId} is not enabled`)
    }

    const currentOptions = featureOptions.value[featureId] as T
    await feature.execute({
      ...currentOptions,
      ...options
    } as T)
  }

  return {
    // State
    features,
    featureStates,
    featureOptions,
    
    // Services (exposés pour les tests)
    registry,
    settingsService,
    
    // Getters
    enabledFeatures,
    
    // Actions
    initializeFeatures,
    toggleFeature,
    updateFeatureOptions,
    executeFeature
  }
}) 