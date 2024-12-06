
## IFeature

- Des types génériques pour les options
- Des métadonnées obligatoires (id, name, description, version)
- Des méthodes requises (execute, validate)

Une classe abstraite BaseFeature qui :
- Implémente l'interface IFeature
- Fournit une validation de base des options
- Force l'implémentation de la méthode execute

Des tests qui vérifient :
- La création correcte d'une feature
- La validation des options
- L'existence de la méthode execute

## IFeatureRegistry

- Une Map en lecture seule des features
- Les méthodes de gestion (register, unregister, get, getAll, clear)

La classe FeatureRegistry qui implémente l'interface avec :
- Une Map privée pour stocker les features
- Un getter qui retourne une copie de la Map pour l'immutabilité
- Des méthodes de gestion avec validation d'erreurs

Des tests complets qui vérifient :
- L'état initial vide
- L'enregistrement de features
La prévention des doublons
- Le désenregistrement
- La gestion des erreurs
- Le nettoyage complet
- L'immutabilité de la Map retournée


## Infos

   Pour référence future, voici la bonne façon de typer un spy de console.error avec Vitest :
   import { MockInstance } from 'vitest'

   let mockToast: ToastInterface
   let consoleErrorSpy: MockInstance

## Tests

   sinon-chrome :
   Plus mature et maintenu depuis longtemps
   Intégration parfaite avec Sinon.js pour le spy/stub
   API plus verbeuse
   Plus lourd car inclut toute la bibliothèque Sinon
   Dernière mise à jour il y a 2 ans
   chrome-mock :
   Plus léger et focalisé uniquement sur le mock de l'API Chrome
   Maintenu activement
   API plus simple et moderne
   Meilleure compatibilité avec les types TypeScript
   Mises à jour régulières pour suivre l'API Chrome
   Pour un projet moderne en TypeScript comme le vôtre, je recommande chrome-mock car

## EventBus

   webext-bridge propose en effet une fonctionnalité similaire à un EventBus via son API de communication. Voici les principales fonctionnalités :
   import { onMessage, sendMessage, getBackgroundPage } from 'webext-bridge'

   // Communication typée
   type MessageType = {
   'event:name': { data: string }
   'other:event': { value: number }
   }

   // Écoute d'événements avec typage
   onMessage<MessageType>('event:name', (message) => {
   console.log(message.data) // string
   })

   // Envoi d'événements avec typage
   await sendMessage('event:name', { data: 'test' }, 'background')

   // Communication bidirectionnelle avec réponse
   onMessage('request:data', async () => {
   return { response: 'data' }
   })

   webext-bridge offre aussi :
   Une gestion des timeouts
   Un système de ports pour la communication persistante
   Un typage fort des messages
   Une API unifiée qui fonctionne dans tous les contextes (background, content, popup)
   C'est en fait déjà un système de pub/sub intégré, similaire à un EventBus.

