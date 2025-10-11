<script lang="ts" setup>
import type { Convention } from "~/types";
import Navbar from "~/components/Home/Navbar.vue";
import FooterSiseb from "~/components/Home/FooterSiseb.vue";

const route = useRoute();
const { $sisepApi } = useNuxtApp();

// Données mockées pour la convention "Accord de Paris sur le climat"
const mockConvention: Convention = {
  id: route.params.id as string,
  title: "Accord de Paris sur le climat",
  description: "L'Accord de Paris est un traité international juridiquement contraignant sur les changements climatiques. Il a été adopté par 196 Parties lors de la COP 21 à Paris, le 12 décembre 2015 et est entré en vigueur le 4 novembre 2016. Son objectif est de limiter le réchauffement climatique à un niveau bien inférieur à 2, de préférence à 1,5 degré Celsius, par rapport au niveau préindustriel.",
  functionalGroup: "Environnement et Développement Durable",
  adoptionDate: "2015-12-12T00:00:00.000Z",
  effectiveDate: "2016-11-04T00:00:00.000Z",
  ratificationDate: "2016-10-31T00:00:00.000Z",
  status: 'ACTIVE',
  isPublished: true,
  type: "Multilatérale",
  category: "Environnement",
  signatories: 196,
  objectives: [
    "Maintenir l'augmentation de la température moyenne mondiale bien en dessous de 2°C au-dessus des niveaux préindustriels",
    "Poursuivre les efforts pour limiter l'augmentation de la température à 1,5°C au-dessus des niveaux préindustriels",
    "Renforcer la capacité d'adaptation aux impacts négatifs des changements climatiques et promouvoir la résilience climatique",
    "Rendre les flux financiers compatibles avec un profil d'évolution vers un développement à faible émission de gaz à effet de serre et résilient aux changements climatiques",
    "Accroître la transparence et le renforcement mutuel de la confiance entre les pays signataires"
  ],
  articles: [
    {
      id: "art-2",
      number: "Article 2",
      title: "Objectif de l'Accord",
      content: "Le présent Accord vise à renforcer la riposte mondiale à la menace des changements climatiques en maintenant l'élévation de la température moyenne de la planète bien en dessous de 2°C et en poursuivant l'action menée pour la limiter à 1,5°C."
    },
    {
      id: "art-4",
      number: "Article 4",
      title: "Contributions déterminées au niveau national",
      content: "Chaque Partie établit, communique et actualise ses contributions déterminées au niveau national (CDN) qu'elle prévoit de réaliser. Les Parties s'efforcent d'adopter des stratégies à long terme de développement sobre en carbone."
    },
    {
      id: "art-7",
      number: "Article 7",
      title: "Adaptation aux changements climatiques",
      content: "Les Parties établissent l'objectif mondial en matière d'adaptation, qui consiste à renforcer les capacités d'adaptation, à accroître la résilience et à réduire la vulnérabilité aux changements climatiques."
    },
    {
      id: "art-9",
      number: "Article 9",
      title: "Financement climatique",
      content: "Les pays développés Parties devraient continuer de montrer la voie en mobilisant un financement de la lutte contre les changements climatiques en faveur des pays en développement."
    }
  ],
  documents: [
    {
      id: "doc-1",
      name: "Texte intégral de l'Accord de Paris",
      type: "PDF",
      url: "#",
      size: 2457600,
      uploadedAt: "2016-11-04T00:00:00.000Z"
    },
    {
      id: "doc-2",
      name: "CDN du Bénin - Version actualisée 2021",
      type: "PDF",
      url: "#",
      size: 3145728,
      uploadedAt: "2021-07-15T00:00:00.000Z"
    },
    {
      id: "doc-3",
      name: "Plan National d'Adaptation du Bénin",
      type: "PDF",
      url: "#",
      size: 5242880,
      uploadedAt: "2020-09-10T00:00:00.000Z"
    },
    {
      id: "doc-4",
      name: "Rapport de mise en œuvre 2023",
      type: "PDF",
      url: "#",
      size: 1835008,
      uploadedAt: "2023-11-20T00:00:00.000Z"
    }
  ],
  implementations: [
    {
      id: "impl-1",
      year: "2016",
      title: "Ratification de l'Accord de Paris",
      description: "Le Bénin a ratifié l'Accord de Paris le 31 octobre 2016, démontrant son engagement ferme dans la lutte contre les changements climatiques et le développement durable.",
      status: "COMPLETED"
    },
    {
      id: "impl-2",
      year: "2019",
      title: "Élaboration du Plan National d'Adaptation",
      description: "Mise en place d'un plan national d'adaptation pour renforcer la résilience face aux impacts des changements climatiques, particulièrement dans les secteurs de l'agriculture et des ressources en eau.",
      status: "COMPLETED"
    },
    {
      id: "impl-3",
      year: "2021",
      title: "Actualisation de la CDN",
      description: "Le Bénin a soumis sa Contribution Déterminée au niveau National (CDN) actualisée avec des objectifs plus ambitieux de réduction des émissions de gaz à effet de serre de 28,7% d'ici 2030.",
      status: "COMPLETED"
    },
    {
      id: "impl-4",
      year: "2023",
      title: "Projet d'énergies renouvelables",
      description: "Lancement de plusieurs projets d'énergies renouvelables incluant le parc solaire de Cotonou et des centrales photovoltaïques pour atteindre 30% d'énergies renouvelables dans le mix énergétique national.",
      status: "IN_PROGRESS"
    },
    {
      id: "impl-5",
      year: "2025",
      title: "Programme de reboisement national",
      description: "Projet ambitieux visant à reboiser 500 000 hectares de forêts d'ici 2030 pour renforcer la séquestration du carbone et protéger la biodiversité.",
      status: "PLANNED"
    }
  ],
  relatedConventions: [
    {
      id: "2",
      title: "Convention-cadre des Nations Unies sur les changements climatiques (CCNUCC)",
      category: "Environnement",
      status: "En vigueur"
    },
    {
      id: "3",
      title: "Protocole de Kyoto",
      category: "Environnement",
      status: "En vigueur"
    },
    {
      id: "4",
      title: "Convention sur la diversité biologique",
      category: "Environnement",
      status: "En vigueur"
    }
  ],
  coverImage: {
    url: "https://images.unsplash.com/photo-1569163139402-38c1f8c1c4ac?w=1200&h=600&fit=crop",
    alt: "Accord de Paris sur le climat",
    width: 1200,
    height: 600
  },
  createdAt: "2015-12-12T00:00:00.000Z",
  updatedAt: "2023-11-20T00:00:00.000Z"
};

// Utilisation des données mockées au lieu de l'API
const convention = ref<Convention>(mockConvention);
const error = ref(null);
const pending = ref(false);

// Récupération des données de la convention depuis l'API (commenté pour utiliser les données mockées)
// const { data: convention, error, pending } = await useAsyncData<Convention>(
//   `convention-${route.params.id}`,
//   () => $sisepApi(`conventions/${route.params.id}`)
// );

// Formattage de la date
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Statut de couleur pour les badges
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700 border-green-200',
    DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
    SUSPENDED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    TERMINATED: 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[status] || colors.DRAFT;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    ACTIVE: 'En vigueur',
    DRAFT: 'Brouillon',
    SUSPENDED: 'Suspendue',
    TERMINATED: 'Terminée',
  };
  return labels[status] || status;
};

const getStatusDot = (status: string) => {
  const colors: Record<string, string> = {
    ACTIVE: 'bg-green-500',
    DRAFT: 'bg-gray-500',
    SUSPENDED: 'bg-yellow-500',
    TERMINATED: 'bg-red-500',
  };
  return colors[status] || colors.DRAFT;
};

// Calcul de l'année d'adoption
const adoptionYear = computed(() => {
  if (!convention.value?.adoptionDate) return '';
  return new Date(convention.value.adoptionDate).getFullYear();
});

// Calcul de l'année d'entrée en vigueur
const effectiveYear = computed(() => {
  if (!convention.value?.effectiveDate) return '';
  return new Date(convention.value.effectiveDate).getFullYear();
});
</script>

<template>
  <main class="bg-gray-50 min-h-screen">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sisep-hit"></div>
        <p class="mt-4 text-gray-600">Chargement de la convention...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !convention" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md mx-auto px-4">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Convention introuvable</h2>
        <p class="text-gray-600 mb-6">La convention que vous recherchez n'existe pas ou a été supprimée.</p>
        <NuxtLink to="/conventions" class="inline-flex items-center gap-2 bg-sisep-hit text-white px-6 py-3 rounded-xl font-semibold hover:bg-sisep-hit/90 transition-all">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
          Retour aux conventions
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
                <NuxtLink to="/public" class="block">
                  <img class="h-12 md:h-auto w-auto mx-auto transition-transform duration-300 hover:scale-105" src="../../../assets/images/logo_cadre_vie.png" alt="Logo"/>
                </NuxtLink>
              </div>
            </div>
            <Navbar class="w-full md:w-auto"/>
          </div>
        </div>

        <!-- Hero Image -->
        <div class="relative h-[60vh] overflow-hidden">
          <img
            :src="convention.coverImage?.url || 'https://images.unsplash.com/photo-1569163139402-38c1f8c1c4ac?w=1200&h=600&fit=crop'"
            :alt="convention.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          <!-- Breadcrumb -->
          <div class="absolute top-24 left-0 right-0 z-10">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
              <nav class="flex items-center gap-2 text-sm text-white/80">
                <NuxtLink to="/public" class="hover:text-white transition-colors">Accueil</NuxtLink>
                <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
                <NuxtLink to="/conventions" class="hover:text-white transition-colors">Conventions</NuxtLink>
                <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
                <span class="text-white font-medium">{{ convention.title }}</span>
              </nav>
            </div>
          </div>

          <!-- Convention Title & Meta -->
          <div class="absolute bottom-0 left-0 right-0 z-10">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div class="max-w-4xl">
                <div class="flex flex-wrap items-center gap-3 mb-4">
                  <span v-if="convention.category" class="inline-flex items-center px-3 py-1.5 bg-sisep-hit text-white text-sm font-semibold rounded-full">
                    {{ convention.category }}
                  </span>
                  <span v-if="convention.type" class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full">
                    {{ convention.type }}
                  </span>
                  <span :class="['inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full border', getStatusColor(convention.status)]">
                    <span class="w-2 h-2 rounded-full" :class="[getStatusDot(convention.status), convention.status === 'ACTIVE' ? 'animate-pulse' : '']"></span>
                    {{ getStatusLabel(convention.status) }}
                  </span>
                  <span v-if="convention.isPublished" class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/40">
                    <UIcon name="i-heroicons-check-badge" class="w-4 h-4" />
                    Publiée
                  </span>
                </div>
                <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-4">
                  {{ convention.title }}
                </h1>
                <p class="text-lg text-white/90">{{ convention.description }}</p>
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

              <!-- Description Détaillée -->
              <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                  À propos de la convention
                </h2>
                <p class="text-gray-700 leading-relaxed text-lg mb-6">
                  {{ convention.description }}
                </p>

                <!-- Stats rapides -->
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                  <div v-if="convention.signatories" class="text-center p-4 bg-gray-50 rounded-xl">
                    <div class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600 mb-1">
                      {{ convention.signatories }}
                    </div>
                    <div class="text-sm text-gray-600">Signataires</div>
                  </div>
                  <div v-if="adoptionYear" class="text-center p-4 bg-gray-50 rounded-xl">
                    <div class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600 mb-1">
                      {{ adoptionYear }}
                    </div>
                    <div class="text-sm text-gray-600">Année d'adoption</div>
                  </div>
                  <div v-if="effectiveYear" class="text-center p-4 bg-gray-50 rounded-xl">
                    <div class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600 mb-1">
                      {{ effectiveYear }}
                    </div>
                    <div class="text-sm text-gray-600">Entrée en vigueur</div>
                  </div>
                </div>
              </div>

              <!-- Objectifs -->
              <div v-if="convention.objectives?.length" class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur motion-delay-100">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                  Objectifs principaux
                </h2>
                <div class="space-y-4">
                  <div v-for="(objective, idx) in convention.objectives" :key="idx"
                       class="flex items-start gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-sisep-hit/30 hover:shadow-md transition-all duration-300">
                    <div class="mt-1 p-2 bg-gradient-to-br from-sisep-hit to-red-600 rounded-lg flex-shrink-0">
                      <UIcon name="i-heroicons-check" class="w-5 h-5 text-white" />
                    </div>
                    <span class="text-gray-700 leading-relaxed">{{ objective }}</span>
                  </div>
                </div>
              </div>

              <!-- Articles Clés -->
              <div v-if="convention.articles?.length" class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur motion-delay-200">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                  Articles clés
                </h2>
                <div class="space-y-4">
                  <div v-for="article in convention.articles" :key="article.id"
                       class="border border-gray-200 rounded-xl overflow-hidden hover:border-sisep-hit/30 hover:shadow-md transition-all duration-300">
                    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div class="flex items-center gap-3">
                        <span class="px-3 py-1 bg-sisep-hit text-white text-xs font-bold rounded-full">
                          {{ article.number }}
                        </span>
                        <h3 class="font-bold text-gray-900">{{ article.title }}</h3>
                      </div>
                    </div>
                    <div class="p-6">
                      <p class="text-gray-700 leading-relaxed">{{ article.content }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mise en œuvre au Bénin -->
              <div v-if="convention.implementations?.length" class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur motion-delay-300">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                  Mise en œuvre au Bénin
                </h2>
                <div class="relative">
                  <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sisep-hit to-red-600"></div>

                  <div v-for="impl in convention.implementations" :key="impl.id" class="relative pl-20 pb-10 last:pb-0">
                    <!-- Year badge -->
                    <div class="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-sisep-hit to-red-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {{ impl.year }}
                    </div>

                    <div class="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-sisep-hit/30 hover:shadow-md transition-all duration-300">
                      <h3 class="font-bold text-gray-900 mb-2">{{ impl.title }}</h3>
                      <p class="text-gray-700 leading-relaxed">{{ impl.description }}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1 space-y-6">

              <!-- Info Card -->
              <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24 motion-preset-blur motion-delay-400">
                <h3 class="font-bold text-gray-900 mb-6">Informations clés</h3>

                <div class="space-y-6">
                  <!-- Groupe fonctionnel -->
                  <div>
                    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <UIcon name="i-heroicons-user-group" class="w-4 h-4" />
                      Groupe fonctionnel
                    </div>
                    <div class="font-semibold text-gray-900">{{ convention.functionalGroup }}</div>
                  </div>

                  <!-- Date d'adoption -->
                  <div>
                    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                      Date d'adoption
                    </div>
                    <div class="font-semibold text-gray-900">{{ formatDate(convention.adoptionDate) }}</div>
                  </div>

                  <!-- Date d'entrée en vigueur -->
                  <div>
                    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
                      Entrée en vigueur
                    </div>
                    <div class="font-semibold text-gray-900">{{ formatDate(convention.effectiveDate) }}</div>
                  </div>

                  <!-- Date de ratification -->
                  <div v-if="convention.ratificationDate">
                    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <UIcon name="i-heroicons-check-badge" class="w-4 h-4" />
                      Ratification par le Bénin
                    </div>
                    <div class="font-semibold text-gray-900">{{ formatDate(convention.ratificationDate) }}</div>
                  </div>

                  <!-- Type -->
                  <div v-if="convention.type">
                    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
                      Type de convention
                    </div>
                    <div class="font-semibold text-gray-900">{{ convention.type }}</div>
                  </div>

                  <!-- Statut -->
                  <div>
                    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <UIcon name="i-heroicons-signal" class="w-4 h-4" />
                      Statut
                    </div>
                    <span :class="['inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full', getStatusColor(convention.status)]">
                      <span class="w-2 h-2 rounded-full" :class="getStatusDot(convention.status)"></span>
                      {{ getStatusLabel(convention.status) }}
                    </span>
                  </div>

                  <!-- CTA Buttons -->
                  <div class="pt-4 space-y-3">
                    <button v-if="convention.documents?.length" class="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sisep-hit to-red-600 hover:from-red-600 hover:to-sisep-hit text-white rounded-xl px-4 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      <UIcon name="i-heroicons-document-arrow-down" class="w-5 h-5" />
                      Télécharger le texte
                    </button>
                    <button class="w-full inline-flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-sisep-hit text-gray-700 hover:text-sisep-hit rounded-xl px-4 py-3 font-semibold transition-all duration-300">
                      <UIcon name="i-heroicons-share" class="w-5 h-5" />
                      Partager
                    </button>
                  </div>
                </div>
              </div>

              <!-- Documents associés -->
              <div v-if="convention.documents?.length" class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 motion-preset-blur motion-delay-500">
                <h3 class="font-bold text-gray-900 mb-4">Documents</h3>
                <div class="space-y-3">
                  <a v-for="doc in convention.documents" :key="doc.id"
                     :href="doc.url"
                     target="_blank"
                     class="group flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-sisep-hit/30 hover:bg-sisep-hit/5 transition-all duration-300">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <div class="p-2 bg-red-100 rounded-lg">
                        <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-red-600" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-900 truncate">{{ doc.name }}</div>
                        <div class="text-xs text-gray-600">{{ doc.type }} • {{ (doc.size / 1024 / 1024).toFixed(1) }} MB</div>
                      </div>
                    </div>
                    <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-gray-400 group-hover:text-sisep-hit transition-colors flex-shrink-0" />
                  </a>
                </div>
              </div>

              <!-- Conventions liées -->
              <div v-if="convention.relatedConventions?.length" class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 motion-preset-blur motion-delay-600">
                <h3 class="font-bold text-gray-900 mb-4">Conventions liées</h3>
                <div class="space-y-3">
                  <NuxtLink v-for="related in convention.relatedConventions" :key="related.id"
                            :to="`/conventions/single/${related.id}`"
                            class="group block p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-sisep-hit/30 hover:bg-sisep-hit/5 transition-all duration-300">
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <h4 class="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-sisep-hit transition-colors">{{ related.title }}</h4>
                      <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-gray-400 group-hover:text-sisep-hit transition-colors flex-shrink-0 mt-0.5" />
                    </div>
                    <div class="flex items-center gap-2">
                      <span v-if="related.category" class="text-xs px-2 py-1 bg-sisep-hit/10 text-sisep-hit rounded-full font-medium">{{ related.category }}</span>
                      <span class="text-xs text-gray-600">{{ related.status }}</span>
                    </div>
                  </NuxtLink>
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
