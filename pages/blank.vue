<script setup lang="ts">

import Vue3autocounter from "vue3-autocounter";
import { VisXYContainer, VisStackedBar, VisSingleContainer, VisDonut } from '@unovis/vue';

definePageMeta({
  layout: "sisep-app-layout",
});

const links = [{
  label: 'Création d\'un nouveau projet',
  icon: 'i-heroicons-user-circle'
}]

</script>

<template>
  <UDashboardToolbar :ui="{ wrapper: 'bg-white dark:bg-gray-900' }" class="py-0 px-1.5 overflow-x-auto">
    <UHorizontalNavigation :links="links" />
  </UDashboardToolbar>





</template>

<style scoped>

</style>