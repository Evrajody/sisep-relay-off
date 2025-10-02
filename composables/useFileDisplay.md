# Documentation : useFileDisplay & Composants de Streaming

## Vue d'ensemble

Le système de gestion de fichiers en streaming permet d'afficher des fichiers (images, PDF, documents) provenant de l'endpoint `/files/display/{id}` avec support du streaming.

## Composable : useFileDisplay

### Installation

```typescript
import { useFileDisplay } from '~/composables/useFileDisplay';

const {
  getFileDisplayUrl,
  getFileType,
  getFileIcon,
  downloadFile,
  openFileInNewTab,
  loadFileAsBlob,
  revokeBlobUrl
} = useFileDisplay();
```

### Fonctions disponibles

#### `getFileDisplayUrl(fileId: string | number): string`
Génère l'URL complète pour afficher un fichier. Cette URL peut être utilisée directement dans les balises `<img>`, `<iframe>`, etc.

```typescript
const imageUrl = getFileDisplayUrl(123);
// Retourne: "https://api.example.com/files/display/123"
```

#### `getFileType(filename: string): string`
Détermine le type de fichier basé sur son extension.

```typescript
const type = getFileType('document.pdf'); // Retourne: 'pdf'
const type = getFileType('photo.jpg');    // Retourne: 'image'
```

Types supportés : `image`, `pdf`, `video`, `audio`, `document`, `unknown`

#### `getFileIcon(filename: string): string`
Retourne l'icône Heroicons appropriée pour le type de fichier.

```typescript
const icon = getFileIcon('document.pdf');
// Retourne: 'i-heroicons-document-text'
```

#### `downloadFile(fileId: string | number, filename?: string): Promise<void>`
Télécharge un fichier sur l'ordinateur de l'utilisateur.

```typescript
await downloadFile(123, 'mon-fichier.pdf');
```

#### `openFileInNewTab(fileId: string | number): void`
Ouvre le fichier dans un nouvel onglet.

```typescript
openFileInNewTab(123);
```

#### `loadFileAsBlob(fileId: string | number): Promise<string>`
Charge un fichier en streaming et retourne une URL blob (utile pour des cas spécifiques).

```typescript
const blobUrl = await loadFileAsBlob(123);
// Retourne: "blob:https://example.com/abc-123-def"

// N'oubliez pas de nettoyer après usage
revokeBlobUrl(blobUrl);
```

## Composants Vue

### StreamedImage

Composant pour afficher des images en streaming avec loader et gestion d'erreur.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fileId` | `string \| number` | *requis* | ID du fichier à afficher |
| `alt` | `string` | `'Image'` | Texte alternatif |
| `class` | `string` | `''` | Classes CSS |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Mode de chargement |

#### Utilisation

```vue
<template>
  <!-- Image simple -->
  <StreamedImage
    :file-id="123"
    alt="Photo de profil"
    class="w-full h-64 object-cover rounded-lg"
  />

  <!-- Image avec chargement immédiat -->
  <StreamedImage
    :file-id="project.coverImageId"
    :alt="project.title"
    loading="eager"
    class="w-full h-96"
  />
</template>
```

#### Fonctionnalités

- ✅ Skeleton loader pendant le chargement
- ✅ Gestion des erreurs avec fallback
- ✅ Support du lazy loading
- ✅ Rechargement automatique si `fileId` change

### StreamedPDF

Composant pour afficher des PDF en streaming dans un iframe.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fileId` | `string \| number` | *requis* | ID du fichier PDF |
| `title` | `string` | `'Document PDF'` | Titre du document |
| `class` | `string` | `''` | Classes CSS |
| `height` | `string` | `'600px'` | Hauteur de l'iframe |

#### Utilisation

```vue
<template>
  <!-- PDF simple -->
  <StreamedPDF
    :file-id="456"
    title="Rapport annuel 2024"
  />

  <!-- PDF avec hauteur personnalisée -->
  <StreamedPDF
    :file-id="document.id"
    :title="document.name"
    height="80vh"
    class="rounded-lg shadow-lg"
  />
</template>
```

#### Fonctionnalités

- ✅ Skeleton loader pendant le chargement
- ✅ Gestion des erreurs avec bouton de réessai
- ✅ Hauteur personnalisable
- ✅ Rechargement automatique si `fileId` change

## Exemples d'utilisation complète

### Galerie d'images

```vue
<script setup>
import { useFileDisplay } from '~/composables/useFileDisplay';

const { getFileType } = useFileDisplay();
const files = ref([
  { id: 1, name: 'photo1.jpg' },
  { id: 2, name: 'photo2.png' },
  { id: 3, name: 'document.pdf' },
]);
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <div v-for="file in files" :key="file.id">
      <StreamedImage
        v-if="getFileType(file.name) === 'image'"
        :file-id="file.id"
        :alt="file.name"
        class="w-full aspect-square object-cover rounded-lg"
      />

      <div v-else class="aspect-square flex items-center justify-center bg-gray-100 rounded-lg">
        <UIcon name="i-heroicons-document" class="w-12 h-12 text-gray-400" />
      </div>
    </div>
  </div>
</template>
```

### Visualiseur de fichiers avec modal

```vue
<script setup>
import { ref } from 'vue';
import { useFileDisplay } from '~/composables/useFileDisplay';

const { getFileType, downloadFile } = useFileDisplay();
const showModal = ref(false);
const currentFile = ref(null);

const viewFile = (file) => {
  currentFile.value = file;
  showModal.value = true;
};
</script>

<template>
  <!-- Liste de fichiers -->
  <div class="space-y-2">
    <div
      v-for="file in files"
      :key="file.id"
      class="flex items-center justify-between p-3 border rounded"
    >
      <span>{{ file.name }}</span>
      <div class="flex gap-2">
        <UButton @click="viewFile(file)" size="sm">Voir</UButton>
        <UButton @click="downloadFile(file.id, file.name)" size="sm">Télécharger</UButton>
      </div>
    </div>
  </div>

  <!-- Modal de prévisualisation -->
  <UModal v-model="showModal" :ui="{ width: 'max-w-5xl' }">
    <UCard>
      <template #header>
        <h3>{{ currentFile?.name }}</h3>
      </template>

      <!-- Image -->
      <StreamedImage
        v-if="getFileType(currentFile?.name) === 'image'"
        :file-id="currentFile.id"
        :alt="currentFile.name"
        class="w-full"
      />

      <!-- PDF -->
      <StreamedPDF
        v-else-if="getFileType(currentFile?.name) === 'pdf'"
        :file-id="currentFile.id"
        height="70vh"
      />

      <template #footer>
        <UButton @click="showModal = false">Fermer</UButton>
      </template>
    </UCard>
  </UModal>
</template>
```

## Bonnes pratiques

### 1. Utilisez les composants plutôt que les URLs directes

❌ **Évitez :**
```vue
<img :src="getFileDisplayUrl(fileId)" alt="Image" />
```

✅ **Préférez :**
```vue
<StreamedImage :file-id="fileId" alt="Image" />
```

### 2. Gérez le lazy loading

Pour les images en haut de page :
```vue
<StreamedImage :file-id="heroImageId" loading="eager" />
```

Pour les images en bas de page :
```vue
<StreamedImage :file-id="thumbnailId" loading="lazy" />
```

### 3. Nettoyez les blob URLs si vous les utilisez

```vue
<script setup>
import { onUnmounted } from 'vue';
import { useFileDisplay } from '~/composables/useFileDisplay';

const { loadFileAsBlob, revokeBlobUrl } = useFileDisplay();
const blobUrl = ref('');

onMounted(async () => {
  blobUrl.value = await loadFileAsBlob(fileId);
});

onUnmounted(() => {
  revokeBlobUrl(blobUrl.value);
});
</script>
```

## Dépannage

### L'image ne s'affiche pas
1. Vérifiez que l'endpoint `/files/display/{id}` est accessible
2. Vérifiez les headers CORS si nécessaire
3. Consultez la console pour les erreurs réseau

### Le PDF ne se charge pas dans l'iframe
1. Vérifiez que le serveur envoie le bon Content-Type (`application/pdf`)
2. Certains navigateurs bloquent les PDF dans les iframes (vérifiez les paramètres)
3. Utilisez le bouton "Ouvrir dans un nouvel onglet" comme alternative

### Problèmes de performance
1. Utilisez `loading="lazy"` pour les images hors viewport
2. Optimisez les images côté serveur
3. Implémentez un système de cache si nécessaire
