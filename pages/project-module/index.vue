<script lang="ts" setup>
import { useProjects } from "~/composables/project/useProjects";
import type { Project } from '~/types';

const router = useRouter();

definePageMeta({
  layout: "sisep-app-layout",
});

const links = [
  {
    label: "Liste des projets",
    icon: "i-heroicons-document-chart-bar",
  },
];

// Configuration du tableau
const page = ref(1);
const pageCount = ref(10);
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

// Options de statut pour le filtre
const statuses = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'PUBLISHED', label: 'Publié' },
  { value: 'REJECTED', label: 'Rejeté' },
];

// Actions disponibles pour chaque projet
const getActions = (row: Project) => [
  {
    label: 'Voir les détails',
    icon: 'i-heroicons-eye',
    click: () => navigateTo(`/project-module/${row.id}`)
  },
  {
    label: 'Modifier',
    icon: 'i-heroicons-pencil-square',
    click: () => navigateTo(`/project-module/${row.id}/edit`)
  },
  {
    label: 'Supprimer',
    icon: 'i-heroicons-trash',
    click: async () => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
        // Implémentez la logique de suppression ici
        await refreshProjectList();
      }
    }
  }
];

// Configuration des badges de statut
const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { color: string, label: string }> = {
    'DRAFT': { color: 'gray', label: 'Brouillon' },
    'PENDING': { color: 'yellow', label: 'En attente' },
    'PUBLISHED': { color: 'green', label: 'Publié' },
    'REJECTED': { color: 'red', label: 'Rejeté' },
  };
  return statusMap[status] || { color: 'gray', label: 'Inconnu' };
};

// Gestion du changement de page
const onPageChange = (newPage: number) => {
  page.value = newPage;
  refreshProjectList();
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
        to="/project-module/create-project"
        color="primary"
        icon="i-heroicons-plus"
        label="Nouveau projet"
        size="sm"
      />
    </template>
  </UDashboardToolbar>

  <div class="max-w-[95vw] w-full py-5 mx-auto px-4">


<!--  <pre>-->
<!--    {{ projectList }}-->
<!--  </pre>-->

    <UDashboardCard
      :ui="{
        divide: 'divide-x divide-gray-200 dark:divide-gray-700',
        title: 'text-gray-900 dark:text-white font-semibold',
        wrapper: 'border border-gray-200 dark:border-gray-800 rounded-lg',
        header: {
          wrapper: 'border-b border-gray-200 dark:border-gray-800',
        },
      }"
    >
      <!-- En-tête avec titre et filtres -->
      <template #header>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 gap-4">
          <div>
            <h3 class="text-lg font-semibold">Liste des projets</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ pagination.totalItems }} projet(s) au total
            </p>
          </div>
          <div class="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto">
            <USelectMenu 
              v-model="selectedStatus"
              :options="statuses" 
              option-attribute="label"
              placeholder="Filtrer par statut"
              class="w-full sm:w-48"
              size="sm"
              @update:modelValue="refreshProjectList"
            />
            <UInput 
              v-model="search" 
              icon="i-heroicons-magnifying-glass"
              placeholder="Rechercher un projet..." 
              class="w-full sm:w-64"
              size="sm"
              @keyup.enter="refreshProjectList"
            />
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
            td: { base: 'whitespace-nowrap' },
            th: { base: 'whitespace-nowrap' }
          }"
          v-model:sort="sort"
          @update:sort="onSort"
        >
          <!-- Colonne Titre avec image -->
          <template #title-data="{ row }">
            <div class="flex items-center gap-3 min-w-[200px]">
              <UAvatar
                :src="row.coverImage?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.title || '')}&background=3b82f6&color=fff`"
                :alt="row.title"
                size="md"
                class="flex-shrink-0"
                :ui="{ size: { 'md': 'h-10 w-10 text-sm' } }"
              />
              <div class="min-w-0">
                <p class="font-medium text-gray-900 dark:text-white truncate">
                  {{ row.title || 'Sans titre' }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ row.type?.name || 'Sans catégorie' }}
                </p>
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
                  yellow: 'dark:bg-yellow-900/50 dark:text-yellow-300',
                  green: 'dark:bg-green-900/50 dark:text-green-300',
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
            <UDropdown :items="[getActions(row)]" :popper="{ placement: 'bottom-start' }">
              <UButton 
                color="gray" 
                variant="ghost" 
                icon="i-heroicons-ellipsis-vertical"
                :loading="projectListStatus === 'pending'"
              />
              
              <template #item="{ item: actionItem }">
                <div class="flex items-center gap-2" @click="actionItem.click">
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
        <div class="flex flex-col sm:flex-row items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            Affichage de <span class="font-medium">{{ pagination.pageFrom }}</span> à 
            <span class="font-medium">{{ pagination.pageTo }}</span> sur
            <span class="font-medium">{{ pagination.totalItems }}</span> projets
          </div>
          
          <UPagination
            v-model="page"
            :page-count="pageCount"
            :total="projectList?.data?.length"
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
