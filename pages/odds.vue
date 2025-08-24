<template>
    <main class="">
        <!-- SECTION BANNER PRINCIPAL-->
        <header class="h-[40dvh] relative bg-gray-100">
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
                            Les ODDS
                        </h1>

                        <div class="font-medium text-white">
                            Faits et informations sur les secteurs d'activité liés au cadre de
                            vie et au développement durable.
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <section class="min-h-[100dvh] bg-[#F2F7F7] ">
            <div class="container w-full relative">
                <img alt="" class="absolute w-full h-full opacity-5 object-center object-cover"
                    src="~/assets/images/cadre_world.jpg">
                <div class="flex mx-auto justify-center w-[60%] items-center gap-2 p-4 bg-gray-50">
                    <!-- Select catégories -->
                    <div class="relative my-10 ">
                        <select
                            class="appearance-none border w-[22vw] border-gray-300 rounded px-4 py-2 pr-8 text-green-600 font-semibold focus:outline-none">
                            <option disabled selected >Catégories</option>
                            <!-- Ajoute ici les autres options -->
                        </select>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M5.516 7.548L10 12.032l4.484-4.484L16 9.064l-6 6-6-6z" />
                            </svg>
                        </div>
                    </div>

                    <!-- Champ de recherche -->
                    <div class="flex flex-grow shadow-md my-14 ">
                        <input type="text" placeholder="Trouvez les activités …"
                            class="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none" />
                        <button
                            class="bg-[#1498DA] text-white px-4 rounded-r hover:cursor-pointer flex justify-center items-center gap-1">
                            Recherche
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387-1.414 1.414-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>


                <div class="min-h-screen flex items-center justify-center">
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-content-center mx-auto my-16">
                        <div v-for="odd in odds" :key="odd.index"
                            class="bg-white flex flex-col justify-between items-center rounded-tr-5xl shadow-lg overflow-hidden h-[40dvh] max-w-sm w-[18vw] border-b-8 border-green-600">
                            <!-- Contenu principal -->
                            <div class="p-8 text-center flex flex-col justify-between h-full w-full">
                                <!-- Cercle avec le numéro -->
                                <div
                                    class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span class="text-white text-2xl font-bold">{{ odd.index }}</span>
                                </div>

                                <!-- Texte descriptif -->
                                <p class="text-gray-800 text-custom leading-relaxed mb-6 flex-1">
                                    {{ odd.description }}
                                </p>

                                <!-- Bouton -->
                                <button
                                    class="bg-[#1498DA] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 mt-auto">
                                    En savoir plus
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </div>


            </div>

        </section>

        <Footer></Footer>
    </main>

</template>

<script lang="ts" setup>

import Footer from '~/components/Home/Footer.vue';
import Navbar from '~/components/Home/Navbar.vue';


const odds = reactive([
    {
        index: 6,
        description: "Garantir l’accès de tous à l’eau et à l’assainissement et assurer une gestion durable des ressources en eau"
    },
    {
        index: 7,
        description: "Garantir l’accès de tous à des services énergétiques fiables, durables et modernes, à un coût abordable"
    },
    {
        index: 8,
        description: "Promouvoir une croissance économique soutenue, partagée et durable, le plein emploi productif et un travail décent pour tous"
    },
    {
        index: 9,
        description: "Mettre en place une infrastructure résiliente, promouvoir une industrialisation durable qui profite à tous et encourager l’innovation"
    },
    {
        index: 10,
        description: "Réduire les inégalités entre les pays et en leur sein"
    },
    {
        index: 11,
        description: "Faire en sorte que les villes et les établissements humains soient ouverts à tous, sûrs, résilients et durables"
    },
    {
        index: 12,
        description: "Établir des modes de consommation et de production durables"
    },
    {
        index: 13,
        description: "Conserver et exploiter de manière durable les océans, les mers et les ressources marines aux fins du développement durable"
    },
    {
        index: 15,
        description: "Faire en sorte que les villes et les établissements humains soient ouverts à tous, sûrs, résilients et durables"
    },
    {
        index: 16,
        description: "Établir des modes de consommation et de production durables"
    },
    {
        index: 17,
        description: "Conserver et exploiter de manière durable les océans, les mers et les ressources marines aux fins du développement durable"
    },
    {
        index: 14,
        description: "Préserver et restaurer les écosystèmes terrestres, en veillant à les exploiter de façon durable, gérer durablement les forêts, lutter contre la désertification, enrayer et inverser le processus de dégradation des sols et mettre fin à l’appauvrissement de la biodiversité"
    },

])


</script>