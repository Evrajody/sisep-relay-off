<script lang="ts" setup>
  const {$sisepApi} = useNuxtApp()

</script>

<template>

  <header class="h-[750px] relative bg-green-400">
    
    <div class="inset-0 absolute z-5 bg-black/70"></div>

    <img alt="" class="absolute inset-0 w-full h-full"
        src="https://www.gouv.bj/upload/images/articles/ckeditor/amazone2.jpg">

    <div class="max-w-7xl inset-0">

      <nav class="text-3xl py-5 font-bold underline">
        Hello world!
      </nav>

      <div class="grid h-full mt-10 py-5 bg-red-600 lg:grid-cols-2">

        <div class="flex flex-col space-y-5">

          <h2 class="text-6xl leading-tight py-5 font-bold">
            Accéder aux données clés sur le cadre de vie au Bénin
          </h2>

          <p class="text-lg font-medium">
            Retrouver les faits et informations sur les secteurs d'activité liés au cadre de vie et au développement
            durable.
          </p>

        </div>

      </div>

    </div>

  </header>


</template>

<style scoped>

</style>