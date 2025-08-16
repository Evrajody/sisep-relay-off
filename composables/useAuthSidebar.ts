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
            children: [

                {
                    id: "lists-type-project",
                    tooltip: {text: "Liste des types de projets"},
                    label: "Liste des types de projets",
                    to: "#",
                },

                {
                    id: "new-types-project",
                    tooltip: {text: "Creer un nouveau type de projet"},
                    label: "Nouveau type de projet",
                    to: "#"
                },

            ],
        },

        {
            id: "problemes",
            label: "Suggestions",
            icon: "heroicons-outline:rectangle-stack",
            tooltip: {text: "Liste des suggestions"},
            to: "#",
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
