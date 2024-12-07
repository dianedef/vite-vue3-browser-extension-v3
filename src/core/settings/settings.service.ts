import browser from 'webextension-polyfill'
import type { IFeatureOptions } from '../features/base.feature'

/** État d'une feature avec ses options */
export interface IFeatureState {
  /** Si la feature est activée ou non */
  enabled: boolean
  /** Options configurées pour la feature */
  options: IFeatureOptions
}

/** Collection des états de toutes les features */
export interface IFeatureSettings {
  /** Map des états indexée par l'ID de feature */
  [featureId: string]: IFeatureState
}

/** Interface définissant les méthodes de gestion des états des features */
export interface ISettingsService {
  /** 
   * Récupère l'état complet d'une feature
   * @param featureId - ID de la feature
   * @returns État et options de la feature
   */
  getFeatureState: <T extends IFeatureOptions>(featureId: string) => Promise<IFeatureState & { options: T }>
  
  /**
   * Sauvegarde l'état complet d'une feature
   * @param featureId - ID de la feature
   * @param state - Nouvel état à sauvegarder
   */
  setFeatureState: <T extends IFeatureOptions>(featureId: string, state: IFeatureState & { options: T }) => Promise<void>
  
  /**
   * Vérifie si une feature est activée
   * @param featureId - ID de la feature
   * @returns true si la feature est activée
   */
  isFeatureEnabled: (featureId: string) => Promise<boolean>
  
  /**
   * Bascule l'état d'activation d'une feature
   * @param featureId - ID de la feature
   * @returns Nouvel état d'activation
   */
  toggleFeature: (featureId: string) => Promise<boolean>
  
  /**
   * Récupère tous les états de toutes les features
   * @returns Map complète des états
   */
  getAllSettings: () => Promise<IFeatureSettings>
  
  /**
   * Efface tous les états sauvegardés
   */
  clear: () => Promise<void>
}

/**
 * Service gérant la persistance des états des features
 * @implements {ISettingsService}
 */
export class SettingsService implements ISettingsService {
  /**
   * Clé de stockage des états des features
   */
  private static STORAGE_KEY = 'feature-settings'
    
  /**
   * État par défaut d'une feature
   */
  private static DEFAULT_FEATURE_STATE: IFeatureState = {
    enabled: false,
    options: {}
  }

  /**
   * Récupère tous les états des features
   * @returns Map des états
   */
  private async getSettings(): Promise<IFeatureSettings> {
    const data = await browser.storage.local.get(SettingsService.STORAGE_KEY)
    const emptySettings: IFeatureSettings = {}
    return data[SettingsService.STORAGE_KEY] || Object.create(null) as IFeatureSettings
  }

  /**
   * Récupère l'état complet d'une feature
   * @param featureId - ID de la feature
   * @returns État et options de la feature
   */
  async getFeatureState<T extends IFeatureOptions>(featureId: string): Promise<IFeatureState & { options: T }> {
    const settings = await this.getSettings()
    return settings[featureId] || SettingsService.DEFAULT_FEATURE_STATE as IFeatureState & { options: T }
  }

  /**
   * Sauvegarde tous les états des features
   * @param settings - Map des états
   */
  private async saveSettings(settings: IFeatureSettings): Promise<void> {
    await browser.storage.local.set({
      [SettingsService.STORAGE_KEY]: settings
    })
  }

  /**
   * Sauvegarde l'état complet d'une feature
   * @param featureId - ID de la feature
   * @param state - Nouvel état à sauvegarder
   */
  async setFeatureState<T extends IFeatureOptions>(
    featureId: string,
    state: IFeatureState & { options: T }
  ): Promise<void> {
    const settings = await this.getSettings()
    settings[featureId] = state
    await this.saveSettings(settings)
  }

  /**
   * Vérifie si une feature est activée
   * @param featureId - ID de la feature
   * @returns true si la feature est activée
   */
  async isFeatureEnabled(featureId: string): Promise<boolean> {
    const state = await this.getFeatureState(featureId)
    return state.enabled
  }

  /**
   * Bascule l'état d'activation d'une feature
   * @param featureId - ID de la feature
   * @returns Nouvel état d'activation
   */
  async toggleFeature(featureId: string): Promise<boolean> {
    const state = await this.getFeatureState(featureId)
    state.enabled = !state.enabled
    await this.setFeatureState(featureId, state)
    return state.enabled
  }

  /**
   * Récupère tous les états de toutes les features
   * @returns Map complète des états
   */
  async getAllSettings(): Promise<IFeatureSettings> {
    return this.getSettings()
  }

  /**
   * Efface tous les états sauvegardés
   */
  async clear(): Promise<void> {
    await this.saveSettings({})
  }
} 