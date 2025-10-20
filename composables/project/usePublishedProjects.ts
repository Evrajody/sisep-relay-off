/**
 * Composable pour récupérer les projets publiés (status = PUBLISHED)
 * Utilisé principalement pour l'affichage public sur la page d'accueil
 */
export const usePublishedProjects = () => {

    const { $sisepApi } = useNuxtApp();

    // Configuration pour les projets publiés
    const limit = ref(10); // Nombre de projets à récupérer
    const randomSeed = ref(Date.now()); // Pour mélanger les résultats

    /**
     * Fonction pour mélanger un tableau de manière aléatoire (Fisher-Yates shuffle)
     */
    const shuffleArray = <T>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Récupération des projets publiés
    const {
        data: publishedProjectsData,
        refresh: refreshPublishedProjects,
        status: publishedProjectsStatus,
        error: publishedProjectsError,
    } = useFetch(`projects`, {
        method: "GET",
        key: "published-projects-list",
        $fetch: $sisepApi,
        query: computed(() => ({
            status: "PUBLISHED",
            limit: limit.value,
            page: 1,
        })),
        transform: (response: any) => {
            // Mélanger les projets de manière aléatoire
            if (response?.data && Array.isArray(response.data)) {
                return {
                    ...response,
                    data: shuffleArray(response.data),
                };
            }
            return response;
        },
    });

    // Computed pour obtenir la liste des projets
    const publishedProjects = computed(() => {
        return publishedProjectsData.value?.data || [];
    });

    // Computed pour obtenir les informations de pagination
    const pagination = computed(() => {
        return publishedProjectsData.value?.pagination || {
            currentPage: 1,
            totalItems: 0,
            totalPages: 0,
        };
    });

    // Fonction pour rafraîchir avec un nouvel ordre aléatoire
    const shuffleProjects = () => {
        randomSeed.value = Date.now();
        refreshPublishedProjects();
    };

    return {
        publishedProjects,
        publishedProjectsStatus,
        publishedProjectsError,
        pagination,
        refreshPublishedProjects,
        shuffleProjects,
        limit,
    };
};
