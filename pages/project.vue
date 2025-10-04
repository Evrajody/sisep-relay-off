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
    <!-- SECTION BANNER PRINCIPAL - Redesigné -->
    <header class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <!-- Background image avec effet parallax -->
      <div class="absolute inset-0">
        <img alt="Projets en cours" class="w-full h-full object-cover opacity-30"
           src="~/assets/images/media_travaux.jpeg"/>
        <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_70%)]"></div>
      </div>

      <!-- Top nav bar - Glassmorphism -->
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
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-24">
        <div class="max-w-4xl">
          <div class="inline-block px-4 py-1.5 bg-sisep-hit/20 backdrop-blur-sm rounded-full mb-6 motion-preset-fade">
            <span class="text-white font-semibold text-sm uppercase tracking-wider">Nos Réalisations</span>
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6 motion-preset-slide-up motion-delay-100">
            Les <span class="text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600">projets</span>
          </h1>
          <p class="text-lg sm:text-xl text-white/90 max-w-2xl motion-preset-slide-up motion-delay-200">
            Faits et informations sur les secteurs d'activité liés au cadre de vie et au développement durable.
          </p>
        </div>
      </div>
    </header>

    <section class="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">

      <div class="mx-auto max-w-[90vw]">
        <!-- Toggle view buttons - Redesigné -->
        <div class="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-8 motion-preset-slide-up">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Explorez nos <span class="text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600">projets</span>
            </h2>
            <p class="text-gray-600">{{ projects.length }} projets en cours de réalisation</p>
          </div>
          <div class="inline-flex gap-2 bg-white rounded-xl p-1.5 shadow-lg border border-gray-200">
            <button
              :class="isList ? 'bg-gradient-to-r from-sisep-hit to-red-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
              @click="toogle(true)">
              <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4"/>
              <span class="hidden sm:inline">Grille</span>
            </button>
            <button
              :class="!isList ? 'bg-gradient-to-r from-sisep-hit to-red-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
              @click="toogle(false)">
              <UIcon name="i-heroicons-map" class="w-4 h-4"/>
              <span class="hidden sm:inline">Carte</span>
            </button>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">

          <!-- left column - Sidebar Filtres Redesigné -->
          <div class="lg:w-80 flex-shrink-0">
            <div class="lg:sticky lg:top-24">
              <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden motion-preset-blur">
                <!-- Header -->
                <div class="p-6 bg-gradient-to-r from-sisep-hit to-red-600 text-white">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <UIcon name="i-heroicons-funnel" class="w-5 h-5"/>
                    </div>
                    <h3 class="text-lg font-bold">Filtres</h3>
                  </div>
                </div>
                <div class="p-6">
                  <ClientOnly>
                    <Vueform ref="filterFormEl" v-bind="filterForm"/>
                  </ClientOnly>
                </div>
              </div>
            </div>
          </div>

          <!-- right column - Content Area -->
          <div class="flex-1 min-w-0">
            <!-- Grid View -->
            <div v-if="isList">
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                <div v-for="(project, idx) in projects" :key="idx" :style="{ transitionDelay: `${idx * 80}ms` }">
                  <ProjectCard :project="project" />
                </div>
              </div>

              <!-- Pagination Redesignée -->
              <div class="flex justify-center mt-12">
                <div class="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
                  <UPagination v-model="page" :page-count="5" :total="100" size="lg"/>
                </div>
              </div>
            </div>

            <!-- Map View -->
            <div v-else class="motion-preset-fade">
              <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <ClientOnly>
                  <LMap :ref="map" :center="[9.30769, 2.315834]" :max-zoom="10" :use-global-leaflet="false" :zoom="7"
                        style="height: 75vh; border-radius: 1rem;">
                    <LTileLayer attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
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

              <!-- Map Legend -->
              <div class="mt-6 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-sisep-hit"/>
                  Légende de la carte
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    <span class="text-sm text-gray-600">En cours</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span class="text-sm text-gray-600">Planifié</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span class="text-sm text-gray-600">Terminé</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span class="text-sm text-gray-600">Suspendu</span>
                  </div>
                </div>
              </div>
            </div>
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
