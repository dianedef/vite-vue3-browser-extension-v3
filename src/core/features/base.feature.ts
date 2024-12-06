export interface IFeatureOptions {
  [key: string]: unknown
}

export interface IFeatureMetadata {
  id: string
  name: string
  description: string
  version: string
}

export interface IFeature<T extends IFeatureOptions = IFeatureOptions> {
  readonly metadata: IFeatureMetadata
  readonly defaultOptions: T
  execute: (options: T) => Promise<void>
  validate: (options: T) => boolean
}

export abstract class BaseFeature<T extends IFeatureOptions> implements IFeature<T> {
  constructor(
    readonly metadata: IFeatureMetadata,
    readonly defaultOptions: T
  ) {}

  abstract execute: (options: T) => Promise<void>

  validate = (options: T): boolean => {
    // Base validation that can be overridden
    return Object.keys(this.defaultOptions).every(key => key in options)
  }
} 