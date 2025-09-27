<script lang="ts" setup>

import Vue3autocounter from "vue3-autocounter";
import FooterSiseb from "~/components/Home/FooterSiseb.vue";
import Navbar from "~/components/Home/Navbar.vue";
import ProjectCard from "~/components/Home/ProjectCard.vue";
import ConventionCard from "~/components/Home/ConventionCard.vue";

// Hero carousel state
const slides = reactive([
  {
    title: "Données clés sur le cadre de vie",
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
    <header class="relative bg-gray-900">
      <!-- Top nav bar with brand + navbar overlay -->
      <div class="h-fit mx-auto absolute top-2 md:top-4 lg:top-7 rounded-lg shadow-lg left-0 right-0 z-20 max-w-[95vw] md:max-w-[90vw] bg-sisep-hit">
        <div class="flex flex-col md:flex-row gap-2 md:gap-6 justify-between md:justify-start items-center p-2 md:pr-6">
          <div class="img-box flex rounded-lg md:rounded-l-lg bg-white w-full md:w-fit">
            <div class="w-full md:w-[250px] lg:w-[300px] p-2 md:p-0">
              <a href="/"><img class="h-12 md:h-auto w-auto mx-auto" src="~/assets/images/logo_cadre_vie.png" alt="Logo Cadre de Vie"></a>
            </div>
          </div>
          <Navbar class="w-full md:w-auto"/>
        </div>
      </div>

      <div class="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden">
        <!-- Slides -->
        <div class="absolute inset-0">
          <transition name="fade" mode="out-in">
            <img
                :key="currentSlide"
                :src="`/images/${slides[currentSlide].image}`"
                :alt="slides[currentSlide].title"
                class="w-full h-full object-cover"
                loading="lazy"
                :srcset="`/images/${slides[currentSlide].image} 1x, /images/${slides[currentSlide].image} 2x`"
            />
          </transition>
          <div class="absolute inset-0 bg-black/60"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 h-full container mx-auto px-3 sm:px-4 md:px-6 flex items-center">
          <div class="w-full md:max-w-2xl lg:max-w-3xl space-y-3 sm:space-y-4 md:space-y-6 pt-16 md:pt-20">
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-bold leading-tight">{{ slides[currentSlide].title }}</h1>
            <p class="text-white/90 text-base sm:text-lg md:text-xl">{{ slides[currentSlide].subtitle }}</p>
            
            <!-- Boutons d'action -->
            <div class="flex flex-wrap gap-2 sm:gap-3 motion-preset-slide-up-lg">
              <NuxtLink :to="slides[currentSlide].cta.href" class="inline-flex items-center justify-center gap-2 bg-sisep-hit hover:bg-sisep-hit/90 text-white rounded-md px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base shadow hover:shadow-lg transition-all duration-200 flex-1 sm:flex-none text-center">
                <span class="font-semibold">{{ slides[currentSlide].cta.label }}</span>
              </NuxtLink>
              <button 
                @click="isPlaying = !isPlaying; if(isPlaying){ startTs = performance.now(); rafId = requestAnimationFrame(step)}" 
                class="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-md px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base backdrop-blur transition-all duration-200 flex-1 sm:flex-none"
                :aria-label="isPlaying ? 'Mettre en pause le carrousel' : 'Lire le carrousel'"
              >
                <UIcon :name="isPlaying ? 'i-heroicons-pause' : 'i-heroicons-play'" class="w-4 h-4" />
                <span class="font-medium">{{ isPlaying ? 'Pause' : 'Lire' }}</span>
              </button>
            </div>

            <!-- Barre de recherche -->
            <div class="mt-4 sm:mt-6 max-w-2xl motion-preset-slide-up-lg">
              <div class="relative flex">
                <input 
                  class="w-full focus:outline-none bg-white rounded-l-md shadow-lg py-3 sm:py-4 px-4 sm:px-5 text-sm sm:text-base" 
                  placeholder="Rechercher des données, indicateurs..." 
                  type="search"
                  aria-label="Rechercher des données et indicateurs"
                />
                <button class="bg-red-600 hover:bg-red-700 text-white rounded-r-md shadow-md px-4 sm:px-5 transition-colors duration-200">
                  <span class="hidden sm:inline">Rechercher</span>
                  <UIcon name="i-heroicons-magnifying-glass" class="sm:hidden w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Tags -->
            <div class="mt-3 sm:mt-4">
              <div class="flex flex-wrap gap-1.5 sm:gap-2 max-h-20 sm:max-h-24 overflow-y-auto pb-1 custom-scrollbar">
                <UBadge 
                  v-for="item in cadresSearchElements" 
                  :key="item.label" 
                  class="backdrop-blur-sm bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm px-2.5 py-1 cursor-pointer transition-colors"
                  @click="$router.push(item.href)"
                >
                  {{ item.label }}
                </UBadge>
              </div>
            </div>
          </div>

          <!-- Next preview - visible uniquement sur desktop -->
          <div class="ml-auto hidden lg:block">
            <div class="relative w-48 xl:w-60 h-32 xl:h-36 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
              <img 
                :src="`/images/${slides[(currentSlide+1)%slides.length].image}`" 
                class="w-full h-full object-cover blur-sm scale-105 transition-transform duration-300 hover:scale-110" 
                :alt="`Aperçu: ${slides[(currentSlide+1)%slides.length].title}`"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-black/20"></div>
              <div class="absolute bottom-2 left-2 text-white text-xs xl:text-sm font-medium">À suivre</div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="absolute inset-x-0 bottom-2 sm:bottom-4 z-10 container mx-auto px-3 sm:px-4 md:px-6">
          <div class="flex items-center gap-2 sm:gap-3">
            <button 
              @click="prevSlide" 
              class="size-7 sm:size-8 md:size-9 rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Diapositive précédente"
            >
              <UIcon name="i-heroicons-chevron-left" class="w-4 h-4" />
            </button>
            
            <div class="h-1.5 sm:h-2 flex-1 rounded-full bg-white/20 overflow-hidden">
              <div 
                class="h-full bg-sisep-hit transition-all duration-300 ease-out" 
                :style="{ width: progress + '%' }"
                :aria-valuenow="progress"
                aria-valuemin="0"
                aria-valuemax="100"
                role="progressbar"
              ></div>
            </div>
            
            <button 
              @click="nextSlide" 
              class="size-7 sm:size-8 md:size-9 rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Diapositive suivante"
            >
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
            </button>
          </div>
          
          <div class="mt-2 sm:mt-3 flex justify-center gap-1.5 sm:gap-2">
            <button 
              v-for="(s, i) in slides" 
              :key="i" 
              @click="goToSlide(i)" 
              class="h-1 sm:h-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50" 
              :class="i===currentSlide ? 'w-6 sm:w-8 bg-white' : 'w-3 sm:w-4 bg-white/40 hover:bg-white/60'"
              :aria-label="`Aller à la diapositive ${i+1}`"
            ></button>
          </div>
        </div>
      </div>
    </header>

    <!-- PAGE WRAPPER FOR CONSISTENT ALIGNMENT -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">

      <!--SECTION MOT DU DIRECTEUR -->
      <section class="py-16 h-full  relative">

        <img alt="" class="absolute inset-0 w-full h-full object-center object-cover"
             src="~/assets/images/cadre_world.webp">

        <div class="bg-white absolute opacity-90 inset-0"></div>

        <div class="relative max-w-7xl mx-auto">

          <div class="grid md:grid-cols-2 items-center gap-10">

            <div class="left space-y-8">

              <h3 class="text-3xl font-bold text-permis-base"> MOT DU MINISTRE DE CADRE DE VIE </h3>

              <p>
                Améliorer notre cadre de vie, c’est investir dans notre bien-être collectif et celui des générations
                futures. Chaque projet, chaque action menée par le ministère vise à rendre nos villes et villages plus
                propres, plus verts et plus agréables à vivre.
              </p>

              <p>
                À travers la modernisation des infrastructures, la promotion des espaces verts, la gestion durable des
                déchets et l’aménagement harmonieux de nos territoires, nous affirmons notre engagement pour un
                environnement respectueux et un urbanisme inclusif.
              </p>

              <p>
                Ce chantier est l’affaire de tous. J’invite chacun à faire preuve de civisme et de responsabilité pour que
                nos efforts portent durablement leurs fruits. Ensemble, faisons de notre cadre de vie un véritable
                héritage dont nous serons fiers.Ce chantier est l’affaire de tous. J’invite chacun à
              </p>

            </div>

            <div class="right">
              <img class="" src="~/assets/images/double_ministre.jpeg">
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


      <!--SECTION STATS ODDs -->

      <section class="py-16 h-full relative ">

        <div class="bg-white absolute opacity-90 inset-0"></div>

        <div class="relative max-w-7xl mx-auto">

          <div class="grid md:grid-cols-2 items-center gap-10">

            <div class="right order-1 md:order-none">
            <img alt="SISEB Bénin, la boussole des données" class="w-full object-cover rounded-md" src="/images/cadre_world.webp">
          </div>

            <div class="left space-y-8">

              <h3 class="text-3xl font-bold text-permis-base"> Découvrez SISEB Bénin, la boussole des données </h3>

              <p>
                Le site SISEB Bénin est une plateforme dédiée à la collecte, à la gestion et à la diffusion des données
                statistiques sur l’état de l’environnement au Bénin.
              </p>

              <div class="stats-bloc grid grid-cols-2 gap-4 grid-rows-2">

                <div v-for="item in statsImg" class="h-24 flex gap-2 items-center px-5 shadow-lg bg-sisep-hit">

                  <img :src="`/icons/${item.src}`" class="size-10 object-cover">

                  <div class="text-white text-4xl flex items-center gap-2">
                    <Vue3autocounter
                        ref="counter"
                        :autoinit="true"
                        :duration="5"
                        :endAmount="item.value"
                        :startAmount="0"
                        class="font-bold"
                    />
                    <span class="text-lg">{{ item.label }}</span>
                  </div>


                </div>


              </div>

            </div>


          </div>

        </div>


      </section>


      <!--SECTION DERNIERS PROJETS (featured + mediums + grid row) -->

      <section class="py-16 h-full relative">
        <div class="bg-white absolute opacity-90 inset-0"></div>

        <div class="relative max-w-7xl mx-auto">
          <div class="flex flex-col items-center justify-center gap-10">
          <!-- Header with CTA -->
          <div class="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h3 class="text-3xl md:text-4xl lg:text-5xl font-bold text-permis-base">Derniers projets</h3>
              <p class="text-gray-600 mt-2 max-w-2xl">Suivez les chantiers prioritaires et les réalisations en cours partout sur le territoire.</p>
            </div>
            <NuxtLink to="/project" class="inline-flex w-fit items-center gap-2 rounded-md bg-sisep-hit text-white px-5 py-3 shadow hover:shadow-lg transition">
              Voir plus
              <span aria-hidden>→</span>
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

      <!-- SECTION CONVENTIONS (slider horizontal) -->
      <section class="py-16 h-full relative">
        <div class="relative max-w-7xl mx-auto">
          <div class="flex flex-col items-center gap-8">
            <!-- Header with CTA -->
            <div class="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h3 class="text-3xl md:text-4xl lg:text-5xl font-bold text-permis-base"> Découvrez les conventions </h3>
                <p class="text-gray-600 mt-2 max-w-2xl"> Suivez les conventions ratifiées et en cours de ratification </p>
              </div>
              <NuxtLink to="/conventions" class="inline-flex w-fit items-center gap-2 rounded-md bg-sisep-hit text-white px-5 py-3 shadow hover:shadow-lg transition">
                Voir plus
                <span aria-hidden>→</span>
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
/* Fade transition for hero carousel */
.fade-enter-active,
.fade-leave-active { transition: opacity .5s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* Optional: hide horizontal scrollbar for conventions slider */
.scrollbar-none { scrollbar-width: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }
</style>