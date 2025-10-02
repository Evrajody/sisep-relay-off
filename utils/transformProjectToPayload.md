# Documentation : Transformation de Projet

## Vue d'ensemble

Ces utilitaires permettent de transformer les données de projet entre différents formats :
- **Format API** : Structure reçue depuis l'API lors de la lecture d'un projet
- **Format Formulaire** : Structure attendue par le formulaire Vueform
- **Format Update** : Structure à envoyer lors de la modification d'un projet

## Fonctions disponibles

### 1. `transformProjectToPayload(project)`

Transforme un projet récupéré de l'API en payload pour le formulaire de modification.

#### Utilisation

```typescript
import { transformProjectToPayload } from '~/utils/transformProjectToPayload';

// Récupération d'un projet depuis l'API
const apiProject = {
  id: "9d050b5f-a2e4-428d-a733-a63f54298640",
  title: "Memphis",
  description: "<div>Adipisicing ipsa!</div>",
  typeId: "8ac69187-686e-4e88-82fb-e80a20da6d93",
  // ... autres champs
};

// Transformation pour le formulaire
const formPayload = transformProjectToPayload(apiProject);

// Utilisation dans Vueform
vueformRef.value.load(formPayload);
```

#### Transformations effectuées

| Champ API | Champ Formulaire | Transformation |
|-----------|------------------|----------------|
| `indicators` (array) | `indicators` (array) | Ajout de `indicatorId` objet si existant |
| `finances` (array) | `finances` (array) | Conversion des nombres en string |
| `location.location.coordinates` | `location.location.latitude/longitude` | Extraction des coordonnées |
| `partners[].otherData` | `partners[].otherData` | Préservation de la structure |
| Champs imbriqués | Champs imbriqués | Conservation de la structure |

### 2. `transformPayloadToAPI(formData)`

Transforme les données du formulaire en format attendu par l'API pour la mise à jour.

#### Utilisation

```typescript
import { transformPayloadToAPI } from '~/utils/transformProjectToPayload';

// Données du formulaire
const formData = {
  title: "Louisville",
  typeId: "8ac69187-686e-4e88-82fb-e80a20da6d93",
  finances: [{
    amountCommitedCfa: "931", // String
    amountDisbursedCfa: "305" // String
  }]
};

// Transformation pour l'API
const apiPayload = transformPayloadToAPI(formData);

// Résultat: { finances: [{ amountCommitedCfa: 931, amountDisbursedCfa: 305 }] }
```

#### Transformations effectuées

| Champ Formulaire | Champ API | Transformation |
|------------------|-----------|----------------|
| `finances[].amountCommitedCfa` (string) | `amountCommitedCfa` (number) | `parseFloat()` |
| `finances[].amountDisbursedCfa` (string) | `amountDisbursedCfa` (number) | `parseFloat()` |
| `finances[].exchangeRateUsed` (string) | `exchangeRateUsed` (number) | `parseFloat()` |
| `location.location.latitude/longitude` | `location.location.coordinates` | Construction du tableau |
| `indicators[].indicatorId` | `indicators[].id` | Extraction de l'ID |

### 3. `cleanPayload(payload)`

Nettoie le payload en supprimant les champs vides, null ou undefined.

#### Utilisation

```typescript
import { cleanPayload } from '~/utils/transformProjectToPayload';

const dirtyPayload = {
  title: "Memphis",
  description: "",
  startDate: null,
  partners: [],
  location: {
    region: "cotonou",
    city: null
  }
};

const clean = cleanPayload(dirtyPayload);

// Résultat:
// {
//   title: "Memphis",
//   location: {
//     region: "cotonou"
//   }
// }
```

#### Règles de nettoyage

- ✅ **Conserve** : `0`, `false`, objets et tableaux non vides
- ❌ **Supprime** : `null`, `undefined`, `""` (string vide), `[]` (tableau vide), `{}` (objet vide)

## Flux complet de modification

### Étape 1 : Chargement du projet

```typescript
import useProjectDetail from '~/composables/project/useProjectDetail';
import { transformProjectToPayload } from '~/utils/transformProjectToPayload';

const { project, fetchProject } = useProjectDetail();

// Récupération du projet
await fetchProject(projectId);

// Transformation pour le formulaire
const formData = transformProjectToPayload(project.value);

// Chargement dans Vueform
vueformRef.value.load(formData);
```

### Étape 2 : Soumission du formulaire

```typescript
import { transformPayloadToAPI, cleanPayload } from '~/utils/transformProjectToPayload';
import { transformTmpPayload } from '~/utils/transformTmpPayload';

const endpoint = async (form: any, payload: any) => {
  // 1. Récupération des données du formulaire
  const formData = payload.requestData;

  // 2. Traitement de la location
  let payloadProject = {
    ...formData,
    location: {
      ...formData.location,
      location: (formData.location?.location?.latitude && formData.location?.location?.longitude)
        ? {
            type: 'point',
            coordinates: [[formData.location.location.latitude, formData.location.location.longitude]]
          }
        : null,
    }
  };

  // 3. Transformation des champs tmp (fichiers)
  const transformedPayload = transformTmpPayload(payloadProject);

  // 4. Transformation vers le format API
  const apiPayload = transformPayloadToAPI(transformedPayload);

  // 5. Nettoyage des champs vides
  const cleanedPayload = cleanPayload(apiPayload);

  // 6. Envoi à l'API
  await updateProject(cleanedPayload);
};
```

## Exemples de transformation

### Exemple 1 : Indicateurs

**Format API :**
```json
{
  "indicators": [
    {
      "id": "abc-123",
      "name": "Taux d'accès à l'eau",
      "baselineValue": "45",
      "targetValue": "80"
    }
  ]
}
```

**Format Formulaire (après transformation) :**
```json
{
  "indicators": [
    {
      "indicatorId": {
        "id": "abc-123",
        "nom": "Taux d'accès à l'eau"
      },
      "indicatorName": "Taux d'accès à l'eau",
      "baselineValue": "45",
      "targetValue": "80"
    }
  ]
}
```

### Exemple 2 : Finances

**Format API :**
```json
{
  "finances": [
    {
      "amountCommitedCfa": 50000000,
      "amountDisbursedCfa": 25000000,
      "currency": "XOF"
    }
  ]
}
```

**Format Formulaire :**
```json
{
  "finances": [
    {
      "amountCommitedCfa": "50000000",
      "amountDisbursedCfa": "25000000",
      "currency": "XOF"
    }
  ]
}
```

### Exemple 3 : Localisation

**Format API :**
```json
{
  "location": {
    "region": "Littoral",
    "city": "Cotonou",
    "location": {
      "type": "point",
      "coordinates": [[6.3703, 2.3912]]
    }
  }
}
```

**Format Formulaire :**
```json
{
  "location": {
    "region": "Littoral",
    "city": "Cotonou",
    "location": {
      "type": "point",
      "coordinates": {
        "latitude": 6.3703,
        "longitude": 2.3912
      }
    }
  }
}
```

## Composable : useUpdateProject

### Installation

```typescript
import { useUpdateProject } from '~/composables/project/useUpdateProject';

const {
  updateProject,
  updateProjectFormEl,
  updateProjectForm,
  loadProjectForEdit
} = useUpdateProject(projectId);
```

### Fonctions

#### `loadProjectForEdit(project)`

Charge un projet et le transforme pour l'édition.

```typescript
const project = await fetchProject(projectId);
const formData = await loadProjectForEdit(project);
vueformRef.value.load(formData);
```

#### `updateProject(data)`

Met à jour un projet.

```typescript
await updateProject({
  title: "Nouveau titre",
  description: "Nouvelle description"
});
```

## Utilisation dans une page d'édition

```vue
<script setup>
import { useUpdateProject } from '~/composables/project/useUpdateProject';
import useProjectDetail from '~/composables/project/useProjectDetail';
import { useCreateProject } from '~/composables/project/useCreateProject';

const route = useRoute();
const projectId = route.params.id;

const { project, fetchProject } = useProjectDetail();
const { createProjectForm } = useCreateProject();
const { updateProjectFormEl, loadProjectForEdit } = useUpdateProject(projectId);

const formData = ref(null);

// Configuration du formulaire
const updateForm = computed(() => ({
  ...createProjectForm.value,
  endpoint: async (form, payload) => {
    // Logique de mise à jour
  }
}));

// Chargement du projet
onMounted(async () => {
  await fetchProject(projectId);
  formData.value = await loadProjectForEdit(project.value);
  updateProjectFormEl.value.load(formData.value);
});
</script>

<template>
  <Vueform
    v-bind="updateForm"
    ref="updateProjectFormEl"
  />
</template>
```

## Bonnes pratiques

### 1. Toujours nettoyer le payload avant l'envoi

```typescript
const cleanedPayload = cleanPayload(apiPayload);
await updateProject(cleanedPayload);
```

### 2. Gérer les coordonnées GPS correctement

```typescript
const location = {
  region: formData.location.region,
  city: formData.location.city,
  location: formData.location.location?.latitude
    ? {
        type: 'point',
        coordinates: [[
          formData.location.location.latitude,
          formData.location.location.longitude
        ]]
      }
    : null
};
```

### 3. Transformer les fichiers avec transformTmpPayload

```typescript
const transformedPayload = transformTmpPayload(payloadProject);
```

### 4. Logger les payloads en développement

```typescript
console.log('Payload formulaire:', formData);
console.log('Payload API:', apiPayload);
console.log('Payload nettoyé:', cleanedPayload);
```

## Dépannage

### Les finances ne s'affichent pas
➜ Vérifier que `finances` est un tableau avec au moins un élément

### Les coordonnées GPS ne sont pas enregistrées
➜ Vérifier la structure : `[[latitude, longitude]]` (tableau de tableaux)

### Les indicateurs existants perdent leur ID
➜ S'assurer que `indicatorId.id` est bien présent dans le payload formulaire

### Erreur 400 lors de la mise à jour
➜ Vérifier que le payload nettoyé ne contient pas de champs invalides
➜ Logger `cleanedPayload` avant l'envoi
