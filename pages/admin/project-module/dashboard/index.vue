<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  layout: "sisep-app-layout",
});

useHead({
  title: "Tableau de bord - Projets",
});

// Données des indicateurs clés (à remplacer par les vraies données de l'API)
const stats = ref([
  {
    id: 1,
    name: "Total Projets",
    value: 156,
    change: 12.5,
    icon: "i-heroicons-folder-open",
    gradient: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: 2,
    name: "Projets en cours",
    value: 45,
    change: 8.3,
    icon: "i-heroicons-arrow-path",
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    id: 3,
    name: "Projets terminés",
    value: 89,
    change: 5.7,
    icon: "i-heroicons-check-circle",
    gradient: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: 4,
    name: "Budget total",
    value: "2.4",
    suffix: "M FCFA",
    change: 15.2,
    icon: "i-heroicons-banknotes",
    gradient: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
]);

// Données de répartition par statut
const statusData = ref([
  { status: 'Publié', count: 89, percentage: 57, color: 'green' },
  { status: 'En cours', count: 45, percentage: 29, color: 'blue' },
  { status: 'En attente', count: 15, percentage: 10, color: 'yellow' },
  { status: 'Rejeté', count: 7, percentage: 4, color: 'red' },
]);

// Données de répartition par type
const typeData = ref([
  { name: 'Infrastructure', count: 42, icon: 'i-heroicons-building-office-2' },
  { name: 'Développement social', count: 35, icon: 'i-heroicons-user-group' },
  { name: 'Environnement', count: 28, icon: 'i-heroicons-globe-americas' },
  { name: 'Éducation', count: 25, icon: 'i-heroicons-academic-cap' },
  { name: 'Santé', count: 18, icon: 'i-heroicons-heart' },
  { name: 'Agriculture', count: 8, icon: 'i-heroicons-beaker' },
]);

// Projets récents
const recentProjects = ref([
  {
    id: 1,
    title: 'Construction d\'écoles rurales',
    status: 'PUBLISHED',
    progress: 85,
    budget: '450M FCFA',
    deadline: '2025-12-15',
    type: { name: 'Infrastructure' },
    image: null
  },
  {
    id: 2,
    title: 'Programme d\'accès à l\'eau potable',
    status: 'PENDING',
    progress: 60,
    budget: '320M FCFA',
    deadline: '2025-11-30',
    type: { name: 'Infrastructure' },
    image: null
  },
  {
    id: 3,
    title: 'Formation professionnelle des jeunes',
    status: 'PUBLISHED',
    progress: 45,
    budget: '180M FCFA',
    deadline: '2025-10-20',
    type: { name: 'Éducation' },
    image: null
  },
  {
    id: 4,
    title: 'Réhabilitation centres de santé',
    status: 'DRAFT',
    progress: 30,
    budget: '275M FCFA',
    deadline: '2025-09-15',
    type: { name: 'Santé' },
    image: null
  },
]);

// Top partenaires
const topPartners = ref([
  { name: 'Banque Mondiale', projects: 24, amount: '1.2M FCFA' },
  { name: 'Union Européenne', projects: 18, amount: '890K FCFA' },
  { name: 'AFD', projects: 15, amount: '750K FCFA' },
  { name: 'BAD', projects: 12, amount: '620K FCFA' },
  { name: 'OMS', projects: 8, amount: '340K FCFA' },
]);

// Statistiques mensuelles (à remplacer par les vraies données)
const monthlyStats = ref([
  { month: 'Jan', projects: 12, budget: 2.5 },
  { month: 'Fév', projects: 15, budget: 3.1 },
  { month: 'Mar', projects: 18, budget: 3.8 },
  { month: 'Avr', projects: 22, budget: 4.2 },
  { month: 'Mai', projects: 24, budget: 4.5 },
  { month: 'Juin', projects: 28, budget: 5.1 },
]);

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

// Fonction pour déterminer la couleur du changement
const getChangeColor = (change: number) => {
  if (change > 0) return 'text-green-600 dark:text-green-400';
  if (change < 0) return 'text-red-600 dark:text-red-400';
  return 'text-gray-500';
};

// Formatage des indicateurs de changement
const formatChange = (change: number) => {
  if (change > 0) return `+${change}%`;
  if (change < 0) return `${change}%`;
  return '0%';
};

// Calcul de la progression
const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'green';
  if (progress >= 50) return 'blue';
  if (progress >= 30) return 'yellow';
  return 'red';
};

const links = [{
  label: 'Tableau de bord',
  icon: 'i-heroicons-chart-bar'
}];

// Formatage des nombres
const formatNumber = (num: number | string) => {
  if (typeof num === 'string') return num;
  return new Intl.NumberFormat('fr-FR').format(num);
};

onMounted(() => {
  // Charger les vraies données ici
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- En-tête -->
    <UDashboardToolbar
      :ui="{ wrapper: 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800' }"
      class="py-0 px-1.5"
    >
      <UHorizontalNavigation :links="links" />
      <template #right>
        <div class="flex items-center gap-2">
          <UButton
            icon="i-heroicons-arrow-path"
            color="gray"
            variant="ghost"
            size="sm"
            label="Actualiser"
          />
          <UButton
            icon="i-heroicons-arrow-down-tray"
            color="gray"
            variant="ghost"
            size="sm"
            label="Exporter"
          />
        </div>
      </template>
    </UDashboardToolbar>

    <div class="max-w-[95vw] mx-auto px-4 py-6 space-y-6">
      <!-- En-tête du dashboard -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Tableau de bord
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Vue d'ensemble de vos projets et statistiques
          </p>
        </div>
        <UButton
          to="/admin/project-module/create-project"
          color="primary"
          icon="i-heroicons-plus"
          size="lg"
        >
          Nouveau projet
        </UButton>
      </div>

      <!-- Indicateurs clés -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UCard
          v-for="stat in stats"
          :key="stat.id"
          :ui="{
            body: { padding: 'p-5' },
            background: 'bg-white dark:bg-gray-800',
            ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
            shadow: 'shadow-sm hover:shadow-md transition-shadow duration-200'
          }"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ stat.name }}
              </p>
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {{ formatNumber(stat.value) }}
                <span v-if="stat.suffix" class="text-base font-normal text-gray-500">
                  {{ stat.suffix }}
                </span>
              </h3>
              <div class="flex items-center gap-1 mt-2">
                <UIcon
                  :name="stat.change > 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'"
                  :class="[getChangeColor(stat.change), 'w-4 h-4']"
                />
                <span :class="['text-sm font-medium', getChangeColor(stat.change)]">
                  {{ formatChange(stat.change) }}
                </span>
                <span class="text-sm text-gray-500">ce mois</span>
              </div>
            </div>
            <div :class="[stat.bgColor, 'p-3 rounded-xl']">
              <UIcon :name="stat.icon" :class="[stat.iconColor, 'w-6 h-6']" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Graphiques et statistiques -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Répartition par statut -->
        <UCard
          :ui="{
            header: { padding: 'px-5 py-4' },
            body: { padding: 'p-5' }
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Répartition par statut
              </h3>
              <UIcon name="i-heroicons-chart-pie" class="w-5 h-5 text-gray-400" />
            </div>
          </template>

          <div class="space-y-4">
            <div v-for="item in statusData" :key="item.status" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <UBadge :color="item.color" variant="subtle" size="xs" />
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{ item.status }}</span>
                </div>
                <span class="text-gray-600 dark:text-gray-400">{{ item.count }} ({{ item.percentage }}%)</span>
              </div>
              <UProgress :value="item.percentage" :color="item.color" size="sm" />
            </div>
          </div>
        </UCard>

        <!-- Répartition par type -->
        <UCard
          :ui="{
            header: { padding: 'px-5 py-4' },
            body: { padding: 'p-5' }
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Types de projets
              </h3>
              <UIcon name="i-heroicons-squares-2x2" class="w-5 h-5 text-gray-400" />
            </div>
          </template>

          <div class="space-y-3">
            <div
              v-for="type in typeData"
              :key="type.name"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <UIcon :name="type.icon" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ type.name }}</span>
              </div>
              <UBadge color="blue" variant="subtle">{{ type.count }}</UBadge>
            </div>
          </div>
        </UCard>

        <!-- Top partenaires -->
        <UCard
          :ui="{
            header: { padding: 'px-5 py-4' },
            body: { padding: 'p-5' }
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Top partenaires
              </h3>
              <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 text-gray-400" />
            </div>
          </template>

          <div class="space-y-3">
            <div
              v-for="(partner, index) in topPartners"
              :key="partner.name"
              class="flex items-center gap-3"
            >
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                {{ index + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ partner.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ partner.projects }} projets
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ partner.amount }}
                </p>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Projets récents -->
      <UCard
        :ui="{
          header: { padding: 'px-5 py-4' },
          body: { padding: 'p-0' }
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Projets en cours
            </h3>
            <UButton
              to="/project-module"
              color="gray"
              variant="ghost"
              size="sm"
              trailing-icon="i-heroicons-arrow-right"
            >
              Voir tout
            </UButton>
          </div>
        </template>

        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="project in recentProjects"
            :key="project.id"
            class="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            @click="navigateTo(`/admin/project-module/${project.id}`)"
          >
            <div class="flex items-start gap-4">
              <!-- Avatar/Image -->
              <UAvatar
                :src="project.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.title)}&background=3b82f6&color=fff`"
                :alt="project.title"
                size="lg"
                class="flex-shrink-0"
              />

              <!-- Contenu -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4 mb-2">
                  <div class="flex-1 min-w-0">
                    <h4 class="text-base font-semibold text-gray-900 dark:text-white truncate">
                      {{ project.title }}
                    </h4>
                    <div class="flex items-center gap-2 mt-1">
                      <UBadge
                        :color="getStatusBadge(project.status).color"
                        variant="subtle"
                        size="xs"
                      >
                        {{ getStatusBadge(project.status).label }}
                      </UBadge>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ project.type.name }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ project.budget }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Échéance: {{ new Date(project.deadline).toLocaleDateString('fr-FR') }}
                    </p>
                  </div>
                </div>

                <!-- Barre de progression -->
                <div class="space-y-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-600 dark:text-gray-400">Progression</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ project.progress }}%</span>
                  </div>
                  <UProgress
                    :value="project.progress"
                    :color="getProgressColor(project.progress)"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
/* Animations personnalisées */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
</style>
