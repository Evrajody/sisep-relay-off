<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Vue3autocounter from "vue3-autocounter";
import { 
  VisXYContainer, 
  VisStackedBar, 
  VisSingleContainer, 
  VisDonut, 
  VisLine,
  VisAxis,
  VisTooltip,
  VisBulletLegend
} from '@unovis/vue';

definePageMeta({
  layout: "sisep-app-layout",
});

// Données des indicateurs clés
const stats = ref([
  {
    id: 1,
    name: "Projets Actifs",
    value: 24,
    change: 12.5,
    icon: "i-ic-twotone-pending-actions",
    color: "bg-blue-500/10 border-blue-500",
    colorIcon: "text-blue-500",
  },
  {
    id: 2,
    name: "Taux d'achèvement",
    value: 78,
    change: 5.2,
    suffix: "%",
    icon: "i-ic-baseline-check-circle",
    color: "bg-green-500/10 border-green-500",
    colorIcon: "text-green-500",
  },
  {
    id: 3,
    name: "Budget Total",
    value: 12.5,
    prefix: "$",
    suffix: "M",
    change: -2.3,
    icon: "i-ic-baseline-attach-money",
    color: "bg-purple-500/10 border-purple-500",
    colorIcon: "text-purple-500",
  },
  {
    id: 4,
    name: "Délai moyen",
    value: 45,
    suffix: "jrs",
    change: -8,
    icon: "i-ic-baseline-access-time",
    color: "bg-amber-500/10 border-amber-500",
    colorIcon: "text-amber-500",
  },
]);

// Données pour le graphique d'évolution mensuelle
const monthlyData = ref([
  { month: 'Jan', projets: 12, budget: 2.5 },
  { month: 'Fév', projets: 15, budget: 3.1 },
  { month: 'Mar', projets: 18, budget: 3.8 },
  { month: 'Avr', projets: 22, budget: 4.2 },
  { month: 'Mai', projets: 24, budget: 4.5 },
  { month: 'Juin', projets: 28, budget: 5.1 },
]);

// Données pour le graphique circulaire des statuts
const statusData = ref([
  { status: 'En cours', value: 45, color: '#3B82F6' },
  { status: 'Terminé', value: 35, color: '#10B981' },
  { status: 'En attente', value: 15, color: '#F59E0B' },
  { status: 'En retard', value: 5, color: '#EF4444' },
]);

// Données pour le graphique à barres des projets par type
const projectsByType = ref([
  { type: 'Infrastructure', count: 12, budget: 4.2 },
  { type: 'Développement', count: 8, budget: 3.1 },
  { type: 'Formation', count: 5, budget: 1.8 },
  { type: 'Recherche', count: 7, budget: 2.4 },
  { type: 'Autres', count: 3, budget: 1.0 },
]);

// Données pour le graphique de progression des projets
const projectProgress = ref([
  { project: 'Projet A', progress: 85, deadline: '15/10/2023' },
  { project: 'Projet B', progress: 60, deadline: '30/10/2023' },
  { project: 'Projet C', progress: 45, deadline: '15/11/2023' },
  { project: 'Projet D', progress: 30, deadline: '30/11/2023' },
  { project: 'Projet E', progress: 15, deadline: '15/12/2023' },
]);

// Fonctions utilitaires pour les graphiques
const xAxis = (d) => d.month;
const yAxis = (d, i) => i;
const value = (d) => d.value;
const color = (d) => d.color;
const projectName = (d) => d.project;
const progressValue = (d) => d.progress;

// Formatage des nombres
const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

// Formatage des pourcentages
const formatPercent = (num) => {
  return new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 1 }).format(num / 100);
};

const links = [{
  label: 'Tableau de bord',
  icon: 'i-heroicons-chart-bar'
}];

// Configuration des couleurs
const colors = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#6366F1',
};

// Configuration responsive
const containerStyle = 'height: 300px; min-height: 300px;';

// Fonction pour déterminer la couleur du changement
const getChangeColor = (change) => {
  if (change > 0) return 'text-green-500';
  if (change < 0) return 'text-red-500';
  return 'text-gray-500';
};

// Formatage des indicateurs de changement
const formatChange = (change) => {
  if (change > 0) return `+${change}%`;
  if (change < 0) return `${change}%`;
  return '0%';
};

onMounted(() => {
  // Simulation de chargement des données
  setTimeout(() => {
    // Mise à jour des données après le chargement
  }, 1000);
});
</script>

<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <UDashboardToolbar :ui="{ wrapper: 'bg-white dark:bg-gray-900' }" class="py-0 px-1.5 overflow-x-auto">
      <UHorizontalNavigation :links="links" />
      <template #right>
        <UButton
          icon="i-heroicons-funnel"
          color="gray"
          variant="ghost"
          label="Filtres"
          class="ml-2"
        />
        <UButton
          icon="i-heroicons-calendar"
          color="gray"
          variant="ghost"
          label="Derniers 30 jours"
          class="ml-2"
        />
      </template>
    </UDashboardToolbar>

    <!-- Indicateurs clés -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
      <UDashboardCard v-for="(stat, index) in stats" :key="index" class="relative overflow-hidden">
        <div class="absolute top-4 right-4">
          <div :class="[stat.color, 'p-2 rounded-lg']">
            <Icon :name="stat.icon" class="text-lg" />
          </div>
        </div>
        <div class="space-y-2">
          <p class="text-sm font-medium text-gray-500">{{ stat.name }}</p>
          <div class="flex items-end justify-between">
            <div>
              <h3 class="text-2xl font-bold">
                {{ stat.prefix || '' }}{{ formatNumber(stat.value) }}{{ stat.suffix || '' }}
              </h3>
              <p :class="['text-sm font-medium', getChangeColor(stat.change)]">
                {{ formatChange(stat.change) }} <span class="text-gray-500">vs mois dernier</span>
              </p>
            </div>
          </div>
        </div>
      </UDashboardCard>
    </div>

    <!-- Graphiques principaux -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
      <!-- Évolution mensuelle -->
      <UDashboardCard title="Évolution mensuelle des projets">
        <VisXYContainer 
          :data="monthlyData" 
          :style="containerStyle"
          :margin="{ top: 20, left: 50, right: 20, bottom: 50 }"
        >
          <VisLine 
            :x="xAxis" 
            :y="(d) => d.projets" 
            :color="colors.primary"
            :curve-type="curveBumpX"
          />
          <VisAxis type="x" :tick-format="xAxis" />
          <VisAxis type="y" :tick-format="(d) => `${d} projets`" />
          <VisTooltip />
        </VisXYContainer>
      </UDashboardCard>

      <!-- Répartition par statut -->
      <UDashboardCard title="Répartition par statut">
        <VisSingleContainer :data="statusData" :style="containerStyle">
          <VisDonut 
            :value="value" 
            :color="color"
            :arc-labels="(d) => `${d.status}: ${d.value}%`"
            :arc-labels-outer-offset="20"
          />
          <VisBulletLegend 
            :items="statusData.map(d => ({ name: d.status, color: d.color }))" 
            :style="{ marginTop: '20px' }"
          />
        </VisSingleContainer>
      </UDashboardCard>
    </div>

    <!-- Graphiques secondaires -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
      <!-- Projets par type -->
      <UDashboardCard title="Projets par type">
        <VisXYContainer 
          :data="projectsByType" 
          :style="containerStyle"
          :margin="{ top: 20, left: 150, right: 20, bottom: 50 }"
        >
          <VisStackedBar 
            :x="(d) => d.count" 
            :y="(d) => d.type"
            :color="colors.info"
          />

          <VisTooltip />
        </VisXYContainer>
      </UDashboardCard>

      <!-- Progression des projets -->
      <UDashboardCard title="Progression des projets">
        <div class="space-y-4 p-4">
          <div v-for="(project, index) in projectProgress" :key="index" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="font-medium">{{ project.project }}</span>
              <span class="text-gray-500">{{ project.progress }}%</span>
            </div>
            <UProgress 
              :value="project.progress" 
              :color="project.progress > 80 ? 'green' : project.progress > 50 ? 'blue' : project.progress > 20 ? 'yellow' : 'red'"
              size="sm"
            />
            <div class="flex justify-between text-xs text-gray-500">
              <span>Début: 01/01/2023</span>
              <span>Échéance: {{ project.deadline }}</span>
            </div>
          </div>
        </div>
      </UDashboardCard>
    </div>
  </div>
</template>

<style scoped>
/* Styles personnalisés pour les cartes */
.dashboard-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md;
}

/* Style pour les indicateurs de tendance */
.trend-up {
  @apply text-green-500;
}

.trend-down {
  @apply text-red-500;
}

/* Amélioration de la lisibilité des graphiques */
:deep(.vis-tooltip) {
  @apply bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 border border-gray-200 dark:border-gray-700 text-sm;
}

:deep(.vis-legend) {
  @apply flex justify-center space-x-4 mt-4;
}

:deep(.vis-legend-item) {
  @apply flex items-center space-x-2 text-sm;
}

:deep(.vis-legend-item-color) {
  @apply w-3 h-3 rounded-full;
}

/* Animation de chargement */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>