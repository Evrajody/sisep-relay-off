# Guide d'utilisation du système d'Abilities

Ce guide explique comment utiliser le système de permissions (abilities) basé sur les rôles Keycloak dans l'application SISEB.

## Structure de la session utilisateur

La session utilisateur contient toutes les informations nécessaires pour déterminer les permissions :

```typescript
{
  user: { name: string, email: string },
  auth_provider: "keycloak" | "local",
  additional_info: {
    tokenDetails: {
      userResources: {
        "siseb-projet": {
          roles: ["VALIDATEUR", "PUBLISH_PROJECT", ...]
        }
      }
    }
  }
}
```

## Rôles disponibles

- `VALIDATEUR` - Rôle composite (liste, lecture, validation, rejet, demande de modification)
- `LIST_PROJECT` - Consulter la liste des projets
- `CREATE_PROJECT` - Créer un projet
- `UPDATE_PROJECT` - Modifier un projet
- `DELETE_PROJECT` - Supprimer un projet
- `ASSIGN_PROJECT` - Affecter un projet
- `VALIDATE_PROJECT` - Valider un projet
- `REJECT_PROJECT` - Rejeter un projet
- `REQUEST_MODIFICATION` - Demander une modification
- `PUBLISH_PROJECT` - Publier un projet
- `UNPUBLISH_PROJECT` - Dépublier un projet

## Utilisation dans les composables

### 1. Importer les types et utilitaires

```typescript
import type { UserSession, ProjectRole } from "~/types/auth";
import {
  getUserRolesForModule,
  hasRole,
  hasAnyRole
} from "~/types/auth";
```

### 2. Vérifier les rôles de l'utilisateur

```typescript
const { data: session } = useAuth();

// Obtenir tous les rôles de l'utilisateur pour le module projet
const userRoles = getUserRolesForModule(session.value);

// Vérifier si l'utilisateur a un rôle spécifique
if (hasRole(session.value, "VALIDATEUR")) {
  console.log("L'utilisateur est un validateur");
}

// Vérifier si l'utilisateur a l'un des rôles
if (hasAnyRole(session.value, ["PUBLISH_PROJECT", "UNPUBLISH_PROJECT"])) {
  console.log("L'utilisateur peut gérer les publications");
}
```

## Utilisation dans les composants Vue

### 1. Utiliser le composable `useAbilities`

```vue
<script setup lang="ts">
import { useAbilities } from "~/composables/useAbilities";

const {
  canCreate,
  canValidate,
  canPublish,
  can,
  Action,
  Subject
} = useAbilities();
</script>

<template>
  <div>
    <!-- Afficher le bouton uniquement si l'utilisateur peut créer -->
    <button v-if="canCreate" @click="createProject">
      Créer un projet
    </button>

    <!-- Afficher le bouton uniquement si l'utilisateur peut valider -->
    <button v-if="canValidate" @click="validateProject">
      Valider le projet
    </button>

    <!-- Afficher le bouton uniquement si l'utilisateur peut publier -->
    <button v-if="canPublish" @click="publishProject">
      Publier le projet
    </button>

    <!-- Vérification personnalisée -->
    <button v-if="can(Action.DELETE, Subject.PROJECT)" @click="deleteProject">
      Supprimer le projet
    </button>
  </div>
</template>
```

### 2. Utiliser l'AbilityManager directement

```typescript
import { AbilityManager, Action, Subject } from "~/shared/utils/abilities";

const { data: session } = useAuth();
const abilityManager = new AbilityManager(session.value);

// Vérifier une permission spécifique
if (abilityManager.can(Action.VALIDATE, Subject.PROJECT)) {
  // L'utilisateur peut valider un projet
}

// Vérifier plusieurs permissions
if (abilityManager.canAny([Action.PUBLISH, Action.UNPUBLISH], Subject.PROJECT)) {
  // L'utilisateur peut publier ou dépublier
}

// Obtenir toutes les abilities de l'utilisateur
const abilities = abilityManager.getAbilities();
console.log(abilities);
// [
//   { action: "list", subject: "project" },
//   { action: "validate", subject: "project" },
//   ...
// ]

// Obtenir les actions disponibles pour un sujet
const projectActions = abilityManager.getActionsForSubject(Subject.PROJECT);
```

### 3. Utiliser les helpers de fonctions

```typescript
import {
  canListProjects,
  canCreateProject,
  canValidateProject,
  canPublishProject,
} from "~/shared/utils/abilities";

const { data: session } = useAuth();

if (canListProjects(session.value)) {
  // Afficher la liste des projets
}

if (canCreateProject(session.value)) {
  // Afficher le formulaire de création
}
```

## Utilisation dans les middlewares

### Protéger une route

```typescript
// middleware/can-create-project.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { data: session } = useAuth();
  const { canCreate } = useAbilities();

  if (!canCreate.value) {
    return navigateTo("/admin/project-module/dashboard");
  }
});
```

### Protéger plusieurs actions

```typescript
// middleware/project-manager.ts
import { hasAnyRole } from "~/types/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const { data: session } = useAuth();

  const requiredRoles = ["CREATE_PROJECT", "UPDATE_PROJECT", "DELETE_PROJECT"];

  if (!hasAnyRole(session.value, requiredRoles)) {
    return abortNavigation("Accès refusé");
  }
});
```

## Utilisation dans les API handlers (server)

```typescript
// server/api/projects/create.post.ts
import { getServerSession } from "#auth";
import { canCreateProject } from "~/shared/utils/abilities";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  // Vérifier les permissions
  if (!canCreateProject(session)) {
    throw createError({
      statusCode: 403,
      message: "Vous n'avez pas la permission de créer un projet",
    });
  }

  // Créer le projet
  // ...
});
```

## Exemples de cas d'usage

### 1. Affichage conditionnel dans un menu

```vue
<template>
  <nav>
    <NuxtLink v-if="canList" to="/projects">
      Projets
    </NuxtLink>

    <NuxtLink v-if="canCreate" to="/projects/create">
      Créer un projet
    </NuxtLink>

    <NuxtLink v-if="canValidate || canReject" to="/projects/pending">
      Projets en attente
    </NuxtLink>
  </nav>
</template>

<script setup>
const { canList, canCreate, canValidate, canReject } = useAbilities();
</script>
```

### 2. Actions conditionnelles sur un projet

```vue
<template>
  <div class="project-actions">
    <button v-if="canUpdate" @click="editProject">
      Modifier
    </button>

    <button v-if="canDelete" @click="deleteProject">
      Supprimer
    </button>

    <button v-if="canAssign" @click="assignProject">
      Affecter
    </button>

    <div v-if="canValidate || canReject" class="validation-actions">
      <button v-if="canValidate" @click="validateProject">
        Valider
      </button>

      <button v-if="canReject" @click="rejectProject">
        Rejeter
      </button>

      <button v-if="canRequestChange" @click="requestModification">
        Demander une modification
      </button>
    </div>

    <div v-if="canPublish || canUnpublish" class="publication-actions">
      <button v-if="canPublish && !project.published" @click="publishProject">
        Publier
      </button>

      <button v-if="canUnpublish && project.published" @click="unpublishProject">
        Dépublier
      </button>
    </div>
  </div>
</template>

<script setup>
const {
  canUpdate,
  canDelete,
  canAssign,
  canValidate,
  canReject,
  canRequestChange,
  canPublish,
  canUnpublish
} = useAbilities();
</script>
```

### 3. Validation côté serveur avec messages personnalisés

```typescript
// server/api/projects/[id]/validate.post.ts
import { getServerSession } from "#auth";
import { canValidateProject } from "~/shared/utils/abilities";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const projectId = getRouterParam(event, "id");

  // Vérifier les permissions
  if (!canValidateProject(session)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "Vous devez avoir le rôle VALIDATEUR ou VALIDATE_PROJECT pour valider un projet",
    });
  }

  // Valider le projet
  // ...

  return { success: true, message: "Projet validé avec succès" };
});
```

## Extension du système

### Ajouter de nouveaux rôles

1. Ajouter le rôle dans `types/auth.ts` :

```typescript
export type ProjectRole =
  | "VALIDATEUR"
  | "NEW_ROLE"  // Nouveau rôle
  | ...
```

2. Ajouter le mapping dans `shared/utils/abilities.ts` :

```typescript
const ROLE_ABILITIES_MAP: Record<ProjectRole, Ability[]> = {
  NEW_ROLE: [
    { action: Action.CUSTOM_ACTION, subject: Subject.PROJECT },
  ],
  // ...
};
```

### Ajouter de nouvelles actions

1. Ajouter l'action dans `shared/utils/abilities.ts` :

```typescript
export enum Action {
  CUSTOM_ACTION = "custom_action",
  // ...
}
```

2. Créer un helper si nécessaire :

```typescript
export function canCustomAction(session: UserSession | null): boolean {
  const manager = new AbilityManager(session);
  return manager.can(Action.CUSTOM_ACTION, Subject.PROJECT);
}
```

## Bonnes pratiques

1. **Toujours vérifier les permissions côté serveur** - Ne jamais faire confiance uniquement aux vérifications côté client
2. **Utiliser les composables** - Préférer `useAbilities()` dans les composants Vue pour une meilleure réactivité
3. **Créer des middlewares réutilisables** - Pour les routes nécessitant des permissions spécifiques
4. **Logger les accès refusés** - Pour le débogage et la sécurité
5. **Tester les permissions** - Écrire des tests pour vérifier que les permissions fonctionnent correctement

## Débogage

Pour afficher toutes les abilities d'un utilisateur :

```typescript
const { abilities } = useAbilities();
console.log("User abilities:", abilities.value);
```

Pour afficher les rôles d'un utilisateur :

```typescript
const { data: session } = useAuth();
const roles = getUserRolesForModule(session.value);
console.log("User roles:", roles);
```
