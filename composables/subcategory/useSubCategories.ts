import type { SisebResponseType, SubCategory } from "~/types"

export const useSubCategories = () => {

    const { $sisepApi } = useNuxtApp()

    const search = ref('')
    const current_page = ref(1)
    const selectedStatus = ref({ value: 'all', label: 'Tous les statuts' })
    const selectedCategory = ref({ value: 'all', label: 'Toutes les catégories' })

    const columns = ref([
        {
            key: 'name',
            label: 'NOM',
            sortable: true
        },
        {
            key: 'category',
            label: 'CATÉGORIE PARENTE',
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

    const { data: subCategoryList, error, status: subCategoryListStatus, refresh: refreshSubCategoryList } = useAsyncData<SisebResponseType<SubCategory>>('subcategories', () => {

        const params: any = {
            search: search.value,
            page: current_page.value,
        }

        if (selectedStatus.value.value !== 'all') {
            params.status = selectedStatus.value.value
        }

        if (selectedCategory.value.value !== 'all') {
            params.categoryId = selectedCategory.value.value
        }

        return $sisepApi('subcategories', {
            query: params
        })
    }, {
        deep: false,
        watch: [search, current_page, selectedStatus, selectedCategory]
    })

    // Mise à jour de la pagination
    watch(subCategoryList, (newData) => {
        if (newData) {
            totalItems.value = newData.totalItems || newData.data?.length || 0
            pageTotal.value = newData.totalPages || Math.ceil(totalItems.value / pageCount.value)
        }
    })

    return {
        search,
        current_page,
        selectedStatus,
        selectedCategory,
        columns,
        subCategoryList,
        error,
        refreshSubCategoryList,
        subCategoryListStatus,
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
