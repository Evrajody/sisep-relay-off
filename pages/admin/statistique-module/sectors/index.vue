<script lang="ts" setup>
import { useSectors } from "~/composables/sector/useSectors";
import { useCreateSector } from "~/composables/sector/useCreateSector";
import { useUpdateSector } from "~/composables/sector/useUpdateSector";
import { useDeleteSector } from "~/composables/sector/useDeleteSector";
import type { Sector } from "~/composables/sector/useSectors";

definePageMeta({
    layout: "sisep-app-layout",
});

const links = [
    {
        label: "Secteurs",
        icon: "i-heroicons-building-office-2",
    },
];

useHead({
    title: "Liste des secteurs",
});

// Chargement de la liste des secteurs
const {
    search,
    current_page,
    columns,
    sectorList,
    pagination,
    error,
    sectorListStatus,
    refreshSectorList
} = useSectors();

// Logique de création de secteurs
const {
    createSectorFormEl,
    createSectorForm,
    isModalCreateSectorOpen,
    toggleModalCreateSector
} = useCreateSector(refreshSectorList);

// Logique de mise à jour de secteurs
const {
    updateSectorFormEl,
    updateSectorForm,
    isModalUpdateSectorOpen,
    toggleModalUpdateSector,
    openUpdateModal,
    currentSector
} = useUpdateSector(refreshSectorList);

// Logique de suppression
const { deleteSector, isDeleting } = useDeleteSector();

const page = ref(1);
const pageCount = ref(10);
const sort = ref({ column: 'identifier', direction: 'asc' as const });

// Gestion du changement de page
const onPageChange = (newPage: number) => {
    page.value = newPage;
    current_page.value = newPage;
};

// Gestion du tri
const onSort = (e: { column: string; direction: 'asc' | 'desc' }) => {
    sort.value = e;
};

// Fonction de suppression d'un secteur
const handleDeleteSector = async (row: Sector) => {
    const sectorName = row.artefact?.nameJson?.fr || row.artefact?.identifier || 'Inconnu';
    const success = await deleteSector(row.id, sectorName);
    if (success) {
        await refreshSectorList();
    }
};

// Actions disponibles pour chaque secteur
const getActions = (row: Sector) => [
    {
        label: 'Modifier',
        icon: 'i-heroicons-pencil-square',
        click: () => openUpdateModal(row)
    },
    {
        label: 'Supprimer',
        icon: 'i-heroicons-trash',
        click: () => handleDeleteSector(row)
    }
];

// Configuration des badges de statut
const getStatusBadge = (row: Sector) => {
    if (row.artefact?.isFinal) {
        return { color: 'green', label: 'Final' };
    } else if (row.artefact?.isPartial) {
        return { color: 'yellow', label: 'Partiel' };
    } else if (row.artefact?.isExternal) {
        return { color: 'blue', label: 'Externe' };
    }
    return { color: 'gray', label: 'Brouillon' };
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

// Helper pour afficher le nom du secteur
const getSectorName = (sector: Sector) => {
    if (sector.artefact?.nameJson) {
        return sector.artefact.nameJson.fr || sector.artefact.nameJson.en || sector.artefact.identifier;
    }
    return sector.artefact?.identifier || 'Sans nom';
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
                label="Nouveau secteur"
                size="sm"
                @click="toggleModalCreateSector"
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
                Liste des secteurs
            </template>

            <template #description>
                <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> secteur(s) au total
            </template>

            <!-- En-tête avec filtres -->
            <template #header>
                <div class="flex w-full flex-col gap-4">
                    <!-- Filtres -->
                    <div class="flex flex-col lg:flex-row gap-4">
                        <UInput
                            v-model="search"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Rechercher un secteur..."
                            class="flex-1"
                            size="lg"
                            :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                            @keyup.enter="refreshSectorList"
                        >
                            <template #trailing>
                                <UButton
                                    v-if="search"
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark"
                                    size="xs"
                                    @click="search = ''; refreshSectorList()"
                                />
                            </template>
                        </UInput>

                        <UButton
                            color="primary"
                            icon="i-heroicons-plus"
                            label="Nouveau secteur"
                            size="lg"
                            class="w-full lg:w-auto"
                            @click="toggleModalCreateSector"
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
                        { key: 'identifier', label: 'Identifiant', sortable: true },
                        { key: 'version', label: 'Version', sortable: true },
                        { key: 'agencyId', label: 'Agence', sortable: true },
                        { key: 'status', label: 'Statut', sortable: false },
                        { key: 'actions', label: 'Actions' }
                    ]"
                    :rows="sectorList?.sectors || []"
                    :loading="sectorListStatus === 'pending'"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
                    :empty-state="{
                        icon: 'i-heroicons-building-office-2',
                        label: 'Aucun secteur trouvé',
                        description: 'Essayez de modifier vos critères de recherche',
                    }"
                    class="w-full"
                    :ui="{
                        td: { base: 'whitespace-nowrap' },
                        th: { base: 'whitespace-nowrap' }
                    }"
                    v-model:sort="sort"
                    @update:sort="onSort"
                >
                    <!-- Colonne Identifiant -->
                    <template #identifier-data="{ row }">
                        <div class="flex items-center gap-3 min-w-[200px]">
                            <div class="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                                <UIcon
                                    name="i-heroicons-building-office-2"
                                    class="w-5 h-5 text-primary-500"
                                />
                            </div>
                            <div class="min-w-0">
                                <p class="font-medium text-gray-900 dark:text-white">
                                    {{ row.artefact?.identifier || 'Sans identifiant' }}
                                </p>
                                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {{ getSectorName(row) }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Colonne Version -->
                    <template #version-data="{ row }">
                        <UBadge
                            color="gray"
                            variant="subtle"
                            size="sm"
                        >
                            v{{ row.artefact?.version || '0.0.0' }}
                        </UBadge>
                    </template>

                    <!-- Colonne Agence -->
                    <template #agencyId-data="{ row }">
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                            {{ row.artefact?.agencyId || 'N/A' }}
                        </div>
                    </template>

                    <!-- Colonne Statut -->
                    <template #status-data="{ row }">
                        <UBadge
                            :color="getStatusBadge(row).color"
                            variant="subtle"
                            size="sm"
                            class="capitalize"
                        >
                            {{ getStatusBadge(row).label }}
                        </UBadge>
                    </template>

                    <!-- Colonne Actions -->
                    <template #actions-data="{ row }">
                        <UDropdown :items="[getActions(row)]" :popper="{ placement: 'bottom-start' }">
                            <UButton
                                color="gray"
                                variant="ghost"
                                icon="i-heroicons-ellipsis-vertical"
                                :loading="sectorListStatus === 'pending'"
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
                        <span class="font-medium">{{ pagination.totalItems }}</span> secteur(s)
                    </div>

                    <UPagination
                        v-model="page"
                        :page-count="pageCount"
                        :total="sectorList?.data?.length || 0"
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
            v-model="isModalCreateSectorOpen"
            title="Création d'un nouveau secteur"
            :ui="{
                rounded: 'rounded-lg',
                base: 'py-0',
                icon: { base: 'text-primary-500 dark:text-primary-400' },
                overlay: { background: 'bg-gray-900/50 backdrop-blur-sm' },
                footer: { base: 'bg-gray-50 dark:bg-gray-800' },
                width: 'w-full sm:max-w-4xl max-h-[90vh]',
                header: {
                    base: 'bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
                    inner: 'py-0 h-full',
                    padding: 'py-4',
                },
            }"
            description="Merci de renseigner les champs obligatoires"
            icon="i-heroicons-building-office-2"
            prevent-close
        >
            <div class="w-full p-4 max-h-[60vh] overflow-y-auto">
                <Vueform ref="createSectorFormEl" v-bind="createSectorForm" />
            </div>

            <template #footer>
                <div class="flex justify-end gap-3 p-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        label="Annuler"
                        size="lg"
                        @click.prevent="toggleModalCreateSector"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': createSectorFormEl?.submitting }"
                        :disabled="createSectorFormEl?.submitting"
                        :label="createSectorFormEl?.submitting ? 'Création en cours...' : 'Enregistrer'"
                        :loading="createSectorFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="createSectorFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>

        <!-- Modal de mise à jour -->
        <UDashboardModal
            v-model="isModalUpdateSectorOpen"
            title="Modifier le secteur"
            :ui="{
                rounded: 'rounded-lg',
                base: 'py-0',
                icon: { base: 'text-primary-500 dark:text-primary-400' },
                overlay: { background: 'bg-gray-900/50 backdrop-blur-sm' },
                footer: { base: 'bg-gray-50 dark:bg-gray-800' },
                width: 'w-full sm:max-w-4xl max-h-[90vh]',
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
            <div class="w-full p-4 max-h-[60vh] overflow-y-auto">
                <Vueform
                    v-if="currentSector"
                    ref="updateSectorFormEl"
                    v-bind="updateSectorForm"
                    :key="currentSector.id"
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
                        @click.prevent="toggleModalUpdateSector"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': updateSectorFormEl?.submitting }"
                        :disabled="updateSectorFormEl?.submitting"
                        :label="updateSectorFormEl?.submitting ? 'Mise à jour en cours...' : 'Mettre à jour'"
                        :loading="updateSectorFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="updateSectorFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>
    </div>
</template>

<style scoped></style>
