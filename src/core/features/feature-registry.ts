import type { IFeature, IFeatureOptions } from './base.feature'

export interface IFeatureRegistry {
  readonly features: Map<string, IFeature<IFeatureOptions>>
  register: <T extends IFeatureOptions>(feature: IFeature<T>) => void
  unregister: (featureId: string) => void
  get: <T extends IFeatureOptions>(featureId: string) => IFeature<T> | undefined
  getAll: () => Array<IFeature<IFeatureOptions>>
  clear: () => void
}

export class FeatureRegistry implements IFeatureRegistry {
  private _features: Map<string, IFeature<IFeatureOptions>> = new Map()

  get features(): Map<string, IFeature<IFeatureOptions>> {
    return new Map(this._features)
  }

  register = <T extends IFeatureOptions>(feature: IFeature<T>): void => {
    if (this._features.has(feature.metadata.id)) {
      throw new Error(`Feature with id ${feature.metadata.id} is already registered`)
    }
    this._features.set(feature.metadata.id, feature as unknown as IFeature<IFeatureOptions>)
  }

  unregister = (featureId: string): void => {
    if (!this._features.has(featureId)) {
      throw new Error(`Feature with id ${featureId} is not registered`)
    }
    this._features.delete(featureId)
  }

  get = <T extends IFeatureOptions>(featureId: string): IFeature<T> | undefined => {
    const feature = this._features.get(featureId)
    return feature as unknown as IFeature<T> | undefined
  }

  getAll = (): Array<IFeature<IFeatureOptions>> => {
    return Array.from(this._features.values())
  }

  clear = (): void => {
    this._features.clear()
  }
} 