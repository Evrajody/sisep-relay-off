// État partagé pour le module actif
const activeModuleState = () => useState<string | null>('activeModule', () => null);

export const useAuthSidebar = () => {

    // CONFIGURATION
    const runtimeConfig = useRuntimeConfig();

    // ROUTER
    const router = useRouter();

    // État du module actif (partagé entre composants)
    const activeModule = activeModuleState();

    const featureChecker = (
        features : any,
        authorizedFeatures: string[],
    ) => {
        return features.filter((el: any) => {
            if (authorizedFeatures.includes(el.id)) {
                if (el.children) {
                    el.children = el.children.filter((child: any) =>
                        authorizedFeatures.includes(child.id),
                    );
                }
                return true;
            }
            return false;
        });
    };

    // Élément commun à tous les modules
    const dashboardElement = {
        id: "dashboard",
        label: "Tableau de bord",
        icon: "i-heroicons-rectangle-group-20-solid",
        to: {name: 'admin-project-module-dashboard'},
        tooltip: {
            text: "Consulter les statistiques",
        },
    };

    // Éléments pour MODULE STATISTIQUE
    const statistiqueElements = [
        dashboardElement,
        {
            id: "sectors",
            label: "Secteurs",
            icon: "i-heroicons-squares-plus",
            children: [
                {
                    id: "liste-sectors",
                    label: "Liste des secteurs",
                    to: { name: "admin-statistique-module-sectors" },
                    tooltip: { text: "Liste des secteurs" },
                },
            ],
        },
        {
            id: "indicators",
            label: "Indicateurs",
            icon: "i-heroicons-chart-bar-square",
            children: [
                {
                    id: "liste-indicators",
                    label: "Liste des indicateurs",
                    to: { name: "admin-statistique-module-indicators" },
                    tooltip: { text: "Liste des indicateurs" },
                },
            ],
        },
        {
            id: "locations",
            label: "Localisations",
            icon: "i-heroicons-map-pin",
            children: [
                {
                    id: "liste-locations",
                    label: "Liste des localisations",
                    to: { name: "admin-statistique-module-locations" },
                    tooltip: { text: "Liste des localisations" },
                },
            ],
        },
        {
            id: "organisations",
            label: "Organisations",
            icon: "i-heroicons-building-office-2",
            children: [
                {
                    id: "liste-organisations",
                    label: "Liste des organisations",
                    // to: { name: "admin-statistique-module-organisations" },
                    tooltip: { text: "Liste des organisations" },
                },
                {
                    id: "new-organisation",
                    label: "Nouvelle organisation",
                    // to: { name: "admin-statistique-module-organisations-create" },
                    tooltip: { text: "Créer une nouvelle organisation" },
                },
            ],
        },
    ];

    // Éléments pour MODULE PROJET (garde l'ancien comportement)
    const projetElements = [
        dashboardElement,
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
        {
            id: "types-projet",
            label: "Type de projets",
            icon: "i-heroicons-megaphone",
            to: { name: "admin-project-module-types-projects" },
        },
    ];

    // Éléments pour MODULE ACTIVITE (à compléter selon vos besoins)
    const activiteElements = [
        dashboardElement,
        {
            id: "categories",
            label: "Catégories",
            icon: "i-heroicons-square-3-stack-3d",
            to: { name: "admin-project-module-categories" },
        },
        {
            id: "subcategories",
            label: "Sous-catégories",
            icon: "i-heroicons-queue-list",
            to: { name: "admin-project-module-subcategories" },
        },
        {
            id: "agents",
            label: "Agents",
            icon: "i-heroicons-users",
            to: { name: "admin-project-module-agents" },
        },
        {
            id: "conventions",
            label: "Conventions",
            icon: "i-heroicons-document-text",
            to: { name: "admin-project-module-conventions" },
        },
    ];

    // Mapping des modules par UUID
    const moduleElementsMap: Record<string, any[]> = {
        '8fb0c6ab-7771-460d-a5dc-5e09b7d1722b': statistiqueElements, // MODULE STATISTIQUE
        '4546916e-0030-47c4-8401-aea042031575': projetElements,      // MODULE PROJET
        'fd5f5b59-f283-40b9-a577-4e08a9005833': activiteElements,    // MODULE ACTIVITE
    };

    // Fonction pour changer de module
    const setActiveModule = (moduleId: string | null) => {
        activeModule.value = moduleId;
    };

    // GENERE LA SIDEBAR ASSOCIE AU MODULE ACTIF
    const sidebarAuthorized = computed(() => {
        if (activeModule.value && moduleElementsMap[activeModule.value]) {
            return moduleElementsMap[activeModule.value];
        }
        // Par défaut, retourne les éléments du module projet
        return projetElements;
    });

    return {
        sidebarAuthorized,
        setActiveModule,
        activeModule,
    };
};
