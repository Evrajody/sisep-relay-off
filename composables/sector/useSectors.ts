import type { SisebResponseType } from "~/types"

export interface Sector {
    id: string
    parentId?: string
    artefactId?: string
    artefact: {
        artefactId?: string
        agencyId?: string
        version: string
        uri?: string
        urn?: string
        isFinal?: boolean
        isExternal?: boolean
        validFrom?: string
        validTo?: string
        structureUrl?: string
        serviceUrl?: string
        isPartial?: boolean
        nameJson?: Record<string, any>
        identifier: string
        descriptionJson?: Record<string, any>
    }
}

export const useSectors = () => {

    const { $sisepStatsApi } = useNuxtApp()

    const search = ref('')
    const current_page = ref(1)

    const columns = ref([
        {
            key: 'identifier',
            label: 'IDENTIFIANT',
            sortable: true
        },
        {
            key: 'version',
            label: 'VERSION',
            sortable: true
        },
        {
            key: 'agencyId',
            label: 'AGENCE',
            sortable: true
        },
        {
            key: 'status',
            label: 'STATUT',
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

    const { data: sectorList, error, status: sectorListStatus, refresh: refreshSectorList } = useAsyncData<SisebResponseType<Sector>>('sectors', () => {

        const params: any = {
            search: search.value,
            page: current_page.value,
        }

        return $sisepStatsApi('sectors', {
            query: params
        })
    }, {
        deep: false,
        watch: [search, current_page]
    })

    // Mise à jour de la pagination
    watch(sectorList, (newData) => {
        if (newData) {
            totalItems.value = newData.totalItems || newData.data?.length || 0
            pageTotal.value = newData.totalPages || Math.ceil(totalItems.value / pageCount.value)
        }
    })

    return {
        search,
        current_page,
        columns,
        sectorList,
        error,
        refreshSectorList,
        sectorListStatus,
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
