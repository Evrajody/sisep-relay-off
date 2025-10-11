<script setup lang="ts">

import Navbar from "~/components/Home/Navbar.vue";

definePageMeta({

})

useHead({
  title: 'SiseB - Les projets',
})

const filterForm = ref({

  scrollOnNext: true,

  id: "suivre-demande",

  addClass: "max-w-full",

  displayErrors: true,

  showRequired: ["label"],

  endpoint: async (form: any, payload: any) => {
    navigateTo({name: 'project-module-dashboard'})
  },

  schema: {
    searchBy: {
      type: "text",
      placeholder: "Rechercher un projet",
      label: "Rechercher un projet",
      columns: {
        default: {container: 12, label: 12, wrapper: 12},
        sm: {container: 12, label: 12, wrapper: 12},
        md: {container: 12, label: 12, wrapper: 12},
        lg: {container: 12, label: 12, wrapper: 12},
      },
    },
    departement: {
      type: "select",
      placeholder: "Filtrer par departement",
      label: "Filtrer par departement",
      options: [
        {value: "1", label: "Departement 1"},
        {value: "2", label: "Departement 2"},
        {value: "3", label: "Departement 3"},
        {value: "4", label: "Departement 4"},
      ],

      columns: {
        default: {container: 12, label: 12, wrapper: 12},
        sm: {container: 12, label: 12, wrapper: 12},
        md: {container: 12, label: 12, wrapper: 12},
        lg: {container: 12, label: 12, wrapper: 12},
      },
    },
    budget: {
      type: "slider",
      showTooltip: "focus",
      placeholder: "Filtrer par departement",
      label: "Filtrer par departement",
      columns: {
        default: {container: 12, label: 12, wrapper: 12},
        sm: {container: 12, label: 12, wrapper: 12},
        md: {container: 12, label: 12, wrapper: 12},
        lg: {container: 12, label: 12, wrapper: 12},
      },
    },

    date: {
      type: "date",
      label: "Filtrer par date de publication",
      columns: {
        default: {container: 12, label: 12, wrapper: 12},
        sm: {container: 12, label: 12, wrapper: 12},
        md: {container: 12, label: 12, wrapper: 12},
        lg: {container: 12, label: 12, wrapper: 12},
      },
    },


    filter: {
      type: "button",
      submits: true,
      buttonLabel: "Filtrer",
      full: true,
      columns: {
        default: {container: 12, label: 12, wrapper: 12},
        sm: {container: 12, label: 12, wrapper: 12},
        md: {container: 12, label: 12, wrapper: 12},
        lg: {container: 12, label: 12, wrapper: 12},
      },
    },
  },
});

</script>

<template>
  
  <div class="relative min-h-80">

    <header class=" bg-gray-100">

      <img alt="" class="absolute inset-0 w-full h-full object-center object-cover" src="../assets/images/cadre_world.webp"/>

      <div class="bg-black/80 absolute opacity-60 inset-0"></div>

      <div
          class="h-fit mx-auto absolute top-7 rounded-lg shadow-lg left-0 right-0 z-20 max-w-[90vw] bg-sisep-hit">
        <div class="flex gap-12 justify-start items-center pr-10">
          <div class="img-box flex rounded-l-lg bg-white w-fit">
            <div class="w-[300px]">
              <a href="">
                <img class="" src="../assets/images/logo_cadre_vie.png"/>
              </a>
            </div>
          </div>

          <!-- Navbar -->
          <Navbar/>
        </div>
      </div>

      <div class="max-w-[90vw] inset-0 absolute h-full mx-auto mt-20">
        <div class="grid h-full place-items-center justify-start">
          <div class="group space-y-6 text-start">
            <h1 class="text-6xl text-white  text-start font-bold">
              Les projets
            </h1>

            <div class="font-medium text-white">
              Faits et informations sur les secteurs d'activité liés au cadre de
              vie et au développement durable.
            </div>
          </div>
        </div>
      </div>
    </header>

  </div>


</template>

<style scoped>

</style>