<script lang="ts" setup>
import Navbar from "~/components/Home/Navbar.vue";
import ProjectCard from "~/components/Home/ProjectCard.vue";
import {UIcon} from "#components";
import FooterSiseb from "~/components/Home/FooterSiseb.vue";

const filterFormEl = ref(null);
const isList = ref(true)

const toogle = (value: boolean) => {
  isList.value = value
}

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

const page = ref(1);

// Create locations data (20 locations around Nantes)
const locations = [
  {name: 'Nantes', lat: 47.218371, lng: -1.553621},
  {name: 'Saint-Nazaire', lat: 47.273018, lng: -2.213733},
  {name: 'La Baule', lat: 47.286835, lng: -2.393108},
  {name: 'Pornic', lat: 47.112, lng: -2.102},
  {name: 'Guérande', lat: 47.328, lng: -2.429},
  {name: 'Clisson', lat: 47.087, lng: -1.276},
  {name: 'Ancenis', lat: 47.366, lng: -1.176},
  {name: 'Châteaubriant', lat: 47.716, lng: -1.376},
  {name: 'Redon', lat: 47.652, lng: -2.084},
  {name: 'Pontchâteau', lat: 47.433, lng: -2.117},
  {name: 'Savenay', lat: 47.327, lng: -1.952},
  {name: 'Rezé', lat: 47.183, lng: -1.55},
  {name: 'Vertou', lat: 47.166, lng: -1.466},
  {name: 'Carquefou', lat: 47.283, lng: -1.5},
  {name: 'Orvault', lat: 47.283, lng: -1.633},
  {name: 'Saint-Herblain', lat: 47.216, lng: -1.65},
  {name: 'Sainte-Luce-sur-Loire', lat: 47.233, lng: -1.483},
  {name: 'Bouguenais', lat: 47.183, lng: -1.583},
  {name: 'Saint-Sébastien-sur-Loire', lat: 47.183, lng: -1.483},
  {name: 'Basse-Goulaine', lat: 47.2, lng: -1.483}
];

const projects = [
  {
    title: 'Parc Solaire de Cotonou',
    category: 'Énergie',
    status: 'En cours',
    location: 'Cotonou',
    date: '12/03/2024',
    budget: '150 000 000 F CFA',
    description: "Déploiement d'un parc solaire pour renforcer la capacité énergétique renouvelable.",
    image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800&h=600&fit=crop',
    coords: [6.379448, 2.451324],
  },
  {
    title: 'Rénovation du Marché Central de Porto-Novo',
    category: 'Infrastructures',
    status: 'Planifié',
    location: 'Porto-Novo',
    date: '05/08/2024',
    budget: '100 000 000 F CFA',
    description: 'Modernisation du marché central pour améliorer les conditions commerciales.',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&h=600&fit=crop',
    coords: [6.49646, 2.60359],
  },
  {
    title: 'Centre de Formation Agro-écologique',
    category: 'Agriculture',
    status: 'En cours',
    location: 'Parakou',
    date: '21/01/2024',
    budget: '80 000 000 F CFA',
    description: 'Création d’un centre dédié aux pratiques agricoles durables et à la formation.',
    image: 'https://images.unsplash.com/photo-1500937386664-56f3d9c9b0f5?w=800&h=600&fit=crop',
    coords: [9.33716, 2.63031],
  },
  // {
  //   title: 'Zone Industrielle Écologique',
  //   category: 'Industrie',
  //   status: 'En cours',
  //   location: 'Abomey-Calavi',
  //   date: '02/06/2024',
  //   budget: '200 000 000 F CFA',
  //   description: 'Aménagement d’une zone industrielle écoresponsable avec gestion des déchets.',
  //   image: 'https://images.unsplash.com/photo-1504312000169-8f07dbf5bf1d?w=800&h=600&fit=crop',
  //   coords: [6.44852, 2.35566],
  // },
  {
    title: 'Réseau Hydraulique Rural',
    category: 'Eau',
    status: 'En cours',
    location: 'Djougou',
    date: '14/02/2024',
    budget: '90 000 000 F CFA',
    description: 'Mise en place d’un réseau pour l’accès à l’eau potable en milieu rural.',
    image: 'https://images.unsplash.com/photo-1469122312224-c5846569feb1?w=800&h=600&fit=crop',
    coords: [9.70853, 1.66598],
  },
  {
    title: 'Parc Agricole Innovant',
    category: 'Agriculture',
    status: 'Terminé',
    location: 'Tchaourou',
    date: '30/11/2023',
    budget: '120 000 000 F CFA',
    description: 'Création d’un parc agricole intégrant technologies et pratiques durables.',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&h=600&fit=crop',
    coords: [8.88649, 2.59753],
  },
  {
    title: 'Tourisme Patrimonial de Natitingou',
    category: 'Tourisme',
    status: 'En cours',
    location: 'Natitingou',
    date: '18/04/2024',
    budget: '110 000 000 F CFA',
    description: 'Valorisation du patrimoine culturel et aménagement de circuits touristiques.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
    coords: [10.30416, 1.37962],
  },
  {
    title: 'Marché Numérique de Bohicon',
    category: 'Numérique',
    status: 'Planifié',
    location: 'Bohicon',
    date: '07/09/2024',
    budget: '70 000 000 F CFA',
    description: 'Digitalisation des services marchands et amélioration de la traçabilité.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
    coords: [7.17826, 2.0667],
  },
  {
    title: 'Promenade culturelle de Ouidah',
    category: 'Culture',
    status: 'En cours',
    location: 'Ouidah',
    date: '25/05/2024',
    budget: '130 000 000 F CFA',
    description: 'Aménagement d’une promenade culturelle et touristique le long du littoral.',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&h=600&fit=crop',
    coords: [6.36307, 2.08506],
  },
  {
    title: 'Programme E-santé Lokossa',
    category: 'Santé',
    status: 'En cours',
    location: 'Lokossa',
    date: '12/01/2024',
    budget: '95 000 000 F CFA',
    description: 'Déploiement de solutions numériques pour l’accès aux soins et télémédecine.',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop',
    coords: [6.63869, 1.71674],
  },
];

// :center="[9.30769, 2.315834]

const map = ref(null) as any;

// When the map is ready


</script>

<template>
  <main class="">
    <!-- SECTION BANNER PRINCIPAL-->
    <header class="h-[40dvh] bg-gray-100 relative top-0">

      <img alt="" class="absolute inset-0 w-full h-full object-center object-cover"
           src="~/assets/images/media_travaux.jpeg"/>

      <div class="bg-black/80 absolute opacity-60 inset-0"></div>

      <div
          class="h-fit mx-auto absolute top-7 rounded-lg shadow-lg left-0 right-0 z-20 lg:max-w-[90vw] bg-sisep-hit">
        <div class="flex gap-12 justify-start items-center pr-10">
          <div class="img-box flex rounded-l-lg bg-white w-fit">
            <div class="w-[300px]">
              <a href="">
                <img class="" src="~/assets/images/logo_cadre_vie.png"/>
              </a>
            </div>
          </div>

          <!-- Navbar -->
          <Navbar/>
        </div>
      </div>

      <div class="container inset-0 absolute h-full mx-auto mt-20">
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

    <section class="py-8  sm:py-14 lg:py-16">

      <div class="mx-auto max-w-[90vw]">
        <div class="flex flex-row gap-x-4 justify-end items-end mr-14 ">
          <button :class="isList ? 'border-2 border-gray-400 text-lg text-black rounded-md px-4 py-2' : 'bg-primary text-white px-4 text-lg py-2 rounded-md'"
                  @click="toogle(false)">
            Mode cartographie
          </button>
          <button :class="isList ? 'bg-primary text-white px-4 text-lg py-2 rounded-md' : 'border-2 border-gray-400 text-lg text-black rounded-md px-4 py-2'"
                  @click="toogle(true)">
            Mode liste
          </button>
        </div>
        <div class="flex flex-row  gap-x-3 gap-y-10 my-10">

          <!-- left column -->
          <div class="col-span-1 lg:px-5  lg:w-1/4 ">
            <!-- Wrapper sticky -->
            <div class="lg:sticky lg:top-5">
              <div class="bg-slate-100 shadow-lg h-auto rounded">
                <!-- Header -->

                <div class="p-5 flex flex-row bg-sisep-hit text-white  ">
                  <UIcon class="text-2xl" name="fe-filter" size="28"/>
                  <h3 class="text-lg font-semibold">Filtres des projets </h3>
                </div>
                <div class="p-4">
                  <ClientOnly>
                    <Vueform ref="filterFormEl" v-bind="filterForm"/>
                  </ClientOnly>
                </div>
              </div>
            </div>
          </div>

          <!-- right column -->

          <div v-if="isList" class="col-span-2 w-full lg:w-3/4 text-sm/relaxed md:text-base/relaxed lg:pr-8 ">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div v-for="(project, idx) in projects" :key="idx" :style="{ transitionDelay: `${idx * 80}ms` }">
                <ProjectCard :project="project" />
              </div>
            </div>
            <div class="flex items-end justify-end w-full my-10 ">
              <UPagination v-model="page" :page-count="5" :total="100" class="text-end" size="xl"/>
            </div>
          </div>

          <div v-else class="w-full lg:w-3/4">
            <ClientOnly>
              <LMap :ref="map" :center="[9.30769, 2.315834]" :max-zoom="10" :use-global-leaflet="false" :zoom="7"
                    style="height: 70dvh">
                <LTileLayer attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                            layer-type="base"
                            name="OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <LMarker v-for="project in projects" :key="project.title" :lat-lng="[project.coords[0], project.coords[1]]">
                  <LTooltip style="background-color: transparent !important ; padding: 0 !important;">
                    <div class="max-w-[20vw]">
                      <ProjectCard :project="project" />

                    </div>
                  </LTooltip>
                </LMarker>

              </LMap>
            </ClientOnly>
          </div>
        </div>

      </div>
    </section>


  </main>
  <!--    SECTION FOOTER -->
  <FooterSiseb/>
</template>

<style>
.leaflet-div-icon {
  background: green;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  font-weight: bold;
  font-size: large;
  text-align: center;
  line-height: 21px;
}

.leaflet-tooltip {
  background-color: white !important;
  padding: 0 !important;
  font-family: inherit !important;
  border-radius: 12px !important;
  border: none !important;
  white-space: nowrap;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);

}

</style>    
