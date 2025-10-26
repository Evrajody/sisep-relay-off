# 🔐 Système de Gestion des Permissions et des Actions de Projet

## Vue d'ensemble

Ce système gère les permissions utilisateur et les transitions d'état des projets. Il s'intègre complètement avec **Better Auth** pour l'authentification.

---

## 📁 Fichiers du système

### 1. **Transitions de statut**
**Fichier**: `utils/projectStatusTransitions.ts`

Définit les transitions autorisées entre les statuts de projet.

```typescript
// Exemple de transitions :
DRAFT → SUBMITTED
SUBMITTED → VALIDATED_BY_STRUCTURE | REJECTED_BY_STRUCTURE
VALIDATED_BY_STRUCTURE → VALIDATED
VALIDATED → PUBLISHED
PUBLISHED ↔ UNPUBLISHED
```

### 2. **Permissions utilisateur**
**Fichier**: `composables/usePermissions.ts`

Gère l'accès aux permissions depuis `session.additional_info.persmissions` (Better Auth).

**Utilisation:**
```typescript
import { usePermissions, ProjectPermission } from '~/composables/usePermissions';

const { hasPermission, canCreateProject, canValidateProject } = usePermissions();

if (hasPermission(ProjectPermission.DELETE)) {
  // L'utilisateur peut supprimer
}
```

### 3. **Actions de statut + Permissions**
**Fichier**: `composables/project/useProjectActionAvailability.ts`

Combine les transitions de statut ET les permissions pour déterminer si une action est disponible.

**Utilisation:**
```typescript
import { useProjectActionAvailability } from '~/composables/project/useProjectActionAvailability';

const { isActionAvailable } = useProjectActionAvailability();

if (isActionAvailable(projectStatus, 'SUBMIT')) {
  // Le bouton "Soumettre" est disponible
}
```

### 4. **Actions CRUD**
**Fichier**: `composables/project/useProjectCRUDPermissions.ts`

Simplifie la vérification des actions de création, modification et suppression.

**Utilisation:**
```typescript
import { useProjectCRUDPermissions } from '~/composables/project/useProjectCRUDPermissions';

const { canCreateProject, canDeleteProject, canModifyProject } = useProjectCRUDPermissions();

if (canCreateProject()) {
  // Afficher le bouton "Créer"
}
```

---

## 🔄 Flux de décision

Quand un utilisateur tente une action :

```
┌─────────────────────────────────────────┐
│ L'action est-elle autorisée?            │
├─────────────────────────────────────────┤
│ 1. Transition de statut valide?         │
│    (ex: DRAFT → SUBMITTED)              │
│                                         │
│ 2. Utilisateur a la permission?         │
│    (ex: CAN_SUBMIT_PROJECT)             │
└─────────────────────────────────────────┘
      ↓
  ✅ Les deux OK → Action disponible
  ❌ Au moins une échoue → Action désactivée
```

---

## 🎯 Intégration avec Better Auth

### Structure de la session Better Auth

```javascript
{
  data: {
    user: { name, email, ... },
    additional_info: {
      user: { username, email, fullName },
      persmissions: {
        CAN_CREATE_PROJECT: boolean,
        CAN_UPDATE_PROJECT: boolean,
        CAN_DELETE_PROJECT: boolean,
        CAN_PUBLISH_PROJECT: boolean,
        CAN_VALIDATE_PROJECT: boolean,
        CAN_REJECT_PROJECT: boolean,
        // ... autres permissions
      },
      structures: [],
      modules: []
    }
  },
  isPending: boolean,
  isRefetching: boolean,
  error: null | BetterFetchError
}
```

### Accès à la session

```typescript
const { $authClient } = useNuxtApp();
const session = $authClient.useSession(); // Ref réactive

// Accès au statut
session.value?.isPending  // En cours de chargement
session.value?.error      // Erreurs
session.value?.data       // Données de la session
```

---

## 💡 Exemples d'utilisation

### Exemple 1: Afficher un bouton "Créer" conditionnel

```vue
<template>
  <UButton
    v-if="canCreateProject()"
    @click="navigateTo('/projects/new')"
  >
    Créer un projet
  </UButton>
</template>

<script lang="ts" setup>
import { useProjectCRUDPermissions } from '~/composables/project/useProjectCRUDPermissions';

const { canCreateProject } = useProjectCRUDPermissions();
</script>
```

### Exemple 2: Boutons d'action basés sur le statut ET les permissions

```vue
<template>
  <div class="actions">
    <!-- Soumettre (seulement si transition et permission OK) -->
    <UButton
      v-if="isActionAvailable(project.status, 'SUBMIT')"
      @click="submitProject()"
    >
      Soumettre
    </UButton>

    <!-- Valider (seulement si CAN_VALIDATE_PROJECT) -->
    <UButton
      v-if="isActionAvailable(project.status, 'VALIDATE')"
      @click="validateProject()"
    >
      Valider
    </UButton>

    <!-- Supprimer (seulement si CAN_DELETE_PROJECT) -->
    <UButton
      v-if="canDeleteProject(project)"
      color="red"
      @click="deleteProject()"
    >
      Supprimer
    </UButton>
  </div>
</template>

<script lang="ts" setup>
import { useProjectActionAvailability } from '~/composables/project/useProjectActionAvailability';
import { useProjectCRUDPermissions } from '~/composables/project/useProjectCRUDPermissions';

const { isActionAvailable } = useProjectActionAvailability();
const { canDeleteProject } = useProjectCRUDPermissions();
</script>
```

### Exemple 3: Vérifier directement les permissions

```typescript
import { usePermissions, ProjectPermission } from '~/composables/usePermissions';

const {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions
} = usePermissions();

// Vérifier une permission spécifique
if (hasPermission(ProjectPermission.CREATE)) {
  // Peut créer
}

// Vérifier si l'utilisateur a AU MOINS UNE des permissions
if (hasAnyPermission([ProjectPermission.UPDATE, ProjectPermission.MODIFY])) {
  // Peut modifier
}

// Vérifier si l'utilisateur a TOUTES les permissions
if (hasAllPermissions([ProjectPermission.CREATE, ProjectPermission.DELETE])) {
  // Est un super utilisateur
}
```

---

## 🔧 Énumération des permissions

```typescript
enum ProjectPermission {
  CREATE = 'CAN_CREATE_PROJECT',
  UPDATE = 'CAN_UPDATE_PROJECT',
  UPDATE_ALL = 'CAN_UPDATE_ALL_PROJECT',
  UPDATE_OWN = 'CAN_UPDATE_OWN_PROJECT',
  MODIFY = 'CAN_MODIFY_PROJECT',
  DELETE = 'CAN_DELETE_PROJECT',
  PUBLISH = 'CAN_PUBLISH_PROJECT',
  UNPUBLISH = 'CAN_UNPUBLISH_PROJECT',
  VALIDATE = 'CAN_VALIDATE_PROJECT',
  REJECT = 'CAN_REJECT_PROJECT',
  SUBMIT = 'CAN_SUBMIT_PROJECT_FOR_VALIDATION',
  LIST_ALL = 'CAN_LIST_ALL_PROJECT',
  LIST_OWN = 'CAN_LIST_OWN_PROJECT',
  ASSIGN = 'CAN_ASSIGN_PROJECT',
}
```

---

## 📋 Actions de projet disponibles

```typescript
{
  SAVE_DRAFT: { requiredPermissions: [UPDATE, MODIFY] },
  SUBMIT: { requiredPermissions: [SUBMIT] },
  VALIDATE: { requiredPermissions: [VALIDATE] },
  VALIDATE_BY_STRUCTURE: { requiredPermissions: [VALIDATE] },
  REJECT: { requiredPermissions: [REJECT] },
  REJECT_BY_STRUCTURE: { requiredPermissions: [REJECT] },
  PUBLISH: { requiredPermissions: [PUBLISH] },
  UNPUBLISH: { requiredPermissions: [UNPUBLISH] },
}
```

---

## 🎨 Intégration dans la page détail du projet

**Fichier**: `pages/admin/project-module/[id].vue`

Les boutons d'action se désactivent automatiquement :

```vue
<UButton
  :disabled="!isActionAvailable(currentStatus, 'SUBMIT')"
>
  Soumettre
</UButton>
```

Le système vérifie à la fois :
1. ✅ La transition de statut
2. ✅ Les permissions de l'utilisateur

---

## 🔄 Personnalisation

### Modifier les transitions de statut

Éditez `utils/projectStatusTransitions.ts` :

```typescript
export const PROJECT_STATUS_TRANSITIONS = {
  [PROJECT_STATUS_DRAFT]: [PROJECT_STATUS_SUBMITTED, PROJECT_STATUS_DRAFT],
  // Ajoutez vos transitions
};
```

### Ajouter de nouvelles permissions

1. Ajoutez à l'énumération `ProjectPermission` dans `composables/usePermissions.ts`
2. Ajoutez la permission requise pour chaque action dans `useProjectActionAvailability.ts`

---

## ⚙️ Architecture

```
┌─────────────────────────────────────┐
│        Better Auth Session          │
│  (session.additional_info)          │
│         + permissions               │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   usePermissions (composable)        │
│  - Accès aux permissions            │
│  - Vérifications simples             │
└──────────────┬──────────────────────┘
               ↓
┌──────────────┴───────────────────────────┐
│                                          │
↓                                          ↓
useProjectCRUD              useProjectActionAvailability
Permissions                 + PROJECT_STATUS_TRANSITIONS
(composable)                (composable)
│                           │
└───────────────┬───────────┘
                ↓
         Vue Components
       (pages & composants)
```

---

## 🐛 Débogage

### Voir les permissions actuelles

```typescript
const { getAllPermissions, getUserInfo } = usePermissions();

console.log('Permissions:', getAllPermissions());
console.log('Utilisateur:', getUserInfo());
```

### Voir les raisons d'une action désactivée

```typescript
const { getActionUnavailableReasons } = useProjectActionAvailability();

const reasons = getActionUnavailableReasons(status, 'SUBMIT');
console.log('Transition refusée?', reasons.transition);
console.log('Permission refusée?', reasons.permission);
```

---

## 📝 Notes

- L'API utilise `persmissions` (avec typo) au lieu de `permissions`
- Better Auth expose `useSession()` qui retourne une `Ref` réactive
- Les transitions de statut et les permissions sont vérifiées **indépendamment**
- Un bouton est actif que si **les deux** conditions sont remplies

---

**Créé avec Better Auth + Nuxt 3** 🚀
