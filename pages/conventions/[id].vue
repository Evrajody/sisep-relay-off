<script lang="ts" setup>
import Navbar from "~/components/Home/Navbar.vue";
import FooterSiseb from "~/components/Home/FooterSiseb.vue";
import { UIcon } from "#components";

// Mock data - À remplacer par des données réelles
const convention = ref({
  title: 'Accord de Paris sur le climat',
  type: 'Multilatérale',
  status: 'En vigueur',
  date: '2015-12-12',
  ratificationDate: '2016-10-31',
  category: 'Climat',
  description: "L'Accord de Paris est un traité international juridiquement contraignant sur les changements climatiques. Il a été adopté par 196 Parties lors de la COP 21 à Paris, le 12 décembre 2015 et est entré en vigueur le 4 novembre 2016.",
  image: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b5?w=1200&h=600&fit=crop',
  objectives: [
    "Limiter l'augmentation de la température mondiale bien en dessous de 2°C",
    "Poursuivre les efforts pour limiter l'augmentation à 1,5°C",
    "Renforcer la capacité d'adaptation aux impacts du changement climatique",
    "Rendre les flux financiers compatibles avec un développement résilient au climat"
  ],
  signatories: 196,
  articles: [
    {
      number: 'Article 2',
      title: 'Objectif de l\'accord',
      content: 'Le présent Accord vise à renforcer la riposte mondiale à la menace des changements climatiques...'
    },
    {
      number: 'Article 4',
      title: 'Contributions déterminées au niveau national',
      content: 'Afin d\'atteindre l\'objectif de température à long terme énoncé à l\'article 2...'
    },
    {
      number: 'Article 7',
      title: 'Adaptation',
      content: 'Les Parties établissent l\'objectif mondial en matière d\'adaptation...'
    }
  ],
  documents: [
    { name: 'Texte complet de l\'Accord', size: '2.5 MB', type: 'PDF' },
    { name: 'Contribution déterminée du Bénin', size: '1.8 MB', type: 'PDF' },
    { name: 'Rapport de mise en œuvre 2023', size: '3.2 MB', type: 'PDF' }
  ],
  relatedConventions: [
    { title: 'Protocole de Kyoto', category: 'Climat', status: 'Ratifiée' },
    { title: 'Convention-cadre des Nations Unies sur les changements climatiques', category: 'Climat', status: 'En vigueur' }
  ],
  implementations: [
    {
      year: '2016',
      title: 'Ratification par le Bénin',
      description: 'Le Bénin ratifie l\'Accord de Paris et soumet sa première contribution déterminée au niveau national.'
    },
    {
      year: '2019',
      title: 'Plan national d\'adaptation',
      description: 'Lancement du plan national d\'adaptation aux changements climatiques avec des objectifs sectoriels.'
    },
    {
      year: '2021',
      title: 'Contribution mise à jour',
      description: 'Le Bénin soumet une contribution déterminée révisée avec des objectifs plus ambitieux.'
    },
    {
      year: '2023',
      title: 'Rapport de progrès',
      description: 'Publication du premier rapport sur les progrès réalisés dans la mise en œuvre des engagements.'
    }
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
              <a href="/" class="block">
                <img class="h-12 md:h-auto w-auto mx-auto transition-transform duration-300 hover:scale-105" src="~/assets/images/logo_cadre_vie.png" alt="Logo"/>
              </a>
            </div>
          </div>
          <Navbar class="w-full md:w-auto"/>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="relative h-[60vh] overflow-hidden">
        <img :src="convention.image" :alt="convention.title" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <!-- Breadcrumb -->
        <div class="absolute top-24 left-0 right-0 z-10">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="flex items-center gap-2 text-sm text-white/80">
              <NuxtLink to="/" class="hover:text-white transition-colors">Accueil</NuxtLink>
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
                <span class="inline-flex items-center px-3 py-1.5 bg-sisep-hit text-white text-sm font-semibold rounded-full">
                  {{ convention.category }}
                </span>
                <span class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  {{ convention.type }}
                </span>
                <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/40">
                  <span class="w-2 h-2 rounded-full bg-green-400"></span>
                  {{ convention.status }}
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
                <div class="text-center p-4 bg-gray-50 rounded-xl">
                  <div class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600 mb-1">
                    {{ convention.signatories }}
                  </div>
                  <div class="text-sm text-gray-600">Signataires</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-xl">
                  <div class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600 mb-1">
                    2015
                  </div>
                  <div class="text-sm text-gray-600">Année d'adoption</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-xl">
                  <div class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600 mb-1">
                    2016
                  </div>
                  <div class="text-sm text-gray-600">Entrée en vigueur</div>
                </div>
              </div>
            </div>

            <!-- Objectifs -->
            <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur motion-delay-100">
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
            <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur motion-delay-200">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                Articles clés
              </h2>
              <div class="space-y-4">
                <div v-for="(article, idx) in convention.articles" :key="idx"
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
            <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 motion-preset-blur motion-delay-300">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div class="w-1 h-8 bg-gradient-to-b from-sisep-hit to-red-600 rounded-full"></div>
                Mise en œuvre au Bénin
              </h2>
              <div class="relative">
                <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sisep-hit to-red-600"></div>

                <div v-for="(impl, idx) in convention.implementations" :key="idx" class="relative pl-20 pb-10 last:pb-0">
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
                <!-- Date de signature -->
                <div>
                  <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                    Date de signature
                  </div>
                  <div class="font-semibold text-gray-900">{{ convention.date }}</div>
                </div>

                <!-- Date de ratification -->
                <div>
                  <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <UIcon name="i-heroicons-check-badge" class="w-4 h-4" />
                    Ratification par le Bénin
                  </div>
                  <div class="font-semibold text-gray-900">{{ convention.ratificationDate }}</div>
                </div>

                <!-- Type -->
                <div>
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
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    {{ convention.status }}
                  </span>
                </div>

                <!-- CTA Buttons -->
                <div class="pt-4 space-y-3">
                  <button class="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sisep-hit to-red-600 hover:from-red-600 hover:to-sisep-hit text-white rounded-xl px-4 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
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
            <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 motion-preset-blur motion-delay-500">
              <h3 class="font-bold text-gray-900 mb-4">Documents</h3>
              <div class="space-y-3">
                <a v-for="(doc, idx) in convention.documents" :key="idx"
                   href="#"
                   class="group flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-sisep-hit/30 hover:bg-sisep-hit/5 transition-all duration-300">
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div class="p-2 bg-red-100 rounded-lg">
                      <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-red-600" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-gray-900 truncate">{{ doc.name }}</div>
                      <div class="text-xs text-gray-600">{{ doc.type }} • {{ doc.size }}</div>
                    </div>
                  </div>
                  <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-gray-400 group-hover:text-sisep-hit transition-colors flex-shrink-0" />
                </a>
              </div>
            </div>

            <!-- Conventions liées -->
            <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 motion-preset-blur motion-delay-600">
              <h3 class="font-bold text-gray-900 mb-4">Conventions liées</h3>
              <div class="space-y-3">
                <NuxtLink v-for="(related, idx) in convention.relatedConventions" :key="idx"
                          to="#"
                          class="group block p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-sisep-hit/30 hover:bg-sisep-hit/5 transition-all duration-300">
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <h4 class="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-sisep-hit transition-colors">{{ related.title }}</h4>
                    <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-gray-400 group-hover:text-sisep-hit transition-colors flex-shrink-0 mt-0.5" />
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs px-2 py-1 bg-sisep-hit/10 text-sisep-hit rounded-full font-medium">{{ related.category }}</span>
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
  </main>
</template>
