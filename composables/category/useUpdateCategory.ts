export const useUpdateCategory = (refreshCategories: () => void) => {

    const { $sisepApi } = useNuxtApp()

    const updateCategory = async (categoryId: string, data: any) => {
        const response = await $sisepApi(`categories/${categoryId}`, {
            method: 'PUT',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Catégorie mise à jour !",
                        message: `La catégorie ${response._data.name} a été mise à jour avec succès`,
                    })
                    toggleModalUpdateCategory()
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

    const updateCategoryFormEl = ref(null)
    const currentCategory = ref(null)

    const updateCategoryForm = computed(() => ({
        scrollOnNext: true,
        id: "updateCategoryForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["name"],

        endpoint: async (form: any, payload: any) => {
            if (currentCategory.value?.id) {
                await updateCategory(currentCategory.value.id, payload.requestData)
            }
        },

        schema: {
            name: {
                type: 'text',
                label: "Nom de la catégorie",
                description: "Formuler un nom pour la catégorie",
                placeholder: "Ex: Environnement, Infrastructure, Éducation",
                rules: ['required'],
                default: currentCategory.value?.name || '',
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
                default: currentCategory.value?.description || '',
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
                default: currentCategory.value?.status || 'ACTIVE',
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
                default: currentCategory.value?.color || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },
        }
    }))

    const isModalUpdateCategoryOpen = ref(false)
    const toggleModalUpdateCategory = () => {
        isModalUpdateCategoryOpen.value = !isModalUpdateCategoryOpen.value
    }

    const openUpdateModal = (category: any) => {
        currentCategory.value = category
        isModalUpdateCategoryOpen.value = true
    }

    return {
        updateCategory,
        updateCategoryFormEl,
        updateCategoryForm,
        isModalUpdateCategoryOpen,
        toggleModalUpdateCategory,
        openUpdateModal,
        currentCategory
    }
}
