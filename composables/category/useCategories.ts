import type { SisebResponseType, Category } from "~/types"

export const useCategories = () => {

    const { $sisepApi } = useNuxtApp()

    const search = ref('')
    const current_page = ref(1)
    const selectedStatus = ref({ value: 'all', label: 'Tous les statuts' })

    const columns = ref([
        {
            key: 'name',
            label: 'NOM',
            sortable: true
        },
        {
            key: 'description',
            label: 'DESCRIPTION',
            sortable: true
        },
        {
            key: 'status',
            label: 'STATUT',
            sortable: true
        },
        {
            key: 'projectCount',
            label: 'PROJETS'
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

    const { data: categoryList, error, status: categoryListStatus, refresh: refreshCategoryList } = useAsyncData<SisebResponseType<Category>>('categories', () => {

        const params: any = {
            search: search.value,
            page: current_page.value,
        }

        if (selectedStatus.value.value !== 'all') {
            params.status = selectedStatus.value.value
        }

        return $sisepApi('categories', {
            query: params
        })
    }, {
        deep: false,
        watch: [search, current_page, selectedStatus]
    })

    // Mise à jour de la pagination
    watch(categoryList, (newData) => {
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
        categoryList,
        error,
        refreshCategoryList,
        categoryListStatus,
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
