export const useUpdateSubCategory = (refreshSubCategories: () => void) => {

    const { $sisepApi } = useNuxtApp()

    const updateSubCategory = async (subCategoryId: string, data: any) => {
        const response = await $sisepApi(`subcategories/${subCategoryId}`, {
            method: 'PUT',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Sous-catégorie mise à jour !",
                        message: `La sous-catégorie ${response._data.name} a été mise à jour avec succès`,
                    })
                    toggleModalUpdateSubCategory()
                    refreshSubCategories()
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

    const updateSubCategoryFormEl = ref(null)
    const currentSubCategory = ref(null)

    const updateSubCategoryForm = computed(() => ({
        scrollOnNext: true,
        id: "updateSubCategoryForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["name", "categoryId"],

        endpoint: async (form: any, payload: any) => {
            if (currentSubCategory.value?.id) {
                await updateSubCategory(currentSubCategory.value.id, payload.requestData)
            }
        },

        schema: {
            categoryId: {
                type: 'select',
                label: "Catégorie parente",
                description: "Sélectionnez la catégorie parente",
                rules: ['required'],
                items: "categories",
                dataKey: "data",
                labelProp: "name",
                valueProp: "id",
                search: true,
                native: true,
                inputType: "search",
                autocomplete: "off",
                default: currentSubCategory.value?.categoryId || currentSubCategory.value?.category?.id || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            name: {
                type: 'text',
                label: "Nom de la sous-catégorie",
                description: "Formuler un nom pour la sous-catégorie",
                placeholder: "Ex: Gestion des déchets, Énergies renouvelables",
                rules: ['required'],
                default: currentSubCategory.value?.name || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            description: {
                type: 'textarea',
                label: "Description de la sous-catégorie",
                description: "Décrivez la sous-catégorie",
                placeholder: "Ex: Sous-catégorie regroupant tous les projets liés à la gestion des déchets...",
                rows: 4,
                default: currentSubCategory.value?.description || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            status: {
                type: 'select',
                label: "Statut de la sous-catégorie",
                default: currentSubCategory.value?.status || 'ACTIVE',
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
                description: "Code couleur hexadécimal pour identifier visuellement la sous-catégorie",
                placeholder: "#3B82F6",
                default: currentSubCategory.value?.color || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },
        }
    }))

    const isModalUpdateSubCategoryOpen = ref(false)
    const toggleModalUpdateSubCategory = () => {
        isModalUpdateSubCategoryOpen.value = !isModalUpdateSubCategoryOpen.value
    }

    const openUpdateModal = (subCategory: any) => {
        currentSubCategory.value = subCategory
        isModalUpdateSubCategoryOpen.value = true
    }

    return {
        updateSubCategory,
        updateSubCategoryFormEl,
        updateSubCategoryForm,
        isModalUpdateSubCategoryOpen,
        toggleModalUpdateSubCategory,
        openUpdateModal,
        currentSubCategory
    }
}
