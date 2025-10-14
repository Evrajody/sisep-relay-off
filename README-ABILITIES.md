# Système d'Abilities et de Permissions SISEB

Ce document résume le système de gestion des permissions (abilities) basé sur les rôles Keycloak mis en place dans l'application SISEB.

## 📁 Structure des fichiers

```
siseb-refonte/
├── types/
│   └── auth.ts                          # Types TypeScript pour la session et helpers
├── shared/
│   └── utils/
│       └── abilities.ts                 # Système d'abilities et mapping des rôles
├── composables/
│   └── useAbilities.ts                  # Composable Vue pour utiliser les abilities
├── plugins/
│   └── authorization-resolver.ts        # Plugin Nuxt d'autorisation mis à jour
├── middleware/
│   └── project-permissions.ts           # Exemple de middleware de protection
├── components/
│   └── examples/
│       └── ProjectActionsExample.vue    # Exemple de composant avec abilities
├── server/
│   └── api/
│       └── projects/
│           └── validate/
│               └── [id].post.ts         # Exemple d'API protégée
└── docs/
    └── abilities-usage.md               # Guide complet d'utilisation
```

## 🎯 Fonctionnalités principales

### 1. Typage complet de la session utilisateur

Le fichier `types/auth.ts` contient :
- **`KeycloakUserSession`** : Type pour les sessions Keycloak
- **`LocalUserSession`** : Type pour les sessions locales
- **`UserSession`** : Union type des deux types de session
- **`ProjectRole`** : Tous les rôles disponibles
- **Helper functions** : `getUserRolesForModule()`, `hasRole()`, `hasAnyRole()`, etc.

```typescript
import type { UserSession, ProjectRole } from "~/types/auth";
import { getUserRolesForModule, hasRole } from "~/types/auth";
```

### 2. Système d'abilities basé sur les rôles

Le fichier `shared/utils/abilities.ts` contient :
- **`Action`** : Enum des actions disponibles (LIST, CREATE, UPDATE, DELETE, etc.)
- **`Subject`** : Enum des sujets (PROJECT, USER, etc.)
- **`AbilityManager`** : Classe pour gérer les permissions
- **Helper functions** : `canCreateProject()`, `canValidateProject()`, etc.

```typescript
import { AbilityManager, Action, Subject } from "~/shared/utils/abilities";

const manager = new AbilityManager(session);
if (manager.can(Action.VALIDATE, Subject.PROJECT)) {
  // L'utilisateur peut valider un projet
}
```

### 3. Composable Vue pour les composants

Le fichier `composables/useAbilities.ts` permet d'utiliser facilement les abilities dans les composants :

```vue
<script setup>
const { canCreate, canValidate, canPublish } = useAbilities();
</script>

<template>
  <button v-if="canCreate">Créer un projet</button>
  <button v-if="canValidate">Valider</button>
  <button v-if="canPublish">Publier</button>
</template>
```

## 🔐 Rôles et Permissions

### Rôles disponibles

| Rôle | Description | Permissions |
|------|-------------|-------------|
| `VALIDATEUR` | Rôle composite de validation | LIST, READ, VALIDATE, REJECT, REQUEST_MODIFICATION |
| `LIST_PROJECT` | Consulter les projets | LIST, READ |
| `CREATE_PROJECT` | Créer des projets | CREATE |
| `UPDATE_PROJECT` | Modifier des projets | UPDATE |
| `DELETE_PROJECT` | Supprimer des projets | DELETE |
| `ASSIGN_PROJECT` | Affecter des projets | ASSIGN |
| `VALIDATE_PROJECT` | Valider des projets | VALIDATE |
| `REJECT_PROJECT` | Rejeter des projets | REJECT |
| `REQUEST_MODIFICATION` | Demander des modifications | REQUEST_MODIFICATION |
| `PUBLISH_PROJECT` | Publier des projets | PUBLISH |
| `UNPUBLISH_PROJECT` | Dépublier des projets | UNPUBLISH |

## 💡 Exemples d'utilisation

### Dans un composant Vue

```vue
<script setup lang="ts">
import { useAbilities } from "~/composables/useAbilities";

const { canCreate, canUpdate, canDelete, canValidate } = useAbilities();

const handleAction = (action: string) => {
  console.log(`Action: ${action}`);
};
</script>

<template>
  <div>
    <button v-if="canCreate" @click="handleAction('create')">
      Créer
    </button>
    <button v-if="canUpdate" @click="handleAction('update')">
      Modifier
    </button>
    <button v-if="canDelete" @click="handleAction('delete')">
      Supprimer
    </button>
    <button v-if="canValidate" @click="handleAction('validate')">
      Valider
    </button>
  </div>
</template>
```

### Dans un middleware

```typescript
// middleware/can-create-project.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { canCreate } = useAbilities();

  if (!canCreate.value) {
    return navigateTo("/admin/project-module/dashboard");
  }
});
```

### Dans une API handler

```typescript
// server/api/projects/create.post.ts
import { getServerSession } from "#auth";
import { canCreateProject } from "~/shared/utils/abilities";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!canCreateProject(session)) {
    throw createError({
      statusCode: 403,
      message: "Permission refusée",
    });
  }

  // Créer le projet...
});
```

### Vérification de rôles

```typescript
import type { UserSession } from "~/types/auth";
import { hasRole, hasAnyRole } from "~/types/auth";

const { data: session } = useAuth();

// Vérifier un rôle spécifique
if (hasRole(session.value, "VALIDATEUR")) {
  console.log("L'utilisateur est un validateur");
}

// Vérifier plusieurs rôles
if (hasAnyRole(session.value, ["PUBLISH_PROJECT", "UNPUBLISH_PROJECT"])) {
  console.log("L'utilisateur peut gérer les publications");
}
```

## 🧪 Tests

Pour tester le système d'abilities, vous pouvez afficher les informations de debug :

```vue
<script setup>
const { abilities } = useAbilities();
const { data: session } = useAuth();

// Afficher toutes les abilities
console.log("User abilities:", abilities.value);

// Afficher les rôles
import { getUserRolesForModule } from "~/types/auth";
console.log("User roles:", getUserRolesForModule(session.value));
</script>
```

## 📚 Documentation complète

Pour plus d'exemples et de détails, consultez le guide complet dans `docs/abilities-usage.md`.

## 🔄 Extension du système

### Ajouter un nouveau rôle

1. Ajouter le rôle dans `types/auth.ts` :
```typescript
export type ProjectRole =
  | "EXISTING_ROLE"
  | "NEW_ROLE"  // ← Nouveau rôle
```

2. Ajouter le mapping dans `shared/utils/abilities.ts` :
```typescript
const ROLE_ABILITIES_MAP: Record<ProjectRole, Ability[]> = {
  NEW_ROLE: [
    { action: Action.CUSTOM_ACTION, subject: Subject.PROJECT },
  ],
};
```

### Ajouter une nouvelle action

1. Ajouter l'action dans `shared/utils/abilities.ts` :
```typescript
export enum Action {
  EXISTING_ACTION = "existing_action",
  NEW_ACTION = "new_action",  // ← Nouvelle action
}
```

2. Créer un helper (optionnel) :
```typescript
export function canNewAction(session: UserSession | null): boolean {
  const manager = new AbilityManager(session);
  return manager.can(Action.NEW_ACTION, Subject.PROJECT);
}
```

## 🛡️ Sécurité

### Bonnes pratiques

1. ✅ **Toujours vérifier côté serveur** : Ne jamais faire confiance aux vérifications client
2. ✅ **Logger les accès refusés** : Pour l'audit et la sécurité
3. ✅ **Utiliser les type guards** : `isKeycloakSession()`, `isLocalSession()`
4. ✅ **Tester les permissions** : Écrire des tests pour chaque rôle
5. ✅ **Documentation** : Documenter les rôles requis pour chaque action

### Vérification côté serveur

Toujours protéger vos endpoints API :

```typescript
export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  // ✅ Vérification obligatoire
  if (!session) {
    throw createError({ statusCode: 401 });
  }

  // ✅ Vérification des permissions
  if (!canDoAction(session)) {
    throw createError({ statusCode: 403 });
  }

  // Traitement...
});
```

## 🚀 Prochaines étapes

1. Implémenter les endpoints API réels pour chaque action
2. Ajouter des tests unitaires pour le système d'abilities
3. Créer des composants réutilisables pour les actions courantes
4. Implémenter l'audit des actions sensibles
5. Ajouter la gestion des permissions au niveau des projets individuels

## 📞 Support

Pour toute question ou problème :
- Consulter `docs/abilities-usage.md` pour le guide complet
- Voir les exemples dans `components/examples/`
- Vérifier les types dans `types/auth.ts`
