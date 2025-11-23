export const useCreateOrganisation = (refreshOrganisations: () => void) => {

    const { $sisepStatsApi } = useNuxtApp()

    const createOrganisation = async (data: any) => {
        const response = await $sisepStatsApi('organisations', {
            method: 'POST',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 201 || response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Nouvelle organisation créée !",
                        message: `L'organisation ${response._data.code} - ${response._data.name} a été créée avec succès`,
                    })
                    toggleModalCreateOrganisation()
                    refreshOrganisations()
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

    const createOrganisationFormEl = ref(null)
    const createOrganisationForm = computed(() => ({
        scrollOnNext: true,
        id: "createOrganisationForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["code", "name"],

        endpoint: async (form: any, payload: any) => {
            await createOrganisation(payload.requestData)
        },

        schema: {
            code: {
                type: 'text',
                label: "Code de l'organisation",
                description: "Code unique de l'organisation",
                placeholder: "Ex: ORG-001, ORG-MIN-EDU",
                rules: ['required'],
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            name: {
                type: 'text',
                label: "Nom de l'organisation",
                description: "Nom complet de l'organisation",
                placeholder: "Ex: Ministère de l'Éducation, Direction Générale des Impôts",
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
                label: "Description de l'organisation",
                description: "Description détaillée de l'organisation",
                placeholder: "Ex: Organisation gouvernementale chargée de...",
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
                label: "Statut de l'organisation",
                default: 'ACTIVE',
                items: [
                    { value: 'ACTIVE', label: 'Actif' },
                    { value: 'INACTIVE', label: 'Inactif' },
                ],
                native: false,
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },
        }
    }))

    const isModalCreateOrganisationOpen = ref(false)
    const toggleModalCreateOrganisation = () => {
        isModalCreateOrganisationOpen.value = !isModalCreateOrganisationOpen.value
    }

    return {
        createOrganisation,
        createOrganisationFormEl,
        createOrganisationForm,
        isModalCreateOrganisationOpen,
        toggleModalCreateOrganisation
    }
}
