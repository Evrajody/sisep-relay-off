<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUpdateProject } from '~/composables/project/useUpdateProject';
import useProjectDetail from '~/composables/project/useProjectDetail';

definePageMeta({
  layout: "sisep-app-layout",
});

const route = useRoute();
const projectId = route.params.id as string;

const links = [{
  label: 'Modification du projet',
  icon: 'i-heroicons-pencil-square'
}];

useHead({
  title: 'Modification du projet',
});

// Récupération du projet
const { project, fetchProject, isLoading: isLoadingProject } = useProjectDetail();

// Composable de mise à jour - reçoit la référence du projet
const { updateProjectFormEl, updateProjectForm } = useUpdateProject(project);

// Chargement du projet
const loadProject = async () => {
  try {
    // Récupération du projet depuis l'API
    await fetchProject(projectId);

    if (!project.value) {
      throw new Error('Projet introuvable');
    }

    console.log('Projet chargé:', project.value);

    // Le formulaire se met à jour automatiquement grâce au computed et au default
    await nextTick();

  } catch (error) {
    console.error('Erreur lors du chargement du projet:', error);
    makeAlert({
      type: 'error',
      title: 'Erreur',
      message: 'Impossible de charger le projet pour modification',
    });
    navigateTo('/project-module');
  }
};

onMounted(() => {
  loadProject();
});
</script>

<template>
  <div>
    <UDashboardToolbar
      :ui="{ wrapper: 'bg-white dark:bg-gray-900' }"
      class="py-0 px-1.5 overflow-x-auto"
    >
      <UHorizontalNavigation :links="links"/>
      <template #right>
        <UButton
          :to="`/admin/project-module/${projectId}`"
          color="gray"
          icon="i-heroicons-arrow-left"
          label="Retour"
          size="sm"
        />
      </template>
    </UDashboardToolbar>

    <div class="max-w-7xl w-full py-5 mx-auto">
      <UDashboardCard
        v-loading="isLoadingProject || updateProjectFormEl?.submitting"
        element-loading-text="Chargement..."
        element-loading-svg-view-box="-10, -10, 50, 50"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        :ui="{
          wrapper: 'border-b border-gray-100',
          header: {
            wrapper: 'border-b border-gray-100',
            padding: '!px-4 py-3',
            background: 'bg-primary-50'
          }
        }"
      >
        <template #title>
          Modification du projet : {{ project?.title || 'Chargement...' }}
        </template>

        <template #description>
          Modifiez les informations du projet ci-dessous
        </template>


        <div v-if="!isLoadingProject && project">
          <Vueform
            v-bind="updateProjectForm"
            ref="updateProjectFormEl"
          />
        </div>

        <div v-else class="py-12 text-center">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p class="text-gray-600 dark:text-gray-400">
            {{ isLoadingProject ? 'Chargement du projet...' : 'Préparation du formulaire...' }}
          </p>
        </div>

        <template #footer>
          <div class="flex gap-2">
            <UButton
              class="rounded-md"
              color="gray"
              icon="i-heroicons-x-circle-solid"
              label="Annuler"
              size="lg"
              :disabled="updateProjectFormEl?.submitting || isLoadingProject"
              @click="navigateTo(`/admin/project-module/${projectId}`)"
            />
            <UButton
              class="rounded-md shadow bg-primary font-medium"
              icon="i-heroicons-check-solid"
              label="Enregistrer les modifications"
              size="lg"
              :disabled="updateProjectFormEl?.submitting || isLoadingProject || !project"
              :loading="updateProjectFormEl?.submitting"
              @click.prevent="updateProjectFormEl?.submit()"
            />
          </div>
        </template>
      </UDashboardCard>
    </div>
  </div>
</template>

<style scoped>
</style>
