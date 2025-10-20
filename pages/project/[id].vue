<script lang="ts" setup>
import type { Project } from "~/types";
import Navbar from "~/components/Home/Navbar.vue";
import FooterSiseb from "~/components/Home/FooterSiseb.vue";

definePageMeta({
  layout: "home",
});

const route = useRoute();
const projectId = route.params.id as string;

// Récupérer les détails du projet
const { projectDetail: project, projectDetailStatus } = useProjectDetail(projectId);

// Utiliser le composable pour afficher les fichiers
const { getFileDisplayUrl } = useFileDisplay();

// Computed pour formater le budget
const formattedBudget = computed(() => {
  if (!project.value?.totalBudget) return 'N/A';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(project.value.totalBudget);
});

// Computed pour formater les dates
const formattedStartDate = computed(() => {
  if (!project.value?.startDate) return 'N/A';
  return new Date(project.value.startDate).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const formattedEndDate = computed(() => {
  if (!project.value?.endDate) return 'N/A';
  return new Date(project.value.endDate).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Computed pour l'image de couverture
const coverImageUrl = computed(() => {
  if (project.value?.coverImageId) {
    return getFileDisplayUrl(project.value.coverImageId);
  }
  return '/images/media_travaux.jpeg';
});

// Computed pour le badge de statut
const statusConfig = computed(() => {
  const configs: Record<string, { color: string; label: string }> = {
    'DRAFT': { color: 'gray', label: 'Brouillon' },
    'PENDING': { color: 'yellow', label: 'En attente' },
    'PUBLISHED': { color: 'green', label: 'Publié' },
    'REJECTED': { color: 'red', label: 'Rejeté' },
  };
  return configs[project.value?.status || 'DRAFT'] || configs['DRAFT'];
});

useHead({
  title: computed(() => project.value?.title || 'Détail du projet'),
  meta: [
    {
      name: 'description',
      content: computed(() => project.value?.description || 'Découvrez les détails de ce projet')
    }
  ]
});
</script>

<template>
  <main class="min-h-screen bg-gray-50">
    <!-- Header avec navigation -->
    <header class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <!-- Background image -->
      <div class="absolute inset-0">
        <img
          :src="coverImageUrl"
          alt="Project cover"
          class="w-full h-full object-cover opacity-30"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent"></div>
      </div>

      <!-- Top nav bar -->
      <div class="h-fit mx-auto absolute top-2 md:top-4 lg:top-7 rounded-2xl shadow-2xl left-0 right-0 z-20 max-w-[95vw] md:max-w-[90vw] bg-white/10 backdrop-blur-xl border border-white/20">
        <div class="flex flex-col md:flex-row gap-2 md:gap-6 justify-between md:justify-start items-center p-2 md:pr-6">
          <div class="img-box flex rounded-xl md:rounded-l-xl bg-gradient-to-br from-white to-gray-50 w-full md:w-fit shadow-inner">
            <div class="w-full md:w-[250px] lg:w-[300px] p-3 md:p-2">
              <a href="/" class="block">
                <img class="h-12 md:h-auto w-auto mx-auto transition-transform duration-300 hover:scale-105" src="~/assets/images/logo_cadre_vie.png" alt="Logo"/>
              </a>
            </div>
          </div>
          <Navbar class="w-full md:w-auto"/>
        </div>
      </div>

      <!-- Hero content -->
      <div v-if="project" class="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-24">
        <div class="max-w-4xl">
          <div class="flex items-center gap-3 mb-6">
            <NuxtLink
              to="/project"
              class="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
              <span>Retour aux projets</span>
            </NuxtLink>
          </div>

          <div class="flex flex-wrap items-center gap-3 mb-6">
            <UBadge :color="statusConfig.color" variant="solid" size="lg">
              {{ statusConfig.label }}
            </UBadge>
            <UBadge v-if="project.type" color="blue" variant="soft" size="lg">
              {{ project.type.name }}
            </UBadge>
          </div>

          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-6">
            {{ project.title }}
          </h1>

          <p v-if="project.description" class="text-lg sm:text-xl text-white/90 max-w-3xl mb-8">
            {{ project.description }}
          </p>

          <!-- Quick stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div class="text-white/70 text-sm mb-1">Budget</div>
              <div class="text-white font-bold text-lg">{{ formattedBudget }}</div>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div class="text-white/70 text-sm mb-1">Début</div>
              <div class="text-white font-bold text-lg">{{ formattedStartDate }}</div>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div class="text-white/70 text-sm mb-1">Fin prévue</div>
              <div class="text-white font-bold text-lg">{{ formattedEndDate }}</div>
            </div>
            <div v-if="project.location" class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div class="text-white/70 text-sm mb-1">Localisation</div>
              <div class="text-white font-bold text-lg">{{ project.location.city }}, {{ project.location.region }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-else-if="projectDetailStatus === 'pending'" class="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-24">
        <div class="flex items-center justify-center">
          <div class="text-white text-xl">Chargement...</div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div v-if="project" class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Objectifs -->
          <UCard v-if="project.objective">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <UIcon name="i-heroicons-flag" class="w-5 h-5 text-blue-600" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Objectifs</h2>
              </div>
            </template>
            <div class="prose max-w-none" v-html="project.objective"></div>
          </UCard>

          <!-- Résultats attendus -->
          <UCard v-if="project.expectedResults">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <UIcon name="i-heroicons-check-badge" class="w-5 h-5 text-green-600" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Résultats attendus</h2>
              </div>
            </template>
            <div class="prose max-w-none" v-html="project.expectedResults"></div>
          </UCard>

          <!-- Leçons apprises -->
          <UCard v-if="project.lessonsLearned">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-purple-600" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Leçons apprises</h2>
              </div>
            </template>
            <div class="prose max-w-none" v-html="project.lessonsLearned"></div>
          </UCard>

          <!-- Indicateurs -->
          <UCard v-if="project.indicators && project.indicators.length > 0">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-orange-600" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Indicateurs de performance</h2>
              </div>
            </template>
            <div class="space-y-4">
              <div
                v-for="indicator in project.indicators"
                :key="indicator.id"
                class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <h3 class="font-semibold text-gray-900 dark:text-white mb-3">{{ indicator.indicatorName }}</h3>
                <div class="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500 dark:text-gray-400">Valeur de référence</span>
                    <p class="font-semibold mt-1">{{ indicator.baselineValue }} ({{ indicator.baselineYear }})</p>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400">Valeur cible</span>
                    <p class="font-semibold mt-1">{{ indicator.targetValue }} ({{ indicator.targetYear }})</p>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400">Valeur actuelle</span>
                    <p class="font-semibold mt-1">{{ indicator.latestValue }} ({{ indicator.latestYear }})</p>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Actions -->
          <UCard v-if="project.actions && project.actions.length > 0">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                  <UIcon name="i-heroicons-bolt" class="w-5 h-5 text-teal-600" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Actions en cours</h2>
              </div>
            </template>
            <div class="space-y-3">
              <div
                v-for="action in project.actions"
                :key="action.id"
                class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div class="flex-shrink-0 mt-1">
                  <UBadge :color="action.status === 'En cours' ? 'green' : 'gray'" variant="subtle">
                    {{ action.status }}
                  </UBadge>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ action.type }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ action.description }}</p>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Structure -->
          <UCard v-if="project.structure">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Structure</h3>
            </template>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 text-blue-600" />
                <span class="font-medium">{{ project.structure.name }}</span>
              </div>
              <p v-if="project.structure.code" class="text-sm text-gray-500 dark:text-gray-400">
                Code: {{ project.structure.code }}
              </p>
            </div>
          </UCard>

          <!-- Partenaires -->
          <UCard v-if="project.partners && project.partners.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Partenaires</h3>
            </template>
            <div class="space-y-3">
              <div
                v-for="partner in project.partners"
                :key="partner.id"
                class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ partner.name }}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ partner.type }}</p>
                <p v-if="partner.otherData?.role" class="text-sm text-gray-600 dark:text-gray-400">
                  {{ partner.otherData.role }}
                </p>
              </div>
            </div>
          </UCard>

          <!-- Cibles -->
          <UCard v-if="project.targets && project.targets.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Cibles</h3>
            </template>
            <div class="space-y-2">
              <div
                v-for="target in project.targets"
                :key="target.id"
                class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <h4 class="font-semibold text-gray-900 dark:text-white text-sm mb-1">{{ target.name }}</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ target.description }}</p>
              </div>
            </div>
          </UCard>

          <!-- Financement -->
          <UCard v-if="project.finances && project.finances.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Financement</h3>
            </template>
            <div class="space-y-3">
              <div
                v-for="finance in project.finances"
                :key="finance.id"
                class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold text-gray-900 dark:text-white">{{ finance.fundingSource.donor }}</span>
                  <UBadge color="blue" variant="subtle" size="xs">{{ finance.fundingSource.program }}</UBadge>
                </div>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Engagé:</span>
                    <span class="font-medium">{{ parseInt(finance.amountCommitedCfa).toLocaleString('fr-FR') }} FCFA</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Décaissé:</span>
                    <span class="font-medium">{{ parseInt(finance.amountDisbursedCfa).toLocaleString('fr-FR') }} FCFA</span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-400">Type:</span>
                    <span>{{ finance.instrumentType }}</span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Vérifications -->
          <UCard v-if="project.verifications && project.verifications.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Vérifications</h3>
            </template>
            <div class="space-y-3">
              <div
                v-for="verification in project.verifications"
                :key="verification.id"
                class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <UBadge
                    :color="verification.verificationLevel === 'Finale' ? 'green' : 'blue'"
                    variant="subtle"
                    size="xs"
                  >
                    {{ verification.verificationLevel }}
                  </UBadge>
                  <span class="text-xs text-gray-500">
                    {{ new Date(verification.verificationDate).toLocaleDateString('fr-FR') }}
                  </span>
                </div>
                <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">{{ verification.verifier }}</p>
                <p v-if="verification.verificationReportReference" class="text-xs text-gray-600 dark:text-gray-400">
                  {{ verification.verificationReportReference.reportTitle }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="projectDetailStatus === 'error'" class="container mx-auto px-4 py-20 text-center">
      <div class="max-w-md mx-auto">
        <div class="p-4 bg-red-50 rounded-full inline-block mb-4">
          <UIcon name="i-heroicons-exclamation-circle" class="w-12 h-12 text-red-600" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Projet introuvable</h2>
        <p class="text-gray-600 mb-6">Le projet que vous recherchez n'existe pas ou n'est plus disponible.</p>
        <NuxtLink
          to="/project"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-sisep-hit to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
          Retour aux projets
        </NuxtLink>
      </div>
    </div>

    <FooterSiseb/>
  </main>
</template>

<style scoped>
.prose :deep(ul) {
  @apply list-disc list-inside space-y-2;
}

.prose :deep(li) {
  @apply text-gray-700 dark:text-gray-300;
}
</style>
