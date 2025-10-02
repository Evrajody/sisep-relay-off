<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useFileDisplay } from '~/composables/useFileDisplay';

interface Props {
  fileId: string | number;
  alt?: string;
  class?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Image',
  class: '',
  fallback: '',
  loading: 'lazy',
});

const { getFileDisplayUrl } = useFileDisplay();
const imageUrl = ref<string>('');
const isLoading = ref(true);
const hasError = ref(false);

// Générer l'URL de l'image
const loadImage = () => {
  if (!props.fileId) {
    hasError.value = true;
    isLoading.value = false;
    return;
  }

  imageUrl.value = getFileDisplayUrl(props.fileId);
};

const handleLoad = () => {
  isLoading.value = false;
  hasError.value = false;
};

const handleError = () => {
  isLoading.value = false;
  hasError.value = true;
  console.error(`Erreur lors du chargement de l'image: ${props.fileId}`);
};

onMounted(() => {
  loadImage();
});

// Recharger si fileId change
watch(() => props.fileId, () => {
  isLoading.value = true;
  hasError.value = false;
  loadImage();
});
</script>

<template>
  <div class="relative">

    <!-- Skeleton loader -->
    <div
      v-if="isLoading"
      :class="[props.class, 'animate-pulse bg-gray-200 dark:bg-gray-700']"
    >
      <div class="flex items-center justify-center h-full">
        <UIcon name="i-heroicons-photo" class="w-12 h-12 text-gray-400" />
      </div>
    </div>

    <!-- Image -->
    <img
      v-show="!isLoading && !hasError"
      :src="imageUrl"
      :alt="alt"
      :class="props.class"
      :loading="loading"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Fallback en cas d'erreur -->
    <div
      v-if="hasError"
      :class="[props.class, 'flex items-center justify-center bg-gray-100 dark:bg-gray-800']"
    >
      <div class="text-center p-4">
        <UIcon name="i-heroicons-photo" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-sm text-gray-500">Image non disponible

        </p>
      </div>
    </div>
  </div>


</template>
