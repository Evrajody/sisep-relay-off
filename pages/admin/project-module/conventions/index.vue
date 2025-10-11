<script lang="ts" setup>
import { useConventions } from "~/composables/convention/useConventions";
import { useConventionActions } from "~/composables/convention/useConventionActions";
import { useDeleteConvention } from "~/composables/convention/useDeleteConvention";
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
    selectedPublicationStatus,
    columns,
    conventionList,
    pagination,
    error,
    conventionListStatus,
    refreshConventionList
} = useConventions();

// Actions sur les conventions
const { publishConvention, unpublishConvention, duplicateConvention, exportToPDF } = useConventionActions();

// Logique de suppression
const { deleteConvention, isDeleting } = useDeleteConvention();

const page = ref(1);
const pageCount = ref(10);
const sort = ref({ column: 'title', direction: 'asc' as const });

// Options de statut pour le filtre
const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'DRAFT', label: 'Brouillon' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ARCHIVED', label: 'Archivée' },
];

// Options de groupes fonctionnels
const functionalGroups = [
    { value: 'all', label: 'Tous les groupes' },
    { value: 'BIODIVERSITY', label: 'Biodiversité' },
    { value: 'CLIMATE', label: 'Climat' },
    { value: 'CHEMICALS', label: 'Produits chimiques' },
    { value: 'WASTE', label: 'Déchets' },
    { value: 'WATER', label: 'Eau' },
    { value: 'LAND', label: 'Terre et désertification' },
];

// Options de publication
const publicationStatuses = [
    { value: 'all', label: 'Tous' },
    { value: 'published', label: 'Publiées' },
    { value: 'unpublished', label: 'Non publiées' },
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

// Fonction de suppression d'une convention
const handleDeleteConvention = async (row: Convention) => {
    const success = await deleteConvention(row.id, row.title);
    if (success) {
        await refreshConventionList();
    }
};

// Fonction de publication
const handlePublishConvention = async (row: Convention) => {
    const success = await publishConvention(row.id, row.title);
    if (success) {
        await refreshConventionList();
    }
};

// Fonction de dépublication
const handleUnpublishConvention = async (row: Convention) => {
    const success = await unpublishConvention(row.id, row.title);
    if (success) {
        await refreshConventionList();
    }
};

// Fonction de duplication
const handleDuplicateConvention = async (row: Convention) => {
    const newConvention = await duplicateConvention(row.id, row.title);
    if (newConvention) {
        await refreshConventionList();
    }
};

// Actions disponibles pour chaque convention
const getActions = (row: Convention) => {
    const actions = [
        {
            label: 'Voir les détails',
            icon: 'i-heroicons-eye',
            click: () => navigateTo(`/project-module/conventions/${row.id}`)
        },
        {
            label: 'Modifier',
            icon: 'i-heroicons-pencil-square',
            click: () => navigateTo(`/project-module/conventions/edit/${row.id}`)
        },
    ];

    // Ajouter l'action de publication/dépublication
    if (row.isPublished) {
        actions.push({
            label: 'Dépublier du site',
            icon: 'i-heroicons-eye-slash',
            click: () => handleUnpublishConvention(row)
        });
    } else {
        actions.push({
            label: 'Publier sur le site',
            icon: 'i-heroicons-globe-alt',
            click: () => handlePublishConvention(row)
        });
    }

    actions.push(
        {
            label: 'Dupliquer',
            icon: 'i-heroicons-document-duplicate',
            click: () => handleDuplicateConvention(row)
        },
        {
            label: 'Exporter en PDF',
            icon: 'i-heroicons-document-arrow-down',
            click: () => exportToPDF(row.id, row.title)
        },
        {
            label: 'Supprimer',
            icon: 'i-heroicons-trash',
            click: () => handleDeleteConvention(row)
        }
    );

    return actions;
};

// Configuration des badges de statut
const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
        'DRAFT': { color: 'gray', label: 'Brouillon' },
        'ACTIVE': { color: 'green', label: 'Active' },
        'ARCHIVED': { color: 'orange', label: 'Archivée' },
    };
    return statusMap[status] || { color: 'gray', label: 'Inconnu' };
};

// Configuration des badges de groupe fonctionnel
const getFunctionalGroupBadge = (group: string) => {
    const groupMap: Record<string, { color: string, label: string }> = {
        'BIODIVERSITY': { color: 'green', label: 'Biodiversité' },
        'CLIMATE': { color: 'blue', label: 'Climat' },
        'CHEMICALS': { color: 'purple', label: 'Produits chimiques' },
        'WASTE': { color: 'orange', label: 'Déchets' },
        'WATER': { color: 'cyan', label: 'Eau' },
        'LAND': { color: 'amber', label: 'Terre' },
    };
    return groupMap[group] || { color: 'gray', label: 'Non défini' };
};

// Formatage des dates
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Fonctions d'exportation globales
const exportAllToPDF = () => {
    console.log('Export PDF global');
};

const exportAllToCSV = () => {
    console.log('Export CSV global');
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
                to="/project-module/conventions/create"
                color="primary"
                icon="i-heroicons-plus"
                label="Nouvelle convention"
                size="sm"
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
                Liste des conventions internationales
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
                            placeholder="Rechercher une convention..."
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
                            to="/project-module/conventions/create"
                            color="primary"
                            icon="i-heroicons-plus"
                            label="Nouvelle convention"
                            size="lg"
                            class="w-full lg:w-auto"
                        />
                    </div>

                    <!-- Deuxième ligne de filtres -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <USelectMenu
                            v-model="selectedFunctionalGroup"
                            :options="functionalGroups"
                            option-attribute="label"
                            placeholder="Tous les groupes"
                            size="sm"
                            :ui="{
                                size: { sm: 'text-sm' }
                            }"
                            @update:modelValue="refreshConventionList"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-squares-2x2" class="h-4 w-4" />
                            </template>
                        </USelectMenu>

                        <USelectMenu
                            v-model="selectedPublicationStatus"
                            :options="publicationStatuses"
                            option-attribute="label"
                            placeholder="Tous"
                            size="sm"
                            :ui="{
                                size: { sm: 'text-sm' }
                            }"
                            @update:modelValue="refreshConventionList"
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
                            @click="exportAllToPDF"
                        >
                            Export PDF
                        </UButton>
                        <UButton
                            color="white"
                            icon="i-heroicons-table-cells"
                            size="sm"
                            variant="outline"
                            @click="exportAllToCSV"
                        >
                            Export CSV
                        </UButton>
                    </div>
                </div>
            </template>

            <!-- Contenu principal du tableau -->
            <div class="overflow-x-auto">
                <UTable
                    :columns="[
                        { key: 'title', label: 'Intitulé', sortable: true },
                        { key: 'functionalGroup', label: 'Groupe fonctionnel', sortable: true },
                        { key: 'adoptionDate', label: 'Date d\'adoption', sortable: true },
                        { key: 'effectiveDate', label: 'Entrée en vigueur', sortable: true },
                        { key: 'isPublished', label: 'Publication', sortable: true },
                        { key: 'status', label: 'Statut', sortable: true },
                        { key: 'actions', label: 'Actions' }
                    ]"
                    :rows="conventionList?.data || []"
                    :loading="conventionListStatus === 'pending'"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
                    :empty-state="{
                        icon: 'i-heroicons-document-text',
                        label: 'Aucune convention trouvée',
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
                    <!-- Colonne Intitulé -->
                    <template #title-data="{ row }">
                        <div class="flex items-center gap-3 min-w-[300px] max-w-md">
                            <div class="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                                <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div class="min-w-0">
                                <p class="font-medium text-gray-900 dark:text-white line-clamp-2">
                                    {{ row.title || 'Sans titre' }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Colonne Groupe fonctionnel -->
                    <template #functionalGroup-data="{ row }">
                        <UBadge
                            v-if="row.functionalGroup"
                            :color="getFunctionalGroupBadge(row.functionalGroup).color"
                            variant="subtle"
                            size="sm"
                        >
                            {{ getFunctionalGroupBadge(row.functionalGroup).label }}
                        </UBadge>
                        <span v-else class="text-sm text-gray-400">Non défini</span>
                    </template>

                    <!-- Colonne Date d'adoption -->
                    <template #adoptionDate-data="{ row }">
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                            {{ formatDate(row.adoptionDate) }}
                        </span>
                    </template>

                    <!-- Colonne Entrée en vigueur -->
                    <template #effectiveDate-data="{ row }">
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                            {{ formatDate(row.effectiveDate) }}
                        </span>
                    </template>

                    <!-- Colonne Publication -->
                    <template #isPublished-data="{ row }">
                        <UBadge
                            :color="row.isPublished ? 'green' : 'gray'"
                            variant="subtle"
                            size="sm"
                        >
                            <UIcon
                                :name="row.isPublished ? 'i-heroicons-globe-alt' : 'i-heroicons-eye-slash'"
                                class="w-3 h-3 mr-1"
                            />
                            {{ row.isPublished ? 'Publiée' : 'Non publiée' }}
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
                        :total="conventionList?.data?.length || 0"
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
    </div>
</template>

<style scoped></style>
