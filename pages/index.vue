<script lang="ts" setup>

import Vue3autocounter from "vue3-autocounter";
import FooterSiseb from "~/components/Home/FooterSiseb.vue";
import Navbar from "~/components/Home/Navbar.vue";
import ProjectCard from "~/components/Home/ProjectCard.vue";
import ConventionCard from "~/components/Home/ConventionCard.vue";

// Définir le layout spécifique pour la page d'accueil
definePageMeta({
  layout: "home",
});

// Hero carousel state
const slides = reactive([
  {
    title: "Données clés sur le cadre de vies",
    subtitle: "Faits et informations pour orienter l'action publique",
    image: "cadre_world.webp",
    cta: { label: "Explorer les données", href: "/" }
  },
  {
    title: "Projets structurants",
    subtitle: "Suivez l'avancée des grands chantiers",
    image: "media_travaux.jpeg",
    cta: { label: "Voir les projets", href: "/project" }
  },
  {
    title: "Conventions et engagements",
    subtitle: "Découvrez les accords majeurs pour l'environnement",
    image: "img-odds.png",
    cta: { label: "Parcourir", href: "/conventions" }
  }
])

const currentSlide = ref(0)
const progress = ref(0) // 0..100
const isPlaying = ref(true)
const SLIDE_DURATION = 7000 // ms
let rafId: number | null = null
let startTs = 0

function step(ts: number) {
  if (!isPlaying.value) return
  if (!startTs) startTs = ts
  const elapsed = ts - startTs
  progress.value = Math.min(100, (elapsed / SLIDE_DURATION) * 100)
  if (elapsed >= SLIDE_DURATION) {
    nextSlide()
    startTs = ts
    progress.value = 0
  }
  rafId = requestAnimationFrame(step)
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}
function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}
function goToSlide(i: number) {
  currentSlide.value = i
  startTs = performance.now()
  progress.value = 0
}

onMounted(() => {
  rafId = requestAnimationFrame(step)
})
onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

const cadresSearchElements = reactive([

  {
    label: "Conditions physiques",
    href: "#",
  },

  {
    label: "Ressources minérales",
    href: "#",
  },

  {
    label: "Ressources énergétiques",
    href: "#",
  },

  {
    label: "Terres",
    href: "#",
  },
  {
    label: "Ressources en eau",
    href: "#",
  },

  {
    label: "Ressources biologiques",
    href: "#",
  },

  {
    label: "Établissements humains",
    href: "#",
  },
  {
    label: "Libération de substances chimiques",
    href: "#",
  },
  {
    label: "Émissions dans l'air",
    href: "#",
  },
  {
    label: "Établissements humains",
    href: "#",
  },
  {
    label: "Santé environnementale",
    href: "#",
  },
  {
    label: "Dépenses de protection de l'environnement et de gestion des ressources",
    href: "#",
  },


])

const partenairesImg = reactive([

  {
    label: "1",
    href: "#",
    src: "logo_cadre_vie.png"
  },

  {
    label: "2",
    href: "#",
    src: "gdiz_logo.png"
  },

  {
    label: "2",
    href: "#",
    src: "sbpe_log.png"
  },

  {
    label: "2",
    href: "#",
    src: "sobrebra.png"
  }


])

const statsImg = reactive([

  {
    label: "Catégories",
    href: "#",
    value: "12",
    src: "categories.png"
  },

  {
    label: "Structures",
    href: "#",
    value: "12",
    src: "structures.png"
  },

  {
    label: "Indicateurs",
    href: "#",
    value: "200",
    src: "indicateurs.png"
  },

  {
    label: "Données",
    href: "#",
    value: "150",
    src: "donnees.png"
  }

])


</script>

<template>

  <main class="">

    <!-- SECTION BANNIÈRE PRINCIPALE: CAROUSEL -->
    <header class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <!-- Top nav bar with brand + navbar overlay - Enhanced glassmorphism -->
      <div class="h-fit mx-auto absolute top-2 md:top-4 lg:top-7 rounded-2xl shadow-2xl left-0 right-0 z-20 max-w-[95vw] md:max-w-[90vw] bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 hover:shadow-3xl motion-preset-fade">
        <div class="flex flex-col md:flex-row gap-2 md:gap-6 justify-between md:justify-start items-center p-2 md:pr-6">
          <div class="img-box flex rounded-xl md:rounded-l-xl bg-gradient-to-br from-white to-gray-50 w-full md:w-fit shadow-inner transform transition-transform duration-300 hover:scale-[1.02]">
            <div class="w-full md:w-[250px] lg:w-[300px] p-3 md:p-2">
              <a href="/" class="block"><img class="h-12 md:h-auto w-auto mx-auto transition-transform duration-300 hover:scale-105" src="~/assets/images/logo_cadre_vie.png" alt="Logo Cadre de Vie"></a>
            </div>
          </div>
          <Navbar class="w-full md:w-auto"/>
        </div>
      </div>

      <div class="relative h-[55vh] sm:h-[65vh] md:h-[75vh] lg:h-[85vh] overflow-hidden">
        <!-- Slides with parallax effect -->
        <div class="absolute inset-0">
          <transition name="fade-scale" mode="out-in">
            <div :key="currentSlide" class="absolute inset-0">
              <img
                :src="`/images/${slides[currentSlide].image}`"
                :alt="slides[currentSlide].title"
                class="w-full h-full object-cover scale-110 animate-ken-burns"
                loading="lazy"
                :srcset="`/images/${slides[currentSlide].image} 1x, /images/${slides[currentSlide].image} 2x`"
              />
            </div>
          </transition>
          <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
          <!-- Animated overlay pattern -->
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_70%)] animate-pulse-slow"></div>
        </div>

        <!-- Content with enhanced animations -->
        <div class="relative z-10 h-full container mx-auto px-3 sm:px-4 md:px-6 flex items-center">
          <div class="w-full md:max-w-2xl lg:max-w-3xl space-y-3 sm:space-y-4 md:space-y-6 pt-16 md:pt-20">
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-bold leading-tight motion-preset-slide-up motion-delay-100 drop-shadow-2xl">{{ slides[currentSlide].title }}</h1>
            <p class="text-white/95 text-base sm:text-lg md:text-xl lg:text-2xl motion-preset-slide-up motion-delay-200 drop-shadow-lg font-light">{{ slides[currentSlide].subtitle }}</p>
            
            <!-- Boutons d'action améliorés -->
            <div class="flex flex-wrap gap-2 sm:gap-3 md:gap-4 motion-preset-slide-up motion-delay-300">
              <NuxtLink :to="slides[currentSlide].cta.href" class="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sisep-hit to-red-600 hover:from-red-600 hover:to-sisep-hit text-white rounded-lg px-5 py-3 sm:px-6 sm:py-3.5 text-sm sm:text-base font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 flex-1 sm:flex-none text-center overflow-hidden transform hover:scale-105">
                <span class="relative z-10">{{ slides[currentSlide].cta.label }}</span>
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <span class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </NuxtLink>
              <button
                @click="isPlaying = !isPlaying; if(isPlaying){ startTs = performance.now(); rafId = requestAnimationFrame(step)}"
                class="group inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/25 text-white rounded-lg px-5 py-3 sm:px-6 sm:py-3.5 text-sm sm:text-base backdrop-blur-md border border-white/20 transition-all duration-300 flex-1 sm:flex-none transform hover:scale-105"
                :aria-label="isPlaying ? 'Mettre en pause le carrousel' : 'Lire le carrousel'"
              >
                <UIcon :name="isPlaying ? 'i-heroicons-pause' : 'i-heroicons-play'" class="w-4 h-4 transition-transform group-hover:scale-110" />
                <span class="font-medium">{{ isPlaying ? 'Pause' : 'Lire' }}</span>
              </button>
            </div>

            <!-- Barre de recherche améliorée -->
            <div class="mt-4 sm:mt-6 lg:mt-8 max-w-3xl motion-preset-slide-up motion-delay-400">
              <div class="relative flex shadow-2xl rounded-xl overflow-hidden backdrop-blur-sm border border-white/30 transition-all duration-300 hover:shadow-3xl focus-within:shadow-3xl focus-within:scale-[1.02]">
                <div class="absolute inset-0 bg-gradient-to-r from-white/95 to-white/90"></div>
                <UIcon name="i-heroicons-magnifying-glass" class="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray-400 z-10" />
                <input
                  class="relative z-10 w-full focus:outline-none bg-transparent py-3.5 sm:py-4 lg:py-5 pl-12 sm:pl-14 pr-4 text-sm sm:text-base lg:text-lg text-gray-800 placeholder:text-gray-500 font-light"
                  placeholder="Rechercher des données, indicateurs, projets..."
                  type="search"
                  aria-label="Rechercher des données et indicateurs"
                />
                <button class="relative z-10 group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-8 lg:px-10 transition-all duration-300 font-semibold flex items-center gap-2">
                  <span class="hidden sm:inline">Rechercher</span>
                  <UIcon name="i-heroicons-magnifying-glass" class="sm:hidden w-5 h-5" />
                  <UIcon name="i-heroicons-arrow-right" class="hidden sm:inline w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            <!-- Tags améliorés -->
            <div class="mt-4 sm:mt-5 motion-preset-blur motion-delay-500">
              <p class="text-white/80 text-sm mb-2 font-light">Recherches populaires:</p>
              <div class="flex flex-wrap gap-2 sm:gap-2.5 max-h-24 sm:max-h-28 overflow-y-auto pb-1 custom-scrollbar">
                <UBadge
                  v-for="(item, idx) in cadresSearchElements"
                  :key="item.label"
                  class="group backdrop-blur-md bg-white/15 hover:bg-white/30 border border-white/20 hover:border-white/40 text-white text-xs sm:text-sm px-3 py-1.5 cursor-pointer transition-all duration-300 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
                  :style="{ transitionDelay: `${idx * 30}ms` }"
                  @click="$router.push(item.href)"
                >
                  <span class="flex items-center gap-1.5">
                    <UIcon name="i-heroicons-hashtag" class="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                    {{ item.label }}
                  </span>
                </UBadge>
              </div>
            </div>
          </div>

          <!-- Next preview amélioré - visible uniquement sur desktop -->
          <div class="ml-auto hidden lg:block motion-preset-slide-left motion-delay-600">
            <div class="relative w-52 xl:w-64 h-36 xl:h-40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl group cursor-pointer border-2 border-white/20 hover:border-white/40">
              <img
                :src="`/images/${slides[(currentSlide+1)%slides.length].image}`"
                class="w-full h-full object-cover blur-[2px] group-hover:blur-none scale-105 transition-all duration-500 group-hover:scale-110"
                :alt="`Aperçu: ${slides[(currentSlide+1)%slides.length].title}`"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40"></div>
              <div class="absolute inset-0 flex flex-col justify-end p-4 transform transition-transform duration-300">
                <div class="flex items-center gap-2 text-white/90 text-xs mb-1">
                  <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
                  <span class="font-light">À suivre</span>
                </div>
                <p class="text-white text-sm xl:text-base font-semibold line-clamp-2">{{ slides[(currentSlide+1)%slides.length].title }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls améliorés -->
        <div class="absolute inset-x-0 bottom-3 sm:bottom-5 lg:bottom-6 z-10 container mx-auto px-3 sm:px-4 md:px-6">
          <div class="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              @click="prevSlide"
              class="group size-9 sm:size-10 md:size-11 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/25 hover:border-white/40 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Diapositive précédente"
            >
              <UIcon name="i-heroicons-chevron-left" class="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </button>

            <div class="h-2 sm:h-2.5 flex-1 rounded-full bg-white/15 backdrop-blur-sm overflow-hidden shadow-inner border border-white/20">
              <div
                class="h-full bg-gradient-to-r from-sisep-hit to-red-600 transition-all duration-300 ease-out shadow-lg relative overflow-hidden"
                :style="{ width: progress + '%' }"
                :aria-valuenow="progress"
                aria-valuemin="0"
                aria-valuemax="100"
                role="progressbar"
              >
                <div class="absolute inset-0 bg-white/20 animate-shimmer"></div>
              </div>
            </div>

            <button
              @click="nextSlide"
              class="group size-9 sm:size-10 md:size-11 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/25 hover:border-white/40 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Diapositive suivante"
            >
              <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div class="mt-3 sm:mt-4 flex justify-center gap-2 sm:gap-2.5">
            <button
              v-for="(s, i) in slides"
              :key="i"
              @click="goToSlide(i)"
              class="h-1.5 sm:h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-md hover:shadow-lg"
              :class="i===currentSlide ? 'w-8 sm:w-10 bg-white' : 'w-4 sm:w-5 bg-white/30 hover:bg-white/50'"
              :aria-label="`Aller à la diapositive ${i+1}`"
            ></button>
          </div>
        </div>
      </div>
    </header>

    <!-- PAGE WRAPPER FOR CONSISTENT ALIGNMENT -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">

      <!--SECTION NOTRE MISSION - Nouvelle section moderne avec cards -->
      <section class="py-20 md:py-24 lg:py-28 h-full relative overflow-hidden">

        <!-- Background élégant -->
        <div class="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"></div>
        <div class="absolute inset-0 opacity-5">
          <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
        </div>

        <div class="relative max-w-7xl mx-auto">

          <!-- Header de section -->
          <div class="text-center mb-12 md:mb-16 motion-preset-slide-up">
            <div class="inline-block px-4 py-1.5 bg-sisep-hit/10 rounded-full mb-4">
              <span class="text-sisep-hit font-semibold text-sm uppercase tracking-wider">Notre engagement</span>
            </div>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Notre <span class="text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600">Mission</span>
            </h2>
            <p class="text-gray-600 text-lg max-w-3xl mx-auto">
              Améliorer notre cadre de vie pour un avenir durable et un bien-être collectif
            </p>
          </div>

          <!-- Grid de missions -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

            <!-- Card 1 -->
            <div class="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 motion-preset-blur motion-delay-100 border border-gray-100 overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sisep-hit/10 to-transparent rounded-bl-full"></div>
              <div class="relative z-10">
                <div class="w-14 h-14 bg-gradient-to-br from-sisep-hit to-red-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <UIcon name="i-heroicons-building-office-2" class="w-7 h-7 text-white" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Infrastructures modernes</h3>
                <p class="text-gray-600 leading-relaxed">
                  Modernisation des infrastructures pour rendre nos villes et villages plus fonctionnels et agréables à vivre.
                </p>
              </div>
            </div>

            <!-- Card 2 -->
            <div class="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 motion-preset-blur motion-delay-200 border border-gray-100 overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full"></div>
              <div class="relative z-10">
                <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <UIcon name="i-heroicons-globe-alt" class="w-7 h-7 text-white" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Espaces verts</h3>
                <p class="text-gray-600 leading-relaxed">
                  Promotion des espaces verts et de la biodiversité urbaine pour un environnement plus sain.
                </p>
              </div>
            </div>

            <!-- Card 3 -->
            <div class="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 motion-preset-blur motion-delay-300 border border-gray-100 overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
              <div class="relative z-10">
                <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <UIcon name="i-heroicons-arrow-path" class="w-7 h-7 text-white" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Gestion durable</h3>
                <p class="text-gray-600 leading-relaxed">
                  Gestion durable des déchets et des ressources pour préserver notre environnement.
                </p>
              </div>
            </div>

            <!-- Card 4 -->
            <div class="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 motion-preset-blur motion-delay-400 border border-gray-100 overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
              <div class="relative z-10">
                <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <UIcon name="i-heroicons-map" class="w-7 h-7 text-white" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Aménagement harmonieux</h3>
                <p class="text-gray-600 leading-relaxed">
                  Aménagement harmonieux des territoires pour un développement équilibré et inclusif.
                </p>
              </div>
            </div>

            <!-- Card 5 -->
            <div class="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 motion-preset-blur motion-delay-500 border border-gray-100 overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full"></div>
              <div class="relative z-10">
                <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <UIcon name="i-heroicons-users" class="w-7 h-7 text-white" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Engagement citoyen</h3>
                <p class="text-gray-600 leading-relaxed">
                  Mobilisation citoyenne pour faire de notre cadre de vie un héritage dont nous serons fiers.
                </p>
              </div>
            </div>

            <!-- Card 6 - Featured (Mot du Ministre) -->
            <div class="group relative bg-gradient-to-br from-sisep-hit to-red-600 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 motion-preset-blur motion-delay-600 overflow-hidden">
              <div class="absolute inset-0 bg-[url('~/assets/images/double_ministre.jpeg')] bg-cover bg-center opacity-10"></div>
              <div class="relative z-10">
                <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <UIcon name="i-heroicons-megaphone" class="w-7 h-7 text-white" />
                </div>
                <h3 class="text-xl font-bold text-white mb-3">Message du Ministre</h3>
                <p class="text-white/90 leading-relaxed text-sm mb-4">
                  "Ce chantier est l'affaire de tous. Ensemble, faisons de notre cadre de vie un véritable héritage."
                </p>
                <button class="inline-flex items-center gap-2 text-white font-semibold text-sm hover:gap-3 transition-all">
                  Lire le message complet
                  <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </section>



      <!--SECTION DES TENDANCES -->

      <section class="py-16 hidden h-full relative">

        <img alt="" class="absolute inset-0 w-full h-full object-center object-cover"
             src="~/assets/images/cadre_world.webp">

        <div class="bg-white absolute opacity-90 inset-0"></div>

        <div class="relative max-w-7xl mx-auto">

          <div class="flex flex-col items-center justify-center h-full inset-0  gap-8">

            <h3 class="text-3xl text-center font-bold text-permis-base"> LES DONNEES DE TENDANCE </h3>

            <div ref="container" class="keen-slider">

              <div class="w-80 keen-slider__slide bg-white p-5">

                <div class="flex gap-6">
                  <div class="w-1/3">
                    <img class="w-full" src="~/assets/images/bill_director.jpg">
                  </div>
                  <div class="flex w-2/3  py-4 flex-col space-y-3">
                    <span class="font-bold text-yellow-600 text-2xl">Données 2013 </span>
                    <h3 class="text-xl font-bold text-permis-base">Population vivant dans des zones rurales</h3>
                    <p>
                      Les données suivantes illustrent la répartition de la population vivant en zones rurales, un
                      indicateur clé pour orienter les politiques de développement territorial.
                    </p>

                    <div class="">
                      <UButton class="font-semibold" color="primary" icon="i-heroicons-arrow-right" label="En savoir plus"
                               variant="link"></UButton>
                    </div>

                  </div>

                </div>
              </div>

              <div class="w-80 keen-slider__slide bg-white p-5">

                <div class="flex gap-6">
                  <div class="w-1/3">
                    <img class="w-full" src="~/assets/images/bill_director.jpg">
                  </div>
                  <div class="flex w-2/3  py-4 flex-col space-y-3">
                    <span class="font-bold text-yellow-600 text-2xl">Données 2014 </span>
                    <h3 class="text-xl font-bold text-permis-base">Population vivant dans des zones rurales</h3>
                    <p>
                      Les données suivantes illustrent la répartition de la population vivant en zones rurales, un
                      indicateur clé pour orienter les politiques de développement territorial.
                    </p>

                    <div class="">
                      <UButton class="font-semibold" color="primary" icon="i-heroicons-arrow-right" label="En savoir plus"
                               variant="link"></UButton>
                    </div>

                  </div>

                </div>
              </div>

              <div class="w-80 keen-slider__slide bg-white p-5">

                <div class="flex gap-6">
                  <div class="w-1/3">
                    <img class="w-full" src="~/assets/images/bill_director.jpg">
                  </div>
                  <div class="flex w-2/3  py-4 flex-col space-y-3">
                    <span class="font-bold text-yellow-600 text-2xl">Données 2024 </span>
                    <h3 class="text-xl font-bold text-permis-base">Population vivant dans des zones rurales</h3>
                    <p>
                      Les données suivantes illustrent la répartition de la population vivant en zones rurales, un
                      indicateur clé pour orienter les politiques de développement territorial.
                    </p>

                    <div class="">
                      <UButton class="font-semibold" color="primary" icon="i-heroicons-arrow-right" label="En savoir plus"
                               variant="link"></UButton>
                    </div>

                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>


      </section>


      <!--SECTION STATS ODDs - Redesignée avec animations -->

      <section class="py-20 md:py-24 lg:py-28 h-full relative overflow-hidden">

        <div class="bg-gradient-to-br from-gray-50 via-white to-gray-100 absolute inset-0"></div>

        <!-- Patterns décoratifs -->
        <div class="absolute inset-0 opacity-[0.03]">
          <div class="absolute top-0 left-0 w-96 h-96 bg-sisep-hit rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        </div>

        <div class="relative max-w-7xl mx-auto">

          <div class="grid md:grid-cols-2 items-center gap-12 lg:gap-16">

            <div class="right order-1 md:order-none motion-preset-slide-right">
              <div class="relative group">
                <div class="absolute -inset-4 bg-gradient-to-r from-sisep-hit to-red-500 rounded-2xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>
                <img alt="SISEB Bénin, la boussole des données" class="relative w-full object-cover rounded-2xl shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]" src="/images/cadre_world.webp">
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>

            <div class="left space-y-6 md:space-y-8 motion-preset-slide-left">

              <div class="space-y-3">
                <div class="inline-block px-4 py-1.5 bg-sisep-hit/10 rounded-full">
                  <span class="text-sisep-hit font-semibold text-sm uppercase tracking-wider">Notre plateforme</span>
                </div>
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Découvrez SISEB Bénin, <span class="text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600">la boussole des données</span>
                </h2>
              </div>

              <p class="text-gray-600 text-base md:text-lg leading-relaxed">
                Le site SISEB Bénin est une plateforme dédiée à la collecte, à la gestion et à la diffusion des données
                statistiques sur l'état de l'environnement au Bénin.
              </p>

              <div class="stats-bloc grid grid-cols-2 gap-4 md:gap-5">

                <div v-for="(item, idx) in statsImg" :key="item.label"
                     class="group relative h-28 md:h-32 flex flex-col justify-center gap-3 px-4 md:px-6 rounded-xl shadow-lg bg-gradient-to-br from-sisep-hit to-red-600 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl motion-preset-blur"
                     :style="{ transitionDelay: `${idx * 100}ms` }">

                  <!-- Effet de brillance au hover -->
                  <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                  <div class="relative z-10 flex items-center gap-3">
                    <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <img :src="`/icons/${item.src}`" class="size-8 md:size-10 object-cover">
                    </div>
                    <div class="flex flex-col">
                      <div class="text-white text-3xl md:text-4xl font-bold flex items-baseline gap-1">
                        <Vue3autocounter
                            ref="counter"
                            :autoinit="true"
                            :duration="5"
                            :endAmount="item.value"
                            :startAmount="0"
                            class="tabular-nums"
                        />
                        <span class="text-xs md:text-sm">+</span>
                      </div>
                      <span class="text-white/90 text-xs md:text-sm font-medium">{{ item.label }}</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>


          </div>

        </div>


      </section>


      <!--SECTION DERNIERS PROJETS - Redesignée avec bento layout -->

      <section class="py-20 md:py-24 lg:py-28 h-full relative overflow-hidden">
        <div class="bg-gradient-to-b from-gray-50 to-white absolute inset-0"></div>

        <!-- Éléments décoratifs -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-sisep-hit/5 rounded-full blur-3xl"></div>

        <div class="relative max-w-7xl mx-auto">
          <div class="flex flex-col gap-10 md:gap-12">

          <!-- Header with CTA amélioré -->
          <div class="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 motion-preset-slide-up">
            <div class="space-y-3">
              <div class="inline-block px-4 py-1.5 bg-sisep-hit/10 rounded-full">
                <span class="text-sisep-hit font-semibold text-sm uppercase tracking-wider">Projets en cours</span>
              </div>
              <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Derniers <span class="text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600">projets</span>
              </h2>
              <p class="text-gray-600 text-base md:text-lg max-w-2xl">Suivez les chantiers prioritaires et les réalisations en cours partout sur le territoire.</p>
            </div>
            <NuxtLink to="/project" class="group inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-sisep-hit to-red-600 hover:from-red-600 hover:to-sisep-hit text-white px-6 py-3.5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <span class="font-semibold">Voir tous les projets</span>
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </NuxtLink>
          </div>

          <!-- Row 1: Featured + two medium cards -->
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
            <div class="lg:col-span-2">
              <ProjectCard :project="{ title: 'Rénovation urbaine', image: 'https://images.unsplash.com/photo-1486304873000-235643847519?w=1200', status: 'En cours', category: 'Urbanisme' }"/>
            </div>
            <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProjectCard :project="{ title: 'Assainissement', image: 'https://images.unsplash.com/photo-1563447310550-3081749fb321?w=800', status: 'Planifié', category: 'Hydraulique' }"/>
              <ProjectCard :project="{ title: 'Éclairage public', image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800', status: 'Planifié', category: 'Infrastructures' }"/>
            </div>
          </div>

          <!-- Row 2: Responsive grid of more projects -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            <div v-for="i in 4" :key="'grid-'+i">
              <ProjectCard :project="{ title: 'Projet '+ i, image: i%2 ? 'https://images.unsplash.com/photo-1556767576-cfba1efe4fd0?w=800' : 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=800', status: i%2 ? 'En cours' : 'Planifié', category: i%2 ? 'Voirie' : 'Aménagement' }"/>
            </div>
          </div>

          </div>
        </div>
      </section>

      <!-- SECTION ACTUALITÉS - Nouvelle timeline moderne -->
      <section class="py-20 md:py-24 lg:py-28 h-full relative overflow-hidden">
        <div class="bg-gradient-to-b from-white to-gray-50 absolute inset-0"></div>

        <div class="relative max-w-7xl mx-auto">
          <div class="flex flex-col gap-12">
            <!-- Header -->
            <div class="text-center motion-preset-slide-up">
              <div class="inline-block px-4 py-1.5 bg-sisep-hit/10 rounded-full mb-4">
                <span class="text-sisep-hit font-semibold text-sm uppercase tracking-wider">Actualités</span>
              </div>
              <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Dernières <span class="text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600">nouvelles</span>
              </h2>
              <p class="text-gray-600 text-lg max-w-3xl mx-auto">
                Restez informés des derniers événements et réalisations du ministère
              </p>
            </div>

            <!-- Timeline Grid -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

              <!-- Actualité 1 - Featured -->
              <div class="md:col-span-2 lg:col-span-1 group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 motion-preset-blur motion-delay-100">
                <div class="relative h-64 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800" alt="Actualité" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div class="absolute bottom-4 left-4 right-4 z-10">
                    <span class="inline-block px-3 py-1 bg-sisep-hit text-white text-xs font-semibold rounded-full mb-2">Événement</span>
                    <h3 class="text-white font-bold text-xl line-clamp-2">Lancement du programme national de reboisement</h3>
                  </div>
                </div>
                <div class="p-6 space-y-4">
                  <p class="text-gray-600 text-sm line-clamp-3">Le ministre a officiellement lancé le programme visant à planter 10 millions d'arbres sur l'ensemble du territoire national d'ici 2025.</p>
                  <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span class="text-xs text-gray-500 flex items-center gap-1">
                      <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
                      Il y a 2 jours
                    </span>
                    <button class="text-sisep-hit text-sm font-semibold hover:gap-2 inline-flex items-center gap-1 transition-all">
                      Lire plus
                      <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Actualité 2 -->
              <div class="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 motion-preset-blur motion-delay-200">
                <div class="relative h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600" alt="Actualité" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span class="absolute top-3 right-3 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">Rapport</span>
                </div>
                <div class="p-5 space-y-3">
                  <h3 class="font-bold text-base text-gray-900 group-hover:text-sisep-hit transition-colors line-clamp-2">Publication du rapport annuel sur l'environnement</h3>
                  <p class="text-gray-600 text-sm line-clamp-2">Découvrez les indicateurs clés de l'année écoulée.</p>
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-xs text-gray-500">Il y a 5 jours</span>
                    <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-sisep-hit opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>

              <!-- Actualité 3 -->
              <div class="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 motion-preset-blur motion-delay-300">
                <div class="relative h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600" alt="Actualité" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span class="absolute top-3 right-3 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">Succès</span>
                </div>
                <div class="p-5 space-y-3">
                  <h3 class="font-bold text-base text-gray-900 group-hover:text-sisep-hit transition-colors line-clamp-2">500 jeunes formés aux métiers verts</h3>
                  <p class="text-gray-600 text-sm line-clamp-2">Un programme de formation qui porte ses fruits.</p>
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-xs text-gray-500">Il y a 1 semaine</span>
                    <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-sisep-hit opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <!-- SECTION CONVENTIONS (slider horizontal) -->
      <section class="py-20 md:py-24 lg:py-28 h-full relative overflow-hidden">
        <div class="bg-gradient-to-b from-gray-50 to-white absolute inset-0"></div>

        <div class="relative max-w-7xl mx-auto">
          <div class="flex flex-col items-center gap-10">
            <!-- Header with CTA amélioré -->
            <div class="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 motion-preset-slide-up">
              <div class="space-y-3">
                <div class="inline-block px-4 py-1.5 bg-sisep-hit/10 rounded-full">
                  <span class="text-sisep-hit font-semibold text-sm uppercase tracking-wider">Engagements internationaux</span>
                </div>
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Découvrez les <span class="text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600">conventions</span>
                </h2>
                <p class="text-gray-600 text-base md:text-lg max-w-2xl">Suivez les conventions ratifiées et en cours de ratification</p>
              </div>
              <NuxtLink to="/conventions" class="group inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-sisep-hit to-red-600 hover:from-red-600 hover:to-sisep-hit text-white px-6 py-3.5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <span class="font-semibold">Toutes les conventions</span>
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </NuxtLink>
            </div>
            <div class="relative w-full">
              <div class="grid grid-cols-2 w-full  gap-4 pb-2">
                <div v-for="i in 4" :key="i" class="min-w-[320px] snap-start" :style="{ transitionDelay: `${(i-1)*60}ms` }">
                  <ConventionCard :convention="{ title: 'Convention ' + i, image: i%2 ? 'https://img.freepik.com/photos-gratuite/tour-eiffel-au-champ-mars-paris-france_53876-94787.jpg' : 'https://cadredevie.gouv.bj/media?id=462', type: 'Multilatérale', status: 'Ratifiée', date: '2024-01-01', category: 'Climat', description: 'Texte descriptif de la convention.' }"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <!--    SECTIONS DES PARTENAIRES-->
      <section class="py-16 h-full relative">
        <div class=" max-w-7xl mx-auto overflow-x-clip">
          <div  class="grid grid-flow-col gap-10 items-center [grid-auto-columns:min-content] justify-center min-w-fit animate-slide">

            <div v-for="item in [...partenairesImg, ...partenairesImg]" class="el w-[300px]">
              <img :src="`/images/${item.src}`" class="w-full motion-blur">
            </div>

          </div>
        </div>
      </section>

      <!-- Newsletter CTA enlarged with background image and overlay -->
      <section class="py-20 relative">
        <div class="absolute inset-0 -z-10">
          <img src="/images/cadre_world.jpg" alt="Newsletter background" class="w-full h-full object-cover"/>
          <div class="absolute inset-0 bg-gradient-to-br from-black/50 to-black/30"></div>
        </div>
        <div class="max-w-6xl mx-auto rounded-2xl bg-white/10 backdrop-blur-md text-white p-8 md:p-14 relative overflow-hidden">
          <div class="absolute -top-10 -right-10 size-40 bg-white/20 rounded-full blur-2xl"></div>
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="flex-1">
              <h3 class="text-3xl md:text-4xl font-bold">Restez informé des nouveautés</h3>
              <p class="text-white/90 mt-3 max-w-2xl">Abonnez-vous à notre newsletter pour recevoir les nouveaux jeux de données, projets et actualités.</p>
            </div>
            <div class="w-full md:w-auto flex items-stretch gap-2 motion-preset-slide-up-lg">
              <input type="email" placeholder="Votre email" class="w-full md:w-96 px-4 py-3 rounded-md text-gray-800 focus:outline-none"/>
              <button class="px-6 py-3 rounded-md bg-sisep-hit text-white font-semibold shadow hover:shadow-lg transition relative overflow-hidden">
                <span class="relative z-10">S'abonner</span>
                <span class="absolute inset-0 bg-white/10 animate-pulse"></span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div> <!-- END WRAPPER -->

    <!--    SECTION FOOTER -->
    <FooterSiseb/>

  </main>


</template>

<style scoped>
/* Fade + scale transition for hero carousel */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(1.1);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Ken Burns effect for carousel images */
@keyframes ken-burns {
  0% { transform: scale(1.1); }
  100% { transform: scale(1.15); }
}
.animate-ken-burns {
  animation: ken-burns 10s ease-out infinite alternate;
}

/* Slow pulse animation */
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Shimmer effect for progress bar */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Custom scrollbar styling */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Hide horizontal scrollbar for conventions slider */
.scrollbar-none {
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>