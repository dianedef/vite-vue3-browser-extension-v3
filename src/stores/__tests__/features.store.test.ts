import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFeatureStore } from '../features.store'
import { BaseFeature, type IFeatureMetadata, type IFeatureOptions } from '@/core/features/base.feature'

// Mock des dépendances
vi.mock('@/core/settings/settings.service', () => ({
  SettingsService: vi.fn().mockImplementation(() => ({
    getAllSettings: vi.fn().mockResolvedValue({}),
    toggleFeature: vi.fn(),
    getFeatureState: vi.fn(),
    setFeatureState: vi.fn()
  }))
}))

// Feature de test
interface TestFeatureOptions extends IFeatureOptions {
  testOption: string
  optionalOption?: string
}

class TestFeature extends BaseFeature<TestFeatureOptions> {
  execute = async (options: TestFeatureOptions): Promise<void> => {
    if (!this.validate(options)) {
      throw new Error('Invalid options')
    }
    vi.fn()(options)
  }

  validate = (options: TestFeatureOptions): boolean => {
    const hasRequiredOptions = Object.keys(this.defaultOptions).every(key => key in options)
    return hasRequiredOptions && typeof options.testOption === 'string'
  }
}

describe('features store', () => {
  const createTestFeature = (id: string): TestFeature => {
    const metadata: IFeatureMetadata = {
      id,
      name: 'Test Feature',
      description: 'A test feature',
      version: '1.0.0'
    }
    return new TestFeature(metadata, { testOption: 'default' })
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should start with empty features', () => {
      const store = useFeatureStore()
      expect(store.features.size).toBe(0)
      expect(store.enabledFeatures).toHaveLength(0)
    })

    it('should initialize features from settings', async () => {
      const store = useFeatureStore()
      const feature = createTestFeature('test-1')
      
      store.registry.register(feature)
      
      const mockSettings = {
        'test-1': {
          enabled: true,
          options: { testOption: 'test' }
        }
      }
      vi.mocked(store.settingsService.getAllSettings).mockResolvedValue(mockSettings)

      await store.initializeFeatures()

      expect(store.featureStates['test-1']).toBe(true)
      expect(store.featureOptions['test-1']).toEqual({ testOption: 'test' })
      expect(store.enabledFeatures).toHaveLength(1)
    })

    it('should handle initialization errors gracefully', async () => {
      const store = useFeatureStore()
      vi.mocked(store.settingsService.getAllSettings).mockRejectedValue(new Error('Storage error'))

      await expect(store.initializeFeatures()).rejects.toThrow('Storage error')
    })
  })

  describe('feature state management', () => {
    it('should toggle feature state', async () => {
      const store = useFeatureStore()
      const feature = createTestFeature('test-1')
      
      store.registry.register(feature)
      vi.mocked(store.settingsService.toggleFeature).mockResolvedValue(true)

      const newState = await store.toggleFeature('test-1')

      expect(newState).toBe(true)
      expect(store.featureStates['test-1']).toBe(true)
      expect(store.settingsService.toggleFeature).toHaveBeenCalledWith('test-1')
    })

    it('should update feature options', async () => {
      const store = useFeatureStore()
      const feature = createTestFeature('test-1')
      
      store.registry.register(feature)
      vi.mocked(store.settingsService.getFeatureState).mockResolvedValue({
        enabled: true,
        options: { testOption: 'old' }
      })

      const newOptions: TestFeatureOptions = { testOption: 'new' }
      await store.updateFeatureOptions('test-1', newOptions)

      expect(store.featureOptions['test-1']).toEqual(newOptions)
      expect(store.settingsService.setFeatureState).toHaveBeenCalledWith('test-1', {
        enabled: true,
        options: newOptions
      })
    })

    it('should handle concurrent state updates', async () => {
      const store = useFeatureStore()
      const feature = createTestFeature('test-1')
      
      store.registry.register(feature)
      
      // Simuler des mises à jour concurrentes
      const update1 = store.updateFeatureOptions('test-1', { testOption: 'value1' })
      const update2 = store.updateFeatureOptions('test-1', { testOption: 'value2' })

      await Promise.all([update1, update2])

      // La dernière mise à jour devrait gagner
      expect(store.featureOptions['test-1']).toEqual({ testOption: 'value2' })
    })
  })

  describe('feature execution', () => {
    it('should execute enabled feature', async () => {
      const store = useFeatureStore()
      const feature = createTestFeature('test-1')
      const executeSpy = vi.spyOn(feature, 'execute')
      
      store.registry.register(feature)
      store.featureStates['test-1'] = true
      store.featureOptions['test-1'] = { testOption: 'current' }

      await store.executeFeature('test-1', { testOption: 'override' })

      expect(executeSpy).toHaveBeenCalledWith({ testOption: 'override' })
    })

    it('should throw when executing disabled feature', async () => {
      const store = useFeatureStore()
      const feature = createTestFeature('test-1')
      
      store.registry.register(feature)
      store.featureStates['test-1'] = false

      await expect(store.executeFeature('test-1')).rejects.toThrow('not enabled')
    })

    it('should throw when executing non-existent feature', async () => {
      const store = useFeatureStore()
      await expect(store.executeFeature('non-existent')).rejects.toThrow('not found')
    })

    it('should validate options before executing', async () => {
      const store = useFeatureStore()
      const feature = createTestFeature('test-1')
      
      store.registry.register(feature)
      store.featureStates['test-1'] = true
      store.featureOptions['test-1'] = { testOption: 'current' }

      const invalidOptions = { testOption: 123 }
      await expect(store.executeFeature('test-1', invalidOptions as unknown as TestFeatureOptions))
        .rejects.toThrow('Invalid options')
    })

    it('should merge current options with execution options', async () => {
      const store = useFeatureStore()
      const feature = createTestFeature('test-1')
      const executeSpy = vi.spyOn(feature, 'execute')
      
      store.registry.register(feature)
      store.featureStates['test-1'] = true
      store.featureOptions['test-1'] = { 
        testOption: 'current',
        optionalOption: 'keep-me'
      }

      await store.executeFeature('test-1', { testOption: 'override' })

      expect(executeSpy).toHaveBeenCalledWith({ 
        testOption: 'override',
        optionalOption: 'keep-me'
      })
    })
  })

  describe('computed properties', () => {
    it('should update enabledFeatures when toggling features', async () => {
      const store = useFeatureStore()
      const feature1 = createTestFeature('test-1')
      const feature2 = createTestFeature('test-2')
      
      // Enregistrer les features dans le registry
      store.registry.register(feature1)
      store.registry.register(feature2)

      // Mock des settings initiaux
      const initialSettings = {
        'test-1': { enabled: false, options: feature1.defaultOptions },
        'test-2': { enabled: false, options: feature2.defaultOptions }
      }
      vi.mocked(store.settingsService.getAllSettings).mockResolvedValue(initialSettings)
      
      // Initialiser les features
      await store.initializeFeatures()
      
      // Vérifier l'état initial
      expect(store.enabledFeatures).toHaveLength(0)

      // Configurer les réponses du mock pour les toggles
      vi.mocked(store.settingsService.toggleFeature)
        .mockResolvedValueOnce(true)  // Premier toggle -> true
        .mockResolvedValueOnce(true)  // Deuxième toggle -> true
        .mockResolvedValueOnce(false) // Troisième toggle -> false

      // Premier toggle : activer feature1
      await store.toggleFeature('test-1')
      expect(store.enabledFeatures).toHaveLength(1)
      expect(store.enabledFeatures[0].metadata.id).toBe('test-1')

      // Deuxième toggle : activer feature2
      await store.toggleFeature('test-2')
      expect(store.enabledFeatures).toHaveLength(2)
      expect(store.enabledFeatures.map(f => f.metadata.id)).toEqual(['test-1', 'test-2'])

      // Troisième toggle : désactiver feature1
      await store.toggleFeature('test-1')
      expect(store.enabledFeatures).toHaveLength(1)
      expect(store.enabledFeatures[0].metadata.id).toBe('test-2')
    })

    it('should maintain enabledFeatures order', async () => {
      const store = useFeatureStore()
      const features = ['test-1', 'test-2', 'test-3'].map(id => createTestFeature(id))
      
      // Enregistrer les features dans le registry
      features.forEach(feature => store.registry.register(feature))

      // Mock des settings initiaux (tous désactivés)
      const initialSettings = features.reduce((acc, feature) => ({
        ...acc,
        [feature.metadata.id]: {
          enabled: false,
          options: feature.defaultOptions
        }
      }), {})
      vi.mocked(store.settingsService.getAllSettings).mockResolvedValue(initialSettings)
      
      // Initialiser les features dans le store
      await store.initializeFeatures()

      // Vérifier que toutes les features sont initialement désactivées
      expect(store.enabledFeatures).toHaveLength(0)
      
      // Activer les features une par une dans un ordre spécifique
      for (const feature of features) {
        vi.mocked(store.settingsService.toggleFeature)
          .mockResolvedValueOnce(true)
        await store.toggleFeature(feature.metadata.id)
      }

      // Vérifier l'ordre final
      expect(store.enabledFeatures).toHaveLength(3)
      expect(store.enabledFeatures.map(f => f.metadata.id))
        .toEqual(['test-1', 'test-2', 'test-3'])
    })
  })

  describe('error handling', () => {
    it('should handle storage errors during toggle', async () => {
      const store = useFeatureStore()
      const feature = createTestFeature('test-1')
      
      store.registry.register(feature)
      store.featureStates['test-1'] = false

      vi.mocked(store.settingsService.toggleFeature).mockRejectedValue(new Error('Storage error'))

      await expect(store.toggleFeature('test-1')).rejects.toThrow('Storage error')
      expect(store.featureStates['test-1']).toBe(false)
    })

    it('should handle storage errors during options update', async () => {
      const store = useFeatureStore()
      const feature = createTestFeature('test-1')
      
      store.registry.register(feature)
      vi.mocked(store.settingsService.setFeatureState).mockRejectedValue(new Error('Storage error'))

      await expect(store.updateFeatureOptions('test-1', { testOption: 'new' }))
        .rejects.toThrow('Storage error')
    })
  })
}) 