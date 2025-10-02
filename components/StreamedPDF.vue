<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useFileDisplay } from '~/composables/useFileDisplay';

interface Props {
  fileId: string | number;
  title?: string;
  class?: string;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Document PDF',
  class: '',
  height: '600px',
});

const { getFileDisplayUrl } = useFileDisplay();
const pdfUrl = ref<string>('');
const isLoading = ref(true);
const hasError = ref(false);

// Générer l'URL du PDF
const loadPDF = () => {
  if (!props.fileId) {
    hasError.value = true;
    isLoading.value = false;
    return;
  }

  pdfUrl.value = getFileDisplayUrl(props.fileId);
  isLoading.value = false;
};

const handleLoad = () => {
  isLoading.value = false;
  hasError.value = false;
};

const handleError = () => {
  isLoading.value = false;
  hasError.value = true;
  console.error(`Erreur lors du chargement du PDF: ${props.fileId}`);
};

onMounted(() => {
  loadPDF();
});

// Recharger si fileId change
watch(() => props.fileId, () => {
  isLoading.value = true;
  hasError.value = false;
  loadPDF();
});
</script>

<template>
  <div class="relative" :class="props.class">
    <!-- Skeleton loader -->
    <div
      v-if="isLoading"
      :style="{ height: props.height }"
      class="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
    >
      <div class="text-center">
        <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-gray-400 mx-auto mb-2" />
        <p class="text-sm text-gray-500">Chargement du PDF...</p>
      </div>
    </div>

    <!-- PDF iframe -->
    <iframe
      v-show="!isLoading && !hasError"
      :src="pdfUrl"
      :title="props.title"
      :style="{ height: props.height }"
      class="w-full border-0 rounded-lg"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Fallback en cas d'erreur -->
    <div
      v-if="hasError"
      :style="{ height: props.height }"
      class="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
    >
      <div class="text-center p-6">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-500 mx-auto mb-3" />
        <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Impossible de charger le PDF
        </p>
        <p class="text-xs text-gray-500 mb-4">
          Le document n'a pas pu être affiché
        </p>
        <UButton
          icon="i-heroicons-arrow-path"
          size="sm"
          @click="loadPDF"
        >
          Réessayer
        </UButton>
      </div>
    </div>
  </div>
</template>
