<script lang="ts" setup>
import { useSubCategories } from "~/composables/subcategory/useSubCategories";
import { useCreateSubCategory } from "~/composables/subcategory/useCreateSubCategory";
import { useUpdateSubCategory } from "~/composables/subcategory/useUpdateSubCategory";
import { useDeleteSubCategory } from "~/composables/subcategory/useDeleteSubCategory";
import type { SubCategory } from "~/types";

definePageMeta({
    layout: "sisep-app-layout",
});

const links = [
    {
        label: "Sous-catégories",
        icon: "i-heroicons-queue-list",
    },
];

useHead({
    title: "Liste des sous-catégories",
});

// Chargement de la liste des sous-catégories
const {
    search,
    current_page,
    selectedStatus,
    selectedCategory,
    columns,
    subCategoryList,
    pagination,
    error,
    subCategoryListStatus,
    refreshSubCategoryList
} = useSubCategories();

// Logique de création de sous-catégories
const {
    createSubCategoryFormEl,
    createSubCategoryForm,
    isModalCreateSubCategoryOpen,
    toggleModalCreateSubCategory
} = useCreateSubCategory(refreshSubCategoryList);

// Logique de mise à jour de sous-catégories
const {
    updateSubCategoryFormEl,
    updateSubCategoryForm,
    isModalUpdateSubCategoryOpen,
    toggleModalUpdateSubCategory,
    openUpdateModal,
    currentSubCategory
} = useUpdateSubCategory(refreshSubCategoryList);

// Logique de suppression
const { deleteSubCategory, isDeleting } = useDeleteSubCategory();

const page = ref(1);
const pageCount = ref(10);
const sort = ref({ column: 'name', direction: 'asc' as const });

// Options de statut pour le filtre
const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
];

// Chargement des catégories pour le filtre
const { data: categories } = await useAsyncData('categories-filter', () =>
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

// Gestion du changement de page
const onPageChange = (newPage: number) => {
    page.value = newPage;
    current_page.value = newPage;
};

// Gestion du tri
const onSort = (e: { column: string; direction: 'asc' | 'desc' }) => {
    sort.value = e;
};

// Fonction de suppression d'une sous-catégorie
const handleDeleteSubCategory = async (row: SubCategory) => {
    const success = await deleteSubCategory(row.id, row.name);
    if (success) {
        await refreshSubCategoryList();
    }
};

// Actions disponibles pour chaque sous-catégorie
const getActions = (row: SubCategory) => [
    {
        label: 'Modifier',
        icon: 'i-heroicons-pencil-square',
        click: () => openUpdateModal(row)
    },
    {
        label: 'Supprimer',
        icon: 'i-heroicons-trash',
        click: () => handleDeleteSubCategory(row)
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
                label="Nouvelle sous-catégorie"
                size="sm"
                @click="toggleModalCreateSubCategory"
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
                Liste des sous-catégories
            </template>

            <template #description>
                <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> sous-catégorie(s) au total
            </template>

            <!-- En-tête avec filtres -->
            <template #header>
                <div class="flex w-full flex-col gap-4">
                    <!-- Filtres -->
                    <div class="flex flex-col lg:flex-row gap-4">
                        <UInput
                            v-model="search"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Rechercher une sous-catégorie..."
                            class="flex-1"
                            size="lg"
                            :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                            @keyup.enter="refreshSubCategoryList"
                        >
                            <template #trailing>
                                <UButton
                                    v-if="search"
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark"
                                    size="xs"
                                    @click="search = ''; refreshSubCategoryList()"
                                />
                            </template>
                        </UInput>

                        <USelectMenu
                            v-model="selectedCategory"
                            :options="categoryFilterOptions"
                            option-attribute="label"
                            placeholder="Toutes les catégories"
                            size="lg"
                            class="w-full lg:w-72"
                            :ui="{
                                size: { lg: 'text-base' }
                            }"
                            @update:modelValue="refreshSubCategoryList"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-square-3-stack-3d" class="h-5 w-5" />
                            </template>
                        </USelectMenu>

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
                            @update:modelValue="refreshSubCategoryList"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-funnel" class="h-5 w-5" />
                            </template>
                        </USelectMenu>

                        <UButton
                            color="primary"
                            icon="i-heroicons-plus"
                            label="Nouvelle sous-catégorie"
                            size="lg"
                            class="w-full lg:w-auto"
                            @click="toggleModalCreateSubCategory"
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
                        { key: 'category', label: 'Catégorie parente', sortable: true },
                        { key: 'description', label: 'Description', sortable: true },
                        { key: 'status', label: 'Statut', sortable: true },
                        { key: 'projectCount', label: 'Nb projets' },
                        { key: 'actions', label: 'Actions' }
                    ]"
                    :rows="subCategoryList?.data || []"
                    :loading="subCategoryListStatus === 'pending'"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
                    :empty-state="{
                        icon: 'i-heroicons-queue-list',
                        label: 'Aucune sous-catégorie trouvée',
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
                            <div
                                class="p-2 rounded-lg"
                                :style="{ backgroundColor: row.color ? `${row.color}20` : '#8B5CF620' }"
                            >
                                <UIcon
                                    name="i-heroicons-queue-list"
                                    class="w-5 h-5"
                                    :style="{ color: row.color || '#8B5CF6' }"
                                />
                            </div>
                            <div class="min-w-0">
                                <p class="font-medium text-gray-900 dark:text-white">
                                    {{ row.name || 'Sans nom' }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Colonne Catégorie parente -->
                    <template #category-data="{ row }">
                        <div class="flex items-center gap-2">
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
                                {{ row.category?.name || 'Non définie' }}
                            </span>
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

                    <!-- Colonne Nombre de projets -->
                    <template #projectCount-data="{ row }">
                        <UBadge
                            color="blue"
                            variant="subtle"
                            size="sm"
                        >
                            {{ row.projectCount || 0 }} projet(s)
                        </UBadge>
                    </template>

                    <!-- Colonne Actions -->
                    <template #actions-data="{ row }">
                        <UDropdown :items="[getActions(row)]" :popper="{ placement: 'bottom-start' }">
                            <UButton
                                color="gray"
                                variant="ghost"
                                icon="i-heroicons-ellipsis-vertical"
                                :loading="subCategoryListStatus === 'pending'"
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
                        <span class="font-medium">{{ pagination.totalItems }}</span> sous-catégorie(s)
                    </div>

                    <UPagination
                        v-model="page"
                        :page-count="pageCount"
                        :total="subCategoryList?.data?.length || 0"
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
            v-model="isModalCreateSubCategoryOpen"
            title="Création d'une nouvelle sous-catégorie"
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
            icon="i-heroicons-queue-list"
            prevent-close
        >
            <div class="w-full p-4">
                <Vueform ref="createSubCategoryFormEl" v-bind="createSubCategoryForm" />
            </div>

            <template #footer>
                <div class="flex justify-end gap-3 p-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        label="Annuler"
                        size="lg"
                        @click.prevent="toggleModalCreateSubCategory"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': createSubCategoryFormEl?.submitting }"
                        :disabled="createSubCategoryFormEl?.submitting"
                        :label="createSubCategoryFormEl?.submitting ? 'Création en cours...' : 'Enregistrer'"
                        :loading="createSubCategoryFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="createSubCategoryFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>

        <!-- Modal de mise à jour -->
        <UDashboardModal
            v-model="isModalUpdateSubCategoryOpen"
            title="Modifier la sous-catégorie"
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
                    v-if="currentSubCategory"
                    ref="updateSubCategoryFormEl"
                    v-bind="updateSubCategoryForm"
                    :key="currentSubCategory.id"
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
                        @click.prevent="toggleModalUpdateSubCategory"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': updateSubCategoryFormEl?.submitting }"
                        :disabled="updateSubCategoryFormEl?.submitting"
                        :label="updateSubCategoryFormEl?.submitting ? 'Mise à jour en cours...' : 'Mettre à jour'"
                        :loading="updateSubCategoryFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="updateSubCategoryFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>
    </div>
</template>

<style scoped></style>
