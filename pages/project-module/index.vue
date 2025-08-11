<script setup lang="ts">

definePageMeta({
  layout: "sisep-app-layout",
});

const links = [{
  label: 'Listing des projets',
  icon: 'i-heroicons-user-circle'
}]

</script>

<template>
  <UDashboardToolbar :ui="{ wrapper: 'bg-white dark:bg-gray-900' }" class="py-0 px-1.5 overflow-x-auto">
    <UHorizontalNavigation :links="links" />
  </UDashboardToolbar>


  <div class="max-w-5xl w-full py-5 mx-auto">

    <UDashboardCard
        :ui="{
        wrapper: 'border-b border-gray-100',
        header: {
          wrapper: 'border-b border-gray-100'
        }
      }"
    >
      <template #title>
        Listing des projets
      </template>

      <template #description>
        Listing complet des projets publiés
      </template>


      <div class="">

      </div>

    </UDashboardCard>

  </div>



</template>

<style scoped>

</style>