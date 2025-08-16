import type { Project, SisebResponseType, TypeProject } from "~/types"

export const useProjects = () => {

    const { $sisepApi } = useNuxtApp()

    const search = ref('')
    const current_page = ref(1)
    const columns = ref([
        {
            key: 'id',
            label: 'PROJET',
            class: ""
        },
        {
            key: 'action',
            label: 'ACTION',
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


    const { data: projets, error, status: projetsStatus, refresh: refreshProjets } = useAsyncData <SisebResponseType <Project> > ('projets', () => {

        return $sisepApi('projects/not-deleted', {
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
        projets,
        error,
        refreshProjets,
        projetsStatus,
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