<script lang="ts" setup>
import FooterSiseb from "~/components/Home/FooterSiseb.vue";
import Navbar from "~/components/Home/Navbar.vue";
import ProjectCard from "~/components/Home/ProjectCard.vue";
import { UIcon } from "#components";
import L from "leaflet";




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
        navigateTo({ name: 'project-module-dashboard' })
    },

    schema: {
        searchBy: {
            type: "text",
            placeholder: "Rechercher un projet",
            label: "Rechercher un projet",
            columns: {
                default: { container: 12, label: 12, wrapper: 12 },
                sm: { container: 12, label: 12, wrapper: 12 },
                md: { container: 12, label: 12, wrapper: 12 },
                lg: { container: 12, label: 12, wrapper: 12 },
            },
        },
        departement: {
            type: "select",
            placeholder: "Filtrer par departement",
            label: "Filtrer par departement",
            options: [
                { value: "1", label: "Departement 1" },
                { value: "2", label: "Departement 2" },
                { value: "3", label: "Departement 3" },
                { value: "4", label: "Departement 4" },
            ],

            columns: {
                default: { container: 12, label: 12, wrapper: 12 },
                sm: { container: 12, label: 12, wrapper: 12 },
                md: { container: 12, label: 12, wrapper: 12 },
                lg: { container: 12, label: 12, wrapper: 12 },
            },
        },
        budget: {
            type: "slider",
            showTooltip: "focus",
            placeholder: "Filtrer par departement",
            label: "Filtrer par departement",
            columns: {
                default: { container: 12, label: 12, wrapper: 12 },
                sm: { container: 12, label: 12, wrapper: 12 },
                md: { container: 12, label: 12, wrapper: 12 },
                lg: { container: 12, label: 12, wrapper: 12 },
            },
        },

        date: {
            type: "date",
            label: "Filtrer par date de publication",
            columns: {
                default: { container: 12, label: 12, wrapper: 12 },
                sm: { container: 12, label: 12, wrapper: 12 },
                md: { container: 12, label: 12, wrapper: 12 },
                lg: { container: 12, label: 12, wrapper: 12 },
            },
        },


        filter: {
            type: "button",
            submits: true,
            buttonLabel: "Filtrer",
            full: true,
            columns: {
                default: { container: 12, label: 12, wrapper: 12 },
                sm: { container: 12, label: 12, wrapper: 12 },
                md: { container: 12, label: 12, wrapper: 12 },
                lg: { container: 12, label: 12, wrapper: 12 },
            },
        },
    },
});

const page = ref(1);

// Create locations data (20 locations around Nantes)
const locations = [
    { name: 'Nantes', lat: 47.218371, lng: -1.553621 },
    { name: 'Saint-Nazaire', lat: 47.273018, lng: -2.213733 },
    { name: 'La Baule', lat: 47.286835, lng: -2.393108 },
    { name: 'Pornic', lat: 47.112, lng: -2.102 },
    { name: 'Guérande', lat: 47.328, lng: -2.429 },
    { name: 'Clisson', lat: 47.087, lng: -1.276 },
    { name: 'Ancenis', lat: 47.366, lng: -1.176 },
    { name: 'Châteaubriant', lat: 47.716, lng: -1.376 },
    { name: 'Redon', lat: 47.652, lng: -2.084 },
    { name: 'Pontchâteau', lat: 47.433, lng: -2.117 },
    { name: 'Savenay', lat: 47.327, lng: -1.952 },
    { name: 'Rezé', lat: 47.183, lng: -1.55 },
    { name: 'Vertou', lat: 47.166, lng: -1.466 },
    { name: 'Carquefou', lat: 47.283, lng: -1.5 },
    { name: 'Orvault', lat: 47.283, lng: -1.633 },
    { name: 'Saint-Herblain', lat: 47.216, lng: -1.65 },
    { name: 'Sainte-Luce-sur-Loire', lat: 47.233, lng: -1.483 },
    { name: 'Bouguenais', lat: 47.183, lng: -1.583 },
    { name: 'Saint-Sébastien-sur-Loire', lat: 47.183, lng: -1.483 },
    { name: 'Basse-Goulaine', lat: 47.2, lng: -1.483 }
];

const projets = [
  { ville: 'Cotonou', coords: [6.379448, 2.451324], nom: 'Énergies Renouvelables de Cotonou', budget: 150_000_000 },
  { ville: 'Porto-Novo', coords: [6.49646, 2.60359], nom: 'Rénovation du Marché Central', budget: 100_000_000 },
  { ville: 'Parakou', coords: [9.33716, 2.63031], nom: 'Centre de Formation Agro-écologique', budget: 80_000_000 },
  { ville: 'Abomey-Calavi', coords: [6.44852, 2.35566], nom: 'Zone Industrielle Écologique', budget: 200_000_000 },
  { ville: 'Djougou', coords: [9.70853, 1.66598], nom: 'Réseau Hydraulique Rural', budget: 90_000_000 },
  { ville: 'Tchaourou', coords: [8.88649, 2.59753], nom: 'Parc Agricole Innovant', budget: 120_000_000 },
  { ville: 'Natitingou', coords: [10.30416, 1.37962], nom: 'Tourisme Patrimonial', budget: 110_000_000 },
  { ville: 'Bohicon', coords: [7.17826, 2.0667], nom: 'Marché Numérique de Bohicon', budget: 70_000_000 },
  { ville: 'Ouidah', coords: [6.36307, 2.08506], nom: 'Promenade culturelle de Ouidah', budget: 130_000_000 },
  { ville: 'Lokossa', coords: [6.63869, 1.71674], nom: 'E-santé Lokossa', budget: 95_000_000 },
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
                src="~/assets/images/cadre_world.jpg" />

            <div class="bg-black/80 absolute opacity-60 inset-0"></div>

            <div
                class="h-fit mx-auto absolute top-7 rounded-lg shadow-lg left-0 right-0 z-20 max-w-[90vw] bg-sisep-hit">
                <div class="flex gap-12 justify-start items-center pr-10">
                    <div class="img-box flex rounded-l-lg bg-white w-fit">
                        <div class="w-[300px]">
                            <a href="">
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
                    <button @click="toogle(false)"
                        :class="isList ? 'border-2 border-gray-400 text-lg text-black rounded-md px-4 py-2' : 'bg-primary text-white px-4 text-lg py-2 rounded-md'">Mode
                        cartographie</button>
                    <button @click="toogle(true)"
                        :class="isList ? 'bg-primary text-white px-4 text-lg py-2 rounded-md' : 'border-2 border-gray-400 text-lg text-black rounded-md px-4 py-2'">Mode
                        liste</button>
                </div>
                <div class="flex flex-row  gap-x-3 gap-y-10 my-10">


                    <!-- left column -->
                    <div class="col-span-1 lg:px-5 w-1/4 ">
                        <!-- Wrapper sticky -->
                        <div class="lg:sticky lg:top-5">
                            <div class="bg-slate-100 h-auto rounded">
                                <!-- Header -->

                                <div class="p-5 flex flex-row bg-sisep-hit text-white  ">
                                    <UIcon name="fe-filter" size="28" class="text-2xl" />
                                    <h3 class="text-lg font-semibold">Filtres des projets </h3>
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

                    <div v-if="isList" class="col-span-2 w-3/4 text-sm/relaxed md:text-base/relaxed lg:pr-8 h-screen ">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            <div v-for="i in 6">
                                <ProjectCard />
                            </div>

                        </div>
                        <div class="flex items-end justify-end w-full my-10 ">
                            <UPagination class="text-end" v-model="page" :page-count="5" size="xl" :total="100" />
                        </div>
                    </div>

                    <div class="w-3/4" v-else>
                        <ClientOnly>
                            <LMap style="height: 70dvh" :zoom="7" :max-zoom="10" :ref="map" :center="[9.30769, 2.315834]"
                                :use-global-leaflet="false">
                                <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                                    layer-type="base" name="OpenStreetMap" />
                                    <LMarker v-for="marker in projets" :lat-lng="[marker.coords[0], marker.coords[1]]" :key="marker.nom" >
                                        <LTooltip style="background-color: transparent !important ; padding: 0 !important;" >
                                        <div class="max-w-[20vw]" >
                                            <ProjectCard />
                                            
                                        </div>
                                        </LTooltip>
                                    </LMarker>

                            </LMap>
                        </ClientOnly>
                    </div>
                </div>

            </div>
        </section>

        <!-- SECTION FOOTER -->
        <!-- <FooterSiseb /> -->
    </main>
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
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);

}

</style>    
