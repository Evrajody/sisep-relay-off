<script lang="ts" setup>
import { useCreateProject } from '~/composables/project/useCreateProject';


definePageMeta({
  layout: "sisep-app-layout",
  middleware: ["auth"],
});

const links = [{
  label: 'Création d\'un nouveau projet',
  icon: 'i-heroicons-user-circle'
}]

useHead({
  title: 'Création d\'un nouveau projet',
});

const { createProjectForm, createProjectFormEl } = useCreateProject();

</script>

<template>

  <UDashboardToolbar :ui="{ wrapper: 'bg-white dark:bg-gray-900' }" class="py-0 px-1.5 overflow-x-auto">
    <UHorizontalNavigation :links="links"/>
  </UDashboardToolbar>


  <div class="max-w-7xl w-full py-5 mx-auto">

    <UDashboardCard
        v-loading="createProjectFormEl?.submitting"
        element-loading-text="Loading..."
        element-loading-svg-view-box="-10, -10, 50, 50"
        element-loading-background="rgba(255, 255, 255, 0.8)"

        :ui="{
        wrapper: 'border-b border-gray-100',
        header: {
          wrapper: 'border-b border-gray-100',
          padding: '!px-4  py-3', background: 'bg-primary-50'
        }
      }"
    >

      <template #title>
        Creation d'un nouveau projet
      </template>

      <template #description>
        Merci de remplir les champs obligatoires pour terminer la création
      </template>


      <div class="">
        <Vueform v-bind="createProjectForm" ref="createProjectFormEl"/>
      </div>

      <template #footer>

        <div class="flex gap-2">
          <UButton
              class="rounded-md"
              color="red"
              icon="i-heroicons-x-circle-solid"
              label="Annuler"
              size="lg"
              :loading="createProjectFormEl?.submitting"
              @click.prevent="null"
          />
          <UButton
              class="rounded-md shadow bg-primary font-medium"
              icon="i-heroicons-check-solid"
              label="Enregistrer"
              size="lg"
              :disabled="createProjectFormEl?.submitting"
              :loading="createProjectFormEl?.submitting"
              @click.prevent="createProjectFormEl?.submit()"
          />
        </div>

      </template>

    </UDashboardCard>

  </div>


</template>

<style scoped>

</style>