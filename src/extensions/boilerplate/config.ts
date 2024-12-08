import type { IFeatureState } from '@/core/settings/settings.service'

export const config: Record<string, IFeatureState> = {
  screenshot: {
    enabled: true,
    options: {
      format: 'png',
      quality: 0.9
    }
  }
} 