import type { SisebResponseType, Agent } from "~/types"

export const useAgents = () => {

    const { $sisepApi } = useNuxtApp()

    const search = ref('')
    const current_page = ref(1)
    const selectedStatus = ref({ value: 'all', label: 'Tous les statuts' })
    const selectedRole = ref({ value: 'all', label: 'Tous les rôles' })
    const selectedStructure = ref({ value: 'all', label: 'Toutes les structures' })

    const columns = ref([
        {
            key: 'fullName',
            label: 'AGENT',
            sortable: true
        },
        {
            key: 'email',
            label: 'EMAIL',
            sortable: true
        },
        {
            key: 'structure',
            label: 'STRUCTURE',
            sortable: true
        },
        {
            key: 'role',
            label: 'RÔLE',
            sortable: true
        },
        {
            key: 'status',
            label: 'STATUT',
            sortable: true
        },
        {
            key: 'actions',
            label: 'ACTIONS'
        }
    ])

    // ELEMENTS ASSOCIE A LA PAGINATION
    const page = ref(1)
    const pageTotal = ref(0)
    const pageCount = ref(10)
    const totalItems = ref(0)
    const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
    const pageTo = computed(() =>
        Math.min(page.value * pageCount.value, totalItems.value)
    )

    const { data: agentList, error, status: agentListStatus, refresh: refreshAgentList } = useAsyncData<SisebResponseType<Agent>>('agents', () => {

        const params: any = {
            search: search.value,
            page: current_page.value,
        }

        if (selectedStatus.value.value !== 'all') {
            params.status = selectedStatus.value.value
        }

        if (selectedRole.value.value !== 'all') {
            params.role = selectedRole.value.value
        }

        if (selectedStructure.value.value !== 'all') {
            params.structureId = selectedStructure.value.value
        }

        return $sisepApi('agents', {
            query: params
        })
    }, {
        deep: false,
        watch: [search, current_page, selectedStatus, selectedRole, selectedStructure]
    })

    // Mise à jour de la pagination
    watch(agentList, (newData) => {
        if (newData) {
            totalItems.value = newData.totalItems || newData.data?.length || 0
            pageTotal.value = newData.totalPages || Math.ceil(totalItems.value / pageCount.value)
        }
    })

    return {
        search,
        current_page,
        selectedStatus,
        selectedRole,
        selectedStructure,
        columns,
        agentList,
        error,
        refreshAgentList,
        agentListStatus,
        pagination: {
            page,
            pageTotal,
            pageCount,
            totalItems,
            pageFrom,
            pageTo,
        },
    }
}
