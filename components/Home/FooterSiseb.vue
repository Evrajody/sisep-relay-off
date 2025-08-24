<template>
    <section class=" text-white bg-sisep-hit p-12">

        <div class="bg-primary bg-opacity-20 max-w-[7xl] h-full mx-auto px-14 py-8 w-full rounded-t-md ">
            <div class="flex flex-row items-start justify-between gap-3">
                <div class="flex flex-col space-y-3 ">
                    <h1 class="font-bold text-4xl">SISEB | BENIN</h1>
                    <p class="text-xl w-[80%]">
                        Faits et informations sur les secteurs d'activité liés au cadre de
                        vie et au développement durable.
                    </p>
                </div>

                <ul class="w-1/3 text-xl flex flex-col gap-5">
                    <li class="font-bold">A propos</li>
                    <li class="font-bold">Données</li>
                    <li class="font-bold">ODD</li>
                    <li class="font-bold">Convention</li>
                    <li class="font-bold">FAQ</li>
                </ul>

                <ul class="w-1/3 flex flex-col gap-5">
                    <li class="font-bold text-xl">Condition Générales d'Utilisation</li>
                    <li class="font-bold text-xl">Politique de confidentialité</li>
                    <li class="font-bold text-xl">Mentions Légales</li>
                </ul>

                <ul class="w-1/3 flex  flex-col gap-5">
                    <li class="font-bold text-xl">Contact</li>
                    <li class="flex items-center flex-row gap-x-2 " >
                        <UIcon name="fe-location"  />
                        9C3M+C3V, Rue 637, Cotonou
                    </li>
                    <li class="flex items-center flex-row gap-x-2 " >
                        <UIcon name="fe-phone"  />
                        +229 01 XX XX XX XX
                    </li>
                    <li class="flex items-center flex-row gap-x-2 " >
                        <UIcon name="fe-mail"  />
                        info@cadredevie.bj
                    </li>
                    <li class="flex items-center flex-row gap-x-2 " >
                        <UIcon name="fe-globe"  />
                        www.cadredevie.gouv.bj
                    </li>

                </ul>
            </div>
        </div>

        <div class="flex flex-row ">
            <div class="bg-[#018751] h-2 w-1/3 "></div>
            <div class="bg-[#FCD115] h-2 w-1/3 "></div>
            <div class="bg-[#E9102D]  h-2 w-1/3 "></div>
        </div>

        <p class="text-center py-5">Copyright © siseb.benin 2025</p>
        <!-- <div class="container mx-auto px-14 pt-8">
            
        </div> -->
    </section>
</template>

<script setup lang="ts">
import { UIcon } from '#components';



</script>