export const useUpdateSdg = (refreshSdgs: () => void) => {

    const { $sisepActiviteApi } = useNuxtApp()

    const updateSdg = async (sdgId: string, data: any) => {
        const response = await $sisepActiviteApi(`sdgs/${sdgId}`, {
            method: 'PUT',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "SDG mis à jour !",
                        message: `Le SDG "${response._data.code} - ${response._data.title}" a été mis à jour avec succès`,
                    })
                    toggleModalUpdateSdg()
                    refreshSdgs()
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
                        message: "SDG introuvable",
                        extraClass: "bg-red-500",
                    })
                }

                if (response.status === 409) {
                    makeAlert({
                        type: "error",
                        title: "Conflit !",
                        message: "Ce code est déjà utilisé par un autre SDG",
                        extraClass: "bg-red-500",
                    })
                }
            }
        })
    }

    const updateSdgFormEl = ref(null)
    const currentSdg = ref<any>(null)

    const updateSdgForm = computed(() => ({
        scrollOnNext: true,
        id: "updateSdgForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["code", "title"],

        endpoint: async (form: any, payload: any) => {
            if (currentSdg.value?.id) {
                await updateSdg(currentSdg.value.id, payload.requestData)
            }
        },

        schema: {
            code: {
                type: 'text',
                label: "Code du SDG",
                description: "Code unique du SDG (ex: SDG-1)",
                placeholder: "Ex: SDG-1",
                rules: ['required'],
                default: currentSdg.value?.code || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            title: {
                type: 'text',
                label: "Titre du SDG",
                description: "Titre descriptif du SDG",
                placeholder: "Ex: Pas de pauvreté",
                rules: ['required'],
                default: currentSdg.value?.title || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            description: {
                type: 'textarea',
                label: "Description",
                description: "Description détaillée du SDG",
                placeholder: "Décrivez le SDG...",
                rows: 4,
                default: currentSdg.value?.description || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            color: {
                type: 'text',
                label: "Couleur",
                description: "Couleur associée au SDG (format hexadécimal)",
                placeholder: "Ex: #E5243B",
                default: currentSdg.value?.color || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },
        }
    }))

    const isModalUpdateSdgOpen = ref(false)
    const toggleModalUpdateSdg = () => {
        isModalUpdateSdgOpen.value = !isModalUpdateSdgOpen.value
    }

    const openUpdateModal = (sdg: any) => {
        currentSdg.value = sdg
        isModalUpdateSdgOpen.value = true
    }

    return {
        updateSdg,
        updateSdgFormEl,
        updateSdgForm,
        isModalUpdateSdgOpen,
        toggleModalUpdateSdg,
        openUpdateModal,
        currentSdg
    }
}
