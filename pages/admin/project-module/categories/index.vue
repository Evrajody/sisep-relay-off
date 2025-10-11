<script lang="ts" setup>
import { useCategories } from "~/composables/category/useCategories";
import { useCreateCategory } from "~/composables/category/useCreateCategory";
import { useUpdateCategory } from "~/composables/category/useUpdateCategory";
import { useDeleteCategory } from "~/composables/category/useDeleteCategory";
import type { Category } from "~/types";

definePageMeta({
    layout: "sisep-app-layout",
});

const links = [
    {
        label: "Catégories",
        icon: "i-heroicons-square-3-stack-3d",
    },
];

useHead({
    title: "Liste des catégories",
});

// Chargement de la liste des catégories
const {
    search,
    current_page,
    selectedStatus,
    columns,
    categoryList,
    pagination,
    error,
    categoryListStatus,
    refreshCategoryList
} = useCategories();

// Logique de création de catégories
const {
    createCategoryFormEl,
    createCategoryForm,
    isModalCreateCategoryOpen,
    toggleModalCreateCategory
} = useCreateCategory(refreshCategoryList);

// Logique de mise à jour de catégories
const {
    updateCategoryFormEl,
    updateCategoryForm,
    isModalUpdateCategoryOpen,
    toggleModalUpdateCategory,
    openUpdateModal,
    currentCategory
} = useUpdateCategory(refreshCategoryList);

// Logique de suppression
const { deleteCategory, isDeleting } = useDeleteCategory();

const page = ref(1);
const pageCount = ref(10);
const sort = ref({ column: 'name', direction: 'asc' as const });

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

// Fonction de suppression d'une catégorie
const handleDeleteCategory = async (row: Category) => {
    const success = await deleteCategory(row.id, row.name);
    if (success) {
        await refreshCategoryList();
    }
};

// Actions disponibles pour chaque catégorie
const getActions = (row: Category) => [
    {
        label: 'Modifier',
        icon: 'i-heroicons-pencil-square',
        click: () => openUpdateModal(row)
    },
    {
        label: 'Supprimer',
        icon: 'i-heroicons-trash',
        click: () => handleDeleteCategory(row)
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
    // Logique d'exportation PDF
    console.log('Export PDF');
};

const exportToCSV = () => {
    // Logique d'exportation CSV
    console.log('Export CSV');
};

const exportToExcel = () => {
    // Logique d'exportation Excel
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
                label="Nouvelle catégorie"
                size="sm"
                @click="toggleModalCreateCategory"
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
                Liste des catégories
            </template>

            <template #description>
                <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> catégorie(s) au total
            </template>

            <!-- En-tête avec filtres -->
            <template #header>
                <div class="flex w-full flex-col gap-4">
                    <!-- Filtres -->
                    <div class="flex flex-col lg:flex-row gap-4">
                        <UInput
                            v-model="search"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Rechercher une catégorie..."
                            class="flex-1"
                            size="lg"
                            :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                            @keyup.enter="refreshCategoryList"
                        >
                            <template #trailing>
                                <UButton
                                    v-if="search"
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark"
                                    size="xs"
                                    @click="search = ''; refreshCategoryList()"
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
                            @update:modelValue="refreshCategoryList"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-funnel" class="h-5 w-5" />
                            </template>
                        </USelectMenu>

                        <UButton
                            color="primary"
                            icon="i-heroicons-plus"
                            label="Nouvelle catégorie"
                            size="lg"
                            class="w-full lg:w-auto"
                            @click="toggleModalCreateCategory"
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
                        { key: 'description', label: 'Description', sortable: true },
                        { key: 'status', label: 'Statut', sortable: true },
                        { key: 'projectCount', label: 'Nb projets' },
                        { key: 'actions', label: 'Actions' }
                    ]"
                    :rows="categoryList?.data || []"
                    :loading="categoryListStatus === 'pending'"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
                    :empty-state="{
                        icon: 'i-heroicons-square-3-stack-3d',
                        label: 'Aucune catégorie trouvée',
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
                                :style="{ backgroundColor: row.color ? `${row.color}20` : '#3B82F620' }"
                            >
                                <UIcon
                                    name="i-heroicons-square-3-stack-3d"
                                    class="w-5 h-5"
                                    :style="{ color: row.color || '#3B82F6' }"
                                />
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
                                :loading="categoryListStatus === 'pending'"
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
                        <span class="font-medium">{{ pagination.totalItems }}</span> catégorie(s)
                    </div>

                    <UPagination
                        v-model="page"
                        :page-count="pageCount"
                        :total="categoryList?.data?.length || 0"
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
            v-model="isModalCreateCategoryOpen"
            title="Création d'une nouvelle catégorie"
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
            icon="i-heroicons-square-3-stack-3d"
            prevent-close
        >
            <div class="w-full p-4">
                <Vueform ref="createCategoryFormEl" v-bind="createCategoryForm" />
            </div>

            <template #footer>
                <div class="flex justify-end gap-3 p-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        label="Annuler"
                        size="lg"
                        @click.prevent="toggleModalCreateCategory"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': createCategoryFormEl?.submitting }"
                        :disabled="createCategoryFormEl?.submitting"
                        :label="createCategoryFormEl?.submitting ? 'Création en cours...' : 'Enregistrer'"
                        :loading="createCategoryFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="createCategoryFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>

        <!-- Modal de mise à jour -->
        <UDashboardModal
            v-model="isModalUpdateCategoryOpen"
            title="Modifier la catégorie"
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
                    v-if="currentCategory"
                    ref="updateCategoryFormEl"
                    v-bind="updateCategoryForm"
                    :key="currentCategory.id"
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
                        @click.prevent="toggleModalUpdateCategory"
                    />
                    <UButton
                        :class="{ 'cursor-not-allowed': updateCategoryFormEl?.submitting }"
                        :disabled="updateCategoryFormEl?.submitting"
                        :label="updateCategoryFormEl?.submitting ? 'Mise à jour en cours...' : 'Mettre à jour'"
                        :loading="updateCategoryFormEl?.submitting"
                        color="primary"
                        icon="i-heroicons-check"
                        size="lg"
                        @click.prevent="updateCategoryFormEl?.submit()"
                    />
                </div>
            </template>
        </UDashboardModal>
    </div>
</template>

<style scoped></style>
