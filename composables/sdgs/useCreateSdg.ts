export const useCreateSdg = (refreshSdgs: () => void) => {

    const { $sisepActiviteApi } = useNuxtApp()

    const createSdg = async (data: any) => {
        const response = await $sisepActiviteApi('sdgs', {
            method: 'POST',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 201 || response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Nouveau SDG créé !",
                        message: `Le SDG "${response._data.code} - ${response._data.title}" a été créé avec succès`,
                    })
                    toggleModalCreateSdg()
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

    const createSdgFormEl = ref(null)
    const createSdgForm = computed(() => ({
        scrollOnNext: true,
        id: "createSdgForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["code", "title"],

        endpoint: async (form: any, payload: any) => {
            await createSdg(payload.requestData)
        },

        schema: {
            code: {
                type: 'text',
                label: "Code du SDG",
                description: "Code unique du SDG (ex: SDG-1)",
                placeholder: "Ex: SDG-1",
                rules: ['required'],
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
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },
        }
    }))

    const isModalCreateSdgOpen = ref(false)
    const toggleModalCreateSdg = () => {
        isModalCreateSdgOpen.value = !isModalCreateSdgOpen.value
    }

    return {
        createSdg,
        createSdgFormEl,
        createSdgForm,
        isModalCreateSdgOpen,
        toggleModalCreateSdg
    }
}
