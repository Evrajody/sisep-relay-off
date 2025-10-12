import type { SisebResponseType, Indicator } from "~/types"

export const useIndicators = () => {

    const { $sisepStatsApi } = useNuxtApp()

    const search = ref('')
    const current_page = ref(1)
    const selectedStatus = ref({ value: 'all', label: 'Tous les statuts' })
    const selectedCategory = ref({ value: 'all', label: 'Toutes les catégories' })
    const selectedSubCategory = ref({ value: 'all', label: 'Toutes les sous-catégories' })
    const selectedCoverage = ref({ value: 'all', label: 'Toutes les couvertures' })

    const columns = ref([
        {
            key: 'code',
            label: 'CODE',
            sortable: true
        },
        {
            key: 'label',
            label: 'LIBELLÉ',
            sortable: true
        },
        {
            key: 'category',
            label: 'CATÉGORIE',
            sortable: true
        },
        {
            key: 'subcategory',
            label: 'SOUS-CATÉGORIE',
            sortable: true
        },
        {
            key: 'coverage',
            label: 'COUVERTURE',
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

    const { data: indicatorList, error, status: indicatorListStatus, refresh: refreshIndicatorList } = useAsyncData<SisebResponseType<Indicator>>('indicators', () => {

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

        if (selectedSubCategory.value.value !== 'all') {
            params.subCategoryId = selectedSubCategory.value.value
        }

        if (selectedCoverage.value.value !== 'all') {
            params.coverage = selectedCoverage.value.value
        }

        return $sisepStatsApi('indicators', {
            query: params
        })
    }, {
        deep: false,
        watch: [search, current_page, selectedStatus, selectedCategory, selectedSubCategory, selectedCoverage]
    })

    // Mise à jour de la pagination
    watch(indicatorList, (newData) => {
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
        selectedSubCategory,
        selectedCoverage,
        columns,
        indicatorList,
        error,
        refreshIndicatorList,
        indicatorListStatus,
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
