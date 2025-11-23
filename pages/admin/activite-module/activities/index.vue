<script lang="ts" setup>
import { useActivities } from "~/composables/activities/useActivities";
import { useCreateActivity } from "~/composables/activities/useCreateActivity";
import { useUpdateActivity } from "~/composables/activities/useUpdateActivity";
import { useDeleteActivity } from "~/composables/activities/useDeleteActivity";

definePageMeta({
    layout: "sisep-app-layout",
});

const links = [
    {
        label: "Activités",
        icon: "i-heroicons-calendar-days",
    },
];

useHead({
    title: "Liste des activités",
});

// Chargement de la liste des activités
const {
    search,
    current_page,
    selectedConvention,
    selectedStatus,
    activityList,
    pagination,
    activityListStatus,
    refreshActivityList
} = useActivities();

// Logique de création d'activités
const {
    createActivityFormEl,
    createActivityForm,
    isModalCreateActivityOpen,
    toggleModalCreateActivity
} = useCreateActivity(refreshActivityList);

// Logique de mise à jour d'activités
const {
    updateActivityFormEl,
    updateActivityForm,
    isModalUpdateActivityOpen,
    toggleModalUpdateActivity,
    openUpdateModal,
    currentActivity
} = useUpdateActivity(refreshActivityList);

// Logique de suppression
const { deleteActivity } = useDeleteActivity();

// Typage pour les refs Vueform
const createFormEl = createActivityFormEl as Ref<any>
const updateFormEl = updateActivityFormEl as Ref<any>

const page = ref(1);
const pageCount = ref(10);
const sort = ref({ column: 'createdAt', direction: 'desc' as const });

// Options de statut pour le filtre
const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'DRAFT', label: 'Brouillon' },
    { value: 'PUBLISHED', label: 'Publié' },
    { value: 'ARCHIVED', label: 'Archivé' },
];

// Gestion du changement de page
const onPageChange = (newPage: number) => {
    page.value = newPage;
    current_page.value = newPage;
};

// Gestion du tri
const onSort = (e: { column: string; direction: 'asc' | 'desc' }) => {
    sort.value = e as { column: string; direction: 'desc' };
};

// Fonction de suppression d'une activité
const handleDeleteActivity = async (row: any) => {
    const success = await deleteActivity(row.id, row.nature);
    if (success) {
        await refreshActivityList();
    }
};

// Actions disponibles pour chaque activité
const getActions = (row: any) => [
    {
        label: 'Modifier',
        icon: 'i-heroicons-pencil-square',
        click: () => openUpdateModal(row)
    },
    {
        label: 'Supprimer',
        icon: 'i-heroicons-trash',
        click: () => handleDeleteActivity(row)
    }
];

// Configuration des badges de statut
type BadgeColor = 'green' | 'gray' | 'red' | 'yellow' | 'blue' | 'indigo' | 'purple' | 'pink' | 'orange' | 'teal' | 'cyan' | 'white' | 'black' | 'primary'
const getStatusBadge = (status: string): { color: BadgeColor, label: string } => {
    const statusMap: Record<string, { color: BadgeColor, label: string }> = {
        'DRAFT': { color: 'yellow', label: 'Brouillon' },
        'PUBLISHED': { color: 'green', label: 'Publié' },
        'ARCHIVED': { color: 'gray', label: 'Archivé' },
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
                label="Nouvelle activité"
                size="sm"
                @click="toggleModalCreateActivity"
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
                Liste des activités
            </template>

            <template #description>
                <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> activité(s) au total
            </template>

            <!-- En-tête avec filtres -->
            <template #header>
                <div class="flex w-full flex-col gap-4">
                    <!-- Première ligne de filtres -->
                    <div class="flex flex-col lg:flex-row gap-4">
                        <UInput
                            v-model="search"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Rechercher une activité (nature, description)..."
                            class="flex-1"
                            size="lg"
                            :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                            @keyup.enter="refreshActivityList"
                        >
                            <template #trailing>
                                <UButton
                                    v-if="search"
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark"
                                    size="xs"
                                    @click="search = ''; refreshActivityList()"
                                />
                            </template>
                        </UInput>

                        <UButton
                            color="primary"
                            icon="i-heroicons-plus"
                            label="Nouvelle activité"
                            size="lg"
                            class="w-full lg:w-auto"
                            @click="toggleModalCreateActivity"
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
                            @update:modelValue="refreshActivityList"
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
                        { key: 'nature', label: 'Nature', sortable: true },
                        { key: 'convention', label: 'Convention', sortable: true },
                        { key: 'description', label: 'Description', sortable: false },
                        { key: 'status', label: 'Statut', sortable: true },
                        { key: 'createdAt', label: 'Date de création', sortable: true },
                        { key: 'actions', label: 'Actions' }
                    ]"
                    :rows="activityList?.data || []"
                    :loading="activityListStatus === 'pending'"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
                    :empty-state="{
                        icon: 'i-heroicons-calendar-days',
                        label: 'Aucune activité trouvée',
                    }"
                    class="w-full"
                    :ui="{
                        td: { base: 'whitespace-nowrap' },
                        th: { base: 'whitespace-nowrap' }
                    }"
                    v-model:sort="sort"
                    @update:sort="onSort"
                >
                    <!-- Colonne Nature -->
                    <template #nature-data="{ row }">
                        <div class="flex items-center gap-3 min-w-[150px]">
                            <div class="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div class="min-w-0">
                                <p class="font-medium text-gray-900 dark:text-white text-sm">
                                    {{ row.nature || 'Sans nature' }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Colonne Convention -->
                    <template #convention-data="{ row }">
                        <div v-if="row.convention" class="flex items-center gap-2 max-w-xs">
                            <div class="p-1.5 rounded bg-indigo-50 dark:bg-indigo-950/30">
                                <UIcon
                                    name="i-heroicons-document-text"
                                    class="w-4 h-4 text-indigo-600 dark:text-indigo-400"
                                />
                            </div>
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                {{ row.convention?.title || row.convention }}
                            </span>
                        </div>
                        <span v-else class="text-sm text-gray-400">-</span>
                    </template>

                    <!-- Colonne Description -->
                    <template #description-data="{ row }">
                        <div class="max-w-xs">
                            <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
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
                                :loading="activityListStatus === 'pending'"
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
                        <span class="font-medium">{{ pagination.totalItems }}</span> activité(s)
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
            v-model="isModalCreateActivityOpen"
            title="Création d'une nouvelle activité"
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
            icon="i-heroicons-calendar-days"
            prevent-close
        >
            <div class="w-full p-4 max-h-[70vh] overflow-y-auto">
                <Vueform ref="createActivityFormEl" v-bind="createActivityForm" />
            </div>

            <template #footer>
                <div class="flex justify-end gap-3 p-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        label="Annuler"
                        size="lg"
                        @click.prevent="toggleModalCreateActivity"
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
            v-model="isModalUpdateActivityOpen"
            title="Modifier l'activité"
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
                    v-if="currentActivity"
                    ref="updateActivityFormEl"
                    v-bind="updateActivityForm"
                    :key="currentActivity.id"
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
                        @click.prevent="toggleModalUpdateActivity"
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
