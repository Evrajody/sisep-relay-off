<script lang="ts" setup>
import Navbar from "~/components/Home/Navbar.vue";
import FooterSiseb from "~/components/Home/FooterSiseb.vue";
import { UIcon } from "#components";

// Mock data - À remplacer par des données réelles
const project = ref({
  title: 'Parc Solaire de Cotonou',
  category: 'Énergie',
  status: 'En cours',
  location: 'Cotonou',
  date: '12/03/2024',
  budget: '150 000 000 F CFA',
  completion: 65,
  description: "Déploiement d'un parc solaire pour renforcer la capacité énergétique renouvelable de la ville de Cotonou. Ce projet s'inscrit dans la stratégie nationale de transition énergétique.",
  image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=600&fit=crop',
  coords: [6.379448, 2.451324],
  objectives: [
    "Produire 50 MW d'énergie solaire propre",
    "Réduire les émissions de CO2 de 30%",
    "Créer 200 emplois directs et indirects",
    "Former 100 techniciens aux technologies solaires"
  ],
  timeline: [
    { phase: 'Étude de faisabilité', status: 'completed', date: 'Jan 2024' },
    { phase: 'Conception technique', status: 'completed', date: 'Fév 2024' },
    { phase: 'Construction phase 1', status: 'in_progress', date: 'Mar - Juin 2024' },
    { phase: 'Tests et mise en service', status: 'pending', date: 'Juil 2024' },
    { phase: 'Exploitation complète', status: 'pending', date: 'Août 2024' }
  ],
  partners: [
    { name: 'Ministère de l\'Énergie', logo: '/images/logo_cadre_vie.png' },
    { name: 'Banque Mondiale', logo: '/images/gdiz_logo.png' },
    { name: 'SBPE', logo: '/images/sbpe_log.png' }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600',
    'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600',
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600',
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600'
  ]
});
</script>

<template>
  <main class="bg-gray-50">
    <!-- HEADER avec navigation -->
    <header class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div class="h-fit mx-auto absolute top-2 md:top-4 lg:top-7 rounded-2xl shadow-2xl left-0 right-0 z-20 max-w-[95vw] md:max-w-[90vw] bg-white/10 backdrop-blur-xl border border-white/20">
        <div class="flex flex-col md:flex-row gap-2 md:gap-6 justify-between md:justify-start items-center p-2 md:pr-6">
          <div class="img-box flex rounded-xl md:rounded-l-xl bg-gradient-to-br from-white to-gray-50 w-full md:w-fit shadow-inner">
            <div class="w-full md:w-[250px] lg:w-[300px] p-3 md:p-2">
              <a href="/public" class="block">
                <img class="h-12 md:h-auto w-auto mx-auto transition-transform duration-300 hover:scale-105" src="~/assets/images/logo_cadre_vie.png" alt="Logo"/>
              </a>
            </div>
          </div>
          <Navbar class="w-full md:w-auto"/>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="relative h-[60vh] overflow-hidden">
        <img :src="project.image" :alt="project.title" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <!-- Breadcrumb -->
        <div class="absolute top-24 left-0 right-0 z-10">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="flex items-center gap-2 text-sm text-white/80">
              <NuxtLink to="/public" class="hover:text-white transition-colors">Accueil</NuxtLink>
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
                    {{ project.category }}
                  </span>
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/40">
                    <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    {{ project.status }}
                  </span>
                  <span class="inline-flex items-center gap-1.5 text-white/90 text-sm">
                    <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                    {{ project.location }}
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
                  <div class="text-2xl font-bold text-white mb-1">{{ project.completion }}%</div>
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

            <!-- Description Détaillée -->
            <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                À propos du projet
              </h2>
              <p class="text-gray-700 leading-relaxed text-lg">
                {{ project.description }}
              </p>
            </div>

            <!-- Objectifs -->
            <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur motion-delay-100">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                Objectifs
              </h2>
              <div class="grid sm:grid-cols-2 gap-4">
                <div v-for="(objective, idx) in project.objectives" :key="idx"
                     class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-sisep-hit/30 hover:bg-sisep-hit/5 transition-all duration-300">
                  <div class="mt-1 p-1.5 bg-gradient-to-br from-sisep-hit to-red-600 rounded-lg flex-shrink-0">
                    <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
                  </div>
                  <span class="text-gray-700 text-sm leading-relaxed">{{ objective }}</span>
                </div>
              </div>
            </div>

            <!-- Timeline -->
            <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur motion-delay-200">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                Chronologie du projet
              </h2>
              <div class="relative space-y-6">
                <div v-for="(phase, idx) in project.timeline" :key="idx"
                     class="relative pl-8 pb-6 border-l-2"
                     :class="phase.status === 'completed' ? 'border-green-500' : phase.status === 'in_progress' ? 'border-sisep-hit' : 'border-gray-300'">
                  <!-- Timeline dot -->
                  <div class="absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-white"
                       :class="phase.status === 'completed' ? 'bg-green-500' : phase.status === 'in_progress' ? 'bg-sisep-hit animate-pulse' : 'bg-gray-300'"></div>

                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <h3 class="font-semibold text-gray-900 mb-1">{{ phase.phase }}</h3>
                      <p class="text-sm text-gray-600">{{ phase.date }}</p>
                    </div>
                    <span v-if="phase.status === 'completed'"
                          class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      <UIcon name="i-heroicons-check-circle" class="w-3.5 h-3.5" />
                      Terminé
                    </span>
                    <span v-else-if="phase.status === 'in_progress'"
                          class="inline-flex items-center gap-1 px-3 py-1 bg-sisep-hit/10 text-sisep-hit text-xs font-semibold rounded-full">
                      <UIcon name="i-heroicons-arrow-path" class="w-3.5 h-3.5 animate-spin" />
                      En cours
                    </span>
                    <span v-else
                          class="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                      <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
                      À venir
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Galerie Photos -->
            <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur motion-delay-300">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                Galerie
              </h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="(img, idx) in project.gallery" :key="idx"
                     class="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <img :src="img" :alt="`Galerie ${idx + 1}`" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                <!-- Budget -->
                <div>
                  <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <UIcon name="i-heroicons-banknotes" class="w-4 h-4" />
                    Budget
                  </div>
                  <div class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600">
                    {{ project.budget }}
                  </div>
                </div>

                <!-- Date de début -->
                <div>
                  <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                    Date de début
                  </div>
                  <div class="font-semibold text-gray-900">{{ project.date }}</div>
                </div>

                <!-- Localisation -->
                <div>
                  <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                    Localisation
                  </div>
                  <div class="font-semibold text-gray-900">{{ project.location }}</div>
                </div>

                <!-- Progress Bar -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-gray-600 text-sm">Avancement</span>
                    <span class="font-bold text-sisep-hit">{{ project.completion }}%</span>
                  </div>
                  <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-sisep-hit to-red-600 rounded-full transition-all duration-1000"
                         :style="{ width: project.completion + '%' }"></div>
                  </div>
                </div>

                <!-- CTA Buttons -->
                <div class="pt-4 space-y-3">
                  <button class="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sisep-hit to-red-600 hover:from-red-600 hover:to-sisep-hit text-white rounded-xl px-4 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                    Télécharger le rapport
                  </button>
                  <button class="w-full inline-flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-sisep-hit text-gray-700 hover:text-sisep-hit rounded-xl px-4 py-3 font-semibold transition-all duration-300">
                    <UIcon name="i-heroicons-share" class="w-5 h-5" />
                    Partager
                  </button>
                </div>
              </div>
            </div>

            <!-- Partenaires -->
            <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 motion-preset-blur motion-delay-500">
              <h3 class="font-bold text-gray-900 mb-4">Partenaires</h3>
              <div class="space-y-4">
                <div v-for="(partner, idx) in project.partners" :key="idx"
                     class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-sisep-hit/30 hover:bg-sisep-hit/5 transition-all duration-300">
                  <img :src="partner.logo" :alt="partner.name" class="w-12 h-12 object-contain" />
                  <span class="text-sm font-medium text-gray-700">{{ partner.name }}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>

    <!-- SECTION FOOTER -->
    <FooterSiseb />
  </main>
</template>
