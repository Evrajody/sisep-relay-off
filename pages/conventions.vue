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
                            Les conventions
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
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-content-center mx-auto my-16" >
                        
                        <div class="w-[20vw] bg-gradient-to-t from-green-300 from-35% to-white h-[40dvh] flex flex-col rounded-xl shadow-xl p-3 " >
                            <img class="  mt-3 object-cover w-[90%] " src="~/assets/images/conventionImg-1.png" alt="">
                            <p>GREENTECH-CONVENTION-2</p>
                            <p>Date de mise en vigueur: </p>
                            <small>2024-09-01</small>
                            <p>Date de ratification</p>
                            <small>2024-09-01</small>
                            <p>Date d’adaption</p>
                            <div class="flex flex-row justify-between items-center gap-2" >
                                <small>2024-09-01</small>
                                <button>Voir plus</button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </section>

        <FooterSiseb></FooterSiseb>
    </main>
</template>

<script lang="ts" setup>

import FooterSiseb from '~/components/Home/FooterSiseb.vue';
import Navbar from '~/components/Home/Navbar.vue';




</script>