<script lang="ts" setup>
import type { Project } from "~/types";
import Navbar from "~/components/Home/Navbar.vue";
import FooterSiseb from "~/components/Home/FooterSiseb.vue";

const route = useRoute();
const { $sisepApi } = useNuxtApp();

// Données mockées pour la démonstration
const mockProject: Project = {
  id: route.params.id as string,
  title: 'Parc Solaire de Cotonou',
  description: "Déploiement d'un parc solaire photovoltaïque de grande envergure pour renforcer la capacité énergétique renouvelable de la ville de Cotonou. Ce projet ambitieux vise à fournir une énergie propre et durable à plus de 50 000 foyers, tout en réduisant significativement les émissions de gaz à effet de serre.",
  type: {
    id: '1',
    name: 'Énergie Renouvelable',
    description: 'Projets liés aux énergies propres et durables'
  },
  status: 'PUBLISHED',
  createdBy: 'admin',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-03-20T14:45:00Z',
  coverImage: {
    url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=600&fit=crop',
    alt: 'Parc solaire moderne'
  },
  startDate: '2024-03-12T00:00:00Z',
  endDate: '2024-12-31T00:00:00Z',
  objective: {
    goal: "Produire 50 MW d'énergie solaire propre pour alimenter la ville de Cotonou et contribuer à la transition énergétique du Bénin vers des sources d'énergie renouvelables et durables."
  },
  expectedResults: {
    result: "Réduction de 30% des émissions de CO2, alimentation électrique de 50 000 foyers, création de 200 emplois directs et indirects, formation de 100 techniciens spécialisés en énergie solaire, et amélioration de la sécurité énergétique de la région."
  },
  totalBudget: 150000000,
  location: {
    region: 'Littoral',
    city: 'Cotonou',
    coordinates: [6.379448, 2.451324]
  },
  indicators: [
    {
      id: '1',
      indicatorName: 'Production énergétique',
      baselineValue: '0',
      targetValue: '50',
      latestValue: '32',
      unit: 'MW'
    },
    {
      id: '2',
      indicatorName: 'Réduction CO2',
      baselineValue: '0',
      targetValue: '30',
      latestValue: '19',
      unit: '%'
    },
    {
      id: '3',
      indicatorName: 'Foyers alimentés',
      baselineValue: '0',
      targetValue: '50000',
      latestValue: '32000',
      unit: 'foyers'
    },
    {
      id: '4',
      indicatorName: 'Emplois créés',
      baselineValue: '0',
      targetValue: '200',
      latestValue: '145',
      unit: 'emplois'
    }
  ],
  partners: [
    {
      id: '1',
      name: 'Ministère de l\'Énergie du Bénin',
      type: 'Gouvernemental',
      role: 'Maître d\'ouvrage et supervision stratégique'
    },
    {
      id: '2',
      name: 'Banque Mondiale',
      type: 'Financier',
      role: 'Financement principal du projet'
    },
    {
      id: '3',
      name: 'Société Béninoise d\'Énergie Électrique (SBEE)',
      type: 'Opérateur',
      role: 'Exploitation et maintenance du réseau'
    },
    {
      id: '4',
      name: 'SolarTech International',
      type: 'Technique',
      role: 'Installation et support technique'
    }
  ],
  finances: [
    {
      id: '1',
      fundingSource: 'Banque Mondiale',
      amountCommitedCfa: '80000000',
      amountDisbursedCfa: '52000000',
      currency: 'XOF'
    },
    {
      id: '2',
      fundingSource: 'Gouvernement du Bénin',
      amountCommitedCfa: '50000000',
      amountDisbursedCfa: '35000000',
      currency: 'XOF'
    },
    {
      id: '3',
      fundingSource: 'Fonds Vert pour le Climat',
      amountCommitedCfa: '20000000',
      amountDisbursedCfa: '15000000',
      currency: 'XOF'
    }
  ],
  files: [
    {
      id: '1',
      name: 'Rapport d\'étude de faisabilité.pdf',
      url: '#',
      type: 'PDF',
      size: 2458624
    },
    {
      id: '2',
      name: 'Plan technique détaillé.pdf',
      url: '#',
      type: 'PDF',
      size: 5242880
    },
    {
      id: '3',
      name: 'Analyse d\'impact environnemental.pdf',
      url: '#',
      type: 'PDF',
      size: 3145728
    }
  ],
  activities: [
    {
      id: '1',
      title: 'Étude de faisabilité et conception',
      description: 'Réalisation des études techniques, environnementales et économiques du projet',
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-02-28T00:00:00Z',
      status: 'COMPLETED'
    },
    {
      id: '2',
      title: 'Préparation du terrain',
      description: 'Nivellement du site, installation des infrastructures de base et raccordement au réseau',
      startDate: '2024-03-01T00:00:00Z',
      endDate: '2024-04-30T00:00:00Z',
      status: 'COMPLETED'
    },
    {
      id: '3',
      title: 'Installation des panneaux solaires',
      description: 'Montage et installation des 125 000 panneaux photovoltaïques',
      startDate: '2024-05-01T00:00:00Z',
      endDate: '2024-08-31T00:00:00Z',
      status: 'IN_PROGRESS'
    },
    {
      id: '4',
      title: 'Tests et mise en service',
      description: 'Tests de performance, optimisation et mise en service progressive',
      startDate: '2024-09-01T00:00:00Z',
      endDate: '2024-10-31T00:00:00Z',
      status: 'PLANNED'
    },
    {
      id: '5',
      title: 'Formation et transfert de compétences',
      description: 'Formation du personnel local à l\'exploitation et la maintenance',
      startDate: '2024-11-01T00:00:00Z',
      endDate: '2024-12-31T00:00:00Z',
      status: 'PLANNED'
    }
  ],
  team: [
    {
      id: '1',
      name: 'Dr. Rachid Ahouandjinou',
      role: 'Chef de projet',
      email: 'r.ahouandjinou@energie.bj',
      phone: '+229 97 45 67 89'
    },
    {
      id: '2',
      name: 'Ing. Marie Kossou',
      role: 'Responsable technique',
      email: 'm.kossou@energie.bj',
      phone: '+229 96 23 45 67'
    },
    {
      id: '3',
      name: 'Fabrice Hounmenou',
      role: 'Coordinateur financier',
      email: 'f.hounmenou@energie.bj',
      phone: '+229 95 78 90 12'
    },
    {
      id: '4',
      name: 'Sophie Dossou-Yovo',
      role: 'Chargée de communication',
      email: 's.dossou@energie.bj',
      phone: '+229 94 56 78 90'
    }
  ]
};

// Récupération des données du projet depuis l'API (désactivé pour la démo)
// Commentez la ligne ci-dessous et décommentez les lignes d'après pour utiliser l'API
const project = ref<Project>(mockProject);
const error = ref(null);
const pending = ref(false);

// Décommentez ces lignes pour utiliser l'API réelle
// const { data: project, error, pending } = await useAsyncData<Project>(
//   `project-${route.params.id}`,
//   () => $sisepApi(`projects/${route.params.id}`)
// );

// Calcul de la progression du projet
const completion = computed(() => {
  if (!project.value?.activities?.length) return 0;
  const completed = project.value.activities.filter(a => a.status === 'COMPLETED').length;
  return Math.round((completed / project.value.activities.length) * 100);
});

// Formattage de la date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Formattage du budget
const formatBudget = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount).replace('XOF', 'F CFA');
};

// Calcul du budget total engagé
const totalCommitted = computed(() => {
  if (!project.value?.finances?.length) return 0;
  return project.value.finances.reduce((sum, f) => sum + parseFloat(f.amountCommitedCfa || '0'), 0);
});

// Calcul du budget total décaissé
const totalDisbursed = computed(() => {
  if (!project.value?.finances?.length) return 0;
  return project.value.finances.reduce((sum, f) => sum + parseFloat(f.amountDisbursedCfa || '0'), 0);
});

// Statut de couleur pour les badges
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PUBLISHED: 'bg-green-100 text-green-700 border-green-200',
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[status] || colors.DRAFT;
};

const getActivityStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    COMPLETED: 'border-green-500 bg-green-500',
    IN_PROGRESS: 'border-sisep-hit bg-sisep-hit',
    PLANNED: 'border-blue-500 bg-blue-500',
    DELAYED: 'border-red-500 bg-red-500',
  };
  return colors[status] || colors.PLANNED;
};

const getActivityStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    COMPLETED: 'Terminé',
    IN_PROGRESS: 'En cours',
    PLANNED: 'Planifié',
    DELAYED: 'Retardé',
  };
  return labels[status] || status;
};
</script>

<template>
  <main class="bg-gray-50 min-h-screen">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sisep-hit"></div>
        <p class="mt-4 text-gray-600">Chargement du projet...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !project" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md mx-auto px-4">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Projet introuvable</h2>
        <p class="text-gray-600 mb-6">Le projet que vous recherchez n'existe pas ou a été supprimé.</p>
        <NuxtLink to="/project" class="inline-flex items-center gap-2 bg-sisep-hit text-white px-6 py-3 rounded-xl font-semibold hover:bg-sisep-hit/90 transition-all">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
          Retour aux projets
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- HEADER avec navigation -->
      <header class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div class="h-fit mx-auto absolute top-2 md:top-4 lg:top-7 rounded-2xl shadow-2xl left-0 right-0 z-20 max-w-[95vw] md:max-w-[90vw] bg-white/10 backdrop-blur-xl border border-white/20">
          <div class="flex flex-col md:flex-row gap-2 md:gap-6 justify-between md:justify-start items-center p-2 md:pr-6">
            <div class="img-box flex rounded-xl md:rounded-l-xl bg-gradient-to-br from-white to-gray-50 w-full md:w-fit shadow-inner">
              <div class="w-full md:w-[250px] lg:w-[300px] p-3 md:p-2">
                <NuxtLink to="/" class="block">
                  <img class="h-12 md:h-auto w-auto mx-auto transition-transform duration-300 hover:scale-105" src="~/assets/images/logo_cadre_vie.png" alt="Logo"/>
                </NuxtLink>
              </div>
            </div>
            <Navbar class="w-full md:w-auto"/>
          </div>
        </div>

        <!-- Hero Image -->
        <div class="relative h-[60vh] overflow-hidden">
          <img
            :src="project.coverImage?.url || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop'"
            :alt="project.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          <!-- Breadcrumb -->
          <div class="absolute top-24 left-0 right-0 z-10">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
              <nav class="flex items-center gap-2 text-sm text-white/80">
                <NuxtLink to="/" class="hover:text-white transition-colors">Accueil</NuxtLink>
                <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
                <NuxtLink to="/project" class="hover:text-white transition-colors">Projets</NuxtLink>
                <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
                <span class="text-white font-medium">{{ project.title }}</span>
              </nav>
            </div>
          </div>

          <!-- Project Title & Meta -->
          <div class="absolute bottom-0 left-0 right-0 z-10">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div class="max-w-3xl">
                  <div class="flex flex-wrap items-center gap-3 mb-4">
                    <span class="inline-flex items-center px-3 py-1.5 bg-sisep-hit text-white text-sm font-semibold rounded-full">
                      {{ project.type.name }}
                    </span>
                    <span :class="['inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full border', getStatusColor(project.status)]">
                      <span class="w-2 h-2 rounded-full" :class="project.status === 'PUBLISHED' ? 'bg-green-500 animate-pulse' : 'bg-current'"></span>
                      {{ project.status }}
                    </span>
                    <span class="inline-flex items-center gap-1.5 text-white/90 text-sm">
                      <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                      {{ project.location.city }}, {{ project.location.region }}
                    </span>
                  </div>
                  <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-4">
                    {{ project.title }}
                  </h1>
                  <p class="text-lg text-white/90">{{ project.description }}</p>
                </div>

                <!-- Quick Stats -->
                <div class="flex gap-4">
                  <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center min-w-[120px]">
                    <div class="text-2xl font-bold text-white mb-1">{{ completion }}%</div>
                    <div class="text-xs text-white/80">Avancement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- MAIN CONTENT -->
      <section class="py-12 md:py-16 lg:py-20">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-3 gap-8">

            <!-- Main Content Column -->
            <div class="lg:col-span-2 space-y-8">

              <!-- Description & Objectif -->
              <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                  À propos du projet
                </h2>
                <div class="prose prose-lg max-w-none">
                  <p class="text-gray-700 leading-relaxed mb-6">{{ project.description }}</p>

                  <h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">Objectif principal</h3>
                  <p class="text-gray-700 leading-relaxed">{{ project.objective?.goal }}</p>

                  <h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">Résultats attendus</h3>
                  <p class="text-gray-700 leading-relaxed">{{ project.expectedResults?.result }}</p>
                </div>
              </div>

              <!-- Indicateurs -->
              <div v-if="project.indicators?.length" class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur motion-delay-100">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                  Indicateurs de performance
                </h2>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div v-for="indicator in project.indicators" :key="indicator.id"
                       class="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-sisep-hit/30 hover:shadow-md transition-all duration-300">
                    <h3 class="font-bold text-gray-900 mb-4">{{ indicator.indicatorName }}</h3>
                    <div class="space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Valeur de base</span>
                        <span class="font-semibold text-gray-900">{{ indicator.baselineValue }} {{ indicator.unit }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Valeur cible</span>
                        <span class="font-semibold text-sisep-hit">{{ indicator.targetValue }} {{ indicator.unit }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Valeur actuelle</span>
                        <span class="font-semibold text-green-600">{{ indicator.latestValue }} {{ indicator.unit }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Activités / Timeline -->
              <div v-if="project.activities?.length" class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur motion-delay-200">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                  Activités du projet
                </h2>
                <div class="relative space-y-6">
                  <div v-for="(activity, idx) in project.activities" :key="activity.id"
                       class="relative pl-8 pb-6 last:pb-0">
                    <!-- Timeline line -->
                    <div v-if="idx < project.activities.length - 1"
                         class="absolute left-[7px] top-4 bottom-0 w-0.5"
                         :class="{
                           'bg-green-500': activity.status === 'COMPLETED',
                           'bg-sisep-hit': activity.status === 'IN_PROGRESS',
                           'bg-blue-500': activity.status === 'PLANNED',
                           'bg-red-500': activity.status === 'DELAYED'
                         }"></div>

                    <!-- Timeline dot -->
                    <div class="absolute left-0 top-0 w-4 h-4 rounded-full border-4 border-white shadow-md"
                         :class="{
                           'bg-green-500': activity.status === 'COMPLETED',
                           'bg-sisep-hit': activity.status === 'IN_PROGRESS',
                           'bg-blue-500': activity.status === 'PLANNED',
                           'bg-red-500': activity.status === 'DELAYED'
                         }"
                         :style="activity.status === 'IN_PROGRESS' ? 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;' : ''"></div>

                    <div class="bg-white rounded-xl p-6 border-2 hover:border-sisep-hit/30 hover:shadow-md transition-all duration-300"
                         :class="{
                           'border-green-200 bg-green-50/30': activity.status === 'COMPLETED',
                           'border-sisep-hit/20 bg-sisep-hit/5': activity.status === 'IN_PROGRESS',
                           'border-blue-200 bg-blue-50/30': activity.status === 'PLANNED',
                           'border-red-200 bg-red-50/30': activity.status === 'DELAYED'
                         }">
                      <div class="flex items-start justify-between gap-4 mb-3">
                        <h3 class="font-semibold text-gray-900">{{ activity.title }}</h3>
                        <span class="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0"
                              :class="getStatusColor(activity.status)">
                          {{ getActivityStatusLabel(activity.status) }}
                        </span>
                      </div>
                      <p class="text-sm text-gray-700 mb-3">{{ activity.description }}</p>
                      <div class="flex items-center gap-4 text-xs text-gray-600">
                        <span class="flex items-center gap-1">
                          <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5" />
                          Début: {{ formatDate(activity.startDate) }}
                        </span>
                        <span class="flex items-center gap-1">
                          <UIcon name="i-heroicons-calendar-days" class="w-3.5 h-3.5" />
                          Fin: {{ formatDate(activity.endDate) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Partenaires -->
              <div v-if="project.partners?.length" class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur motion-delay-300">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                  Partenaires
                </h2>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div v-for="partner in project.partners" :key="partner.id"
                       class="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-sisep-hit/30 hover:shadow-md transition-all duration-300">
                    <div class="p-3 bg-white rounded-lg border border-gray-200 flex-shrink-0">
                      <UIcon name="i-heroicons-building-office" class="w-6 h-6 text-sisep-hit" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-gray-900 mb-1">{{ partner.name }}</h3>
                      <p class="text-sm text-gray-600 mb-1">{{ partner.type }}</p>
                      <p class="text-xs text-sisep-hit font-medium">{{ partner.role }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Équipe -->
              <div v-if="project.team?.length" class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur motion-delay-400">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                  Équipe projet
                </h2>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div v-for="member in project.team" :key="member.id"
                       class="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-sisep-hit/30 hover:shadow-md transition-all duration-300">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-sisep-hit to-red-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {{ member.name.charAt(0) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-gray-900">{{ member.name }}</h3>
                      <p class="text-sm text-sisep-hit font-medium mb-2">{{ member.role }}</p>
                      <div class="space-y-1">
                        <a :href="`mailto:${member.email}`" class="text-xs text-gray-600 hover:text-sisep-hit flex items-center gap-1">
                          <UIcon name="i-heroicons-envelope" class="w-3.5 h-3.5" />
                          {{ member.email }}
                        </a>
                        <a v-if="member.phone" :href="`tel:${member.phone}`" class="text-xs text-gray-600 hover:text-sisep-hit flex items-center gap-1">
                          <UIcon name="i-heroicons-phone" class="w-3.5 h-3.5" />
                          {{ member.phone }}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1 space-y-6">

              <!-- Info Card -->
              <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 motion-preset-blur motion-delay-400">
                <h3 class="font-bold text-gray-900 mb-6">Informations clés</h3>

                <div class="space-y-6">
                  <!-- Budget Total -->
                  <div>
                    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <UIcon name="i-heroicons-banknotes" class="w-4 h-4" />
                      Budget total
                    </div>
                    <div class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600">
                      {{ formatBudget(project.totalBudget) }}
                    </div>
                  </div>

                  <!-- Budget engagé -->
                  <div v-if="totalCommitted > 0">
                    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
                      Budget engagé
                    </div>
                    <div class="font-semibold text-gray-900">{{ formatBudget(totalCommitted) }}</div>
                  </div>

                  <!-- Budget décaissé -->
                  <div v-if="totalDisbursed > 0">
                    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <UIcon name="i-heroicons-arrow-trending-up" class="w-4 h-4" />
                      Budget décaissé
                    </div>
                    <div class="font-semibold text-green-600">{{ formatBudget(totalDisbursed) }}</div>
                  </div>

                  <!-- Dates -->
                  <div>
                    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                      Date de début
                    </div>
                    <div class="font-semibold text-gray-900">{{ formatDate(project.startDate) }}</div>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
                      Date de fin
                    </div>
                    <div class="font-semibold text-gray-900">{{ formatDate(project.endDate) }}</div>
                  </div>

                  <!-- Localisation -->
                  <div>
                    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                      Localisation
                    </div>
                    <div class="font-semibold text-gray-900">{{ project.location.city }}</div>
                    <div class="text-sm text-gray-600">{{ project.location.region }}</div>
                  </div>

                  <!-- Progress Bar -->
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-gray-600 text-sm">Avancement</span>
                      <span class="font-bold text-sisep-hit">{{ completion }}%</span>
                    </div>
                    <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-sisep-hit to-red-600 rounded-full transition-all duration-1000"
                           :style="{ width: completion + '%' }"></div>
                    </div>
                  </div>

                  <!-- CTA Buttons -->
                  <div class="pt-4 space-y-3">
                    <button v-if="project.files?.length" class="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sisep-hit to-red-600 hover:from-red-600 hover:to-sisep-hit text-white rounded-xl px-4 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                      Télécharger les documents
                    </button>
                    <button class="w-full inline-flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-sisep-hit text-gray-700 hover:text-sisep-hit rounded-xl px-4 py-3 font-semibold transition-all duration-300">
                      <UIcon name="i-heroicons-share" class="w-5 h-5" />
                      Partager
                    </button>
                  </div>
                </div>
              </div>

              <!-- Finances -->
              <div v-if="project.finances?.length" class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 motion-preset-blur motion-delay-500">
                <h3 class="font-bold text-gray-900 mb-4">Sources de financement</h3>
                <div class="space-y-3">
                  <div v-for="finance in project.finances" :key="finance.id"
                       class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div class="font-semibold text-gray-900 mb-2">{{ finance.fundingSource }}</div>
                    <div class="space-y-1 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Engagé</span>
                        <span class="font-semibold text-gray-900">{{ formatBudget(parseFloat(finance.amountCommitedCfa)) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Décaissé</span>
                        <span class="font-semibold text-green-600">{{ formatBudget(parseFloat(finance.amountDisbursedCfa)) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Documents -->
              <div v-if="project.files?.length" class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 motion-preset-blur motion-delay-600">
                <h3 class="font-bold text-gray-900 mb-4">Documents</h3>
                <div class="space-y-3">
                  <a v-for="doc in project.files" :key="doc.id"
                     :href="doc.url"
                     target="_blank"
                     class="group flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-sisep-hit/30 hover:bg-sisep-hit/5 transition-all duration-300">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <div class="p-2 bg-red-100 rounded-lg">
                        <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-red-600" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-900 truncate">{{ doc.name }}</div>
                        <div class="text-xs text-gray-600">{{ doc.type }} • {{ (doc.size / 1024).toFixed(1) }} KB</div>
                      </div>
                    </div>
                    <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-gray-400 group-hover:text-sisep-hit transition-colors flex-shrink-0" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <!-- SECTION FOOTER -->
      <FooterSiseb />
    </template>
  </main>
</template>
