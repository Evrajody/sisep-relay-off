<script lang="ts" setup>
import { useStructures } from "~/composables/structure/useStructures";
import { useCreateStructure } from "~/composables/structure/useCreateStructure";
import { useUpdateStructure } from "~/composables/structure/useUpdateStructure";
import { useDeleteStructure } from "~/composables/structure/useDeleteStructure";
import { useAssignIndicators } from "~/composables/structure/useAssignIndicators";
import type { Structure } from "~/types";

definePageMeta({
    layout: "sisep-app-layout",
});

const links = [
    {
        label: "Structures",
        icon: "i-heroicons-building-office-2",
    },
];

useHead({
    title: "Liste des structures",
});

// Chargement de la liste des structures
const {
    search,
    current_page,
    selectedStatus,
    columns,
    structureList,
    pagination,
    error,
    structureListStatus,
    refreshStructureList
} = useStructures();

// Logique de création de structures
const {
    createStructureFormEl,
    createStructureForm,
    isModalCreateStructureOpen,
    toggleModalCreateStructure
} = useCreateStructure(refreshStructureList);

// Logique de mise à jour de structures
const {
    updateStructureFormEl,
    updateStructureForm,
    isModalUpdateStructureOpen,
    toggleModalUpdateStructure,
    openUpdateModal,
    currentStructure
} = useUpdateStructure(refreshStructureList);

// Logique de suppression
const { deleteStructure, isDeleting } = useDeleteStructure();

// Logique d'assignation des indicateurs
const {
    assignIndicatorsFormEl,
    assignIndicatorsForm,
    isModalAssignIndicatorsOpen,
    toggleModalAssignIndicators,
    openAssignModal,
    currentStructure: assignStructure
} = useAssignIndicators(refreshStructureList);

const page = ref(1);
const pageCount = ref(10);
const sort = ref({ column: 'label', direction: 'asc' as const });

// Options de statut pour le filtre
const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
];

// Gestion du changement de page
const onPageChange = (newPage: number) => {
    page.value = newPage;
    current_page.value = newPage;
};

// Gestion du tri
const onSort = (e: { column: string; direction: 'asc' | 'desc' }) => {
    sort.value = e;
};

// Fonction de suppression d'une structure
const handleDeleteStructure = async (row: Structure) => {
    const success = await deleteStructure(row.id, row.label, row.abbreviation);
    if (success) {
        await refreshStructureList();
    }
};

// Actions disponibles pour chaque structure
const getActions = (row: Structure) => [
    {
        label: 'Assigner des indicateurs',
        icon: 'i-heroicons-chart-bar-square',
        click: () => openAssignModal(row)
    },
    {
        label: 'Modifier',
        icon: 'i-heroicons-pencil-square',
        click: () => openUpdateModal(row)
    },
    {
        label: 'Supprimer',
        icon: 'i-heroicons-trash',
        click: () => handleDeleteStructure(row)
    }
];

// Configuration des badges de statut
const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
        'ACTIVE': { color: 'green', label: 'Active' },
        'INACTIVE': { color: 'gray', label: 'Inactive' },
    };
    return statusMap[status] || { color: 'gray', label: 'Inconnu' };
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
                label="Nouvelle structure"
                size="sm"
                @click="toggleModalCreateStructure"
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
                Liste des structures
            </template>

            <template #description>
                <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> structure(s) au total
            </template>

            <!-- En-tête avec filtres -->
            <template #header>
                <div class="flex w-full flex-col gap-4">
                    <!-- Filtres -->
                    <div class="flex flex-col lg:flex-row gap-4">
                        <UInput
                            v-model="search"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Rechercher une structure..."
                            class="flex-1"
                            size="lg"
                            :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                            @keyup.enter="refreshStructureList"
                        >
                            <template #trailing>
                                <UButton
                                    v-if="search"
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark"
                                    size="xs"
                                    @click="search = ''; refreshStructureList()"
                                />
                            </template>
                        </UInput>

                        <USelectMenu
                            v-model="selectedStatus"
                            :options="statuses"
                            option-attribute="label"
                            placeholder="Tous les statuts"
                            size="lg"
                            class="w-full lg:w-72"
                            :ui="{
                                size: { lg: 'text-base' }
                            }"
                            @update:modelValue="refreshStructureList"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-funnel" class="h-5 w-5" />
                            </template>
                        </USelectMenu>

                        <UButton
                            color="primary"
                            icon="i-heroicons-plus"
                            label="Nouvelle structure"
                            size="lg"
                            class="w-full lg:w-auto"
                            @click="toggleModalCreateStructure"
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
                        { key: 'label', label: 'Libellé', sortable: true },
                        { key: 'abbreviation', label: 'Abréviation', sortable: true },
                        { key: 'indicatorCount', label: 'Indicateurs', sortable: true },
                        { key: 'status', label: 'Statut', sortable: true },
                        { key: 'actions', label: 'Actions' }
                    ]"
                    :rows="structureList?.data || []"
                    :loading="structureListStatus === 'pending'"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
                    :empty-state="{
                        icon: 'i-heroicons-building-office-2',
                        label: 'Aucune structure trouvée',
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
                    <!-- Colonne Libellé -->
                    <template #label-data="{ row }">
                        <div class="flex items-center gap-3 min-w-[250px]">
                            <div class="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                                <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div class="min-w-0">
                                <p class="font-medium text-gray-900 dark:text-white">
                                    {{ row.label || 'Sans libellé' }}
                                </p>
                                <p v-if="row.description" class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                    {{ row.description }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Colonne Abréviation -->
                    <template #abbreviation-data="{ row }">
                        <div class="flex items-center gap-2">
                            <UBadge color="blue" variant="subtle" size="sm" class="font-mono font-semibold">
                                {{ row.abbreviation || 'N/A' }}
                            </UBadge>
                        </div>
                    </template>

                    <!-- Colonne Nombre d'indicateurs -->
                    <template #indicatorCount-data="{ row }">
                        <div class="flex items-center gap-2">
                            <UButton
                                :color="row.indicatorCount > 0 ? 'primary' : 'gray'"
                                variant="soft"
                                size="xs"
                                icon="i-heroicons-chart-bar-square"
                                @click="openAssignModal(row)"
                            >
                                {{ row.indicatorCount || 0 }} indicateur(s)
                            </UButton>
                        </div>
                    </template>

                    <!-- Colonne Statut -->
                    <template #status-data="{ row }">
                        <UBadge
                            :color="getStatusBadge(row.status).color"
                            variant="subtle"
                            size="sm"
                            class="capitalize"
                        >
                            {{ getStatusBadge(row.status).label }}
                        </UBadge>
                    </template>

                    <!-- Colonne Actions -->
                    <template #actions-data="{ row }">
                        <UDropdown :items="[getActions(row)]" :popper="{ placement: 'bottom-start' }">
                            <UButton
                                color="gray"
                                variant="ghost"
                                icon="i-heroicons-ellipsis-vertical"
                                :loading="structureListStatus === 'pending'"
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
                        <span class="font-medium">{{ pagination.totalItems }}</span> structure(s)
                    </div>

                    <UPagination
                        v-model="page"
                        :page-count="pageCount"
                        :total="structureList?.data?.length || 0"
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
            v-model="isModalCreateStructureOpen"
            title="Création d'une nouvelle structure"
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
            icon="i-heroicons-building-office-2"
            prevent-close
        >
            <div class="w-full p-4">
                <Vueform ref="createStructureFormEl" v-bind="createStructureForm" />
            </div>

            <template #footer>
                <div class="flex justify-end gap-3 p-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        label="Annuler"
                        size="lg"
                        @click.prevent="toggleModalCreateStructure"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': createStructureFormEl?.submitting }"
                        :disabled="createStructureFormEl?.submitting"
                        :label="createStructureFormEl?.submitting ? 'Création en cours...' : 'Enregistrer'"
                        :loading="createStructureFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="createStructureFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>

        <!-- Modal de mise à jour -->
        <UDashboardModal
            v-model="isModalUpdateStructureOpen"
            title="Modifier la structure"
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
            icon="i-heroicons-pencil-square"
            prevent-close
        >
            <div class="w-full p-4">
                <Vueform
                    v-if="currentStructure"
                    ref="updateStructureFormEl"
                    v-bind="updateStructureForm"
                    :key="currentStructure.id"
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
                        @click.prevent="toggleModalUpdateStructure"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': updateStructureFormEl?.submitting }"
                        :disabled="updateStructureFormEl?.submitting"
                        :label="updateStructureFormEl?.submitting ? 'Mise à jour en cours...' : 'Mettre à jour'"
                        :loading="updateStructureFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="updateStructureFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>

        <!-- Modal d'assignation d'indicateurs -->
        <UDashboardModal
            v-model="isModalAssignIndicatorsOpen"
            title="Assigner des indicateurs"
            :ui="{
                rounded: 'rounded-lg',
                base: 'py-0',
                icon: { base: 'text-primary-500 dark:text-primary-400' },
                overlay: { background: 'bg-gray-900/50 backdrop-blur-sm' },
                footer: { base: 'bg-gray-50 dark:bg-gray-800' },
                width: 'w-full sm:max-w-3xl',
                header: {
                    base: 'bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
                    inner: 'py-0 h-full',
                    padding: 'py-4',
                },
            }"
            description="Sélectionnez les indicateurs à assigner à cette structure"
            icon="i-heroicons-chart-bar-square"
            prevent-close
        >
            <div class="w-full p-4">
                <Vueform
                    v-if="assignStructure"
                    ref="assignIndicatorsFormEl"
                    v-bind="assignIndicatorsForm"
                    :key="assignStructure.id"
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
                        @click.prevent="toggleModalAssignIndicators"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': assignIndicatorsFormEl?.submitting }"
                        :disabled="assignIndicatorsFormEl?.submitting"
                        :label="assignIndicatorsFormEl?.submitting ? 'Assignation en cours...' : 'Assigner'"
                        :loading="assignIndicatorsFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="assignIndicatorsFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>
    </div>
</template>

<style scoped></style>
