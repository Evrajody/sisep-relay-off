<script lang="ts" setup>
import { useLocations } from "~/composables/location/useLocations";
import { useCreateLocation } from "~/composables/location/useCreateLocation";
import { useUpdateLocation } from "~/composables/location/useUpdateLocation";
import { useDeleteLocation } from "~/composables/location/useDeleteLocation";
import type { Location } from "~/composables/location/useLocations";

definePageMeta({
    layout: "sisep-app-layout",
});

const links = [
    {
        label: "Localisations",
        icon: "i-heroicons-map-pin",
    },
];

useHead({
    title: "Liste des localisations",
});

// Chargement de la liste des localisations
const {
    search,
    current_page,
    selectedLevel,
    columns,
    locationList,
    pagination,
    error,
    locationListStatus,
    refreshLocationList
} = useLocations();

// Logique de création de localisations
const {
    createLocationFormEl,
    createLocationForm,
    isModalCreateLocationOpen,
    toggleModalCreateLocation
} = useCreateLocation(refreshLocationList);

// Logique de mise à jour de localisations
const {
    updateLocationFormEl,
    updateLocationForm,
    isModalUpdateLocationOpen,
    toggleModalUpdateLocation,
    openUpdateModal,
    currentLocation
} = useUpdateLocation(refreshLocationList);

// Logique de suppression
const { deleteLocation, isDeleting } = useDeleteLocation();

const page = ref(1);
const pageCount = ref(10);
const sort = ref({ column: 'name', direction: 'asc' as const });

// Options de niveau pour le filtre
const levels = [
    { value: 'all', label: 'Tous les niveaux' },
    { value: 'PAYS', label: 'Pays' },
    { value: 'DEPARTEMENT', label: 'Département' },
    { value: 'COMMUNE', label: 'Commune' },
    { value: 'ARRONDISSEMENT', label: 'Arrondissement' },
    { value: 'QUARTIER', label: 'Quartier / Village' },
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

// Fonction de suppression d'une localisation
const handleDeleteLocation = async (row: Location) => {
    const success = await deleteLocation(row.id, row.name);
    if (success) {
        await refreshLocationList();
    }
};

// Actions disponibles pour chaque localisation
const getActions = (row: Location) => [
    {
        label: 'Modifier',
        icon: 'i-heroicons-pencil-square',
        click: () => openUpdateModal(row)
    },
    {
        label: 'Supprimer',
        icon: 'i-heroicons-trash',
        click: () => handleDeleteLocation(row)
    }
];

// Configuration des badges de niveau
const getLevelBadge = (level: string) => {
    const levelMap: Record<string, { color: string, label: string }> = {
        'PAYS': { color: 'purple', label: 'Pays' },
        'DEPARTEMENT': { color: 'blue', label: 'Département' },
        'COMMUNE': { color: 'green', label: 'Commune' },
        'ARRONDISSEMENT': { color: 'yellow', label: 'Arrondissement' },
        'QUARTIER': { color: 'orange', label: 'Quartier / Village' },
    };
    return levelMap[level] || { color: 'gray', label: level };
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
                label="Nouvelle localisation"
                size="sm"
                @click="toggleModalCreateLocation"
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
                Liste des localisations
            </template>

            <template #description>
                <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> localisation(s) au total
            </template>

            <!-- En-tête avec filtres -->
            <template #header>
                <div class="flex w-full flex-col gap-4">
                    <!-- Filtres -->
                    <div class="flex flex-col lg:flex-row gap-4">
                        <UInput
                            v-model="search"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Rechercher une localisation..."
                            class="flex-1"
                            size="lg"
                            :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                            @keyup.enter="refreshLocationList"
                        >
                            <template #trailing>
                                <UButton
                                    v-if="search"
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark"
                                    size="xs"
                                    @click="search = ''; refreshLocationList()"
                                />
                            </template>
                        </UInput>

                        <USelectMenu
                            v-model="selectedLevel"
                            :options="levels"
                            option-attribute="label"
                            placeholder="Tous les niveaux"
                            size="lg"
                            class="w-full lg:w-72"
                            :ui="{
                                size: { lg: 'text-base' }
                            }"
                            @update:modelValue="refreshLocationList"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-funnel" class="h-5 w-5" />
                            </template>
                        </USelectMenu>

                        <UButton
                            color="primary"
                            icon="i-heroicons-plus"
                            label="Nouvelle localisation"
                            size="lg"
                            class="w-full lg:w-auto"
                            @click="toggleModalCreateLocation"
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
                        { key: 'code', label: 'Code', sortable: true },
                        { key: 'level', label: 'Niveau', sortable: true },
                        { key: 'parentCode', label: 'Code parent', sortable: true },
                        { key: 'actions', label: 'Actions' }
                    ]"
                    :rows="locationList?.locations || []"
                    :loading="locationListStatus === 'pending'"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
                    :empty-state="{
                        icon: 'i-heroicons-map-pin',
                        label: 'Aucune localisation trouvée',
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
                    <!-- Colonne Nom -->
                    <template #name-data="{ row }">
                        <div class="flex items-center gap-3 min-w-[200px]">
                            <div class="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                                <UIcon
                                    name="i-heroicons-map-pin"
                                    class="w-5 h-5 text-primary-500"
                                />
                            </div>
                            <div class="min-w-0">
                                <p class="font-medium text-gray-900 dark:text-white">
                                    {{ row.name || 'Sans nom' }}
                                </p>
                                <p v-if="row.description" class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                    {{ row.description }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Colonne Code -->
                    <template #code-data="{ row }">
                        <UBadge
                            color="gray"
                            variant="subtle"
                            size="sm"
                            class="font-mono"
                        >
                            {{ row.code || 'N/A' }}
                        </UBadge>
                    </template>

                    <!-- Colonne Niveau -->
                    <template #level-data="{ row }">
                        <UBadge
                            :color="getLevelBadge(row.level).color"
                            variant="subtle"
                            size="sm"
                            class="capitalize"
                        >
                            {{ getLevelBadge(row.level).label }}
                        </UBadge>
                    </template>

                    <!-- Colonne Code parent -->
                    <template #parentCode-data="{ row }">
                        <span v-if="row.parentCode" class="text-sm text-gray-600 dark:text-gray-400 font-mono">
                            {{ row.parentCode }}
                        </span>
                        <span v-else class="text-sm text-gray-400 dark:text-gray-500 italic">
                            Aucun
                        </span>
                    </template>

                    <!-- Colonne Actions -->
                    <template #actions-data="{ row }">
                        <UDropdown :items="[getActions(row)]" :popper="{ placement: 'bottom-start' }">
                            <UButton
                                color="gray"
                                variant="ghost"
                                icon="i-heroicons-ellipsis-vertical"
                                :loading="locationListStatus === 'pending'"
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
                        <span class="font-medium">{{ pagination.totalItems }}</span> localisation(s)
                    </div>

                    <UPagination
                        v-model="page"
                        :page-count="pageCount"
                        :total="locationList?.data?.length || 0"
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
            v-model="isModalCreateLocationOpen"
            title="Création d'une nouvelle localisation"
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
            description="Merci de renseigner les champs obligatoires"
            icon="i-heroicons-map-pin"
            prevent-close
        >
            <div class="w-full p-4">
                <Vueform ref="createLocationFormEl" v-bind="createLocationForm" />
            </div>

            <template #footer>
                <div class="flex justify-end gap-3 p-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        label="Annuler"
                        size="lg"
                        @click.prevent="toggleModalCreateLocation"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': createLocationFormEl?.submitting }"
                        :disabled="createLocationFormEl?.submitting"
                        :label="createLocationFormEl?.submitting ? 'Création en cours...' : 'Enregistrer'"
                        :loading="createLocationFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="createLocationFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>

        <!-- Modal de mise à jour -->
        <UDashboardModal
            v-model="isModalUpdateLocationOpen"
            title="Modifier la localisation"
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
            description="Merci de renseigner les champs obligatoires"
            icon="i-heroicons-pencil-square"
            prevent-close
        >
            <div class="w-full p-4">
                <Vueform
                    v-if="currentLocation"
                    ref="updateLocationFormEl"
                    v-bind="updateLocationForm"
                    :key="currentLocation.id"
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
                        @click.prevent="toggleModalUpdateLocation"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': updateLocationFormEl?.submitting }"
                        :disabled="updateLocationFormEl?.submitting"
                        :label="updateLocationFormEl?.submitting ? 'Mise à jour en cours...' : 'Mettre à jour'"
                        :loading="updateLocationFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="updateLocationFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>
    </div>
</template>

<style scoped></style>
