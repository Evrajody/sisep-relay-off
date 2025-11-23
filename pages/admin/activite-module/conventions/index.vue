<script lang="ts" setup>
import { useConventions } from "~/composables/conventions/useConventions";
import { useCreateConvention } from "~/composables/conventions/useCreateConvention";
import { useUpdateConvention } from "~/composables/conventions/useUpdateConvention";
import { useDeleteConvention } from "~/composables/conventions/useDeleteConvention";
import type { Convention } from "~/types";

definePageMeta({
    layout: "sisep-app-layout",
});

const links = [
    {
        label: "Conventions",
        icon: "i-heroicons-document-text",
    },
];

useHead({
    title: "Liste des conventions",
});

// Chargement de la liste des conventions
const {
    search,
    current_page,
    selectedStatus,
    selectedFunctionalGroup,
    conventionList,
    pagination,
    conventionListStatus,
    refreshConventionList
} = useConventions();

// Logique de création de conventions
const {
    createConventionFormEl,
    createConventionForm,
    isModalCreateConventionOpen,
    toggleModalCreateConvention
} = useCreateConvention(refreshConventionList);

// Logique de mise à jour de conventions
const {
    updateConventionFormEl,
    updateConventionForm,
    isModalUpdateConventionOpen,
    toggleModalUpdateConvention,
    openUpdateModal,
    currentConvention
} = useUpdateConvention(refreshConventionList);

// Logique de suppression
const { deleteConvention } = useDeleteConvention();

// Typage pour les refs Vueform
const createFormEl = createConventionFormEl as Ref<any>
const updateFormEl = updateConventionFormEl as Ref<any>

const page = ref(1);
const pageCount = ref(10);
const sort = ref({ column: 'title', direction: 'asc' as const });

// Options de statut pour le filtre
const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'ACTIVE', label: 'Actif' },
    { value: 'INACTIVE', label: 'Inactif' },
];

// Gestion du changement de page
const onPageChange = (newPage: number) => {
    page.value = newPage;
    current_page.value = newPage;
};

// Gestion du tri
const onSort = (e: { column: string; direction: 'asc' | 'desc' }) => {
    sort.value = e as { column: string; direction: 'asc' };
};

// Fonction de suppression d'une convention
const handleDeleteConvention = async (row: Convention) => {
    const success = await deleteConvention(row.id, row.title);
    if (success) {
        await refreshConventionList();
    }
};

// Actions disponibles pour chaque convention
const getActions = (row: Convention) => [
    {
        label: 'Modifier',
        icon: 'i-heroicons-pencil-square',
        click: () => openUpdateModal(row)
    },
    // {
    //     label: 'Supprimer',
    //     icon: 'i-heroicons-trash',
    //     click: () => handleDeleteConvention(row)
    // }
];

// Configuration des badges de statut
type BadgeColor = 'green' | 'gray' | 'red' | 'yellow' | 'blue' | 'indigo' | 'purple' | 'pink' | 'orange' | 'teal' | 'cyan' | 'white' | 'black' | 'primary'
const getStatusBadge = (status: string): { color: BadgeColor, label: string } => {
    const statusMap: Record<string, { color: BadgeColor, label: string }> = {
        'ACTIVE': { color: 'green', label: 'Actif' },
        'INACTIVE': { color: 'gray', label: 'Inactif' },
    };
    return statusMap[status] || { color: 'gray', label: 'Inconnu' };
};

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
                label="Nouvelle convention"
                size="sm"
                @click="toggleModalCreateConvention"
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
                Liste des conventions
            </template>

            <template #description>
                <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> convention(s) au total
            </template>

            <!-- En-tête avec filtres -->
            <template #header>
                <div class="flex w-full flex-col gap-4">
                    <!-- Première ligne de filtres -->
                    <div class="flex flex-col lg:flex-row gap-4">
                        <UInput
                            v-model="search"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Rechercher une convention (titre)..."
                            class="flex-1"
                            size="lg"
                            :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                            @keyup.enter="refreshConventionList"
                        >
                            <template #trailing>
                                <UButton
                                    v-if="search"
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark"
                                    size="xs"
                                    @click="search = ''; refreshConventionList()"
                                />
                            </template>
                        </UInput>

                        <UButton
                            color="primary"
                            icon="i-heroicons-plus"
                            label="Nouvelle convention"
                            size="lg"
                            class="w-full lg:w-auto"
                            @click="toggleModalCreateConvention"
                        />
                    </div>

                    <!-- Deuxième ligne de filtres -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <USelectMenu
                            v-model="selectedStatus"
                            :options="statuses"
                            option-attribute="label"
                            placeholder="Tous les statuts"
                            size="sm"
                            :ui="{
                                size: { sm: 'text-sm' }
                            }"
                            @update:modelValue="refreshConventionList"
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
                        { key: 'title', label: 'Titre', sortable: true },
                        { key: 'functionalGroup', label: 'Groupe fonctionnel', sortable: true },
                        { key: 'adoptionDate', label: 'Date d\'adoption', sortable: true },
                        { key: 'effectiveDate', label: 'Entrée en vigueur', sortable: true },
                        { key: 'status', label: 'Statut', sortable: true },
                        { key: 'actions', label: 'Actions' }
                    ]"
                    :rows="conventionList?.data || conventionList?.conventions || []"
                    :loading="conventionListStatus === 'pending'"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
                    :empty-state="{
                        icon: 'i-heroicons-document-text',
                        label: 'Aucune convention trouvée',
                    }"
                    class="w-full"
                    :ui="{
                        td: { base: 'whitespace-nowrap' },
                        th: { base: 'whitespace-nowrap' }
                    }"
                    v-model:sort="sort"
                    @update:sort="onSort"
                >
                    <!-- Colonne Titre -->
                    <template #title-data="{ row }">
                        <div class="flex items-center gap-3 min-w-[200px]">
                            <div class="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                                <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div class="min-w-0 max-w-xs">
                                <p class="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                                    {{ row.title || 'Sans titre' }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Colonne Groupe fonctionnel -->
                    <template #functionalGroup-data="{ row }">
                        <div v-if="row.functionalGroup" class="flex items-center gap-2">
                            <div class="p-1.5 rounded bg-purple-50 dark:bg-purple-950/30">
                                <UIcon
                                    name="i-heroicons-rectangle-group"
                                    class="w-4 h-4 text-purple-600 dark:text-purple-400"
                                />
                            </div>
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {{ row.functionalGroup?.name || row.functionalGroup }}
                            </span>
                        </div>
                        <span v-else class="text-sm text-gray-400">-</span>
                    </template>

                    <!-- Colonne Date d'adoption -->
                    <template #adoptionDate-data="{ row }">
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                            {{ formatDate(row.adoptionDate) }}
                        </span>
                    </template>

                    <!-- Colonne Date d'entrée en vigueur -->
                    <template #effectiveDate-data="{ row }">
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                            {{ formatDate(row.effectiveDate) }}
                        </span>
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
                                :loading="conventionListStatus === 'pending'"
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
                        <span class="font-medium">{{ pagination.totalItems }}</span> convention(s)
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
            v-model="isModalCreateConventionOpen"
            title="Création d'une nouvelle convention"
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
            icon="i-heroicons-document-text"
            prevent-close
        >
            <div class="w-full p-4 max-h-[70vh] overflow-y-auto">
                <Vueform ref="createConventionFormEl" v-bind="createConventionForm" />
            </div>

            <template #footer>
                <div class="flex justify-end gap-3 p-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        label="Annuler"
                        size="lg"
                        @click.prevent="toggleModalCreateConvention"
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
            v-model="isModalUpdateConventionOpen"
            title="Modifier la convention"
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
            <div class="w-full p-4 max-h-[70vh] overflow-y-auto">
                <Vueform
                    v-if="currentConvention"
                    ref="updateConventionFormEl"
                    v-bind="updateConventionForm"
                    :key="currentConvention.id"
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
                        @click.prevent="toggleModalUpdateConvention"
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
