<script lang="ts" setup>
import { useSdgs } from "~/composables/sdgs/useSdgs";
import { useCreateSdg } from "~/composables/sdgs/useCreateSdg";
import { useUpdateSdg } from "~/composables/sdgs/useUpdateSdg";
import { useDeleteSdg } from "~/composables/sdgs/useDeleteSdg";

definePageMeta({
    layout: "sisep-app-layout",
});

const links = [
    {
        label: "SDG (Objectifs de développement durable)",
        icon: "i-heroicons-globe-alt",
    },
];

useHead({
    title: "Liste des SDG",
});

// Chargement de la liste des SDG
const {
    searchCode,
    searchTitle,
    current_page,
    sdgList,
    pagination,
    sdgListStatus,
    refreshSdgList
} = useSdgs();

// Logique de création de SDG
const {
    createSdgFormEl,
    createSdgForm,
    isModalCreateSdgOpen,
    toggleModalCreateSdg
} = useCreateSdg(refreshSdgList);

// Logique de mise à jour de SDG
const {
    updateSdgFormEl,
    updateSdgForm,
    isModalUpdateSdgOpen,
    toggleModalUpdateSdg,
    openUpdateModal,
    currentSdg
} = useUpdateSdg(refreshSdgList);

// Logique de suppression
const { deleteSdg } = useDeleteSdg();

// Typage pour les refs Vueform
const createFormEl = createSdgFormEl as Ref<any>
const updateFormEl = updateSdgFormEl as Ref<any>

const page = ref(1);
const pageCount = ref(10);
const sort = ref({ column: 'code', direction: 'asc' as const });

// Gestion du changement de page
const onPageChange = (newPage: number) => {
    page.value = newPage;
    current_page.value = newPage;
};

// Gestion du tri
const onSort = (e: { column: string; direction: 'asc' | 'desc' }) => {
    sort.value = e as { column: string; direction: 'asc' };
};

// Fonction de suppression d'un SDG
const handleDeleteSdg = async (row: any) => {
    const success = await deleteSdg(row.id, row.code, row.title);
    if (success) {
        await refreshSdgList();
    }
};

// Actions disponibles pour chaque SDG
const getActions = (row: any) => [
    {
        label: 'Modifier',
        icon: 'i-heroicons-pencil-square',
        click: () => openUpdateModal(row)
    },
    // {
    //     label: 'Supprimer',
    //     icon: 'i-heroicons-trash',
    //     click: () => handleDeleteSdg(row)
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
                label="Nouveau SDG"
                size="sm"
                @click="toggleModalCreateSdg"
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
                Liste des SDG (Objectifs de développement durable)
            </template>

            <template #description>
                <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> SDG au total
            </template>

            <!-- En-tête avec filtres -->
            <template #header>
                <div class="flex w-full flex-col gap-4">
                    <!-- Première ligne de filtres -->
                    <div class="flex flex-col lg:flex-row gap-4">
                        <UInput
                            v-model="searchCode"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Rechercher par code..."
                            class="flex-1"
                            size="lg"
                            :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                            @keyup.enter="refreshSdgList"
                        >
                            <template #trailing>
                                <UButton
                                    v-if="searchCode"
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark"
                                    size="xs"
                                    @click="searchCode = ''; refreshSdgList()"
                                />
                            </template>
                        </UInput>

                        <UInput
                            v-model="searchTitle"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Rechercher par titre..."
                            class="flex-1"
                            size="lg"
                            :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                            @keyup.enter="refreshSdgList"
                        >
                            <template #trailing>
                                <UButton
                                    v-if="searchTitle"
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark"
                                    size="xs"
                                    @click="searchTitle = ''; refreshSdgList()"
                                />
                            </template>
                        </UInput>

                        <UButton
                            color="primary"
                            icon="i-heroicons-plus"
                            label="Nouveau SDG"
                            size="lg"
                            class="w-full lg:w-auto"
                            @click="toggleModalCreateSdg"
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
                        { key: 'code', label: 'Code', sortable: true },
                        { key: 'title', label: 'Titre', sortable: true },
                        { key: 'description', label: 'Description', sortable: false },
                        { key: 'color', label: 'Couleur', sortable: false },
                        { key: 'createdAt', label: 'Date de création', sortable: true },
                        { key: 'actions', label: 'Actions' }
                    ]"
                    :rows="sdgList?.data || []"
                    :loading="sdgListStatus === 'pending'"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
                    :empty-state="{
                        icon: 'i-heroicons-globe-alt',
                        label: 'Aucun SDG trouvé',
                    }"
                    class="w-full"
                    :ui="{
                        td: { base: 'whitespace-nowrap' },
                        th: { base: 'whitespace-nowrap' }
                    }"
                    v-model:sort="sort"
                    @update:sort="onSort"
                >
                    <!-- Colonne Code -->
                    <template #code-data="{ row }">
                        <div class="flex items-center gap-3 min-w-[100px]">
                            <div
                                class="p-2 rounded-lg"
                                :style="{ backgroundColor: row.color ? `${row.color}20` : '#f3f4f6' }"
                            >
                                <UIcon
                                    name="i-heroicons-globe-alt"
                                    class="w-5 h-5"
                                    :style="{ color: row.color || '#6b7280' }"
                                />
                            </div>
                            <div class="min-w-0">
                                <p class="font-medium text-gray-900 dark:text-white text-sm">
                                    {{ row.code || 'Sans code' }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Colonne Titre -->
                    <template #title-data="{ row }">
                        <div class="max-w-xs">
                            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {{ row.title || '-' }}
                            </p>
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

                    <!-- Colonne Couleur -->
                    <template #color-data="{ row }">
                        <div v-if="row.color" class="flex items-center gap-2">
                            <div
                                class="w-6 h-6 rounded-full border border-gray-300"
                                :style="{ backgroundColor: row.color }"
                            ></div>
                            <span class="text-sm text-gray-600 dark:text-gray-400">
                                {{ row.color }}
                            </span>
                        </div>
                        <span v-else class="text-sm text-gray-400">-</span>
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
                                :loading="sdgListStatus === 'pending'"
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
                        <span class="font-medium">{{ pagination.totalItems }}</span> SDG
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
            v-model="isModalCreateSdgOpen"
            title="Création d'un nouveau SDG"
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
            icon="i-heroicons-globe-alt"
            prevent-close
        >
            <div class="w-full p-4 max-h-[70vh] overflow-y-auto">
                <Vueform ref="createSdgFormEl" v-bind="createSdgForm" />
            </div>

            <template #footer>
                <div class="flex justify-end gap-3 p-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        label="Annuler"
                        size="lg"
                        @click.prevent="toggleModalCreateSdg"
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
            v-model="isModalUpdateSdgOpen"
            title="Modifier le SDG"
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
                    v-if="currentSdg"
                    ref="updateSdgFormEl"
                    v-bind="updateSdgForm"
                    :key="currentSdg.id"
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
                        @click.prevent="toggleModalUpdateSdg"
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
