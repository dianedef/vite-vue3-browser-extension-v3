import { beforeEach, describe, expect, it, vi } from 'vitest'
import browser from 'webextension-polyfill'
import type { IFeatureOptions } from '../settings.service'
import { SettingsService } from '../settings.service'

vi.mock('webextension-polyfill', () => ({
  default: {
    storage: {
      local: {
        get: vi.fn(),
        set: vi.fn()
      }
    }
  }
}))

interface TestFeatureOptions extends IFeatureOptions {
  [key: string]: unknown
  testOption: string
}

describe('settings service', () => {
  let service: SettingsService
  const STORAGE_KEY = 'feature-settings'

  beforeEach(() => {
    vi.clearAllMocks()
    service = new SettingsService()
  })

  it('should return default state for unknown feature', async () => {
    vi.mocked(browser.storage.local.get).mockResolvedValue({})

    const state = await service.getFeatureState<TestFeatureOptions>('unknown')

    expect(state.enabled).toBe(false)
    expect(state.options).toEqual({})
  })

  it('should save and retrieve feature state', async () => {
    const featureId = 'test-feature'
    const initialState = {
      enabled: true,
      options: { testOption: 'value' } as TestFeatureOptions
    }

    // Mock empty initial state
    vi.mocked(browser.storage.local.get).mockResolvedValue({})

    // Save state
    await service.setFeatureState(featureId, initialState)

    // Verify save call
    expect(browser.storage.local.set).toHaveBeenCalledWith({
      [STORAGE_KEY]: {
        [featureId]: initialState
      }
    })

    // Mock the saved state for retrieval
    vi.mocked(browser.storage.local.get).mockResolvedValue({
      [STORAGE_KEY]: {
        [featureId]: initialState
      }
    })

    // Retrieve and verify state
    const retrievedState = await service.getFeatureState<TestFeatureOptions>(featureId)
    expect(retrievedState).toEqual(initialState)
  })

  it('should toggle feature state', async () => {
    const featureId = 'test-feature'
    
    // Mock initial disabled state
    vi.mocked(browser.storage.local.get).mockResolvedValue({
      [STORAGE_KEY]: {
        [featureId]: {
          enabled: false,
          options: {} as TestFeatureOptions
        }
      }
    })

    // Toggle feature
    const newState = await service.toggleFeature(featureId)
    expect(newState).toBe(true)

    // Verify the state was saved
    expect(browser.storage.local.set).toHaveBeenCalledWith({
      [STORAGE_KEY]: {
        [featureId]: {
          enabled: true,
          options: {} as TestFeatureOptions
        }
      }
    })
  })

  it('should check if feature is enabled', async () => {
    const featureId = 'test-feature'
    
    // Mock enabled feature
    vi.mocked(browser.storage.local.get).mockResolvedValue({
      [STORAGE_KEY]: {
        [featureId]: {
          enabled: true,
          options: {} as TestFeatureOptions
        }
      }
    })

    const isEnabled = await service.isFeatureEnabled(featureId)
    expect(isEnabled).toBe(true)
  })

  it('should clear all settings', async () => {
    await service.clear()

    expect(browser.storage.local.set).toHaveBeenCalledWith({
      [STORAGE_KEY]: {}
    })
  })

  it('should get all settings', async () => {
    const mockSettings = {
      'feature-1': { enabled: true, options: {} as TestFeatureOptions },
      'feature-2': { enabled: false, options: { testOption: 'value' } as TestFeatureOptions }
    }

    vi.mocked(browser.storage.local.get).mockResolvedValue({
      [STORAGE_KEY]: mockSettings
    })

    const settings = await service.getAllSettings()
    expect(settings).toEqual(mockSettings)
  })
}) 