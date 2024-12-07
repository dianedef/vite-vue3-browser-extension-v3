/** Options configurables pour une feature */
export interface IFeatureOptions {
  [key: string]: unknown
}

/** Métadonnées requises pour identifier et décrire une feature */
export interface IFeatureMetadata {
  /** Identifiant unique de la feature */
  id: string
  /** Nom d'affichage de la feature */
  name: string
  /** Description détaillée de la feature */
  description: string
  /** Version actuelle de la feature */
  version: string
}

/**
 * Interface définissant le contrat d'une feature
 * @template T - Type des options spécifiques de la feature
 */
export interface IFeature<T extends IFeatureOptions> {
  /** Métadonnées de la feature en lecture seule */
  readonly metadata: IFeatureMetadata
  /** Options par défaut de la feature en lecture seule */
  readonly defaultOptions: T
  /**
   * Exécute la logique principale de la feature
   * @param options - Options de configuration pour l'exécution
   * @returns Promise qui se résout quand l'exécution est terminée
   */
  execute: (options: T) => Promise<void>
  /**
   * Valide les options fournies
   * @param options - Options à valider
   * @returns true si les options sont valides, false sinon
   */
  validate: (options: T) => boolean
}
/**
 * Classe de base abstraite pour implémenter une feature
 * @template T - Type des options spécifiques de la feature
 * @abstract
 * @implements {IFeature<T>}
 */
export abstract class BaseFeature<T extends IFeatureOptions> implements IFeature<T> {
  /**
   * Crée une nouvelle instance de BaseFeature
   * @param metadata - Métadonnées décrivant la feature
   * @param defaultOptions - Options par défaut de la feature
   */
  constructor(
    readonly metadata: IFeatureMetadata,
    readonly defaultOptions: T
  ) {}

  /**
   * Méthode abstraite à implémenter par les classes filles
   * Contient la logique principale de la feature
   * @abstract
   * @param options - Options de configuration pour l'exécution
   * @returns Promise qui se résout quand l'exécution est terminée
   */
  abstract execute: (options: T) => Promise<void>

  /**
   * Valide que toutes les options requises sont présentes
   * Peut être surchargée par les classes filles pour une validation plus spécifique
   * @param options - Options à valider
   * @returns true si les options sont valides, false sinon
   */
  validate = (options: T): boolean => {
    return Object.keys(this.defaultOptions).every(key => key in options)
  }
}