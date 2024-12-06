import { describe, expect, it } from 'vitest'
import { BaseFeature, type IFeatureMetadata, type IFeatureOptions } from '../base.feature'

interface TestFeatureOptions extends IFeatureOptions {
  testOption: string
}

class TestFeature extends BaseFeature<TestFeatureOptions> {
  execute = async (_options: TestFeatureOptions): Promise<void> => {
    // Test implementation
  }
}

describe('base feature', () => {
  const metadata: IFeatureMetadata = {
    id: 'test-feature',
    name: 'Test Feature',
    description: 'A test feature',
    version: '1.0.0'
  }

  const defaultOptions: TestFeatureOptions = {
    testOption: 'default'
  }

  it('should create a feature with metadata and default options', () => {
    const feature = new TestFeature(metadata, defaultOptions)
    expect(feature.metadata).toEqual(metadata)
    expect(feature.defaultOptions).toEqual(defaultOptions)
  })

  it('should validate options correctly', () => {
    const feature = new TestFeature(metadata, defaultOptions)
    
    // Valid options
    expect(feature.validate({ testOption: 'test' })).toBe(true)
    
    // Invalid options (missing required option)
    expect(feature.validate({} as TestFeatureOptions)).toBe(false)
    
    // Extra options are allowed
    expect(feature.validate({ testOption: 'test', extraOption: 'extra' } as TestFeatureOptions)).toBe(true)
  })

  it('should have abstract execute method', () => {
    const feature = new TestFeature(metadata, defaultOptions)
    expect(feature.execute).toBeDefined()
    expect(typeof feature.execute).toBe('function')
  })
}) 