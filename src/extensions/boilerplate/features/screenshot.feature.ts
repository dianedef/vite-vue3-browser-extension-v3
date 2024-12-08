import { BaseFeature, type IFeatureMetadata, type IFeatureOptions } from '@/core/features/base.feature'

interface ScreenshotOptions extends IFeatureOptions {
  format: 'png' | 'jpeg'
  quality: number
}

export class ScreenshotFeature extends BaseFeature<ScreenshotOptions> {
  constructor() {
    const metadata: IFeatureMetadata = {
      id: 'screenshot',
      name: 'Screenshot',
      description: 'Capture screenshots of web pages',
      version: '1.0.0'
    }

    const defaultOptions: ScreenshotOptions = {
      format: 'png',
      quality: 0.9
    }

    super(metadata, defaultOptions)
  }

  async execute(options: ScreenshotOptions): Promise<void> {
    try {
      // Logique de capture d'écran ici
      console.log('Taking screenshot with options:', options)
    } catch (error) {
      console.error('Failed to take screenshot:', error)
    }
  }

  validate(options: ScreenshotOptions): boolean {
    return (
      super.validate(options) &&
      ['png', 'jpeg'].includes(options.format) &&
      options.quality > 0 &&
      options.quality <= 1
    )
  }
} 