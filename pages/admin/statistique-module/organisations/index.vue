<script lang="ts" setup>
import { useOrganisations, type Organisation } from "~/composables/organisation/useOrganisations";
import { useCreateOrganisation } from "~/composables/organisation/useCreateOrganisation";
import { useUpdateOrganisation } from "~/composables/organisation/useUpdateOrganisation";
import { useDeleteOrganisation } from "~/composables/organisation/useDeleteOrganisation";

definePageMeta({
    layout: "sisep-app-layout",
});

const links = [
    {
        label: "Organisations",
        icon: "i-heroicons-building-office-2",
    },
];

useHead({
    title: "Liste des organisations",
});

// Chargement de la liste des organisations
const {
    search,
    current_page,
    selectedStatus,
    organisationList,
    pagination,
    organisationListStatus,
    refreshOrganisationList
} = useOrganisations();

// Logique de création d'organisations
const {
    createOrganisationFormEl,
    createOrganisationForm,
    isModalCreateOrganisationOpen,
    toggleModalCreateOrganisation
} = useCreateOrganisation(refreshOrganisationList);

// Logique de mise à jour d'organisations
const {
    updateOrganisationFormEl,
    updateOrganisationForm,
    isModalUpdateOrganisationOpen,
    toggleModalUpdateOrganisation,
    openUpdateModal,
    currentOrganisation
} = useUpdateOrganisation(refreshOrganisationList);

// Typage pour les refs Vueform
const createFormEl = createOrganisationFormEl as Ref<any>
const updateFormEl = updateOrganisationFormEl as Ref<any>

// Logique de suppression
const { deleteOrganisation } = useDeleteOrganisation();

const page = ref(1);
const pageCount = ref(10);
const sort = ref({ column: 'code', direction: 'asc' as const });

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

// Fonction de suppression d'une organisation
const handleDeleteOrganisation = async (row: Organisation) => {
    const success = await deleteOrganisation(row.id, row.code, row.name);
    if (success) {
        await refreshOrganisationList();
    }
};

// Actions disponibles pour chaque organisation
const getActions = (row: Organisation) => [
    {
        label: 'Modifier',
        icon: 'i-heroicons-pencil-square',
        click: () => openUpdateModal(row)
    },
    {
        label: 'Supprimer',
        icon: 'i-heroicons-trash',
        click: () => handleDeleteOrganisation(row)
    }
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
                label="Nouvelle organisation"
                size="sm"
                @click="toggleModalCreateOrganisation"
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
                Liste des organisations
            </template>

            <template #description>
                <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> organisation(s) au total
            </template>

            <!-- En-tête avec filtres -->
            <template #header>
                <div class="flex w-full flex-col gap-4">
                    <!-- Première ligne de filtres -->
                    <div class="flex flex-col lg:flex-row gap-4">
                        <UInput
                            v-model="search"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Rechercher une organisation (code ou nom)..."
                            class="flex-1"
                            size="lg"
                            :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                            @keyup.enter="refreshOrganisationList"
                        >
                            <template #trailing>
                                <UButton
                                    v-if="search"
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark"
                                    size="xs"
                                    @click="search = ''; refreshOrganisationList()"
                                />
                            </template>
                        </UInput>

                        <UButton
                            color="primary"
                            icon="i-heroicons-plus"
                            label="Nouvelle organisation"
                            size="lg"
                            class="w-full lg:w-auto"
                            @click="toggleModalCreateOrganisation"
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
                            @update:modelValue="refreshOrganisationList"
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
                        { key: 'name', label: 'Nom', sortable: true },
                        { key: 'description', label: 'Description', sortable: false },
                        { key: 'status', label: 'Statut', sortable: true },
                        { key: 'actions', label: 'Actions' }
                    ]"
                    :rows="organisationList?.categories || []"
                    :loading="organisationListStatus === 'pending'"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
                    :empty-state="{
                        icon: 'i-heroicons-building-office-2',
                        label: 'Aucune organisation trouvée',
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
                            <div class="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                                <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div class="min-w-0">
                                <p class="font-mono font-semibold text-gray-900 dark:text-white text-sm">
                                    {{ row.code || 'N/A' }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Colonne Nom -->
                    <template #name-data="{ row }">
                        <div class="max-w-xs">
                            <p class="font-medium text-gray-900 dark:text-white line-clamp-2">
                                {{ row.name || 'Sans nom' }}
                            </p>
                        </div>
                    </template>

                    <!-- Colonne Description -->
                    <template #description-data="{ row }">
                        <div class="max-w-xs">
                            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {{ row.description || '-' }}
                            </p>
                        </div>
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
                                :loading="organisationListStatus === 'pending'"
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
                        <span class="font-medium">{{ pagination.totalItems }}</span> organisation(s)
                    </div>

                    <UPagination
                        v-model="page"
                        :page-count="pageCount"
                        :total="organisationList?.pagination?.total || 0"
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
            v-model="isModalCreateOrganisationOpen"
            title="Création d'une nouvelle organisation"
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
                <Vueform ref="createOrganisationFormEl" v-bind="createOrganisationForm" />
            </div>

            <template #footer>
                <div class="flex justify-end gap-3 p-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        label="Annuler"
                        size="lg"
                        @click.prevent="toggleModalCreateOrganisation"
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
            v-model="isModalUpdateOrganisationOpen"
            title="Modifier l'organisation"
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
                    v-if="currentOrganisation"
                    ref="updateOrganisationFormEl"
                    v-bind="updateOrganisationForm"
                    :key="currentOrganisation.id"
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
                        @click.prevent="toggleModalUpdateOrganisation"
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
