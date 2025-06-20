<script setup lang="ts">

</script>

<template>

  <div class="">

    <header class="h-[600px] relative ">


      <img class="absolute inset-0 w-full h-full object-center object-cover"
           src="https://annuaire.justice.bj/images/background_justice_compressed.jpg" alt="">

      <div class="bg-mask-annuaire absolute opacity-60 inset-0"></div>

      <div class="h-fit mx-auto absolute top-7 rounded-lg shadow-lg left-0 right-0 z-20 max-w-7xl bg-white">

        <div class="flex gap-12 justify-between items-center pr-10">
          <div class="img-box rounded-l-lg bg-white w-fit">
            <a href="">
              <img class="h-fit" src="https://annuaire.justice.bj/images/mjl.png">
            </a>
          </div>

          <div class="">

            <ul class="flex gap-6 items-center">
              <li>
                <a href="" class="text-lg font-bold uppercase">
                  <span>Accueil</span>
                </a>
              </li>

              <li>
                <a href="" class="text-lg font-bold uppercase">
                  <span>Trombinoscope</span>
                </a>
              </li>
            </ul>

          </div>

        </div>


      </div>

      <div class="container inset-0 absolute h-full mx-auto">


        <div class="grid h-full place-items-center">

          <div class="group space-y-6">

            <h5
                class="flex gap-2 items-center bg-white py-2 px-2 rounded-sm text-white w-fit backdrop-blur-sm bg-opacity-30">
              <span class="text-lg text-white"> Bienvenue sur </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
                <path fill="currentColor" d="M16.175 13H4v-2h12.175l-5.6-5.6L12 4l8 8l-8 8l-1.425-1.4z"/>
              </svg>
            </h5>

            <h1 class="text-7xl text-white font-bold">
              L'annuaire de la Justice
            </h1>

            <div class="relative mt-8 bg-green-300">

              <input
                  class="w-full  mx-auto qcss motion-preset-slide-up-lg focus:outline-none focus:appearance-auto motion-duration-500 motion-delay-200 bg-white rounded-sm shadow-lg py-5 max-w-4xl px-5 z-30"
                  placeholder="Besoin du contact d'un personnel, recherchez-le dans l'annuaire...." type="search">

              <button
                  class="bg-red-600 absolute right-4 bottom-1/2 translate-y-1/2 text-white rounded-sm shadow-md px-5 py-2.5">
                <span class="font-medium"> Rechercher </span>
              </button>

            </div>

            <div class="font-medium text-white">
              Besoin du contact d'un personnel, recherchez-le dans l'annuaire.
            </div>


          </div>


        </div>

      </div>

    </header>

    <div class="max-w-7xl mx-auto -my-28 z-10 absolute inset-x-0 bg-white rounded-sm ">

      <div class="border-b p-4">
        <h2 class="text-2xl font-bold text-gray-900">
          Résultats pour « Dossou Jean »
        </h2>
      </div>

      <div class="w-full grid grid-cols-3 gap-5 p-4">

        <div
            class="bg-mask-annuaire pb-1 rounded-t-lg transform hover:scale-105 transition-transform duration-300 rounded-b-lg">
          <div
              class=" rounded-lg h-full  bg-gray-50 shadow-lg w-full  ">
            <div class="bg-mask-annuaire rounded-t-lg p-4">
              <h2 class="text-xl line-clamp-2 text-wrap font-bold text-white">
                M./Mme DIOGO Emmanuel Akwagnon Mairo Ben Moussa Aurel Mario
              </h2>
            </div>
            <div class="p-4 space-y-3">
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Fonction :</span>

                <span class="font-medium text-yellow-700">Avocat</span>


              </p>
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Email :</span>

                <a href="mailto:jean.dupont@example.com" class="text-blue-600 hover:underline">
                  jean.dupont@example.com
                </a>

                <span class="size-7 cursor-pointer text-annuaire-plant-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-full" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path
                    fill="currentColor"
                    d="M17 4h-1.18A3 3 0 0 0 13 2h-2a3 3 0 0 0-2.82 2H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-7 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm8 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6h1a1 1 0 0 1 1 1Z"/></svg>
              </span>

              </p>
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Contact :</span>
                <span>
                +33 1 23 45 67 89
              </span>
                <span class="size-7 cursor-pointer text-annuaire-plant-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-full" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path
                    fill="currentColor"
                    d="M17 4h-1.18A3 3 0 0 0 13 2h-2a3 3 0 0 0-2.82 2H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-7 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm8 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6h1a1 1 0 0 1 1 1Z"/></svg>
              </span>
              </p>
              <p class="text-gray-700 flex gap-2 items-center">

                <span class="font-semibold text-gray-900">Juridiction :</span>

                <span>
                Paris, France
              </span>


              </p>
            </div>
            <!--  <div class="bg-mask-annuaire to-annuaire-plant-600/10 rounded-b-lg h-1"></div>-->
          </div>
        </div>

        <div
            class="bg-mask-annuaire pb-1 rounded-t-lg transform hover:scale-105 transition-transform duration-300 rounded-b-lg">
          <div
              class=" rounded-lg h-full  bg-gray-50 shadow-lg w-full  ">
            <div class="bg-mask-annuaire rounded-t-lg p-4">
              <h2 class="text-xl line-clamp-2 text-wrap font-bold text-white">
                M./Mme DIOGO Emmanuel Akwagnon Mairo Ben Moussa Aurel Mario
              </h2>
            </div>
            <div class="p-4 space-y-3">
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Fonction :</span>

                <span class="font-medium text-yellow-700">Avocat</span>


              </p>
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Email :</span>

                <a href="mailto:jean.dupont@example.com" class="text-blue-600 hover:underline">
                  jean.dupont@example.com
                </a>

                <span class="size-7 cursor-pointer text-annuaire-plant-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-full" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path
                    fill="currentColor"
                    d="M17 4h-1.18A3 3 0 0 0 13 2h-2a3 3 0 0 0-2.82 2H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-7 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm8 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6h1a1 1 0 0 1 1 1Z"/></svg>
              </span>

              </p>
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Contact :</span>
                <span>
                +33 1 23 45 67 89
              </span>
                <span class="size-7 cursor-pointer text-annuaire-plant-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-full" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path
                    fill="currentColor"
                    d="M17 4h-1.18A3 3 0 0 0 13 2h-2a3 3 0 0 0-2.82 2H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-7 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm8 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6h1a1 1 0 0 1 1 1Z"/></svg>
              </span>
              </p>
              <p class="text-gray-700 flex gap-2 items-center">

                <span class="font-semibold text-gray-900">Juridiction :</span>

                <span>
                Paris, France
              </span>


              </p>
            </div>
            <!--  <div class="bg-mask-annuaire to-annuaire-plant-600/10 rounded-b-lg h-1"></div>-->
          </div>
        </div>

        <div
            class="bg-mask-annuaire pb-1 rounded-t-lg transform hover:scale-105 transition-transform duration-300 rounded-b-lg">
          <div
              class=" rounded-lg h-full  bg-gray-50 shadow-lg w-full  ">
            <div class="bg-mask-annuaire rounded-t-lg p-4">
              <h2 class="text-xl line-clamp-2 text-wrap font-bold text-white">
                M./Mme DIOGO Emmanuel Akwagnon Mairo Ben Moussa Aurel Mario
              </h2>
            </div>
            <div class="p-4 space-y-3">
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Fonction :</span>

                <span class="font-medium text-yellow-700">Avocat</span>


              </p>
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Email :</span>

                <a href="mailto:jean.dupont@example.com" class="text-blue-600 hover:underline">
                  jean.dupont@example.com
                </a>

                <span class="size-7 cursor-pointer text-annuaire-plant-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-full" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path
                    fill="currentColor"
                    d="M17 4h-1.18A3 3 0 0 0 13 2h-2a3 3 0 0 0-2.82 2H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-7 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm8 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6h1a1 1 0 0 1 1 1Z"/></svg>
              </span>

              </p>
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Contact :</span>
                <span>
                +33 1 23 45 67 89
              </span>
                <span class="size-7 cursor-pointer text-annuaire-plant-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-full" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path
                    fill="currentColor"
                    d="M17 4h-1.18A3 3 0 0 0 13 2h-2a3 3 0 0 0-2.82 2H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-7 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm8 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6h1a1 1 0 0 1 1 1Z"/></svg>
              </span>
              </p>
              <p class="text-gray-700 flex gap-2 items-center">

                <span class="font-semibold text-gray-900">Juridiction :</span>

                <span>
                Paris, France
              </span>


              </p>
            </div>
            <!--  <div class="bg-mask-annuaire to-annuaire-plant-600/10 rounded-b-lg h-1"></div>-->
          </div>
        </div>

        <div
            class="bg-mask-annuaire pb-1 rounded-t-lg transform hover:scale-105 transition-transform duration-300 rounded-b-lg">
          <div
              class=" rounded-lg h-full  bg-gray-50 shadow-lg w-full  ">
            <div class="bg-mask-annuaire rounded-t-lg p-4">
              <h2 class="text-xl line-clamp-2 text-wrap font-bold text-white">
                M./Mme DIOGO Emmanuel Akwagnon Mairo Ben Moussa Aurel Mario
              </h2>
            </div>
            <div class="p-4 space-y-3">
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Fonction :</span>

                <span class="font-medium text-yellow-700">Avocat</span>


              </p>
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Email :</span>

                <a href="mailto:jean.dupont@example.com" class="text-blue-600 hover:underline">
                  jean.dupont@example.com
                </a>

                <span class="size-7 cursor-pointer text-annuaire-plant-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-full" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path
                    fill="currentColor"
                    d="M17 4h-1.18A3 3 0 0 0 13 2h-2a3 3 0 0 0-2.82 2H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-7 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm8 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6h1a1 1 0 0 1 1 1Z"/></svg>
              </span>

              </p>
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Contact :</span>
                <span>
                +33 1 23 45 67 89
              </span>
                <span class="size-7 cursor-pointer text-annuaire-plant-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-full" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path
                    fill="currentColor"
                    d="M17 4h-1.18A3 3 0 0 0 13 2h-2a3 3 0 0 0-2.82 2H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-7 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm8 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6h1a1 1 0 0 1 1 1Z"/></svg>
              </span>
              </p>
              <p class="text-gray-700 flex gap-2 items-center">

                <span class="font-semibold text-gray-900">Juridiction :</span>

                <span>
                Paris, France
              </span>


              </p>
            </div>
            <!--  <div class="bg-mask-annuaire to-annuaire-plant-600/10 rounded-b-lg h-1"></div>-->
          </div>
        </div>

        <div
            class="bg-mask-annuaire pb-1 rounded-t-lg transform hover:scale-105 transition-transform duration-300 rounded-b-lg">
          <div
              class=" rounded-lg h-full  bg-gray-50 shadow-lg w-full  ">
            <div class="bg-mask-annuaire rounded-t-lg p-4">
              <h2 class="text-xl line-clamp-2 text-wrap font-bold text-white">
                M./Mme DIOGO Emmanuel Akwagnon Mairo Ben Moussa Aurel Mario
              </h2>
            </div>
            <div class="p-4 space-y-3">
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Fonction :</span>

                <span class="font-medium text-yellow-700">Avocat</span>

              </p>
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Email :</span>

                <a href="mailto:jean.dupont@example.com" class="text-blue-600 hover:underline">
                  jean.dupont@example.com
                </a>

                <span class="size-7 cursor-pointer text-annuaire-plant-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-full" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path
                    fill="currentColor"
                    d="M17 4h-1.18A3 3 0 0 0 13 2h-2a3 3 0 0 0-2.82 2H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-7 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm8 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6h1a1 1 0 0 1 1 1Z"/></svg>
              </span>

              </p>
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Contact :</span>
                <span>
                +33 1 23 45 67 89
              </span>
                <span class="size-7 cursor-pointer text-annuaire-plant-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-full" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path
                    fill="currentColor"
                    d="M17 4h-1.18A3 3 0 0 0 13 2h-2a3 3 0 0 0-2.82 2H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-7 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm8 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6h1a1 1 0 0 1 1 1Z"/></svg>
              </span>
              </p>
              <p class="text-gray-700 flex gap-2 items-center">

                <span class="font-semibold text-gray-900">Juridiction :</span>

                <span>
                Paris, France
              </span>


              </p>
            </div>
            <!--  <div class="bg-mask-annuaire to-annuaire-plant-600/10 rounded-b-lg h-1"></div>-->
          </div>
        </div>

        <div
            class="bg-mask-annuaire pb-1 rounded-t-lg transform hover:scale-105 transition-transform duration-300 rounded-b-lg">
          <div
              class=" rounded-lg h-full  bg-gray-50 shadow-lg w-full  ">
            <div class="bg-mask-annuaire rounded-t-lg p-4">
              <h2 class="text-xl line-clamp-2 text-wrap font-bold text-white">
                M./Mme DIOGO Emmanuel Akwagnon Mairo Ben Moussa Aurel Mario
              </h2>
            </div>
            <div class="p-4 space-y-3">
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Fonction :</span>

                <span class="font-medium text-yellow-700">Avocat</span>


              </p>
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Email :</span>

                <a href="mailto:jean.dupont@example.com" class="text-blue-600 hover:underline">
                  jean.dupont@example.com
                </a>

                <span class="size-7 cursor-pointer text-annuaire-plant-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-full" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path
                    fill="currentColor"
                    d="M17 4h-1.18A3 3 0 0 0 13 2h-2a3 3 0 0 0-2.82 2H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-7 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm8 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6h1a1 1 0 0 1 1 1Z"/></svg>
              </span>

              </p>
              <p class="text-gray-700 flex items-center gap-2">
                <span class="font-semibold text-gray-900">Contact :</span>
                <span>
                +33 1 23 45 67 89
              </span>
                <span class="size-7 cursor-pointer text-annuaire-plant-800 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-full" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path
                    fill="currentColor"
                    d="M17 4h-1.18A3 3 0 0 0 13 2h-2a3 3 0 0 0-2.82 2H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-7 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm8 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6h1a1 1 0 0 1 1 1Z"/></svg>
              </span>
              </p>
              <p class="text-gray-700 flex gap-2 items-center">

                <span class="font-semibold text-gray-900">Juridiction :</span>

                <span>
                Paris, France
              </span>


              </p>
            </div>
            <!--  <div class="bg-mask-annuaire to-annuaire-plant-600/10 rounded-b-lg h-1"></div>-->
          </div>
        </div>













        <!-- VERSION ALTERNATIVE  -->


      </div>
    </div>


  </div>


</template>

<style scoped>

</style>