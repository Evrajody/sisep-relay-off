import type { SisebResponseType, Convention, FunctionalGroup } from "~/types"

export const useConventions = () => {

    const { $sisepActiviteApi } = useNuxtApp()

    const search = ref('')
    const current_page = ref(1)
    const selectedStatus = ref({ value: 'all', label: 'Tous les statuts' })
    const selectedFunctionalGroup = ref({ value: 'all', label: 'Tous les groupes' })
    const selectedPublicationStatus = ref({ value: 'all', label: 'Tous' })

    const columns = ref([
        {
            key: 'title',
            label: 'INTITULÉ',
            sortable: true
        },
        {
            key: 'functionalGroup',
            label: 'GROUPE FONCTIONNEL',
            sortable: true
        },
        {
            key: 'adoptionDate',
            label: 'DATE D\'ADOPTION',
            sortable: true
        },
        {
            key: 'effectiveDate',
            label: 'ENTRÉE EN VIGUEUR',
            sortable: true
        },
        {
            key: 'isPublished',
            label: 'PUBLICATION',
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

    const { data: conventionList, error, status: conventionListStatus, refresh: refreshConventionList } = useAsyncData<SisebResponseType<Convention>>('conventions', () => {

        const params: any = {
            search: search.value,
            page: current_page.value,
        }

        if (selectedStatus.value.value !== 'all') {
            params.status = selectedStatus.value.value
        }

        if (selectedFunctionalGroup.value.value !== 'all') {
            params.functionalGroup = selectedFunctionalGroup.value.value
        }

        if (selectedPublicationStatus.value.value !== 'all') {
            params.isPublished = selectedPublicationStatus.value.value === 'published'
        }

        return $sisepActiviteApi('conventions', {
            query: params
        })
    }, {
        deep: false,
        watch: [search, current_page, selectedStatus, selectedFunctionalGroup, selectedPublicationStatus]
    })

    // Mise à jour de la pagination
    watch(conventionList, (newData: any) => {
        if (newData) {
            totalItems.value = newData.total || newData.data?.length || 0
            pageTotal.value = Math.ceil(totalItems.value / (newData.limit || pageCount.value))
            page.value = newData.page || 1
        }
    })

    return {
        search,
        current_page,
        selectedStatus,
        selectedFunctionalGroup,
        selectedPublicationStatus,
        columns,
        conventionList,
        error,
        refreshConventionList,
        conventionListStatus,
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
