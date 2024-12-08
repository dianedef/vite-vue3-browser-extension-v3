import { FeatureRegistry } from './feature-registry'
import { NotificationsFeature } from './notifications.feature'

// Créer le registre
const registry = new FeatureRegistry()

// Enregistrer la feature notifications
registry.register(new NotificationsFeature())

export default registry 