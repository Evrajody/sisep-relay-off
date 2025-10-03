<script lang="ts" setup>
import { useAgents } from "~/composables/agent/useAgents";
import { useDeleteAgent } from "~/composables/agent/useDeleteAgent";
import type { Agent } from "~/types";

definePageMeta({
    layout: "sisep-app-layout",
});

const links = [
    {
        label: "Agents",
        icon: "i-heroicons-users",
    },
];

useHead({
    title: "Liste des agents",
});

// Chargement de la liste des agents
const {
    search,
    current_page,
    selectedStatus,
    selectedRole,
    selectedStructure,
    columns,
    agentList,
    pagination,
    error,
    agentListStatus,
    refreshAgentList
} = useAgents();

// Logique de suppression
const { deleteAgent, isDeleting } = useDeleteAgent();

const page = ref(1);
const pageCount = ref(10);
const sort = ref({ column: 'fullName', direction: 'asc' as const });

// Options de statut pour le filtre
const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'ACTIVE', label: 'Actif' },
    { value: 'INACTIVE', label: 'Inactif' },
];

// Options de rôles pour le filtre
const roles = [
    { value: 'all', label: 'Tous les rôles' },
    { value: 'POINT_FOCAL', label: 'Point focal' },
    { value: 'VALIDATEUR', label: 'Validateur' },
    { value: 'SUPERVALIDATEUR', label: 'Supervalidateur' },
    { value: 'PRC', label: 'PRC' },
    { value: 'MINISTRE', label: 'Ministre' },
];

// Chargement des structures pour le filtre
const { data: structures } = await useAsyncData('structures-filter-agents', () =>
    $fetch('/api/structures')
);

const structureFilterOptions = computed(() => {
    const allOption = { value: 'all', label: 'Toutes les structures' };
    if (!structures.value?.data) return [allOption];
    return [
        allOption,
        ...structures.value.data.map((struct: any) => ({
            value: struct.id,
            label: `${struct.label} (${struct.abbreviation})`
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

// Fonction de suppression d'un agent
const handleDeleteAgent = async (row: Agent) => {
    const success = await deleteAgent(row.id, row.firstName, row.lastName);
    if (success) {
        await refreshAgentList();
    }
};

// Actions disponibles pour chaque agent
const getActions = (row: Agent) => [
    {
        label: 'Modifier',
        icon: 'i-heroicons-pencil-square',
        click: () => navigateTo(`/project-module/agents/edit/${row.id}`)
    },
    {
        label: 'Supprimer',
        icon: 'i-heroicons-trash',
        click: () => handleDeleteAgent(row)
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

// Configuration des badges de rôle
const getRoleBadge = (role: string) => {
    const roleMap: Record<string, { color: string, label: string }> = {
        'POINT_FOCAL': { color: 'blue', label: 'Point focal' },
        'VALIDATEUR': { color: 'purple', label: 'Validateur' },
        'SUPERVALIDATEUR': { color: 'orange', label: 'Supervalidateur' },
        'PRC': { color: 'indigo', label: 'PRC' },
        'MINISTRE': { color: 'red', label: 'Ministre' },
    };
    return roleMap[role] || { color: 'gray', label: 'Inconnu' };
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
                to="/project-module/agents/create"
                color="primary"
                icon="i-heroicons-plus"
                label="Nouvel agent"
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
                Liste des agents
            </template>

            <template #description>
                <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> agent(s) au total
            </template>

            <!-- En-tête avec filtres -->
            <template #header>
                <div class="flex w-full flex-col gap-4">
                    <!-- Première ligne de filtres -->
                    <div class="flex flex-col lg:flex-row gap-4">
                        <UInput
                            v-model="search"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Rechercher un agent (nom, prénom ou email)..."
                            class="flex-1"
                            size="lg"
                            :ui="{
                                icon: { trailing: { pointer: '' } },
                                size: { lg: 'text-base' }
                            }"
                            @keyup.enter="refreshAgentList"
                        >
                            <template #trailing>
                                <UButton
                                    v-if="search"
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark"
                                    size="xs"
                                    @click="search = ''; refreshAgentList()"
                                />
                            </template>
                        </UInput>

                        <UButton
                            to="/project-module/agents/create"
                            color="primary"
                            icon="i-heroicons-plus"
                            label="Nouvel agent"
                            size="lg"
                            class="w-full lg:w-auto"
                        />
                    </div>

                    <!-- Deuxième ligne de filtres -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <USelectMenu
                            v-model="selectedStructure"
                            :options="structureFilterOptions"
                            option-attribute="label"
                            placeholder="Toutes les structures"
                            size="sm"
                            :ui="{
                                size: { sm: 'text-sm' }
                            }"
                            @update:modelValue="refreshAgentList"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-building-office-2" class="h-4 w-4" />
                            </template>
                        </USelectMenu>

                        <USelectMenu
                            v-model="selectedRole"
                            :options="roles"
                            option-attribute="label"
                            placeholder="Tous les rôles"
                            size="sm"
                            :ui="{
                                size: { sm: 'text-sm' }
                            }"
                            @update:modelValue="refreshAgentList"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-user-circle" class="h-4 w-4" />
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
                            @update:modelValue="refreshAgentList"
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
                        { key: 'fullName', label: 'Agent', sortable: true },
                        { key: 'email', label: 'Email', sortable: true },
                        { key: 'structure', label: 'Structure', sortable: true },
                        { key: 'role', label: 'Rôle', sortable: true },
                        { key: 'status', label: 'Statut', sortable: true },
                        { key: 'actions', label: 'Actions' }
                    ]"
                    :rows="agentList?.data || []"
                    :loading="agentListStatus === 'pending'"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Chargement...' }"
                    :empty-state="{
                        icon: 'i-heroicons-users',
                        label: 'Aucun agent trouvé',
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
                    <!-- Colonne Agent -->
                    <template #fullName-data="{ row }">
                        <div class="flex items-center gap-3 min-w-[200px]">
                            <UAvatar
                                :alt="`${row.firstName} ${row.lastName}`"
                                size="md"
                                :ui="{ size: { 'md': 'h-10 w-10 text-sm' } }"
                            />
                            <div class="min-w-0">
                                <p class="font-medium text-gray-900 dark:text-white">
                                    {{ row.firstName }} {{ row.lastName }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Colonne Email -->
                    <template #email-data="{ row }">
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-gray-400" />
                            <span class="text-sm text-gray-600 dark:text-gray-400">
                                {{ row.email }}
                            </span>
                        </div>
                    </template>

                    <!-- Colonne Structure -->
                    <template #structure-data="{ row }">
                        <div v-if="row.structure" class="flex items-center gap-2">
                            <div class="p-1.5 bg-teal-50 dark:bg-teal-950/30 rounded">
                                <UIcon name="i-heroicons-building-office-2" class="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div class="min-w-0">
                                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {{ row.structure.abbreviation }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                    {{ row.structure.label }}
                                </p>
                            </div>
                        </div>
                        <span v-else class="text-sm text-gray-400">Non assigné</span>
                    </template>

                    <!-- Colonne Rôle -->
                    <template #role-data="{ row }">
                        <UBadge
                            :color="getRoleBadge(row.role).color"
                            variant="subtle"
                            size="sm"
                        >
                            {{ getRoleBadge(row.role).label }}
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
                                :loading="agentListStatus === 'pending'"
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
                        <span class="font-medium">{{ pagination.totalItems }}</span> agent(s)
                    </div>

                    <UPagination
                        v-model="page"
                        :page-count="pageCount"
                        :total="agentList?.data?.length || 0"
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
