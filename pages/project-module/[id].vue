<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Project } from '~/types';
type ProjectStatus = Project['status'];

// Import du composable
import useProjectDetail from '~/composables/project/useProjectDetail';

// Initialisation des utilitaires de routage
const route = useRoute();
const router = useRouter();
const projectId = route.params.id as string;

// Utilisation du composable
const {
  project,
  isLoading,
  error,
  fetchProject,
  updateProjectStatus,
  formatDate,
  getProjectProgress,
  getStatusBadge,
  getDaysRemaining
} = useProjectDetail();

// État local
const activeTab = ref('overview');
const projectStatus = computed<ProjectStatus>(() => project.value?.status || 'DRAFT');

// Formater les montants en devise
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Gestion des erreurs
const errorMessage = computed(() => {
  if (error.value) return error.value;
  if (!project.value) return 'Projet non trouvé';
  return null;
});

// Données de démonstration (à supprimer une fois l'API implémentée)
const demoProject: Project = {
  id: projectId,
  title: "Projet de développement durable",
  description: "Description détaillée du projet",
  type: {
    id: "type1",
    name: "Eau potable",
    description: "Projets liés à l'accès à l'eau potable"
  },
  status: "PENDING",
  createdBy: "Augustin Bonou",
  createdAt: "2025-09-26T02:57:54.211Z",
  updatedAt: "2025-09-26T02:57:54.211Z",
  coverImage: {
    url: "/images/project-cover.jpg",
    alt: "Image de couverture du projet"
  },
  startDate: "2025-01-01T00:00:00.000Z",
  endDate: "2025-12-31T00:00:00.000Z",
  objective: {
    goal: "Améliorer l'accès à l'eau potable"
  },
  expectedResults: {
    result: "1000 personnes avec accès à l'eau"
  },
  totalBudget: 1500000,
  location: {
    region: "Atlantique",
    city: "Calavi",
    coordinates: [2.4604, 6.363]
  },
  indicators: [
    {
      id: "ind-1",
      name: "Nombre de bénéficiaires",
      value: "500",
      target: "1000",
      unit: "personnes"
    }
  ],
  finances: [
    {
      id: "f1",
      fundingSource: "Banque mondiale",
      amountCommitedCfa: 100000000,
      amountDisbursedCfa: 50000000,
      currency: "FCFA"
    }
  ],
  files: [
    {
      id: "file-1",
      name: "Rapport de projet",
      type: "pdf",
      size: "1.2 MB",
      uploadedAt: "2025-09-26T02:57:54.211Z"
    }
  ]
};

// Mettre à jour le statut du projet
const updateStatus = async (status: ProjectStatus) => {
  if (!project.value) return;

  const success = await updateProjectStatus(project.value.id, status);
  if (success) {
    // Rafraîchir les données
    await fetchProject(projectId);
  }
};

// Charger les données du projet au montage du composant
onMounted(async () => {
  // En développement, utiliser les données de démonstration
  if (process.env.NODE_ENV === 'development') {
    project.value = demoProject;
    isLoading.value = false;
  } else {
    await fetchProject(projectId);
  }
});

// Recharger les données lorsque l'ID du projet change
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await fetchProject(newId as string);
  }
});

// Actions du projet
const projectActions = [
  {
    label: 'Modifier',
    icon: 'i-heroicons-pencil-square',
    click: () => navigateTo(`/project-module/${projectId}/edit`)
  },
  {
    label: 'Supprimer',
    icon: 'i-heroicons-trash',
    click: async () => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
        // Implémentez la logique de suppression ici
        await router.push('/project-module');
      }
    }
  },
  {
    label: 'Publier',
    icon: 'i-heroicons-arrow-up-tray',
    click: () => updateStatus('PUBLISHED'),
    disabled: computed(() => projectStatus.value === 'PUBLISHED')
  },
  {
    label: 'Rejeter',
    icon: 'i-heroicons-x-circle',
    click: () => updateStatus('REJECTED'),
    disabled: computed(() => projectStatus.value === 'REJECTED')
  },
  {
    label: 'Exporter en PDF',
    icon: 'i-heroicons-document-arrow-down',
    click: () => {
      // Logique d'export PDF
      alert('Export PDF en cours de développement');
    }
  }
];

// Onglets de navigation
const tabs = [
  { id: 'overview', label: 'Aperçu', icon: 'i-heroicons-home' },
  { id: 'indicators', label: 'Indicateurs', icon: 'i-heroicons-chart-bar' },
  { id: 'finances', label: 'Finances', icon: 'i-heroicons-currency-dollar' },
  { id: 'documents', label: 'Documents', icon: 'i-heroicons-document' },
  { id: 'activity', label: 'Activité', icon: 'i-heroicons-clock' },
  { id: 'settings', label: 'Paramètres', icon: 'i-heroicons-cog-6-tooth' }
];

// Fonction pour obtenir le badge de statut
const getStatusBadges = (status: ProjectStatus) => {
  const statusMap: Record<ProjectStatus, { color: string, label: string }> = {
    'DRAFT': { color: 'gray', label: 'Brouillon' },
    'PENDING': { color: 'yellow', label: 'En attente' },
    'PUBLISHED': { color: 'green', label: 'Publié' },
    'REJECTED': { color: 'red', label: 'Rejeté' },
  };
  return statusMap[status] || { color: 'gray', label: 'Inconnu' };
};

// Fonction pour obtenir l'icône d'un type de fichier
const getFileIcon = (fileType: string) => {
  const iconMap: Record<string, string> = {
    'pdf': 'i-heroicons-document-text',
    'doc': 'i-heroicons-document',
    'docx': 'i-heroicons-document',
    'xls': 'i-heroicons-table-cells',
    'xlsx': 'i-heroicons-table-cells',
    'ppt': 'i-heroicons-presentation-chart-bar',
    'pptx': 'i-heroicons-presentation-chart-bar',
    'jpg': 'i-heroicons-photo',
    'jpeg': 'i-heroicons-photo',
    'png': 'i-heroicons-photo',
    'gif': 'i-heroicons-photo',
    'zip': 'i-heroicons-archive-box',
    'rar': 'i-heroicons-archive-box',
    'txt': 'i-heroicons-document-text',
    'csv': 'i-heroicons-document-chart-bar',
  };

  return iconMap[fileType.toLowerCase()] || 'i-heroicons-document';
};

// Fonction pour obtenir l'icône d'un type d'activité
const getActivityIcon = (activityType: string) => {
  const iconMap: Record<string, string> = {
    'status_change': 'i-heroicons-arrow-path-rounded-square',
    'file_upload': 'i-heroicons-arrow-up-tray',
    'file_download': 'i-heroicons-arrow-down-tray',
    'comment': 'i-heroicons-chat-bubble-left-right',
    'update': 'i-heroicons-pencil-square',
    'create': 'i-heroicons-plus-circle',
    'delete': 'i-heroicons-trash',
  };

  return iconMap[activityType] || 'i-heroicons-bell';
};


// Onglets de navigation
const tabss = [
  { key: 'overview', label: 'Aperçu' },
  { key: 'indicators', label: 'Indicateurs' },
  { key: 'finances', label: 'Financement' },
  { key: 'documents', label: 'Documents' },
  { key: 'activities', label: 'Activités' },
  { key: 'team', label: 'Équipe' },
  { key: 'settings', label: 'Paramètres' }
];

// Charger les données au montage du composant
onMounted(() => {
  //loadProject();
});

// Définir le titre de la page
useHead({
  title: computed(() => project.value ? `${project.value.title} - Détails` : 'Chargement...'),
});

definePageMeta({
  layout: "sisep-app-layout",
});

</script>

<template>
  <div class=" bg-gray-50 dark:bg-gray-900">
    <!-- En-tête -->
    <div class="relative bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <UButton
                icon="i-heroicons-arrow-left"
                color="gray"
                variant="ghost"
                @click="router.push('/project-module')"
                class="mr-2"
            />
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ project?.title || 'Chargement...' }}
              </h1>
              <div class="flex items-center mt-1 space-x-2">
                <UBadge
                    v-if="project?.status"
                    :color="getStatusBadge(project.status).color"
                    variant="subtle"
                    size="sm"
                    class="capitalize"
                >
                  {{ getStatusBadge(project.status).label }}
                </UBadge>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Dernière mise à jour le {{ project ? formatDate(project.updatedAt) : '...' }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <UButton
                color="gray"
                variant="outline"
                icon="i-heroicons-ellipsis-horizontal"
                :ui="{ rounded: 'rounded-full' }"
            >
              <UDropdown :items="[projectActions]" :popper="{ placement: 'bottom-end' }">
                <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-ellipsis-vertical"
                />
              </UDropdown>
            </UButton>
            <UButton
                color="primary"
                icon="i-heroicons-pencil"
                label="Modifier"
                :to="`/project-module/${projectId}/edit`"
            />
          </div>
        </div>

        <!-- Barre d'onglets -->
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="activeTab = tab.key"
                :class="[
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="text-center">
          <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin text-primary-500 mx-auto" />
          <p class="mt-2 text-sm text-gray-500">Chargement du projet...</p>
        </div>
      </div>

      <div v-else-if="!project" class="text-center py-12">
        <UIcon name="i-heroicons-exclamation-circle" class="h-12 w-12 text-gray-400 mx-auto" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Projet non trouvé</h3>
        <p class="mt-1 text-sm text-gray-500">Le projet demandé n'existe pas ou a été supprimé.</p>
        <div class="mt-6">
          <UButton
              to="/project-module"
              color="primary"
              variant="solid"
              icon="i-heroicons-arrow-left"
          >
            Retour à la liste des projets
          </UButton>
        </div>
      </div>

      <div v-else class="space-y-6">
        <!-- Aperçu du projet -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <!-- Bannière et image de couverture -->
          <div class="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 h-48">
            <img
                :src="project.coverImage?.url || 'https://placehold.co/1200x300/3b82f6/ffffff?text=' + project.title"
                :alt="project.title"
                class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-6 text-white">
              <h2 class="text-2xl font-bold">{{ project.title }}</h2>
              <p class="mt-1 text-gray-200">{{ project.type?.name || 'Sans catégorie' }}</p>
            </div>
          </div>

          <!-- Grille d'informations -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <!-- Colonne de gauche -->
            <div class="md:col-span-2 space-y-6">
              <!-- Description -->
              <UDashboardCard>
                <template #header>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Description</h3>
                </template>
                <p class="text-gray-600 dark:text-gray-300">
                  {{ project.description || 'Aucune description fournie.' }}
                </p>
              </UDashboardCard>

              <!-- Objectifs et résultats attendus -->
              <UDashboardCard>
                <template #header>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Objectifs et résultats</h3>
                </template>
                <div class="space-y-4">
                  <div>
                    <h4 class="font-medium text-gray-700 dark:text-gray-200">Objectif principal</h4>
                    <p class="text-gray-600 dark:text-gray-400">
                      {{ project.objective?.goal || 'Non spécifié' }}
                    </p>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-700 dark:text-gray-200">Résultats attendus</h4>
                    <p class="text-gray-600 dark:text-gray-400">
                      {{ project.expectedResults?.result || 'Non spécifié' }}
                    </p>
                  </div>
                </div>
              </UDashboardCard>

              <!-- Localisation -->
              <UDashboardCard>
                <template #header>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Localisation</h3>
                </template>
                <div class="space-y-2">
                  <div class="flex items-center text-gray-600 dark:text-gray-300">
                    <UIcon name="i-heroicons-map-pin" class="w-5 h-5 mr-2 text-gray-400" />
                    <span>{{ project.location?.city }}, {{ project.location?.region }}</span>
                  </div>
                  <div class="mt-4 h-48 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                    <!-- Carte intégrée (à implémenter avec une bibliothèque de cartes) -->
                    <div class="w-full h-full flex items-center justify-center text-gray-400">
                      <UIcon name="i-heroicons-map" class="w-12 h-12" />
                      <span class="ml-2">Carte de localisation</span>
                    </div>
                  </div>
                </div>
              </UDashboardCard>
            </div>

            <!-- Colonne de droite -->
            <div class="space-y-6">
              <!-- Statut et dates -->
              <UDashboardCard>
                <div class="space-y-4">
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Statut</h4>
                    <div class="mt-1">
                      <UBadge
                          :color="getStatusBadge(project.status).color"
                          variant="subtle"
                          size="lg"
                          class="text-sm"
                      >
                        {{ getStatusBadge(project.status).label }}
                      </UBadge>
                    </div>
                  </div>

                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Période</h4>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                      Du {{ formatDate(project.startDate) }} au {{ formatDate(project.endDate) }}
                    </p>
                    <div class="mt-2">
                      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Début</span>
                        <span>Fin</span>
                      </div>
                      <UProgress
                          :value="getProjectProgress(project)"
                          color="primary"
                          size="sm"
                          class="w-full"
                      />
                      <div class="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
                        {{ getProjectProgress(project) }}% complété
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Budget total</h4>
                    <p class="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(project.totalBudget) }}
                    </p>
                  </div>
                </div>
              </UDashboardCard>

              <!-- Partenaires -->
              <UDashboardCard>
                <template #header>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Partenaires</h3>
                </template>
                <div class="space-y-3">
                  <div
                      v-for="partner in project.partners || []"
                      :key="partner.id"
                      class="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    <UAvatar
                        :text="partner.name.split(' ').map(n => n[0]).join('').toUpperCase()"
                        size="md"
                        :ui="{ rounded: 'rounded-lg' }"
                    />
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ partner.name }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ partner.type }}
                      </p>
                    </div>
                  </div>
                  <p v-if="!project.partners?.length" class="text-sm text-gray-500 text-center py-2">
                    Aucun partenaire renseigné
                  </p>
                </div>
              </UDashboardCard>
            </div>
          </div>
        </div>

        <!-- Indicateurs -->
        <div v-else-if="activeTab === 'indicators'" class="space-y-6">
          <UDashboardCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Indicateurs de performance</h3>
                <UButton
                    color="primary"
                    variant="solid"
                    size="sm"
                    icon="i-heroicons-plus"
                    label="Ajouter un indicateur"
                />
              </div>
            </template>

            <div class="space-y-6">
              <div
                  v-for="indicator in project.indicators || []"
                  :key="indicator.id"
                  class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">
                      {{ indicator.indicatorName }}
                    </h4>
                    <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Valeur de base: {{ indicator.baselineValue }} {{ indicator.unit || '' }}</span>
                      <span>•</span>
                      <span>Cible: {{ indicator.targetValue }} {{ indicator.unit || '' }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                      {{ indicator.latestValue }} {{ indicator.unit || '' }}
                    </div>
                    <div class="text-xs text-gray-500">Dernière mise à jour</div>
                  </div>
                </div>

                <div class="mt-4">
                  <div class="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progression</span>
                    <span>
                      {{ Math.round((indicator.latestValue / indicator.targetValue) * 100) }}%
                    </span>
                  </div>
                  <UProgress
                      :value="(indicator.latestValue / indicator.targetValue) * 100"
                      color="green"
                      size="xs"
                      class="w-full"
                  />
                </div>

                <div class="mt-3 flex justify-end space-x-2">
                  <UButton
                      color="gray"
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-pencil"
                      label="Modifier"
                  />
                  <UButton
                      color="red"
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-trash"
                      label="Supprimer"
                  />
                </div>
              </div>

              <div
                  v-if="!project.indicators?.length"
                  class="text-center py-8 text-gray-500"
              >
                <UIcon name="i-heroicons-chart-bar" class="mx-auto h-12 w-12 text-gray-300" />
                <h3 class="mt-2 text-sm font-medium">Aucun indicateur</h3>
                <p class="mt-1 text-sm">Commencez par ajouter un indicateur pour suivre les progrès de votre projet.</p>
                <div class="mt-4">
                  <UButton
                      color="primary"
                      variant="solid"
                      icon="i-heroicons-plus"
                      label="Ajouter un indicateur"
                  />
                </div>
              </div>
            </div>
          </UDashboardCard>
        </div>

        <!-- Financement -->
        <div v-else-if="activeTab === 'finances'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <!-- Récapitulatif financier -->
            <div class="md:col-span-1">
              <UDashboardCard>
                <template #header>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Récapitulatif</h3>
                </template>
                <div class="space-y-4">
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Budget total</h4>
                    <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                      {{ formatCurrency(project.totalBudget) }}
                    </p>
                  </div>

                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Dépensé à ce jour</h4>
                    <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                      {{ formatCurrency(project.finances?.reduce((sum, f) => sum + parseFloat(f.amountDisbursedCfa || 0), 0) || 0) }}
                    </p>
                  </div>

                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Taux d'exécution</h4>
                    <div class="mt-1">
                      <UProgress
                          :value="(project.finances?.reduce((sum, f) => sum + parseFloat(f.amountDisbursedCfa || 0), 0) / project.totalBudget) * 100"
                          color="green"
                          size="sm"
                          class="w-full"
                      />
                      <div class="mt-1 text-xs text-right text-gray-500">
                        {{ Math.round((project.finances?.reduce((sum, f) => sum + parseFloat(f.amountDisbursedCfa || 0), 0) / project.totalBudget) * 100) }}% du budget utilisé
                      </div>
                    </div>
                  </div>
                </div>
              </UDashboardCard>

              <div class="mt-6">
                <UDashboardCard>
                  <template #header>
                    <div class="flex items-center justify-between">
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Répartition par source</h3>
                      <UButton
                          color="primary"
                          variant="ghost"
                          size="xs"
                          icon="i-heroicons-plus"
                          label="Ajouter"
                      />
                    </div>
                  </template>

                  <div class="space-y-4">
                    <div v-if="!project.finances?.length" class="text-center py-4 text-gray-500">
                      Aucune source de financement renseignée
                    </div>

                    <div v-for="(finance, index) in project.finances || []" :key="index" class="space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="font-medium text-gray-700 dark:text-gray-300">{{ finance.fundingSource }}</span>
                        <span class="font-medium">{{ formatCurrency(parseFloat(finance.amountCommitedCfa || 0)) }}</span>
                      </div>
                      <UProgress
                          :value="(parseFloat(finance.amountDisbursedCfa || 0) / parseFloat(finance.amountCommitedCfa || 1)) * 100"
                          color="blue"
                          size="xs"
                          class="w-full"
                      />
                      <div class="flex justify-between text-xs text-gray-500">
                        <span>Décaissé: {{ formatCurrency(parseFloat(finance.amountDisbursedCfa || 0)) }}</span>
                        <span>{{ Math.round((parseFloat(finance.amountDisbursedCfa || 0) / parseFloat(finance.amountCommitedCfa || 1)) * 100) }}%</span>
                      </div>
                    </div>
                  </div>
                </UDashboardCard>
              </div>
            </div>

            <!-- Dépenses récentes -->
            <div class="md:col-span-2">
              <UDashboardCard>
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Dépenses récentes</h3>
                    <UButton
                        color="primary"
                        variant="solid"
                        size="sm"
                        icon="i-heroicons-plus"
                        label="Nouvelle dépense"
                    />
                  </div>
                </template>

                <div class="overflow-x-auto">
                  <UTable :rows="[]">
                    <template #empty-state>
                      <div class="py-8 text-center">
                        <UIcon name="i-heroicons-receipt-percent" class="mx-auto h-12 w-12 text-gray-300" />
                        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune dépense enregistrée</h3>
                        <p class="mt-1 text-sm text-gray-500">Commencez par ajouter une dépense pour suivre les coûts de votre projet.</p>
                        <div class="mt-4">
                          <UButton
                              color="primary"
                              variant="solid"
                              icon="i-heroicons-plus"
                              label="Ajouter une dépense"
                          />
                        </div>
                      </div>
                    </template>
                  </UTable>
                </div>
              </UDashboardCard>
            </div>
          </div>
        </div>

        <!-- Autres onglets -->
        <div v-else class="py-12 text-center">
          <UIcon name="i-heroicons-wrench-screwdriver" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Section en construction</h3>
          <p class="mt-1 text-gray-500">Cette section sera bientôt disponible.</p>
        </div>
      </div>
    </main>
  </div>
</template>
