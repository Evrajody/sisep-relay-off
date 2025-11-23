export const useSdgs = () => {

    const { $sisepActiviteApi } = useNuxtApp()

    const search = ref('')
    const searchCode = ref('')
    const searchTitle = ref('')
    const current_page = ref(1)

    const columns = ref([
        {
            key: 'code',
            label: 'CODE',
            sortable: true
        },
        {
            key: 'title',
            label: 'TITRE',
            sortable: true
        },
        {
            key: 'description',
            label: 'DESCRIPTION',
            sortable: false
        },
        {
            key: 'color',
            label: 'COULEUR',
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

    const { data: sdgList, error, status: sdgListStatus, refresh: refreshSdgList } = useAsyncData<any>('sdgs', () => {

        const params: any = {
            page: current_page.value,
            limit: pageCount.value,
        }

        if (searchCode.value) {
            params.code = searchCode.value
        }

        if (searchTitle.value) {
            params.title = searchTitle.value
        }

        return $sisepActiviteApi('sdgs', {
            query: params
        })
    }, {
        deep: false,
        watch: [current_page, searchCode, searchTitle]
    })

    // Mise à jour de la pagination
    watch(sdgList, (newData: any) => {
        if (newData) {
            totalItems.value = newData.total || newData.data?.length || 0
            pageTotal.value = Math.ceil(totalItems.value / (newData.limit || pageCount.value))
            page.value = newData.page || 1
        }
    })

    return {
        search,
        searchCode,
        searchTitle,
        current_page,
        columns,
        sdgList,
        error,
        refreshSdgList,
        sdgListStatus,
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
