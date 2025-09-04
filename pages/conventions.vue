<template>
    <main class="">
        <!-- SECTION BANNER PRINCIPAL-->
        <header class="h-[40dvh] bg-gray-100 relative top-0">
            <img alt="" class="absolute inset-0 w-full h-full object-center object-cover"
                src="~/assets/images/img-odds.png" />

            <div class="bg-black/80 absolute opacity-60 inset-0"></div>

            <div
                class="h-fit mx-auto  absolute top-7 rounded-lg shadow-lg left-0 right-0 z-20 max-w-[90vw] bg-sisep-hit">
                <div class="flex gap-12 justify-start items-center pr-10">
                    <div class="img-box flex rounded-l-lg bg-white w-fit">
                        <div class="w-[300px]">
                            <a href="/">
                                <img class="" src="~/assets/images/logo_cadre_vie.png" />
                            </a>
                        </div>
                    </div>

                    <!-- Navbar -->
                    <Navbar />
                </div>
            </div>

            <div class="container inset-0 absolute h-full mx-auto mt-20">
                <div class="grid h-full place-items-center justify-start">
                    <div class="group space-y-6 text-start">
                        <h1 class="text-6xl text-white text-start font-bold">
                            Les conventions
                        </h1>

                        <div class="font-medium text-white">
                            Explorez les conventions et accords signés par le Bénin.
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <section class="py-8 sm:py-14 lg:py-16">
            <div class="mx-auto max-w-[90vw]">
                <div class="flex flex-row gap-x-3 gap-y-10 my-10">
                    <!-- left column -->
                    <div class="col-span-1 lg:px-5 w-1/4">
                        <!-- Wrapper sticky -->
                        <div class="lg:sticky lg:top-5">
                            <div class="bg-slate-100 shadow-lg h-auto rounded">
                                <!-- Header -->
                                <div class="p-5 flex flex-row items-center gap-2 bg-sisep-hit text-white">
                                    <UIcon name="i-heroicons-funnel" class="text-2xl" />
                                    <h3 class="text-lg font-semibold">Filtres des conventions</h3>
                                </div>
                                <div class="p-4">
                                    <ClientOnly>
                                        <Vueform ref="filterFormEl" v-bind="filterForm" />
                                    </ClientOnly>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- right column -->
                    <div class="col-span-2 w-3/4 text-sm/relaxed md:text-base/relaxed lg:pr-8">

                        <div class="grid grid-cols-1  gap-4 mb-8">
                            <div v-for="(convention, index) in conventions" :key="index">
                                <ConventionCard :convention="convention" />
                            </div>
                        </div>
                        <div class="flex items-end justify-end w-full my-10">
                            <UPagination v-model="page" :page-count="9" size="xl" :total="conventions.length" />
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