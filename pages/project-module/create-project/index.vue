<script lang="ts" setup>

definePageMeta({
  layout: "sisep-app-layout",
});

const links = [{
  label: 'Liste des projets',
  icon: 'i-heroicons-user-circle'
}]

useHead({
  title: 'Liste des projets',
});

const search = ref('');

const statusPermisFilter = ref('');

const selectedColumns = ref([]);

const pagination = ref({
  page: 1,
  pageCount: 10,
  totalItems: 10,
  pageFrom: 1,
  pageTo: 10

})

const columnsTable = ref([
  {
    id: "libelle",
    key: "title",
    label: "Titre"
  },

  {
    id: "statut",
    key: "Statut",
    label: "Statut"
  }

]);

const dataProjets = ref([
  {
    id: 1,
    title: "Projet d'aménagement des espace verts du littoral",
    statut: "En cours"
  },
  {
    id: 2,
    title: "Projet de constructions de centre de recherche et d'innovation",
    statut: "En cours"
  }
])

</script>

<template>

  <UDashboardToolbar :ui="{ wrapper: 'bg-white dark:bg-gray-900' }" class="py-0 px-1.5 overflow-x-auto">
    <UHorizontalNavigation :links="links"/>
  </UDashboardToolbar>


  <div class="max-w-5xl w-full py-5 mx-auto">

    <UDashboardCard
        :ui="{
       divide: 'divide-x divide-gray-200 dark:divide-gray-700',
        title: 'text-gray-900 dark:text-white font-semibold',
        wrapper: ' border-gray-100',
        header: {
          wrapper: ' border-gray-100'
        }
      }"
    >

      <template #title>
        Liste des projets
      </template>

      <template #description>
        Merci de remplir les champs obligatoires pour terminer la création
      </template>


      <div class="">

          <!-- Filters -->
          <div class="flex items-center justify-between gap-3 px-4">
            <UInput
                v-model="search"
                class="w-[500px]"
                icon="i-heroicons-magnifying-glass-20-solid"
                placeholder="Filter les projets..."
                size="lg"
            />
            <USelectMenu
                v-model="statusPermisFilter"
                :options="[]"
                class="w-[250px]"
                clear-search-on-close
                placeholder="--Filter par statut--"
                size="lg"
                value-attribute="key"
            />
          </div>

          <!-- ACTIONS BUTTONS -->
          <div class="flex justify-between items-center w-full px-4 py-3">
            <div class="flex items-center gap-1.5">
              <span class="text-sm leading-5">Element par page:</span>
              <USelect
                  :options="[3, 5, 10, 20, 30]"
                  class="me-2 w-[100px]"
                  size="lg"
              />
            </div>
            <div class="flex gap-2 items-center">
              <USelectMenu v-model="selectedColumns" :options="[]">
                <UButton color="gray" icon="i-heroicons-view-columns" size="lg">
                  Afficher uniquement
                </UButton>
              </USelectMenu>
              <UButton
                  color="gray"
                  icon="i-heroicons-funnel"
                  size="lg"
                  @click="null"
              >
                Réinitialiser
              </UButton>
            </div>
          </div>

          <!-- TABLES -->
          <UTable
              :columns="columnsTable"
              :loading="false"
              :rows="dataProjets"
              class="w-full"
              @select="null"
          >
            <template #title-data="{ row }">
              <div class="flex gap-3 space-y-2">
                <NuxtImg
                    class="rounded-md"
                    width="200"
                    height="200"
                    src="https://images.pexels.com/photos/545068/pexels-photo-545068.jpeg"/>

                <div class="flex ">
                  <p class="font-extrabold  text-lg"> {{row.title}} </p>
                </div>
              </div>
            </template>

            <template #empty-state>
              <div class="flex flex-col items-center gap-5 justify-center py-12">
                <div class="size-10">
                  <svg
                      class="size-10 text-gray-500"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        d="M7.628 1.099a.75.75 0 0 1 .744 0l5.25 3a.75.75 0 0 1 0 1.302l-5.25 3a.75.75 0 0 1-.744 0l-5.25-3a.75.75 0 0 1 0-1.302z"
                        fill="currentColor"
                    />
                    <path
                        d="m2.57 7.24l-.192.11a.75.75 0 0 0 0 1.302l5.25 3a.75.75 0 0 0 .744 0l5.25-3a.75.75 0 0 0 0-1.303l-.192-.11l-4.314 2.465a2.25 2.25 0 0 1-2.232 0z"
                        fill="currentColor"
                    />
                    <path
                        d="m2.378 10.6l.192-.11l4.314 2.464a2.25 2.25 0 0 0 2.232 0l4.314-2.465l.192.11a.75.75 0 0 1 0 1.303l-5.25 3a.75.75 0 0 1-.744 0l-5.25-3a.75.75 0 0 1 0-1.303"
                        fill="currentColor"
                    />
                  </svg>
                </div>
                <span class="text-sm"> Aucune donnée </span>
              </div>
            </template>

            <template #loading-state>
              <div class="flex flex-col items-center gap-5 justify-center py-12">
                <div class="size-10">
                  <svg
                      class="size-10"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        d="M12 3c4.97 0 9 4.03 9 9"
                        fill="none"
                        stroke="currentColor"
                        stroke-dasharray="16"
                        stroke-dashoffset="16"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                    >
                      <animate
                          attributeName="stroke-dashoffset"
                          dur="0.2s"
                          fill="freeze"
                          values="16;0"
                      />
                      <animateTransform
                          attributeName="transform"
                          dur=".5s"
                          repeatCount="indefinite"
                          type="rotate"
                          values="0 12 12;360 12 12"
                      />
                    </path>
                  </svg>
                </div>
                <span class="text-sm"> Chargement des données... </span>
              </div>
            </template>
          </UTable>

          <!-- ELEMENT DE PAGINATION -->
<!--          <template #footer>-->
<!--            <div class="flex flex-wrap justify-between items-center">-->
<!--              <div>-->
<!--            <span class="text-sm leading-5">-->
<!--              Affichage-->
<!--              <span class="font-medium">{{ pagination?.pageFrom }}</span>-->
<!--              à-->
<!--              <span class="font-medium">{{ pagination?.pageTo }}</span>-->
<!--              sur-->
<!--              <span class="font-medium">{{ pagination?.totalItems }}</span>-->
<!--              élement(s)-->
<!--            </span>-->
<!--              </div>-->

<!--              <UPagination-->
<!--                  v-model="pagination?.page"-->
<!--                  :page-count="pagination?.pageCount"-->
<!--                  :total="pagination?.totalItems"-->
<!--                  :ui="{-->
<!--              wrapper: 'flex items-center gap-1',-->
<!--              rounded: '!rounded-full min-w-[32px] justify-center',-->
<!--              default: {-->
<!--                activeButton: {-->
<!--                  variant: 'outline',-->
<!--                },-->
<!--              },-->
<!--            }"-->
<!--              />-->
<!--            </div>-->
<!--          </template>-->

      </div>

    </UDashboardCard>

  </div>


</template>

<style scoped>

</style>