export const useUpdateConvention = (refreshConventions: () => void) => {

    const { $sisepActiviteApi } = useNuxtApp()

    const updateConvention = async (conventionId: string, data: any) => {
        const response = await $sisepActiviteApi(`conventions/${conventionId}`, {
            method: 'PUT',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Convention mise à jour !",
                        message: `La convention ${response._data.title} a été mise à jour avec succès`,
                    })
                    toggleModalUpdateConvention()
                    refreshConventions()
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

    const updateConventionFormEl = ref(null)
    const currentConvention = ref<any>(null)

    const updateConventionForm = computed(() => ({
        scrollOnNext: true,
        id: "updateConventionForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["title", "functionalGroupId"],

        endpoint: async (form: any, payload: any) => {
            if (currentConvention.value?.id) {
                await updateConvention(currentConvention.value.id, payload.requestData)
            }
        },

        schema: {
            title: {
                type: 'text',
                label: "Titre de la convention",
                description: "Titre complet de la convention",
                placeholder: "Ex: Convention de Rio sur la biodiversité",
                rules: ['required'],
                default: currentConvention.value?.title || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            functionalGroupId: {
                type: 'select',
                label: "Groupe fonctionnel",
                description: "Sélectionnez le groupe fonctionnel associé",
                rules: ['required'],
                items: "functional-groups",
                dataKey: "data",
                labelProp: "name",
                valueProp: "id",
                search: true,
                native: true,
                inputType: "search",
                autocomplete: "off",
                default: currentConvention.value?.functionalGroupId || currentConvention.value?.functionalGroup?.id || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            adoptionDate: {
                type: 'date',
                label: "Date d'adoption",
                description: "Date à laquelle la convention a été adoptée",
                default: currentConvention.value?.adoptionDate || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            ratificationDate: {
                type: 'date',
                label: "Date de ratification",
                description: "Date de ratification de la convention",
                default: currentConvention.value?.ratificationDate || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            effectiveDate: {
                type: 'date',
                label: "Date d'entrée en vigueur",
                description: "Date d'entrée en vigueur de la convention",
                default: currentConvention.value?.effectiveDate || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            objectives: {
                type: 'textarea',
                label: "Objectifs",
                description: "Objectifs de la convention",
                placeholder: "Décrivez les objectifs principaux de la convention...",
                rows: 4,
                default: currentConvention.value?.objectives || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            principles: {
                type: 'textarea',
                label: "Principes",
                description: "Principes fondamentaux de la convention",
                placeholder: "Décrivez les principes de la convention...",
                rows: 4,
                default: currentConvention.value?.principles || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            globalObligations: {
                type: 'textarea',
                label: "Obligations globales",
                description: "Obligations globales définies par la convention",
                placeholder: "Décrivez les obligations globales...",
                rows: 4,
                default: currentConvention.value?.globalObligations || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            specificObligations: {
                type: 'textarea',
                label: "Obligations spécifiques",
                description: "Obligations spécifiques définies par la convention",
                placeholder: "Décrivez les obligations spécifiques...",
                rows: 4,
                default: currentConvention.value?.specificObligations || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },
        }
    }))

    const isModalUpdateConventionOpen = ref(false)
    const toggleModalUpdateConvention = () => {
        isModalUpdateConventionOpen.value = !isModalUpdateConventionOpen.value
    }

    const openUpdateModal = (convention: any) => {
        currentConvention.value = convention
        isModalUpdateConventionOpen.value = true
    }

    return {
        updateConvention,
        updateConventionFormEl,
        updateConventionForm,
        isModalUpdateConventionOpen,
        toggleModalUpdateConvention,
        openUpdateModal,
        currentConvention
    }
}
