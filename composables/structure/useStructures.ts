import type { SisebResponseType, Structure } from "~/types"

export const useStructures = () => {

    const { $sisepStatsApi } = useNuxtApp()

    const search = ref('')
    const current_page = ref(1)
    const selectedStatus = ref({ value: 'all', label: 'Tous les statuts' })

    const columns = ref([
        {
            key: 'label',
            label: 'LIBELLÉ',
            sortable: true
        },
        {
            key: 'abbreviation',
            label: 'ABRÉVIATION',
            sortable: true
        },
        {
            key: 'indicatorCount',
            label: 'INDICATEURS',
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

    const { data: structureList, error, status: structureListStatus, refresh: refreshStructureList } = useAsyncData<SisebResponseType<Structure>>('structures', () => {

        const params: any = {
            search: search.value,
            page: current_page.value,
        }

        if (selectedStatus.value.value !== 'all') {
            params.status = selectedStatus.value.value
        }

        return $sisepStatsApi('organisations', {
            query: params
        })
    }, {
        deep: false,
        watch: [search, current_page, selectedStatus]
    })

    // Mise à jour de la pagination
    watch(structureList, (newData) => {
        if (newData) {
            totalItems.value = newData.totalItems || newData.data?.length || 0
            pageTotal.value = newData.totalPages || Math.ceil(totalItems.value / pageCount.value)
        }
    })

    return {
        search,
        current_page,
        selectedStatus,
        columns,
        structureList,
        error,
        refreshStructureList,
        structureListStatus,
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
