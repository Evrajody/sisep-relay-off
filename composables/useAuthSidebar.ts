export const useAuthSidebar = () => {

    // CONFIGURATION
    const runtimeConfig = useRuntimeConfig();

    // ROUTER
    const router = useRouter();

    const featureChecker = (
        features : any,
        authorizedFeatures: string[],
    ) => {
        return features.filter((el: any) => {
            if (authorizedFeatures.includes(el.id)) {
                if (el.children) {
                    el.children = el.children.filter((child) =>
                        authorizedFeatures.includes(child.id),
                    );
                }
                return true;
            }
            return false;
        });
    };

    // COMPLETE SIDEBAR
    const sidebarElements = ([
        {
            id: "dashboard",
            label: "Tableau de bord",
            icon: "i-heroicons-rectangle-group-20-solid",
            to: {name: 'admin-project-module-dashboard'},
            tooltip: {
                text: "Consulter les statistiques",
            },
        },

        {
            id: "projects",
            label: "Gestion des projets",
            chip: "-",
            icon: "i-heroicons-document-duplicate-solid",
            children: [

                {
                    id: "listes-project",
                    label: "Liste des projets",
                    to: {name: 'admin-project-module'},
                    tooltip: {text: "Liste des projets"},
                },

                {
                    id: "new-project",
                    label: "Nouveau projet",
                    tooltip: {text: "Creer un nouveau projet"},
                    to: { name: "admin-project-module-create-project" },
                },

            ],
        },

        // {
        //     id: "types-projet",
        //     label: "Type de projets",
        //     icon: "i-heroicons-megaphone",
        //     to: { name: "admin-project-module-types-projects" },
        // },
        //
        // {
        //     id: "categories",
        //     label: "Catégories",
        //     icon: "i-heroicons-square-3-stack-3d",
        //     to: { name: "admin-project-module-categories" },
        // },
        //
        // {
        //     id: "subcategories",
        //     label: "Sous-catégories",
        //     icon: "i-heroicons-queue-list",
        //     to: { name: "admin-project-module-subcategories" },
        // },
        //
        // {
        //     id: "sectors",
        //     label: "Secteurs",
        //     icon: "i-heroicons-squares-plus",
        //     to: { name: "admin-project-module-sectors" },
        // },
        //
        // {
        //     id: "locations",
        //     label: "Localisations",
        //     icon: "i-heroicons-map-pin",
        //     to: { name: "admin-project-module-locations" },
        // },
        //
        // {
        //     id: "indicators",
        //     label: "Indicateurs",
        //     icon: "i-heroicons-chart-bar-square",
        //     to: { name: "admin-project-module-indicators" },
        // },
        //
        // {
        //     id: "structures",
        //     label: "Structures",
        //     icon: "i-heroicons-building-office-2",
        //     to: { name: "admin-project-module-structures" },
        // },
        //
        // {
        //     id: "agents",
        //     label: "Agents",
        //     icon: "i-heroicons-users",
        //     to: { name: "admin-project-module-agents" },
        // },
        //
        // {
        //     id: "conventions",
        //     label: "Conventions",
        //     icon: "i-heroicons-document-text",
        //     to: { name: "admin-project-module-conventions" },
        // },
    ]);

    // RECUPERE UTILISATEUR EN COURS

    // const { data } = useAuth();

    // GENERE LA SIDEBAR ASSOCIE AU PROFILE ACTUEL

    const sidebarAuthorized = computed(() => {
        return sidebarElements;
    });

    return {
        sidebarAuthorized,
    };
};
