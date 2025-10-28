<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useProjects } from "~/composables/project/useProjects";
import { useProjectDelete } from "~/composables/project/useProjectDelete";
import type { Project } from '~/types';
import {canCreateProject, canModifyProject, canDeleteProject} from "#shared/utils/abilities";



definePageMeta({
  layout: "sisep-app-layout",
  middleware: ["auth"],
});

const links = [
  {
    label: "Liste des projets",
    icon: "i-heroicons-document-chart-bar",
  },
];

// Configuration du tableau
const selected = ref<Project[]>([]);
const sort = ref({ column: 'createdAt', direction: 'desc' as const });

useHead({
  title: "Liste des projets",
});

// Chargement de la liste des projets
const {
  projectList,
  refreshProjectList,
  projectListStatus,
  columns,
  search,
  pagination,
  selectedStatus
} = useProjects();

// Gestion de la suppression
const { deleteProject, isDeleting } = useProjectDelete();

// État pour les actions autorisées par ligne
const authorizedActionsMap = ref<Record<string, any[]>>({});

// Options de statut pour le filtre
const statuses = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'SUBMITTED', label: 'Soumis' },
  { value: 'VALIDATED', label: 'Validé' },
  { value: 'VALIDATED_BY_STRUCTURE', label: 'Validé par la structure' },
  { value: 'REJECTED', label: 'Rejeté' },
  { value: 'REJECTED_BY_STRUCTURE', label: 'Rejeté par la structure' },
  { value: 'PUBLISHED', label: 'Publié' },
  { value: 'UNPUBLISHED', label: 'Non publié' },
];

// Fonction de suppression d'un projet
const handleDeleteProject = async (row: Project) => {
  const success = await deleteProject(row.id, row.title);
  if (success) {
    await refreshProjectList();
  }
};

// Actions disponibles pour chaque projet
const getActions = (row: Project) => [
  {
    label: 'Voir les détails',
    icon: 'i-heroicons-eye',
    click: () => navigateTo(`/admin/project-module/${row.id}`),
    isAuthorized: true,
  },
  {
    label: 'Modifier',
    icon: 'i-heroicons-pencil-square',
    click: () => navigateTo(`/admin/project-module/edit-project/${row.id}`),
    isAuthorized: () =>  allows(canModifyProject, row),
  },
  {
    label: 'Supprimer',
    icon: 'i-heroicons-trash',
    click: () => handleDeleteProject(row),
    isAuthorized: async () => await allows(canDeleteProject, row),
  }
];

// Charger les actions autorisées pour chaque projet
const loadAuthorizedActions = async () => {
  const newMap: Record<string, any[]> = {};

  for (const project of projectList.value?.data || []) {
    const actions = getActions(project);
    const authorizedActions: any[] = [];

    for (const action of actions) {
      if (typeof action.isAuthorized === 'function') {
        // Gérer les fonctions asynchrones et synchrones
        const isAuth = await Promise.resolve(action.isAuthorized());
        if (isAuth) {
          authorizedActions.push(action);
        }
      } else if (action.isAuthorized) {
        // Booléens statiques
        authorizedActions.push(action);
      }
    }

    newMap[project.id] = authorizedActions;
  }

  authorizedActionsMap.value = newMap;
};

// Watcher pour recharger les actions quand la liste des projets change
watchEffect(() => {
  if (projectList.value?.data) {
    loadAuthorizedActions();
  }
});

// Fonction utilitaire pour obtenir les actions d'une ligne
const getAuthorizedActions = (row: Project) => {
  return authorizedActionsMap.value[row.id] || [];
};

// Configuration des badges de statut
const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { color: string, label: string }> = {
    'DRAFT': { color: 'gray', label: 'Brouillon' },
    'SUBMITTED': { color: 'blue', label: 'Soumis' },
    'VALIDATED': { color: 'green', label: 'Validé' },
    'VALIDATED_BY_STRUCTURE': { color: 'emerald', label: 'Validé par la structure' },
    'REJECTED': { color: 'red', label: 'Rejeté' },
    'REJECTED_BY_STRUCTURE': { color: 'orange', label: 'Rejeté par la structure' },
    'PUBLISHED': { color: 'green', label: 'Publié' },
    'UNPUBLISHED': { color: 'gray', label: 'Non publié' },
    'PENDING': { color: 'yellow', label: 'En attente' },
  };
  return statusMap[status] || { color: 'gray', label: 'Inconnu' };
};

// Gestion du changement de page
const onPageChange = (newPage: number) => {
  pagination.page.value = newPage;
};

// Gestion du tri
const onSort = (e: { column: string; direction: 'asc' | 'desc' }) => {
  sort.value = e;
  refreshProjectList();
};

// Formatage de la date
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Calcul de la progression du projet
const getProjectProgress = (project: Project) => {
  if (!project.startDate || !project.endDate) return 0;
  
  const start = new Date(project.startDate).getTime();
  const end = new Date(project.endDate).getTime();
  const now = new Date().getTime();
  
  if (now >= end) return 100;
  if (now <= start) return 0;
  
  return Math.round(((now - start) / (end - start)) * 100);
};

// Formatage du temps restant avant la fin du projet
const getTimeRemaining = (endDate: string) => {
  if (!endDate) return 'Date de fin non définie';
  
  const end = new Date(endDate);
  const now = new Date();
  
  if (now > end) return 'Terminé';
  
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Se termine aujourd\'hui';
  if (diffDays === 1) return 'Se termine demain';
  if (diffDays < 30) return `Se termine dans ${diffDays} jours`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return 'Se termine dans 1 mois';
  if (diffMonths < 12) return `Se termine dans ${diffMonths} mois`;
  
  const diffYears = Math.floor(diffMonths / 12);
  return `Se termine dans ${diffYears} an${diffYears > 1 ? 's' : ''}`;
};

// Calcul du nombre de jours restants
const getDaysRemaining = (endDate: string) => {
  if (!endDate) return 0;
  
  const end = new Date(endDate);
  const now = new Date();
  
  if (now > end) return 0;
  
  const diffTime = end.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
</script>

<template>

  <UDashboardToolbar
    :ui="{ wrapper: 'bg-white dark:bg-gray-900' }"
    class="py-0 px-1.5 overflow-x-auto"
  >
    <UHorizontalNavigation :links="links" />
    <template #right>
      <UButton
        to="/admin/project-module/create-project"
        color="primary"
        icon="i-heroicons-plus"
        label="Nouveau projet"
        size="sm"
      />
    </template>
  </UDashboardToolbar>

  <div class="max-w-[95vw] w-full py-5 mx-auto px-4">

    <UDashboardCard
      :ui="{
        divide: 'divide-x divide-gray-200 dark:divide-gray-700',
        title: 'text-gray-900 dark:text-white font-semibold text-lg',
        description: 'text-sm text-gray-600 dark:text-gray-400 mt-1',
        wrapper: ' !border-none  border-gray-200 dark:border-gray-800 rounded-none shadow-md',
        header: {
          wrapper: 'bg-primary-50 dark:bg-primary-900/20 border-none',
          padding: '!px-2 py-2',
        },
        body: {
          padding: '!p-0 !border-none',
        },
      }"
    >
      <template #title>
        Liste des projets
      </template>

      <template #description>
        <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> projet(s) au total
      </template>

      <!-- En-tête avec filtres -->
      <template #header>
        <div class="flex  w-full flex-col gap-4">
          <!-- Filtres -->
          <div class="flex flex-col lg:flex-row gap-4">
            <UInput
              v-model="search"
              icon="i-heroicons-magnifying-glass"
              placeholder="Rechercher par titre, type ou description..."
              class="flex-1"
              size="lg"
              :ui="{
                icon: { trailing: { pointer: '' } },
                size: { lg: 'text-base' }
              }"
              @keyup.enter="refreshProjectList"
            >
              <template #trailing>
                <UButton
                  v-if="search"
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  size="xs"
                  @click="search = ''; refreshProjectList()"
                />
              </template>
            </UInput>

            <USelectMenu
              v-model="selectedStatus"
              :options="statuses"
              option-attribute="label"
              placeholder="Tous les statuts"
              size="lg"
              class="w-full lg:w-72"
              :ui="{
                size: { lg: 'text-base' }
              }"
              @update:modelValue="refreshProjectList"
            >
              <template #leading>
                <UIcon name="i-heroicons-funnel" class="h-5 w-5" />
              </template>
            </USelectMenu>

            <Can :ability="canCreateProject">
              <UButton
                to="/admin/project-module/create-project"
                color="primary"
                icon="i-heroicons-plus"
                label="Nouveau projet"
                size="lg"
                class="w-full lg:w-auto"
              />
            </Can>

          </div>
        </div>
      </template>

      <!-- Contenu principal du tableau -->
      <div class="overflow-x-auto">
        <UTable
          :columns="[
            { key: 'title', label: 'Projet', sortable: true },
            { key: 'type.name', label: 'Type', sortable: true },
            { key: 'status', label: 'Statut', sortable: true },
            { key: 'dates', label: 'Période', sortable: true },
            { key: 'progress', label: 'Progression' },
            { key: 'actions', label: 'Actions' }
          ]"
          :rows="projectList?.data || []"
          :loading="projectListStatus === 'pending'"
          :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
          :empty-state="{
            icon: 'i-heroicons-document-magnifying-glass',
            label: 'Aucun projet trouvé',
            description: 'Essayez de modifier vos critères de recherche',
          }"
          class="w-full"
          :ui="{
            td: { base: 'whitespace-normal' },
            th: { base: 'whitespace-nowrap' }
          }"
          v-model:sort="sort"
          @update:sort="onSort"
        >
          <!-- Colonne Titre avec image -->
          <template #title-data="{ row }">
            <div class="flex gap-3 w-[750px]">
              <UAvatar
                :src="row.coverImage?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.title || '')}&background=3b82f6&color=fff`"
                :alt="row.title"
                size="md"
                class="flex-shrink-0"
                :ui="{ size: { 'md': 'h-10 w-10 text-sm' } }"
              />
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white break-words">
                  {{ row.title || 'Sans titre' }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 break-words">
                  {{ row.type?.name || 'Sans catégorie' }}
                </p>
                <div v-if="row.structure" class="flex items-center gap-1 mt-1">
                  <UIcon name="i-heroicons-building-office-2" class="w-3 h-3 text-blue-500" />
                  <p class="text-xs text-blue-600 dark:text-blue-400 break-words">
                    {{ row.structure.name }}
                  </p>
                </div>
              </div>
            </div>
          </template>

          <!-- Colonne Statut -->
          <template #status-data="{ row }">
            <UBadge
              :color="getStatusBadge(row.status).color"
              variant="subtle"
              size="sm"
              class="capitalize"
              :ui="{
                color: {
                  gray: 'dark:bg-gray-800/50 dark:text-gray-300',
                  blue: 'dark:bg-blue-900/50 dark:text-blue-300',
                  yellow: 'dark:bg-yellow-900/50 dark:text-yellow-300',
                  green: 'dark:bg-green-900/50 dark:text-green-300',
                  emerald: 'dark:bg-emerald-900/50 dark:text-emerald-300',
                  orange: 'dark:bg-orange-900/50 dark:text-orange-300',
                  red: 'dark:bg-red-900/50 dark:text-red-300'
                }
              }"
            >
              {{ getStatusBadge(row.status).label }}
            </UBadge>
          </template>

          <!-- Colonne Période -->
          <template #dates-data="{ row }">
            <div class="flex flex-col gap-1">
              <div class="text-sm text-gray-900 dark:text-white font-medium">
                {{ formatDate(row.startDate) }} - {{ formatDate(row.endDate) }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ getTimeRemaining(row.endDate) }}
              </div>
            </div>
          </template>

          <!-- Colonne Progression -->
          <template #progress-data="{ row }">
            <div class="flex flex-col gap-1 min-w-[150px]">
              <UProgress 
                :value="getProjectProgress(row)" 
                size="sm" 
                color="blue"
                :show-animation="true"
                class="w-full"
              />
              <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{{ getProjectProgress(row) }}%</span>
                <span>{{ getDaysRemaining(row.endDate) }} jours restants</span>
              </div>
            </div>
          </template>

          <!-- Colonne Actions -->
          <template #actions-data="{ row }">
            <UDropdown :items="[getAuthorizedActions(row)]" :popper="{ placement: 'bottom-start' }">
              <UButton 
                color="gray" 
                variant="ghost" 
                icon="i-heroicons-ellipsis-vertical"
                :loading="projectListStatus === 'pending'"
              />
              <template #item="{ item: actionItem }">
                <div  class="flex items-center gap-2" @click="actionItem.click">
                  <UIcon :name="actionItem.icon" class="h-4 w-4" />
                  <span>{{ actionItem.label }}</span>
                </div>
              </template>
            </UDropdown>
          </template>
        </UTable>
      </div>

      <!-- Pied de tableau avec pagination -->
      <template #footer>
        <div class="flex flex-col sm:flex-row items-center justify-between border-gray-200 dark:border-gray-700">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            Affichage de <span class="font-medium">{{ pagination.pageFrom }}</span> à
            <span class="font-medium">{{ pagination.pageTo }}</span> sur
            <span class="font-medium">{{ pagination.totalItems }}</span> projets
          </div>

          <UPagination
            v-model="pagination.page.value"
            :page-count="pagination.pageCount.value"
            :total="pagination.totalItems.value"
            :ui="{
              wrapper: 'flex items-center gap-1',
              rounded: '!rounded-full min-w-[32px] justify-center',
              default: {
                activeButton: {
                  variant: 'outline'
                }
              }
            }"
            @update:modelValue="onPageChange"
          />
        </div>
      </template>

    </UDashboardCard>
  </div>
</template>

<style scoped></style>
