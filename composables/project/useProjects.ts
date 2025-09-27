
export const useProjects = () => {
    const { $sisepApi } = useNuxtApp();

    // CONFIGURATION API
    const search = ref("");
    const statusProjet = ref("");
    const selectedStatus = ref([]);

    // ELEMENTS ASSOCIE A LA PAGINATIONS
    const page = ref(1);
    const pageCount = ref(10);
    const totalItems = ref(0);
    const pageTotal = ref(0);
    const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
    const pageTo = computed(() =>
        Math.min(page.value * pageCount.value, totalItems.value),
    );

    // GESTION DES FILTRES

    const resetFilters = () => {
        search.value = "";
        statusProjet.value = "";
        selectedStatus.value = [];
    };

    // COLUMNS ASSOCIE SELON LE PROFILE
    const columns = [
        {
            key: "numero",
            label: "Numéro",
        },
        {
            key: "statutIn",
            label: "Statut",
        },
        {
            key: "createdAt",
            label: "Date de la demande",
        },

        {
            key: "actions",
            label: "Actions",
        },
    ];

    const {
        data: projectList,
        refresh: refreshProjectList,
        status: projectListStatus,
    } = useFetch(`projects`, {
        method: "GET",
        key: "auth-projets-list",
        $fetch: $sisepApi,


        onResponse: ({ response }) => {
            if (response.status != 200) {
                makeAlert({
                    title: "Oups Erreur !",
                    message: `${response._data.message}`,
                    type: "error",
                });
            } else {
                page.value = response._data.pagination.currentPage;
                totalItems.value = response._data.pagination.totalItems;
                pageTotal.value = response._data.pagination.totalPages;
            }
        },
    });

    return {
        projectList,
        refreshProjectList,
        projectListStatus,
        columns,
        search,
        selectedStatus,
        pagination: {
            page,
            pageTotal,
            pageCount,
            totalItems,
            pageFrom,
            pageTo,
        },
    };
};