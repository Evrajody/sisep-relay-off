<script lang="ts" setup>

import Vue3autocounter from "vue3-autocounter";

const navMenuElements = reactive([
  {
    label: "Accueil",
    href: "#",
  },

  {
    label: "A propos",
    href: "#",
  },

  {
    label: "Données",
    href: "#",
  },

  {
    label: "ODDs",
    href: "#",
  },

  {
    label: "Conventions",
    href: "#",
  },

  {
    label: "Projet",
    href: "#",
  },

  {
    label: "Faqs",
    href: "#",
  },

])


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

const questions = reactive([{
  label: 'Comment reinitialiser mon mot de passe justice ?',
  icon: 'i-heroicons-information-circle',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Comment contacter le support ?',
  icon: 'i-heroicons-arrow-down-tray',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Comment acceder à la plateforme de gestion de la détention',
  icon: 'i-heroicons-arrow-down-tray',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Comment éditer mon profile sur la plateforme mandat ?',
  icon: 'i-heroicons-eye-dropper',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Puis modifier un mandat après emission ?',
  icon: 'i-heroicons-rectangle-group',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Comment changer ma photo de profile ?',
  icon: 'i-heroicons-square-3-stack-3d',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Comment inscrire son EBNL ?',
  icon: 'i-heroicons-square-3-stack-3d',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Mon mail n\'est pas accessible',
  icon: 'i-heroicons-wrench-screwdriver',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}])

const animation = {duration: 50000, easing: (t) => t}

const [container, slider] = useKeenSlider({
  loop: true,
  mode: "free-snap",
  renderMode: "performance",
  created(s) {
    s.moveToIdx(5, true)
  },
  updated(s) {
    s.moveToIdx(s.track.details.abs + 5, true)
  },

  Ended(s) {
    s.moveToIdx(s.track.details.abs + 5, true)
  },

  slides: {
    perView: 3,
    spacing: 20,
  },
});


</script>

<template>

  <main class="">

    <!-- SECTION BANNER PRINCIPAL-->
    <header class="h-[600px] relative bg-gray-100 ">

      <img alt="" class="absolute inset-0 w-full h-full object-center object-cover"
           src="~/assets/images/cadre_world.jpg">

      <div class="bg-black/80 absolute opacity-60 inset-0"></div>

      <div class="h-fit mx-auto absolute top-7 rounded-lg shadow-lg left-0 right-0 z-20 max-w-7xl bg-sisep-hit">

        <div class="flex gap-12 justify-between items-center pr-10">

          <div class="img-box flex rounded-l-lg bg-white w-fit">

            <div class="w-[300px]">
              <a href="">
                <img class="" src="~/assets/images/logo_cadre_vie.png">
              </a>
            </div>

          </div>

          <div class="">

            <ul class="flex gap-6 items-center">
              <li v-for="item in navMenuElements">
                <a class="text-lg font-bold text-white uppercase" href="">
                  <span>{{ item.label }}</span>
                </a>
              </li>

            </ul>

          </div>

        </div>


      </div>

      <div class="container inset-0 absolute h-full mx-auto mt-20">

        <div class="grid h-full place-items-center">

          <div class="group space-y-6 text-center ">

            <h1 class="text-6xl text-white font-bold">
              Données clés sur le cadre de vie.
            </h1>

            <div class="font-medium text-white">
              Faits et informations sur les secteurs d'activité liés au cadre de vie et au développement durable.
            </div>

            <div class=" flex mt-8  motion-preset-slide-up-lg">

              <input
                  class="w-full  mx-auto qcss  focus:outline-none focus:appearance-auto motion-duration-500 motion-delay-200 bg-white rounded-sm shadow-lg py-5 max-w-4xl px-5 z-30"
                  placeholder="Trouvzr des données , des indicateurs par catégories" type="search">

              <button
                  class="bg-red-600  text-white rounded-sm shadow-md px-5 py-2.5">
                <span class="font-medium"> Rechercher </span>
              </button>

            </div>

            <div class="tag-search">

              <div class="max-w-4xl flex items-center justify-center flex-wrap gap-2">

                <UBadge v-for="item in cadresSearchElements" class="backdrop-blur-sm bg-opacity-50">
                  <a href="">{{ item.label }}</a>
                </UBadge>

              </div>


            </div>


          </div>


        </div>

      </div>

    </header>


    <!-- SECTION DES IMAGES PARTENAIRES-->
    <section class="py-16">
      <div class=" max-w-7xl mx-auto overflow-x-clip">
        <div
            class="grid grid-flow-col gap-10 items-center [grid-auto-columns:min-content] justify-center min-w-fit animate-slide">

          <div v-for="item in [...partenairesImg, ...partenairesImg]" class="el w-[300px]">
            <img :src="`/images/${item.src}`" class="w-full motion-blur">
          </div>

        </div>
      </div>
    </section>


    <!--SECTION MOT DU DIRECTEUR -->
    <section class="py-16 h-full  relative ">

      <img alt="" class="absolute inset-0 w-full h-full object-center object-cover"
           src="~/assets/images/cadre_world.jpg">

      <div class="bg-white absolute opacity-90 inset-0"></div>

      <div class="relative max-w-7xl mx-auto">

        <div class="flex items-center  h-full inset-0  gap-20">

          <div class="left w-1/2 space-y-8">

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

          <div class="right w-1/2">
            <img alt="" class="w-full" src="~/assets/images/bill_director.jpg">
          </div>

        </div>

      </div>

    </section>


    <!--SECTION DECOUVERTE -->

    <section class="py-16 h-full relative ">

      <div class="bg-white absolute opacity-90 inset-0"></div>

      <div class="relative max-w-7xl mx-auto">

        <div class="flex items-center  h-full inset-0  gap-20">

          <div class="right w-1/2">
            <img alt="" class="w-full" src="~/assets/images/sport_duo.jpg">
          </div>

          <div class="left w-1/2 space-y-8">

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


    <!--SECTION DES TENDANCES -->

    <section class="py-16 h-full relative">

      <img alt="" class="absolute inset-0 w-full h-full object-center object-cover" src="~/assets/images/cadre_world.jpg">

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
                    Les données suivantes illustrent la répartition de la population vivant en zones rurales, un indicateur clé pour orienter les politiques de développement territorial.
                  </p>

                  <div class="">
                    <UButton icon="i-heroicons-arrow-right" class="font-semibold" color="primary" variant="link" label="En savoir plus"></UButton>
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
                    Les données suivantes illustrent la répartition de la population vivant en zones rurales, un indicateur clé pour orienter les politiques de développement territorial.
                  </p>

                  <div class="">
                    <UButton icon="i-heroicons-arrow-right" class="font-semibold" color="primary" variant="link" label="En savoir plus"></UButton>
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
                    Les données suivantes illustrent la répartition de la population vivant en zones rurales, un indicateur clé pour orienter les politiques de développement territorial.
                  </p>

                  <div class="">
                    <UButton icon="i-heroicons-arrow-right" class="font-semibold" color="primary" variant="link" label="En savoir plus"></UButton>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>

      </div>


    </section>


    <!--SECTION DES ODDs -->

    <section class="py-16 h-full relative ">

      <div class="bg-white absolute opacity-90 inset-0"></div>

      <div class="relative max-w-7xl mx-auto">

        <div class="flex items-center  h-full inset-0  gap-20">

          <div class="right w-1/2">
            <img alt="" class="w-full" src="~/assets/images/sport_duo.jpg">
          </div>

          <div class="left w-1/2 space-y-8">

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



    <!--SECTION DES PROJETS -->

    <section class="py-16 h-full relative">

      <img alt="" class="absolute inset-0 w-full h-full object-center object-cover" src="~/assets/images/cadre_world.jpg">

      <div class="bg-white absolute opacity-90 inset-0"></div>

      <div class="relative max-w-7xl mx-auto">

        <div class="flex flex-col items-center justify-center h-full inset-0  gap-8">

          <h3 class="text-3xl text-center font-bold text-permis-base"> DECOUVRER LES DERNIERS PROJETS </h3>



        </div>

      </div>


    </section>



    <!--    SECTIONS DES QUESTION | FAQs-->
    <section class="py-16 h-full relative">

      <div class="bg-white absolute opacity-90 inset-0"></div>

      <div class="relative max-w-7xl mx-auto">

        <div class="flex flex-col items-center justify-center h-full inset-0  gap-8">

          <h3 class="text-3xl text-center font-bold text-permis-base"> QUESTIONS </h3>


          <UAccordion :items="questions" :ui="{ wrapper: 'flex border-y flex-col w-full',  }">
            <template #default="{ item, index, open }">
              <UButton :class="`motion-delay-[${index * 100}00ms]`"
                       :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
                       class="border-b py-4 intersect:motion-preset-slide-up-lg   cursor-pointer border-gray-200 dark:border-gray-700"
                       color="gray"
                       variant="ghost">
                <template #leading>
                  <div
                      class="size-10 rounded-full bg-primary-500/10 dark:bg-primary-400 flex items-center justify-center -my-1">
                    <span class="font-bold text-lg text-tawk-green"> {{ index + 1 }} </span>
                  </div>
                </template>

                <span class=" font-semibold text-lg truncate">{{ item.label }}</span>

                <template #trailing>
                  <UIcon
                      :class="[open && 'rotate-90']"
                      class="w-5 h-5 ms-auto transform transition-transform duration-200"
                      name="i-heroicons-chevron-right-20-solid"
                  />
                </template>
              </UButton>
            </template>

            <template #item="{item}">
              <p class="px-8 py-2 text-base leading-snug">
                {{ item.content }}
              </p>
            </template>

          </UAccordion>

        </div>

      </div>


    </section>







  </main>


</template>

<style scoped>

</style>