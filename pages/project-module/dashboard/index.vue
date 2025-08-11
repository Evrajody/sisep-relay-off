<script setup lang="ts">

import Vue3autocounter from "vue3-autocounter";
import { VisXYContainer, VisStackedBar, VisSingleContainer, VisDonut } from '@unovis/vue';

definePageMeta({
  layout: "sisep-app-layout",
});

const stats = reactive([
  {
    id: 1,
    name: "Projects",
    value: 0,
    icon: "i-ic-twotone-pending-actions",
    color: "bg-blue-500/10  border-blue-500",
    colorIcon: "text-blue-500",
  },

  {
    id: 1,
    name: "Types de projets",
    value: 0,
    icon: "i-ic-twotone-block",
    color: "bg-yellow-700/10  border-yellow-700",
    colorIcon: "text-yellow-700",
  },

  {
    id: 1,
    name: "Publiées",
    value: 0,
    icon: "i-ic-sharp-check-circle-outline",
    color: "bg-primary/10  border-primary",
    colorIcon: "text-primary",
  },

  {
    id: 1,
    name: "Indicateurs",
    value: 0,
    icon: "i-ic-baseline-cancel",
    color: "bg-red-500/10  border-red-500",
    colorIcon: "text-red-500",
  },
]);

const links = [{
  label: 'Tableau de bord',
  icon: 'i-heroicons-user-circle'
}]

const barData = [
  { label: 'Projet A', value: 40 },
  { label: 'Projet B', value: 25 },
  { label: 'Projet C', value: 35 },
];
const pieData = [
  { label: 'En cours', value: 45 },
  { label: 'Terminés', value: 35 },
  { label: 'En attente', value: 20 },
];
const x = (d) => d.label;
const y = (d) => d.value;
const value = (d) => d.value;

</script>

<template>

  <UDashboardToolbar :ui="{ wrapper: 'bg-white dark:bg-gray-900' }" class="py-0 px-1.5 overflow-x-auto">
    <UHorizontalNavigation :links="links" />
  </UDashboardToolbar>

  <div class="grid lg:grid-cols-4 px-4 py-5">

    <UDashboardCard
        v-for="i in stats"
        class="lg:rounded-none p* first:rounded-l-lg last:rounded-r-lg hover:z-5"
        title="Recent sales"
        variant="subtle"
    >
      <template #icon>
        <div  class="size-14 border border-primary text-primary-100 rounded-full grid place-items-center">
          <Icon
              class="text-primary-500 text-lg"
              :name="i.icon"
              size="28"
          />
        </div>
      </template>

      <template #title>
        <h3 class="text-base font-extrabold self-center">
          {{ i.name }}
        </h3>
        <h2 class="text-2xl text-gray-500 font-semibold">
          <Vue3autocounter
              ref="counter"
              :autoinit="true"
              :duration="10"
              :endAmount="i.value"
              :startAmount="0"
          />
        </h2>
      </template>
    </UDashboardCard>

  </div>

  <!-- Dashboard Graphs Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 mt-6">
    <UDashboardCard
      title="Répartition des projets (Barres)"
      variant="subtle"
    >
      <VisXYContainer :data="barData" style="height:260px;">
        <VisStackedBar :x="x" :y="y" />
      </VisXYContainer>
    </UDashboardCard>
    <UDashboardCard
      title="Statuts des projets (Camembert)"
      variant="subtle"
    >
      <VisSingleContainer :data="pieData" style="height:260px;">
        <VisDonut :value="value" :name="x" />
      </VisSingleContainer>
    </UDashboardCard>
  </div>

</template>

<style scoped>

</style>