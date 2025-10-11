<script lang="ts" setup>
import { useIndicators } from "~/composables/indicator/useIndicators";
import { useCreateIndicator } from "~/composables/indicator/useCreateIndicator";
import { useUpdateIndicator } from "~/composables/indicator/useUpdateIndicator";
import { useDeleteIndicator } from "~/composables/indicator/useDeleteIndicator";
import type { Indicator } from "~/types";

definePageMeta({
    layout: "sisep-app-layout",
});

const links = [
    {
        label: "Indicateurs",
        icon: "i-heroicons-chart-bar-square",
    },
];

useHead({
    title: "Liste des indicateurs",
});

// Chargement de la liste des indicateurs
const {
    search,
    current_page,
    selectedStatus,
    selectedCategory,
    selectedSubCategory,
    selectedCoverage,
    columns,
    indicatorList,
    pagination,
    error,
    indicatorListStatus,
    refreshIndicatorList
} = useIndicators();

// Logique de création d'indicateurs
const {
    createIndicatorFormEl,
    createIndicatorForm,
    isModalCreateIndicatorOpen,
    toggleModalCreateIndicator
} = useCreateIndicator(refreshIndicatorList);

// Logique de mise à jour d'indicateurs
const {
    updateIndicatorFormEl,
    updateIndicatorForm,
    isModalUpdateIndicatorOpen,
    toggleModalUpdateIndicator,
    openUpdateModal,
    currentIndicator
} = useUpdateIndicator(refreshIndicatorList);

// Logique de suppression
const { deleteIndicator, isDeleting } = useDeleteIndicator();

const page = ref(1);
const pageCount = ref(10);
const sort = ref({ column: 'code', direction: 'asc' as const });

// Options de statut pour le filtre
const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'ACTIVE', label: 'Actif' },
    { value: 'INACTIVE', label: 'Inactif' },
];

// Options de couverture pour le filtre
const coverages = [
    { value: 'all', label: 'Toutes les couvertures' },
    { value: 'REGIONAL', label: 'Régional' },
    { value: 'NATIONAL', label: 'National' },
    { value: 'INTERNATIONAL', label: 'International' },
];

// Chargement des catégories pour le filtre
const { data: categories } = await useAsyncData('categories-filter-ind', () =>
    $fetch('/api/categories')
);

const categoryFilterOptions = computed(() => {
    const allOption = { value: 'all', label: 'Toutes les catégories' };
    if (!categories.value?.data) return [allOption];
    return [
        allOption,
        ...categories.value.data.map((cat: any) => ({
            value: cat.id,
            label: cat.name
        }))
    ];
});

// Chargement des sous-catégories pour le filtre
const { data: subCategories } = await useAsyncData('subcategories-filter-ind', () =>
    $fetch('/api/subcategories')
);

const subCategoryFilterOptions = computed(() => {
    const allOption = { value: 'all', label: 'Toutes les sous-catégories' };
    if (!subCategories.value?.data) return [allOption];
    return [
        allOption,
        ...subCategories.value.data.map((subCat: any) => ({
            value: subCat.id,
            label: subCat.name
        }))
    ];
});

// Gestion du changement de page
const onPageChange = (newPage: number) => {
    page.value = newPage;
    current_page.value = newPage;
};

// Gestion du tri
const onSort = (e: { column: string; direction: 'asc' | 'desc' }) => {
    sort.value = e;
};

// Fonction de suppression d'un indicateur
const handleDeleteIndicator = async (row: Indicator) => {
    const success = await deleteIndicator(row.id, row.code, row.label);
    if (success) {
        await refreshIndicatorList();
    }
};

// Actions disponibles pour chaque indicateur
const getActions = (row: Indicator) => [
    {
        label: 'Modifier',
        icon: 'i-heroicons-pencil-square',
        click: () => openUpdateModal(row)
    },
    {
        label: 'Supprimer',
        icon: 'i-heroicons-trash',
        click: () => handleDeleteIndicator(row)
    }
];

// Configuration des badges de statut
const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
        'ACTIVE': { color: 'green', label: 'Actif' },
        'INACTIVE': { color: 'gray', label: 'Inactif' },
    };
    return statusMap[status] || { color: 'gray', label: 'Inconnu' };
};

// Configuration des badges de couverture
const getCoverageBadge = (coverage: string) => {
    const coverageMap: Record<string, { color: string, label: string }> = {
        'REGIONAL': { color: 'blue', label: 'Régional' },
        'NATIONAL': { color: 'purple', label: 'National' },
        'INTERNATIONAL': { color: 'orange', label: 'International' },
    };
    return coverageMap[coverage] || { color: 'gray', label: 'Non défini' };
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
                label="Nouvel indicateur"
                size="sm"
                @click="toggleModalCreateIndicator"
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
                Liste des indicateurs
            </template>

            <template #description>
                <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> indicateur(s) au total
            </template>

            <!-- En-tête avec filtres -->
            <template #header>
                <div class="flex w-full flex-col gap-4">
                    <!-- Première ligne de filtres -->
                    <div class="flex flex-col lg:flex-row gap-4">
                        <UInput
                            v-model="search"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Rechercher un indicateur (code ou libellé)..."
                            class="flex-1"
                            size="lg"
                            :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                            @keyup.enter="refreshIndicatorList"
                        >
                            <template #trailing>
                                <UButton
                                    v-if="search"
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark"
                                    size="xs"
                                    @click="search = ''; refreshIndicatorList()"
                                />
                            </template>
                        </UInput>

                        <UButton
                            color="primary"
                            icon="i-heroicons-plus"
                            label="Nouvel indicateur"
                            size="lg"
                            class="w-full lg:w-auto"
                            @click="toggleModalCreateIndicator"
                        />
                    </div>

                    <!-- Deuxième ligne de filtres -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <USelectMenu
                            v-model="selectedCategory"
                            :options="categoryFilterOptions"
                            option-attribute="label"
                            placeholder="Toutes les catégories"
                            size="sm"
                            :ui="{
                                size: { sm: 'text-sm' }
                            }"
                            @update:modelValue="refreshIndicatorList"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-square-3-stack-3d" class="h-4 w-4" />
                            </template>
                        </USelectMenu>

                        <USelectMenu
                            v-model="selectedSubCategory"
                            :options="subCategoryFilterOptions"
                            option-attribute="label"
                            placeholder="Toutes les sous-catégories"
                            size="sm"
                            :ui="{
                                size: { sm: 'text-sm' }
                            }"
                            @update:modelValue="refreshIndicatorList"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-queue-list" class="h-4 w-4" />
                            </template>
                        </USelectMenu>

                        <USelectMenu
                            v-model="selectedCoverage"
                            :options="coverages"
                            option-attribute="label"
                            placeholder="Toutes les couvertures"
                            size="sm"
                            :ui="{
                                size: { sm: 'text-sm' }
                            }"
                            @update:modelValue="refreshIndicatorList"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-globe-alt" class="h-4 w-4" />
                            </template>
                        </USelectMenu>

                        <USelectMenu
                            v-model="selectedStatus"
                            :options="statuses"
                            option-attribute="label"
                            placeholder="Tous les statuts"
                            size="sm"
                            :ui="{
                                size: { sm: 'text-sm' }
                            }"
                            @update:modelValue="refreshIndicatorList"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-funnel" class="h-4 w-4" />
                            </template>
                        </USelectMenu>
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
                        { key: 'label', label: 'Libellé', sortable: true },
                        { key: 'category', label: 'Catégorie', sortable: true },
                        { key: 'subcategory', label: 'Sous-catégorie', sortable: true },
                        { key: 'coverage', label: 'Couverture', sortable: true },
                        { key: 'status', label: 'Statut', sortable: true },
                        { key: 'actions', label: 'Actions' }
                    ]"
                    :rows="indicatorList?.data || []"
                    :loading="indicatorListStatus === 'pending'"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
                    :empty-state="{
                        icon: 'i-heroicons-chart-bar-square',
                        label: 'Aucun indicateur trouvé',
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
                    <!-- Colonne Code -->
                    <template #code-data="{ row }">
                        <div class="flex items-center gap-3 min-w-[150px]">
                            <div class="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                                <UIcon name="i-heroicons-chart-bar-square" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div class="min-w-0">
                                <p class="font-mono font-semibold text-gray-900 dark:text-white text-sm">
                                    {{ row.code || 'N/A' }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Colonne Libellé -->
                    <template #label-data="{ row }">
                        <div class="max-w-xs">
                            <p class="font-medium text-gray-900 dark:text-white line-clamp-2">
                                {{ row.label || 'Sans libellé' }}
                            </p>
                            <p v-if="row.unit" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Unité: {{ row.unit }}
                            </p>
                        </div>
                    </template>

                    <!-- Colonne Catégorie -->
                    <template #category-data="{ row }">
                        <div v-if="row.category" class="flex items-center gap-2">
                            <div
                                class="p-1.5 rounded"
                                :style="{ backgroundColor: row.category?.color ? `${row.category.color}20` : '#3B82F620' }"
                            >
                                <UIcon
                                    name="i-heroicons-square-3-stack-3d"
                                    class="w-4 h-4"
                                    :style="{ color: row.category?.color || '#3B82F6' }"
                                />
                            </div>
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {{ row.category?.name }}
                            </span>
                        </div>
                        <span v-else class="text-sm text-gray-400">-</span>
                    </template>

                    <!-- Colonne Sous-catégorie -->
                    <template #subcategory-data="{ row }">
                        <div v-if="row.subCategory" class="flex items-center gap-2">
                            <div
                                class="p-1.5 rounded"
                                :style="{ backgroundColor: row.subCategory?.color ? `${row.subCategory.color}20` : '#8B5CF620' }"
                            >
                                <UIcon
                                    name="i-heroicons-queue-list"
                                    class="w-4 h-4"
                                    :style="{ color: row.subCategory?.color || '#8B5CF6' }"
                                />
                            </div>
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {{ row.subCategory?.name }}
                            </span>
                        </div>
                        <span v-else class="text-sm text-gray-400">-</span>
                    </template>

                    <!-- Colonne Couverture -->
                    <template #coverage-data="{ row }">
                        <UBadge
                            :color="getCoverageBadge(row.coverage).color"
                            variant="subtle"
                            size="sm"
                        >
                            {{ getCoverageBadge(row.coverage).label }}
                        </UBadge>
                    </template>

                    <!-- Colonne Statut -->
                    <template #status-data="{ row }">
                        <UBadge
                            :color="getStatusBadge(row.status).color"
                            variant="subtle"
                            size="sm"
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
                                :loading="indicatorListStatus === 'pending'"
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
                        <span class="font-medium">{{ pagination.totalItems }}</span> indicateur(s)
                    </div>

                    <UPagination
                        v-model="page"
                        :page-count="pageCount"
                        :total="indicatorList?.data?.length || 0"
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
            v-model="isModalCreateIndicatorOpen"
            title="Création d'un nouvel indicateur"
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
            icon="i-heroicons-chart-bar-square"
            prevent-close
        >
            <div class="w-full p-4">
                <Vueform ref="createIndicatorFormEl" v-bind="createIndicatorForm" />
            </div>

            <template #footer>
                <div class="flex justify-end gap-3 p-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        label="Annuler"
                        size="lg"
                        @click.prevent="toggleModalCreateIndicator"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': createIndicatorFormEl?.submitting }"
                        :disabled="createIndicatorFormEl?.submitting"
                        :label="createIndicatorFormEl?.submitting ? 'Création en cours...' : 'Enregistrer'"
                        :loading="createIndicatorFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="createIndicatorFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>

        <!-- Modal de mise à jour -->
        <UDashboardModal
            v-model="isModalUpdateIndicatorOpen"
            title="Modifier l'indicateur"
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
                    v-if="currentIndicator"
                    ref="updateIndicatorFormEl"
                    v-bind="updateIndicatorForm"
                    :key="currentIndicator.id"
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
                        @click.prevent="toggleModalUpdateIndicator"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': updateIndicatorFormEl?.submitting }"
                        :disabled="updateIndicatorFormEl?.submitting"
                        :label="updateIndicatorFormEl?.submitting ? 'Mise à jour en cours...' : 'Mettre à jour'"
                        :loading="updateIndicatorFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="updateIndicatorFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>
    </div>
</template>

<style scoped></style>
