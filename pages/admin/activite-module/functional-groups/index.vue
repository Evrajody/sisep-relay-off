<script lang="ts" setup>
import { useFunctionalGroups } from "~/composables/functional-groups/useFunctionalGroups";
import { useCreateFunctionalGroup } from "~/composables/functional-groups/useCreateFunctionalGroup";
import { useUpdateFunctionalGroup } from "~/composables/functional-groups/useUpdateFunctionalGroup";
import { useDeleteFunctionalGroup } from "~/composables/functional-groups/useDeleteFunctionalGroup";

definePageMeta({
    layout: "sisep-app-layout",
});

const links = [
    {
        label: "Groupes fonctionnels",
        icon: "i-heroicons-rectangle-group",
    },
];

useHead({
    title: "Liste des groupes fonctionnels",
});

// Chargement de la liste des groupes fonctionnels
const {
    search,
    current_page,
    functionalGroupList,
    pagination,
    functionalGroupListStatus,
    refreshFunctionalGroupList
} = useFunctionalGroups();

// Logique de création de groupes fonctionnels
const {
    createFunctionalGroupFormEl,
    createFunctionalGroupForm,
    isModalCreateFunctionalGroupOpen,
    toggleModalCreateFunctionalGroup
} = useCreateFunctionalGroup(refreshFunctionalGroupList);

// Logique de mise à jour de groupes fonctionnels
const {
    updateFunctionalGroupFormEl,
    updateFunctionalGroupForm,
    isModalUpdateFunctionalGroupOpen,
    toggleModalUpdateFunctionalGroup,
    openUpdateModal,
    currentFunctionalGroup
} = useUpdateFunctionalGroup(refreshFunctionalGroupList);

// Logique de suppression
const { deleteFunctionalGroup } = useDeleteFunctionalGroup();

// Typage pour les refs Vueform
const createFormEl = createFunctionalGroupFormEl as Ref<any>
const updateFormEl = updateFunctionalGroupFormEl as Ref<any>

const page = ref(1);
const pageCount = ref(10);
const sort = ref({ column: 'name', direction: 'asc' as const });

// Gestion du changement de page
const onPageChange = (newPage: number) => {
    page.value = newPage;
    current_page.value = newPage;
};

// Gestion du tri
const onSort = (e: { column: string; direction: 'asc' | 'desc' }) => {
    sort.value = e as { column: string; direction: 'asc' };
};

// Fonction de suppression d'un groupe fonctionnel
const handleDeleteFunctionalGroup = async (row: any) => {
    const success = await deleteFunctionalGroup(row.id, row.name);
    if (success) {
        await refreshFunctionalGroupList();
    }
};

// Actions disponibles pour chaque groupe fonctionnel
const getActions = (row: any) => [
    {
        label: 'Modifier',
        icon: 'i-heroicons-pencil-square',
        click: () => openUpdateModal(row)
    },
    // {
    //     label: 'Supprimer',
    //     icon: 'i-heroicons-trash',
    //     click: () => handleDeleteFunctionalGroup(row)
    // }
];

// Formatage des dates
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Fonctions d'exportation
const exportToPDF = () => {
    console.log('Export PDF');
};

const exportToCSV = () => {
    console.log('Export CSV');
};

const exportToExcel = () => {
    console.log('Export Excel');
};
</script>

<template>
    <UDashboardToolbar
        :ui="{ wrapper: 'bg-white dark:bg-gray-900' }"
        class="py-0 px-1.5 overflow-x-auto"
    >
        <UHorizontalNavigation :links="links" />
        <template #right>
            <UButton
                color="primary"
                icon="i-heroicons-plus"
                label="Nouveau groupe"
                size="sm"
                @click="toggleModalCreateFunctionalGroup"
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
                Liste des groupes fonctionnels
            </template>

            <template #description>
                <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> groupe(s) fonctionnel(s) au total
            </template>

            <!-- En-tête avec filtres -->
            <template #header>
                <div class="flex w-full flex-col gap-4">
                    <!-- Première ligne de filtres -->
                    <div class="flex flex-col lg:flex-row gap-4">
                        <UInput
                            v-model="search"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Rechercher un groupe fonctionnel (nom)..."
                            class="flex-1"
                            size="lg"
                            :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                            @keyup.enter="refreshFunctionalGroupList"
                        >
                            <template #trailing>
                                <UButton
                                    v-if="search"
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark"
                                    size="xs"
                                    @click="search = ''; refreshFunctionalGroupList()"
                                />
                            </template>
                        </UInput>

                        <UButton
                            color="primary"
                            icon="i-heroicons-plus"
                            label="Nouveau groupe"
                            size="lg"
                            class="w-full lg:w-auto"
                            @click="toggleModalCreateFunctionalGroup"
                        />
                    </div>

                    <!-- Boutons d'exportation -->
                    <div class="flex gap-2 flex-wrap">
                        <UButton
                            color="white"
                            icon="i-heroicons-document-arrow-down"
                            size="sm"
                            variant="outline"
                            @click="exportToPDF"
                        >
                            Export PDF
                        </UButton>
                        <UButton
                            color="white"
                            icon="i-heroicons-table-cells"
                            size="sm"
                            variant="outline"
                            @click="exportToCSV"
                        >
                            Export CSV
                        </UButton>
                        <UButton
                            color="white"
                            icon="i-heroicons-document-text"
                            size="sm"
                            variant="outline"
                            @click="exportToExcel"
                        >
                            Export Excel
                        </UButton>
                    </div>
                </div>
            </template>

            <!-- Contenu principal du tableau -->
            <div class="overflow-x-auto">
                <UTable
                    :columns="[
                        { key: 'name', label: 'Nom', sortable: true },
                        { key: 'description', label: 'Description', sortable: false },
                        { key: 'createdAt', label: 'Date de création', sortable: true },
                        { key: 'actions', label: 'Actions' }
                    ]"
                    :rows="functionalGroupList?.data || []"
                    :loading="functionalGroupListStatus === 'pending'"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
                    :empty-state="{
                        icon: 'i-heroicons-rectangle-group',
                        label: 'Aucun groupe fonctionnel trouvé',
                    }"
                    class="w-full"
                    :ui="{
                        td: { base: 'whitespace-nowrap' },
                        th: { base: 'whitespace-nowrap' }
                    }"
                    v-model:sort="sort"
                    @update:sort="onSort"
                >
                    <!-- Colonne Nom -->
                    <template #name-data="{ row }">
                        <div class="flex items-center gap-3 min-w-[150px]">
                            <div class="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                                <UIcon name="i-heroicons-rectangle-group" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div class="min-w-0">
                                <p class="font-medium text-gray-900 dark:text-white text-sm">
                                    {{ row.name || 'Sans nom' }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Colonne Description -->
                    <template #description-data="{ row }">
                        <div class="max-w-xs">
                            <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {{ row.description || '-' }}
                            </p>
                        </div>
                    </template>

                    <!-- Colonne Date de création -->
                    <template #createdAt-data="{ row }">
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                            {{ formatDate(row.createdAt) }}
                        </span>
                    </template>

                    <!-- Colonne Actions -->
                    <template #actions-data="{ row }">
                        <UDropdown :items="[getActions(row)]" :popper="{ placement: 'bottom-start' }">
                            <UButton
                                color="gray"
                                variant="ghost"
                                icon="i-heroicons-ellipsis-vertical"
                                :loading="functionalGroupListStatus === 'pending'"
                            />

                            <template #item="{ item: actionItem }">
                                <div class="flex items-center gap-2" @click="actionItem.click">
                                    <UIcon :name="actionItem.icon" class="h-4 w-4" />
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
                        <span class="font-medium">{{ pagination.totalItems }}</span> groupe(s)
                    </div>

                    <UPagination
                        v-model="page"
                        :page-count="pageCount"
                        :total="pagination.totalItems || 0"
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
            v-model="isModalCreateFunctionalGroupOpen"
            title="Création d'un nouveau groupe fonctionnel"
            :ui="{
                rounded: 'rounded-lg',
                base: 'py-0',
                icon: { base: 'text-primary-500 dark:text-primary-400' },
                overlay: { background: 'bg-gray-900/50 backdrop-blur-sm' },
                footer: { base: 'bg-gray-50 dark:bg-gray-800' },
                width: 'w-full sm:max-w-2xl',
                header: {
                    base: 'bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
                    inner: 'py-0 h-full',
                    padding: 'py-4',
                },
            }"
            description="Merci de renseigner les champs obligatoires"
            icon="i-heroicons-rectangle-group"
            prevent-close
        >
            <div class="w-full p-4 max-h-[70vh] overflow-y-auto">
                <Vueform ref="createFunctionalGroupFormEl" v-bind="createFunctionalGroupForm" />
            </div>

            <template #footer>
                <div class="flex justify-end gap-3 p-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        label="Annuler"
                        size="lg"
                        @click.prevent="toggleModalCreateFunctionalGroup"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': createFormEl?.submitting }"
                        :disabled="createFormEl?.submitting"
                        :label="createFormEl?.submitting ? 'Création en cours...' : 'Enregistrer'"
                        :loading="createFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="createFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>

        <!-- Modal de mise à jour -->
        <UDashboardModal
            v-model="isModalUpdateFunctionalGroupOpen"
            title="Modifier le groupe fonctionnel"
            :ui="{
                rounded: 'rounded-lg',
                base: 'py-0',
                icon: { base: 'text-primary-500 dark:text-primary-400' },
                overlay: { background: 'bg-gray-900/50 backdrop-blur-sm' },
                footer: { base: 'bg-gray-50 dark:bg-gray-800' },
                width: 'w-full sm:max-w-2xl',
                header: {
                    base: 'bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
                    inner: 'py-0 h-full',
                    padding: 'py-4',
                },
            }"
            description="Merci de renseigner les champs obligatoires"
            icon="i-heroicons-pencil-square"
            prevent-close
        >
            <div class="w-full p-4 max-h-[70vh] overflow-y-auto">
                <Vueform
                    v-if="currentFunctionalGroup"
                    ref="updateFunctionalGroupFormEl"
                    v-bind="updateFunctionalGroupForm"
                    :key="currentFunctionalGroup.id"
                />
            </div>

            <template #footer>
                <div class="flex justify-end gap-3 p-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        label="Annuler"
                        size="lg"
                        @click.prevent="toggleModalUpdateFunctionalGroup"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': updateFormEl?.submitting }"
                        :disabled="updateFormEl?.submitting"
                        :label="updateFormEl?.submitting ? 'Mise à jour en cours...' : 'Mettre à jour'"
                        :loading="updateFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="updateFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>
    </div>
</template>

<style scoped></style>
