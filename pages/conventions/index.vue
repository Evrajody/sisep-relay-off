<template>
    <main class="">
        <!-- SECTION BANNER PRINCIPAL - Redesigné -->
        <header class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
            <!-- Background image avec effet parallax -->
            <div class="absolute inset-0">
                <img alt="Conventions internationales" class="w-full h-full object-cover opacity-30"
                    src="../../assets/images/img-odds.png" />
                <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_70%)]"></div>
            </div>

            <!-- Top nav bar - Glassmorphism -->
            <div class="h-fit mx-auto absolute top-2 md:top-4 lg:top-7 rounded-2xl shadow-2xl left-0 right-0 z-20 max-w-[95vw] md:max-w-[90vw] bg-white/10 backdrop-blur-xl border border-white/20">
                <div class="flex flex-col md:flex-row gap-2 md:gap-6 justify-between md:justify-start items-center p-2 md:pr-6">
                    <div class="img-box flex rounded-xl md:rounded-l-xl bg-gradient-to-br from-white to-gray-50 w-full md:w-fit shadow-inner">
                        <div class="w-full md:w-[250px] lg:w-[300px] p-3 md:p-2">
                            <a href="/public" class="block">
                                <img class="h-12 md:h-auto w-auto mx-auto transition-transform duration-300 hover:scale-105" src="../../assets/images/logo_cadre_vie.png" alt="Logo" />
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
                        <span class="text-white font-semibold text-sm uppercase tracking-wider">Engagements Internationaux</span>
                    </div>
                    <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6 motion-preset-slide-up motion-delay-100">
                        Les <span class="text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600">conventions</span>
                    </h1>
                    <p class="text-lg sm:text-xl text-white/90 max-w-2xl motion-preset-slide-up motion-delay-200">
                        Explorez les conventions et accords internationaux signés et ratifiés par le Bénin.
                    </p>
                </div>
            </div>
        </header>

        <section class="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
            <div class="mx-auto max-w-[90vw]">

                <!-- Header Section -->
                <div class="mb-8 motion-preset-slide-up">
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Explorer les <span class="text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600">conventions</span>
                    </h2>
                    <p class="text-gray-600">{{ conventions.length }} conventions et accords internationaux</p>
                </div>

                <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    <!-- left column - Sidebar Filtres -->
                    <div class="lg:w-80 flex-shrink-0">
                        <div class="lg:sticky lg:top-24">
                            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden motion-preset-blur">
                                <!-- Header -->
                                <div class="p-6 bg-gradient-to-r from-sisep-hit to-red-600 text-white">
                                    <div class="flex items-center gap-3">
                                        <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <UIcon name="i-heroicons-funnel" class="w-5 h-5" />
                                        </div>
                                        <h3 class="text-lg font-bold">Filtres</h3>
                                    </div>
                                </div>
                                <div class="p-6">
                                    <ClientOnly>
                                        <Vueform ref="filterFormEl" v-bind="filterForm" />
                                    </ClientOnly>
                                </div>
                            </div>

                            <!-- Stats Card -->
                            <div class="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <h3 class="font-bold text-gray-900 mb-4">Statistiques</h3>
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm text-gray-600">Total conventions</span>
                                        <span class="font-bold text-sisep-hit">{{ conventions.length }}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm text-gray-600">Ratifiées</span>
                                        <span class="font-bold text-green-600">{{ conventions.filter(c => c.status === 'Ratifiée').length }}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm text-gray-600">En vigueur</span>
                                        <span class="font-bold text-blue-600">{{ conventions.filter(c => c.status === 'En vigueur').length }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- right column - Content Area -->
                    <div class="flex-1 min-w-0">
                        <div class="space-y-6 mb-10">
                            <div v-for="(convention, index) in conventions" :key="index"
                                 :style="{ transitionDelay: `${index * 60}ms` }"
                                 class="motion-preset-blur">
                                <ConventionCard :convention="convention" />
                            </div>
                        </div>

                        <!-- Pagination Redesignée -->
                        <div class="flex justify-center mt-12">
                            <div class="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
                                <UPagination v-model="page" :page-count="9" size="lg" :total="conventions.length" />
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

<script lang="ts" setup>
import Navbar from "~/components/Home/Navbar.vue";
import ConventionCard from "~/components/Home/ConventionCard.vue";
import { UIcon } from "#components";
import FooterSiseb from "~/components/Home/FooterSiseb.vue";

const filterFormEl = ref(null);

const filterForm = ref({
  scrollOnNext: true,
  id: "filter-conventions",
  addClass: "max-w-full",
  displayErrors: true,
  showRequired: ["label"],
  schema: {
    searchBy: {
      type: "text",
      placeholder: "Rechercher une convention",
      label: "Rechercher une convention",
      columns: {
        lg: { container: 12, label: 12, wrapper: 12 },
      },
    },
    type: {
      type: "select",
      placeholder: "Filtrer par type",
      label: "Filtrer par type",
      options: [
        { value: "bilateral", label: "Bilatérale" },
        { value: "multilateral", label: "Multilatérale" },
      ],
      columns: {
        lg: { container: 12, label: 12, wrapper: 12 },
      },
    },
    status: {
      type: "select",
      placeholder: "Filtrer par statut",
      label: "Filtrer par statut",
      options: [
        { value: "signed", label: "Signée" },
        { value: "ratified", label: "Ratifiée" },
        { value: "in_force", label: "En vigueur" },
      ],
      columns: {
        lg: { container: 12, label: 12, wrapper: 12 },
      },
    },
    date: {
      type: "date",
      label: "Filtrer par date de signature",
      columns: {
        lg: { container: 12, label: 12, wrapper: 12 },
      },
    },
    filter: {
      type: "button",
      submits: true,
      buttonLabel: "Filtrer",
      full: true,
      columns: {
        lg: { container: 12, label: 12, wrapper: 12 },
      },
    },
  },
});

const page = ref(1);
const selectedConvention = ref<any | null>(null)

const conventions = ref([
  // {
  //   title: 'Convention sur la diversité biologique',
  //   type: 'Multilatérale',
  //   status: 'Signée',
  //   date: '1992-06-05',
  //   category: 'Biodiversité',
  //   description: "Protection et utilisation durable de la diversité biologique, incluant la répartition juste et équitable des avantages issus des ressources génétiques.",
  //   image: 'https://images.unsplash.com/photo-1437957143641-a72c502fb3b3?w=600&h=400&fit=crop',
  //   coords: [6.37029, 2.39124] // Cotonou (approx.)
  // },
  {
    id: '1',
    title: 'Protocole de Kyoto',
    type: 'Multilatérale',
    status: 'Ratifiée',
    date: '1997-12-11',
    category: 'Climat',
    description: "Accord international visant à réduire les émissions de gaz à effet de serre des pays industrialisés.",
    image: 'https://images.unsplash.com/photo-1504221507732-5246c045949b?w=600&h=400&fit=crop',
    coords: [6.49646, 2.60359] // Porto-Novo
  },
  {
    id: '2',
    title: 'Accord de Paris sur le climat',
    type: 'Multilatérale',
    status: 'En vigueur',
    date: '2015-12-12',
    category: 'Climat',
    description: "Accord global pour limiter le réchauffement climatique bien en dessous de 2°C, avec des contributions nationales.",
    image: 'https://img.freepik.com/photos-gratuite/tour-eiffel-au-champ-mars-paris-france_53876-94787.jpg',
    coords: [9.33716, 2.63031] // Parakou
  },
  {
    id: '3',
    title: 'Convention de Ramsar sur les zones humides',
    type: 'Multilatérale',
    status: 'Signée',
    date: '1971-02-02',
    category: 'Zones humides',
    description: "Protection et utilisation rationnelle des zones humides d'importance internationale.",
    image: 'https://cadredevie.gouv.bj/media?id=462',
    coords: [6.36307, 2.08506] // Ouidah
  },
  {
    id: '4',
    title: 'Convention sur le commerce international des espèces de faune et de flore sauvages menacées d\'extinction (CITES)',
    type: 'Multilatérale',
    status: 'Ratifiée',
    date: '1973-03-03',
    category: 'Faune & Flore',
    description: "Réglementation du commerce des espèces menacées afin d'assurer leur survie.",
    image: 'https://img.freepik.com/photos-gratuite/gros-plan-bebe-cerf-pres-sa-mere-dans-champ-herbeux-sec-flou_181624-2255.jpg',
    coords: [7.17826, 2.0667] // Bohicon
  },
  {
    id: '5',
    title: 'Convention de Stockholm sur les polluants organiques persistants',
    type: 'Multilatérale',
    status: 'En vigueur',
    date: '2001-05-22',
    category: 'Pollution',
    description: "Élimination ou réduction des polluants organiques persistants nocifs pour la santé et l'environnement.",
    image: 'https://img.freepik.com/photos-gratuite/gens-masques-pancartes-exterieur_23-2148970959.jpg',
    coords: [6.63869, 1.71674] // Lokossa
  },
  {
    id: '6',
    title: 'Accord de coopération environnementale Bénin-Ghana',
    type: 'Bilatérale',
    status: 'Signée',
    date: '2023-05-10',
    category: 'Coopération',
    description: "Partenariat bilatéral pour la gestion partagée des ressources naturelles et la lutte contre la pollution.",
    image: 'https://img.freepik.com/photos-premium/quatre-jeunes-adultes-protestent-pancartes-contre-pollution-devant-decharge-illegale-ciel-ouvert-afrique_404612-719.jpg',
    coords: [9.70853, 1.66598] // Djougou
  },
  // {
  //   title: 'Protocole sur la gestion des déchets plastiques',
  //   type: 'Bilatérale',
  //   status: 'Ratifiée',
  //   date: '2022-11-15',
  //   category: 'Déchets',
  //   description: "Réduction, collecte et recyclage des déchets plastiques à l'échelle régionale.",
  //   image: 'https://images.unsplash.com/photo-1597083400551-2b3621ac482e?w=600&h=400&fit=crop',
  //   coords: [10.30416, 1.37962] // Natitingou
  // },
  {
    id: '7',
    title: 'Convention sur la protection des forêts tropicales',
    type: 'Multilatérale',
    status: 'En vigueur',
    date: '1983-11-18',
    category: 'Forêts',
    description: "Conservation et gestion durable des forêts tropicales pour préserver la biodiversité.",
    image: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=600&h=400&fit=crop',
    coords: [8.88649, 2.59753] // Tchaourou
  },
]);
</script>