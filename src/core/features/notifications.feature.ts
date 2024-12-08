import { useToast } from 'primevue/usetoast'
import type { ToastMessageOptions } from 'primevue/toast'
import { BaseFeature, type IFeatureOptions } from '@/core/features/base.feature'

/**
 * Options de configuration pour la feature de notifications
 * @interface NotificationOptions
 * @extends {IFeatureOptions}
 */
export interface NotificationOptions extends IFeatureOptions {
  /** Active ou désactive les notifications */
  enabled: boolean
  /** Active ou désactive le son des notifications */
  sound: boolean
  /** Type de notification (success, info, warn, error) */
  severity?: 'success' | 'info' | 'warn' | 'error'
  /** Titre de la notification */
  summary?: string
  /** Contenu détaillé de la notification */
  detail?: string
  /** Durée d'affichage en millisecondes */
  life?: number
}

/**
 * Feature gérant les notifications Toast de l'interface
 * @class NotificationsFeature
 * @extends {BaseFeature<NotificationOptions>}
 */
export class NotificationsFeature extends BaseFeature<NotificationOptions> {
  constructor() {
    super(
      {
        id: 'notifications',
        name: 'feature_notifications_name',
        description: 'feature_notifications_description',
        version: '1.0.0'
      },
      {
        enabled: true,
        sound: false,
        life: 3000
      }
    )
  }

  /**
   * Affiche une notification Toast avec les options spécifiées
   * @param {NotificationOptions} options - Options de configuration de la notification
   * @throws {Error} Si les options sont invalides
   */
  execute = async (options: NotificationOptions): Promise<void> => {
    if (!this.validate(options)) {
      throw new Error('Invalid notification options')
    }

    if (!options.enabled) {
      return
    }

    try {
      const toast = useToast()
      
      const toastOptions: ToastMessageOptions = {
        severity: options.severity || 'info',
        summary: options.summary,
        detail: options.detail,
        life: options.life
      }

      toast.add(toastOptions)

    } catch (error) {
      console.error('Failed to show notification:', error)
      throw error
    }
  }

  /**
   * Valide les options de notification
   * @param {NotificationOptions} options - Options à valider
   * @returns {boolean} true si les options sont valides
   */
  validate = (options: NotificationOptions): boolean => {
    return (
      Object.keys(this.defaultOptions).every(key => key in options) &&
      typeof options.enabled === 'boolean' &&
      typeof options.sound === 'boolean'
    )
  }
} 