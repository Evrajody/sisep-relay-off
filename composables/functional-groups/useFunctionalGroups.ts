export const useFunctionalGroups = () => {

    const { $sisepActiviteApi } = useNuxtApp()

    const search = ref('')
    const current_page = ref(1)

    const columns = ref([
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

    const { data: functionalGroupList, error, status: functionalGroupListStatus, refresh: refreshFunctionalGroupList } = useAsyncData<any>('functional-groups', () => {

        const params: any = {
            search: search.value,
            page: current_page.value,
            limit: pageCount.value,
        }

        return $sisepActiviteApi('functional-groups', {
            query: params
        })
    }, {
        deep: false,
        watch: [search, current_page]
    })

    // Mise à jour de la pagination
    watch(functionalGroupList, (newData: any) => {
        if (newData) {
            totalItems.value = newData.total || newData.data?.length || 0
            pageTotal.value = Math.ceil(totalItems.value / (newData.limit || pageCount.value))
            page.value = newData.page || 1
        }
    })

    return {
        search,
        current_page,
        columns,
        functionalGroupList,
        error,
        refreshFunctionalGroupList,
        functionalGroupListStatus,
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
