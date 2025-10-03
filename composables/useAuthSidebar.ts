export const useAuthSidebar = () => {

    // CONFIGURATION
    const runtimeConfig = useRuntimeConfig();

    //ROUTER
    const router = useRouter();

    const featureChecker = (
        features,
        authorizedFeatures: string[],
    ) => {
        return features.filter((el) => {
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
            to: {name: 'project-module-dashboard'},
            tooltip: {
                text: "Consulter les statistiques",
            },
        },

        {
            id: "projects",
            label: "Projets",
            chip: "-",
            icon: "i-heroicons-document-duplicate-solid",
            children: [

                {
                    id: "listes-project",
                    label: "Projets",
                    to: {name: 'project-module'},
                    tooltip: {text: "Liste des projets"},
                },

                {
                    id: "new-project",
                    label: "Nouveau projet",
                    tooltip: {text: "Creer un nouveau projet"},
                    to: { name: "project-module-create-project" },
                },

            ],
        },

        {
            id: "types-projet",
            label: "Type de projets",
            icon: "i-heroicons-megaphone",
            to: { name: "project-module-types-projects" },
        },

        {
            id: "categories",
            label: "Catégories",
            icon: "i-heroicons-square-3-stack-3d",
            to: { name: "project-module-categories" },
        },

        {
            id: "subcategories",
            label: "Sous-catégories",
            icon: "i-heroicons-queue-list",
            to: { name: "project-module-subcategories" },
        },

        {
            id: "indicators",
            label: "Indicateurs",
            icon: "i-heroicons-chart-bar-square",
            to: { name: "project-module-indicators" },
        },

        {
            id: "structures",
            label: "Structures",
            icon: "i-heroicons-building-office-2",
            to: { name: "project-module-structures" },
        },

        {
            id: "agents",
            label: "Agents",
            icon: "i-heroicons-users",
            to: { name: "project-module-agents" },
        },

        {
            id: "conventions",
            label: "Conventions",
            icon: "i-heroicons-document-text",
            to: { name: "project-module-conventions" },
        },
    ]);

    // RECUPERE UTILISATEUR EN COURS

    // const { data } = useAuth();

    // GENERE LA SIDEBAR ASSOCIE AU PROFILE ACTUEL

    const sidebarAuthorized = computed(() => {

        // let sidebarElement = [...sidebarElements.value];

        // switch (data.value?.user?.role.libelle) {
        //   // PROFILE ADMIN
        //   case PermisRoles.admin:
        //     const authorizedFeatures = [
        //       "dashboard",
        //       "demandes",
        //       "permis-visites",
        //       "permis-communiquer",
        //       "laisser-passer",
        //       "agrements",
        //       "autorisation-acces",
        //       "autorisation-visite",
        //       "badge",
        //       "utilisateurs",
        //       "huissier",
        //       "avocats",
        //       "problemes",
        //     ];
        //
        //     sidebarElement = featureChecker(sidebarElement, authorizedFeatures);
        //
        //     break;
        //
        //   // PROFILE GARDE DES SCEAUX SUPREME DE LA PLATEFORME
        //
        //   case PermisRoles.gs:
        //     sidebarElement = featureChecker(sidebarElement, [
        //       "dashboard",
        //       "demandes",
        //       "permis-visites",
        //       "permis-communiquer",
        //       "laisser-passer",
        //       "agrements",
        //       "autorisation-acces",
        //       "autorisation-visite",
        //       "badge",
        //       "liste-rouges",
        //       "list-red-items",
        //       "demandes-visas",
        //       "emissions",
        //       "emit-permis-communiquer",
        //     ]);
        //
        //     break;
        //
        //   // PROFILE DGAPB SUPREME DE LA PLATEFORME
        //
        //   case PermisRoles.dgapb:
        //     sidebarElement = featureChecker(sidebarElement, [
        //       "dashboard",
        //       "demandes",
        //       "permis-visites",
        //       "permis-communiquer",
        //       "laisser-passer",
        //       "agrements",
        //       "autorisation-acces",
        //       "autorisation-visite",
        //       "badge",
        //     ]);
        //
        //     break;
        //
        //   case PermisRoles.proc:
        //     sidebarElement = featureChecker(sidebarElement, [
        //       "dashboard",
        //       "demandes",
        //       "permis-visites",
        //       "permis-communiquer",
        //       "liste-rouges",
        //       "list-red-items",
        //       "demandes-visas",
        //       "emissions",
        //       "emit-permis-communiquer",
        //     ]);
        //
        //     break;
        //
        //   // PROFILE REGISSEUR DE LA PLATEFORME
        //
        //   case PermisRoles.regisseur:
        //     sidebarElement = featureChecker(sidebarElement, [
        //       "dashboard",
        //       "demandes",
        //       "permis-visites",
        //       "permis-communiquer",
        //       "laisser-passer",
        //       "autorisation-acces",
        //       "autorisation-visite",
        //       "badge",
        //     ]);
        //
        //     break;
        // }

        return sidebarElements;
    });

    return {
        sidebarAuthorized,
    };
};
