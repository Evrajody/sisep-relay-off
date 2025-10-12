import type { SisebResponseType } from "~/types"

export interface Location {
    id: string
    name: string
    level: string
    code: string
    parentCode?: string
    description?: string
    parentId?: string
}

export const useLocations = () => {

    const { $sisepStatsApi } = useNuxtApp()

    const search = ref('')
    const current_page = ref(1)
    const selectedLevel = ref({ value: 'all', label: 'Tous les niveaux' })

    const columns = ref([
        {
            key: 'name',
            label: 'NOM',
            sortable: true
        },
        {
            key: 'code',
            label: 'CODE',
            sortable: true
        },
        {
            key: 'level',
            label: 'NIVEAU',
            sortable: true
        },
        {
            key: 'parentCode',
            label: 'CODE PARENT',
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

    const { data: locationList, error, status: locationListStatus, refresh: refreshLocationList } = useAsyncData<SisebResponseType<Location>>('locations', () => {

        const params: any = {
            search: search.value,
            page: current_page.value,
        }

        if (selectedLevel.value.value !== 'all') {
            params.level = selectedLevel.value.value
        }

        return $sisepStatsApi('locations', {
            query: params
        })
    }, {
        deep: false,
        watch: [search, current_page, selectedLevel]
    })

    // Mise à jour de la pagination
    watch(locationList, (newData) => {
        if (newData) {
            totalItems.value = newData.totalItems || newData.data?.length || 0
            pageTotal.value = newData.totalPages || Math.ceil(totalItems.value / pageCount.value)
        }
    })

    return {
        search,
        current_page,
        selectedLevel,
        columns,
        locationList,
        error,
        refreshLocationList,
        locationListStatus,
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
