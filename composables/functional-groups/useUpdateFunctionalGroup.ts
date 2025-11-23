export const useUpdateFunctionalGroup = (refreshFunctionalGroups: () => void) => {

    const { $sisepActiviteApi } = useNuxtApp()

    const updateFunctionalGroup = async (functionalGroupId: string, data: any) => {
        const response = await $sisepActiviteApi(`functional-groups/${functionalGroupId}`, {
            method: 'PUT',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Groupe fonctionnel mis à jour !",
                        message: `Le groupe fonctionnel "${response._data.name}" a été mis à jour avec succès`,
                    })
                    toggleModalUpdateFunctionalGroup()
                    refreshFunctionalGroups()
                }

                if (response.status === 400) {
                    makeAlert({
                        type: "error",
                        title: "OUPS ERREUR !",
                        message: `Erreur sur la clé ${response?._data?.errors[0]?.path}, ${response?._data?.errors[0]?.message}`,
                        extraClass: "bg-red-500",
                    })
                }

                if (response.status === 404) {
                    makeAlert({
                        type: "error",
                        title: "Non trouvé !",
                        message: "Groupe fonctionnel introuvable",
                        extraClass: "bg-red-500",
                    })
                }

                if (response.status === 409) {
                    makeAlert({
                        type: "error",
                        title: "Conflit !",
                        message: "Ce nom est déjà utilisé par un autre groupe fonctionnel",
                        extraClass: "bg-red-500",
                    })
                }
            }
        })
    }

    const updateFunctionalGroupFormEl = ref(null)
    const currentFunctionalGroup = ref<any>(null)

    const updateFunctionalGroupForm = computed(() => ({
        scrollOnNext: true,
        id: "updateFunctionalGroupForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["name"],

        endpoint: async (form: any, payload: any) => {
            if (currentFunctionalGroup.value?.id) {
                await updateFunctionalGroup(currentFunctionalGroup.value.id, payload.requestData)
            }
        },

        schema: {
            name: {
                type: 'text',
                label: "Nom du groupe fonctionnel",
                description: "Nom unique du groupe fonctionnel",
                placeholder: "Ex: Éducation",
                rules: ['required'],
                default: currentFunctionalGroup.value?.name || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            description: {
                type: 'textarea',
                label: "Description",
                description: "Description du groupe fonctionnel",
                placeholder: "Décrivez le groupe fonctionnel...",
                rows: 4,
                default: currentFunctionalGroup.value?.description || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },
        }
    }))

    const isModalUpdateFunctionalGroupOpen = ref(false)
    const toggleModalUpdateFunctionalGroup = () => {
        isModalUpdateFunctionalGroupOpen.value = !isModalUpdateFunctionalGroupOpen.value
    }

    const openUpdateModal = (functionalGroup: any) => {
        currentFunctionalGroup.value = functionalGroup
        isModalUpdateFunctionalGroupOpen.value = true
    }

    return {
        updateFunctionalGroup,
        updateFunctionalGroupFormEl,
        updateFunctionalGroupForm,
        isModalUpdateFunctionalGroupOpen,
        toggleModalUpdateFunctionalGroup,
        openUpdateModal,
        currentFunctionalGroup
    }
}
