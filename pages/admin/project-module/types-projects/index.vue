<script lang="ts" setup>

import {useCreateTypeProject} from "~/composables/type-projets/useCreateTypeProject";
import {useTypeProjects} from "~/composables/type-projets/useTypeProjects";
import type {TypeProject} from "~/types";

definePageMeta({
  layout: "sisep-app-layout",
  middleware: ["auth"],
});

useHead({
  title: "Liste des types de projets",
});


const links = [
  {
    label: "Types de projets",
    icon: "i-heroicons-tag",
  },
];

// Chargement de la liste des types de projets
const {
  search,
  current_page,
  columns,
  typeProjets,
  pagination,
  error,
  typeProjetsStatus,
  refreshTypeProjets
} = useTypeProjects();

// Logique de création de types de projets
const {
  createTypeProjectForm,
  createTypeProjectFormEl,
  isModalCreateTypeProjectOpen,
  toogleModalCreateTypeProject
} = useCreateTypeProject(refreshTypeProjets);

const page = ref(1);
const pageCount = ref(10);
const sort = ref({column: 'name', direction: 'asc' as const});

// Gestion du changement de page
const onPageChange = (newPage: number) => {
  page.value = newPage;
  current_page.value = newPage;
};

// Gestion du tri
const onSort = (e: { column: string; direction: 'asc' | 'desc' }) => {
  sort.value = e;
};

// Actions disponibles pour chaque type
const getActions = (row: TypeProject) => [
  {
    label: 'Modifier',
    icon: 'i-heroicons-pencil-square',
    click: () => {
      // Logique de modification
      console.log('Modifier', row);
    }
  },
  {
    label: 'Supprimer',
    icon: 'i-heroicons-trash',
    click: async () => {
      // Logique de suppression
      console.log('Supprimer', row);
    }
  }
];
</script>

<template>
  <UDashboardToolbar
      :ui="{ wrapper: 'bg-white dark:bg-gray-900' }"
      class="py-0 px-1.5 overflow-x-auto"
  >
    <UHorizontalNavigation :links="links"/>
    <template #right>
      <UButton
          color="primary"
          icon="i-heroicons-plus"
          label="Nouveau type"
          size="sm"
          @click="toogleModalCreateTypeProject"
      />
    </template>
  </UDashboardToolbar>

  <div class="max-w-[95vw] w-full py-5 mx-auto px-4">
    <UDashboardCard
        :ui="{
                divide: 'divide-x divide-gray-200 dark:divide-gray-700',
                title: 'text-gray-900 dark:text-white font-semibold text-lg',
                description: 'text-sm text-gray-600 dark:text-gray-400 mt-1',
                wrapper: ' !border-none  border-gray-200 dark:border-gray-800 rounded-none shadow-md',
                header: {
                    wrapper: 'bg-primary-50 dark:bg-primary-900/20 border-none',
                    padding: '!px-2 py-2',
                },
                body: {
                    padding: '!p-0 !border-none',
                },
            }"
    >
      <template #title>
        Types de projets
      </template>

      <template #description>
        <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> type(s) au total
      </template>

      <!-- En-tête avec filtres -->
      <template #header>
        <div class="flex w-full flex-col gap-4">
          <!-- Filtres -->
          <div class="flex flex-col lg:flex-row gap-4">
            <UInput
                v-model="search"
                :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                class="flex-1"
                icon="i-heroicons-magnifying-glass"
                placeholder="Rechercher un type de projet..."
                size="lg"
            >
              <template #trailing>
                <UButton
                    v-if="search"
                    color="gray"
                    icon="i-heroicons-x-mark"
                    size="xs"
                    variant="ghost"
                    @click="search = ''"
                />
              </template>
            </UInput>

            <UButton
                class="w-full lg:w-auto"
                color="primary"
                icon="i-heroicons-plus"
                label="Nouveau type"
                size="lg"
                @click="toogleModalCreateTypeProject"
            />
          </div>
        </div>
      </template>

      <!-- Contenu principal du tableau -->
      <div class="overflow-x-auto">
        <UTable
            v-model:sort="sort"
            :columns="[
                        { key: 'name', label: 'Nom', sortable: true },
                        { key: 'description', label: 'Description', sortable: true },
                        { key: 'projectCount', label: 'Nb projets' },
                        { key: 'actions', label: 'Actions' }
                    ]"
            :empty-state="{
                        icon: 'i-heroicons-tag',
                        label: 'Aucun type trouvé',
                        description: 'Essayez de modifier vos critères de recherche',
                    }"
            :loading="typeProjetsStatus === 'pending'"
            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
            :rows="typeProjets?.data || []"
            :ui="{
                        td: { base: 'whitespace-nowrap' },
                        th: { base: 'whitespace-nowrap' }
                    }"
            class="w-full"
            @update:sort="onSort"
        >
          <!-- Colonne Nom -->
          <template #name-data="{ row }">
            <div class="flex items-center gap-3 min-w-[200px]">
              <div class="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <UIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" name="i-heroicons-tag"/>
              </div>
              <div class="min-w-0">
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ row.name || 'Sans nom' }}
                </p>
              </div>
            </div>
          </template>

          <!-- Colonne Description -->
          <template #description-data="{ row }">
            <div class="max-w-md">
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {{ row.description || 'Aucune description' }}
              </p>
            </div>
          </template>

          <!-- Colonne Nombre de projets -->
          <template #projectCount-data="{ row }">
            <UBadge
                color="blue"
                size="sm"
                variant="subtle"
            >
              {{ row.projectCount || 0 }} projet(s)
            </UBadge>
          </template>

          <!-- Colonne Actions -->
          <template #actions-data="{ row }">
            <UDropdown :items="[getActions(row)]" :popper="{ placement: 'bottom-start' }">
              <UButton
                  :loading="typeProjetsStatus === 'pending'"
                  color="gray"
                  icon="i-heroicons-ellipsis-vertical"
                  variant="ghost"
              />

              <template #item="{ item: actionItem }">
                <div class="flex items-center gap-2" @click="actionItem.click">
                  <UIcon :name="actionItem.icon" class="h-4 w-4"/>
                  <span>{{ actionItem.label }}</span>
                </div>
              </template>
            </UDropdown>
          </template>
        </UTable>
      </div>

      <!-- Pied de tableau avec pagination -->
      <template #footer>
        <div class="flex flex-col sm:flex-row items-center justify-between border-gray-200 dark:border-gray-700">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            Affichage de <span class="font-medium">{{ pagination.pageFrom }}</span> à
            <span class="font-medium">{{ pagination.pageTo }}</span> sur
            <span class="font-medium">{{ pagination.totalItems }}</span> type(s)
          </div>

          <UPagination
              v-model="page"
              :page-count="pageCount"
              :total="typeProjets?.data?.length || 0"
              :ui="{
                            wrapper: 'flex items-center gap-1',
                            rounded: '!rounded-full min-w-[32px] justify-center',
                            default: {
                                activeButton: {
                                    variant: 'outline'
                                }
                            }
                        }"
              @update:modelValue="onPageChange"
          />
        </div>
      </template>
    </UDashboardCard>

    <!-- Modal de création -->
    <UDashboardModal
        v-model="isModalCreateTypeProjectOpen"
        :ui="{
                rounded: 'rounded-lg',
                base: 'py-0',
                icon: { base: 'text-primary-500 dark:text-primary-400' },
                overlay: { background: 'bg-gray-900/50 backdrop-blur-sm' },
                footer: { base: 'bg-gray-50 dark:bg-gray-800' },
                width: 'w-full sm:max-w-4xl',
                header: {
                    base: 'bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
                    inner: 'py-0 h-full',
                    padding: 'py-4',
                },
            }"
        description="Merci de renseigner les champs obligatoires"
        icon="i-heroicons-tag"
        prevent-close
        title="Création d'un nouveau type de projet"
    >
      <div class="w-full p-4">
        <Vueform ref="createTypeProjectFormEl" v-bind="createTypeProjectForm"/>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3 p-4">
          <UButton
              color="gray"
              icon="i-heroicons-x-mark"
              label="Annuler"
              size="lg"
              variant="ghost"
              @click.prevent="toogleModalCreateTypeProject"
          />
          <UButton
              :class="{ 'cursor-not-allowed': createTypeProjectFormEl?.submitting }"
              :disabled="createTypeProjectFormEl?.submitting"
              :label="createTypeProjectFormEl?.submitting ? 'Création en cours...' : 'Enregistrer'"
              :loading="createTypeProjectFormEl?.submitting"
              color="primary"
              icon="i-heroicons-check"
              size="lg"
              @click.prevent="createTypeProjectFormEl?.submit()"
          />
        </div>
      </template>
    </UDashboardModal>
  </div>
</template>

<style scoped></style>
