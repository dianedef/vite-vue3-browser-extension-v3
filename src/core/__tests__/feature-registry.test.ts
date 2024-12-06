import { describe, expect, it } from 'vitest'
import { BaseFeature, type IFeatureMetadata, type IFeatureOptions } from '../features/base.feature'
import { FeatureRegistry } from '../feature-registry'

interface TestFeatureOptions extends IFeatureOptions {
  testOption: string
}

class TestFeature extends BaseFeature<TestFeatureOptions> {
  execute = async (_options: TestFeatureOptions): Promise<void> => {
    // Test implementation
  }
}

describe('feature registry', () => {
  const createTestFeature = (id: string): TestFeature => {
    const metadata: IFeatureMetadata = {
      id,
      name: 'Test Feature',
      description: 'A test feature',
      version: '1.0.0'
    }
    return new TestFeature(metadata, { testOption: 'default' })
  }

  it('should start with an empty registry', () => {
    const registry = new FeatureRegistry()
    expect(registry.getAll()).toHaveLength(0)
  })

  it('should register a feature', () => {
    const registry = new FeatureRegistry()
    const feature = createTestFeature('test-1')
    
    registry.register<TestFeatureOptions>(feature)
    
    const retrievedFeature = registry.get<TestFeatureOptions>('test-1')
    expect(retrievedFeature).toBe(feature)
    expect(registry.getAll()).toHaveLength(1)
  })

  it('should not register the same feature twice', () => {
    const registry = new FeatureRegistry()
    const feature = createTestFeature('test-1')
    
    registry.register<TestFeatureOptions>(feature)
    
    expect(() => registry.register<TestFeatureOptions>(feature)).toThrow('already registered')
  })

  it('should unregister a feature', () => {
    const registry = new FeatureRegistry()
    const feature = createTestFeature('test-1')
    
    registry.register<TestFeatureOptions>(feature)
    registry.unregister('test-1')
    
    const retrievedFeature = registry.get<TestFeatureOptions>('test-1')
    expect(retrievedFeature).toBeUndefined()
    expect(registry.getAll()).toHaveLength(0)
  })

  it('should throw when unregistering non-existent feature', () => {
    const registry = new FeatureRegistry()
    
    expect(() => registry.unregister('non-existent')).toThrow('not registered')
  })

  it('should clear all features', () => {
    const registry = new FeatureRegistry()
    const feature1 = createTestFeature('test-1')
    const feature2 = createTestFeature('test-2')
    
    registry.register<TestFeatureOptions>(feature1)
    registry.register<TestFeatureOptions>(feature2)
    registry.clear()
    
    expect(registry.getAll()).toHaveLength(0)
  })

  it('should return a copy of features map', () => {
    const registry = new FeatureRegistry()
    const feature = createTestFeature('test-1')
    
    registry.register<TestFeatureOptions>(feature)
    const features = registry.features
    
    // Modifying the returned map should not affect the registry
    features.clear()
    expect(registry.getAll()).toHaveLength(1)
  })
}) 