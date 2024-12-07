import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFeatureStore } from '../features.store'
import { FeatureRegistry } from '@/core/feature-registry'
import { SettingsService } from '@/core/settings/settings.service'
import type { IFeature, IFeatureMetadata, IFeatureOptions } from '@/core/features/base.feature'

// Mock des services
const mockGet = vi.fn()
const mockFeatures = new Map()
const mockSetFeatureState = vi.fn()
const mockGetFeatureState = vi.fn()
const mockToggleFeature = vi.fn()
const mockGetAllSettings = vi.fn()

vi.mock('@/core/feature-registry', () => ({
  FeatureRegistry: vi.fn().mockImplementation(() => ({
    features: mockFeatures,
    get: mockGet
  }))
}))

vi.mock('@/core/settings/settings.service', () => ({
  SettingsService: vi.fn().mockImplementation(() => ({
    getAllSettings: mockGetAllSettings,
    toggleFeature: mockToggleFeature,
    getFeatureState: mockGetFeatureState,
    setFeatureState: mockSetFeatureState
  }))
}))

// Feature de test
const createTestFeature = (id: string): IFeature<IFeatureOptions> => ({
  metadata: {
    id,
    name: 'Test Feature',
    description: 'A test feature',
    version: '1.0.0'
  },
  defaultOptions: {
    testOption: 'default'
  } as IFeatureOptions,
  execute: vi.fn().mockImplementation(async () => {}),
  validate: vi.fn().mockImplementation(() => true)
})

describe('feature store', () => {
  let store: ReturnType<typeof useFeatureStore>
  let featureRegistry: FeatureRegistry
  
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    store = useFeatureStore()
    featureRegistry = new FeatureRegistry()
  })

  it('should initialize features from registry and settings', async () => {
    const feature1 = createTestFeature('test-1')
    const feature2 = createTestFeature('test-2')
    
    // Mettre à jour directement la Map mockée
    mockFeatures.clear()
    mockFeatures.set('test-1', feature1)
    mockFeatures.set('test-2', feature2)

    const mockSettings = {
      'test-1': { enabled: true, options: { testOption: 'value1' } },
      'test-2': { enabled: false, options: { testOption: 'value2' } }
    }

    // Mock des retours des services
    mockGetAllSettings.mockResolvedValue(mockSettings)

    await store.initializeFeatures()

    expect(store.features).toEqual(mockFeatures)
    expect(store.featureStates).toEqual({
      'test-1': true,
      'test-2': false
    })
    expect(store.featureOptions).toEqual({
      'test-1': { testOption: 'value1' },
      'test-2': { testOption: 'value2' }
    })
  })

  it('should toggle feature state', async () => {
    const featureId = 'test-1'
    mockToggleFeature.mockResolvedValue(true)
    store.featureStates[featureId] = false

    const newState = await store.toggleFeature(featureId)

    expect(newState).toBe(true)
    expect(store.featureStates[featureId]).toBe(true)
    expect(mockToggleFeature).toHaveBeenCalledWith(featureId)
  })

  it('should update feature options', async () => {
    const featureId = 'test-1'
    const newOptions = { testOption: 'new-value' }
    const currentState = { enabled: true, options: { testOption: 'old-value' } }

    mockGetFeatureState.mockResolvedValue(currentState)

    await store.updateFeatureOptions(featureId, newOptions)

    expect(store.featureOptions[featureId]).toEqual(newOptions)
    expect(mockSetFeatureState).toHaveBeenCalledWith(
      featureId,
      { ...currentState, options: newOptions }
    )
  })

  it('should execute enabled feature with merged options', async () => {
    const featureId = 'test-1'
    const feature = createTestFeature(featureId)
    const currentOptions = { testOption: 'current' }
    const extraOptions = { testOption: 'extra' }

    // Setup initial state
    store.featureStates[featureId] = true
    store.featureOptions[featureId] = currentOptions
    vi.mocked(featureRegistry.get).mockReturnValue(feature)

    await store.executeFeature(featureId, extraOptions)

    expect(feature.execute).toHaveBeenCalledWith({
      ...currentOptions,
      ...extraOptions
    })
  })

  it('should not execute disabled feature', async () => {
    const featureId = 'test-1'
    const feature = createTestFeature(featureId)

    // Setup disabled state
    store.featureStates[featureId] = false
    mockGet.mockReturnValue(feature)

    await expect(store.executeFeature(featureId)).rejects.toThrow(`Feature ${featureId} is not enabled`)
    expect(feature.execute).not.toHaveBeenCalled()
  })

  it('should compute enabled features correctly', () => {
    const feature1 = createTestFeature('test-1')
    const feature2 = createTestFeature('test-2')
    const mockFeatures = new Map([
      ['test-1', feature1],
      ['test-2', feature2]
    ])

    // Setup state
    store.features = mockFeatures
    store.featureStates = {
      'test-1': true,
      'test-2': false
    }

    expect(store.enabledFeatures).toHaveLength(1)
    expect(store.enabledFeatures[0]).toStrictEqual(feature1)
  })
}) 