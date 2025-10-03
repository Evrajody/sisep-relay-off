export const useCreateCategory = (refreshCategories: () => void) => {

    const { $sisepApi } = useNuxtApp()

    const createCategory = async (data: any) => {
        const response = await $sisepApi('categories', {
            method: 'POST',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 201 || response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Nouvelle catégorie créée !",
                        message: `La catégorie ${response._data.name} a été créée avec succès`,
                    })
                    toggleModalCreateCategory()
                    refreshCategories()
                }

                if (response.status === 400) {
                    makeAlert({
                        type: "error",
                        title: "OUPS ERREUR !",
                        message: `Erreur sur la clé ${response?._data?.errors[0]?.path}, ${response?._data?.errors[0]?.message}`,
                        extraClass: "bg-red-500",
                    })
                }
            }
        })
    }

    const createCategoryFormEl = ref(null)
    const createCategoryForm = computed(() => ({
        scrollOnNext: true,
        id: "createCategoryForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["name"],

        endpoint: async (form: any, payload: any) => {
            await createCategory(payload.requestData)
        },

        schema: {
            name: {
                type: 'text',
                label: "Nom de la catégorie",
                description: "Formuler un nom pour la catégorie",
                placeholder: "Ex: Environnement, Infrastructure, Éducation",
                rules: ['required'],
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            description: {
                type: 'textarea',
                label: "Description de la catégorie",
                description: "Décrivez la catégorie",
                placeholder: "Ex: Catégorie regroupant tous les projets liés à la protection de l'environnement...",
                rows: 4,
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            status: {
                type: 'select',
                label: "Statut de la catégorie",
                default: 'ACTIVE',
                items: [
                    { value: 'ACTIVE', label: 'Active' },
                    { value: 'INACTIVE', label: 'Inactive' },
                ],
                native: false,
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            color: {
                type: 'text',
                label: "Couleur (optionnel)",
                description: "Code couleur hexadécimal pour identifier visuellement la catégorie",
                placeholder: "#3B82F6",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },
        }
    }))

    const isModalCreateCategoryOpen = ref(false)
    const toggleModalCreateCategory = () => {
        isModalCreateCategoryOpen.value = !isModalCreateCategoryOpen.value
    }

    return {
        createCategory,
        createCategoryFormEl,
        createCategoryForm,
        isModalCreateCategoryOpen,
        toggleModalCreateCategory
    }
}
