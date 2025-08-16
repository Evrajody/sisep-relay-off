import type { SisebResponseType, TypeProject } from "~/types"

export const useTypeProjects = () => {

    const { $sisepApi } = useNuxtApp()

    const search = ref('')
    const current_page = ref(1)
    const columns = ref([
        {
            key: 'id',
            label: 'ID',
            class: ""
        },
        {
            key: 'name',
            label: 'NOM',
            class: ""
        },
        {
            key: 'description',
            label: 'DESCRIPTION',
            class: ""
        },
    ])

    // ELEMENTS ASSOCIE A LA PAGINATIONS
    const page = ref(1);
    const pageTotal = ref(0);
    const pageCount = ref(10);
    const totalItems = ref(10);
    const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
    const pageTo = computed(() =>
        Math.min(page.value * pageCount.value, pageTotal.value),
    );


    const { data: typeProjets, error, status: typeProjetsStatus, refresh: refreshTypeProjets } = useAsyncData <SisebResponseType <TypeProject> > ('types-projets', () => {

        return $sisepApi('project-types/not-deleted', {
            query: {
                search: search.value,
                page: current_page.value,
            }
        } )
    }, {
        deep: false,
        watch: [search, current_page]
    } )


    return {
        search,
        current_page,
        columns,
        typeProjets,
        error,
        refreshTypeProjets,
        typeProjetsStatus,
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