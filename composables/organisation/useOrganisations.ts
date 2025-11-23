export interface Organisation {
    id: string
    code: string
    name: string
    description?: string | null
    parentId?: string | null
    createdAt?: string
    updatedAt?: string
    deletedAt?: string | null
}

export interface OrganisationResponse {
    categories: Organisation[]
    pagination: {
        total: number
        pages: number
        currentPage: number
        hasNext: boolean
        hasPrev: boolean
    }
}

export const useOrganisations = () => {

    const { $sisepStatsApi } = useNuxtApp()

    const search = ref('')
    const current_page = ref(1)
    const selectedStatus = ref({ value: 'all', label: 'Tous les statuts' })

    const columns = ref([
        {
            key: 'code',
            label: 'CODE',
            sortable: true
        },
        {
            key: 'name',
            label: 'NOM',
            sortable: true
        },
        {
            key: 'description',
            label: 'DESCRIPTION',
            sortable: false
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

    const { data: organisationList, error, status: organisationListStatus, refresh: refreshOrganisationList } = useAsyncData<OrganisationResponse>('organisations', () => {

        const params: any = {
            search: search.value,
            page: current_page.value,
        }

        return $sisepStatsApi('organisations', {
            query: params
        })
    }, {
        deep: false,
        watch: [search, current_page, selectedStatus]
    })

    // Mise à jour de la pagination
    watch(organisationList, (newData) => {
        if (newData?.pagination) {
            totalItems.value = newData.pagination.total || 0
            pageTotal.value = newData.pagination.pages || 1
            page.value = newData.pagination.currentPage || 1
        }
    })

    return {
        search,
        current_page,
        selectedStatus,
        columns,
        organisationList,
        error,
        refreshOrganisationList,
        organisationListStatus,
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
