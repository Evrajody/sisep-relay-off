export const useActivities = () => {

    const { $sisepActiviteApi } = useNuxtApp()

    const search = ref('')
    const current_page = ref(1)
    const selectedConvention = ref({ value: 'all', label: 'Toutes les conventions' })
    const selectedStatus = ref({ value: 'all', label: 'Tous les statuts' })
    const sortOrder = ref('desc')

    const columns = ref([
        {
            key: 'nature',
            label: 'NATURE',
            sortable: true
        },
        {
            key: 'convention',
            label: 'CONVENTION',
            sortable: true
        },
        {
            key: 'description',
            label: 'DESCRIPTION',
            sortable: false
        },
        {
            key: 'status',
            label: 'STATUT',
            sortable: true
        },
        {
            key: 'createdAt',
            label: 'DATE DE CRÉATION',
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

    const { data: activityList, error, status: activityListStatus, refresh: refreshActivityList } = useAsyncData<any>('activities', () => {

        const params: any = {
            search: search.value,
            page: current_page.value,
            limit: pageCount.value,
            sortOrder: sortOrder.value
        }

        if (selectedConvention.value.value !== 'all') {
            params.conventionId = selectedConvention.value.value
        }

        if (selectedStatus.value.value !== 'all') {
            params.status = selectedStatus.value.value
        }

        return $sisepActiviteApi('activities', {
            query: params
        })
    }, {
        deep: false,
        watch: [search, current_page, selectedConvention, selectedStatus, sortOrder]
    })

    // Mise à jour de la pagination
    watch(activityList, (newData: any) => {
        if (newData) {
            totalItems.value = newData.total || newData.data?.length || 0
            pageTotal.value = Math.ceil(totalItems.value / (newData.limit || pageCount.value))
            page.value = newData.page || 1
        }
    })

    return {
        search,
        current_page,
        selectedConvention,
        selectedStatus,
        sortOrder,
        columns,
        activityList,
        error,
        refreshActivityList,
        activityListStatus,
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
