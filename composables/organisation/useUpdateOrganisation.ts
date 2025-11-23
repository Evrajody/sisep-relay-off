export const useUpdateOrganisation = (refreshOrganisations: () => void) => {

    const { $sisepApi } = useNuxtApp()

    const updateOrganisation = async (organisationId: string, data: any) => {
        const response = await $sisepApi(`organisations/${organisationId}`, {
            method: 'PUT',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Organisation mise à jour !",
                        message: `L'organisation ${response._data.code} - ${response._data.name} a été mise à jour avec succès`,
                    })
                    toggleModalUpdateOrganisation()
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

    const updateOrganisationFormEl = ref(null)
    const currentOrganisation = ref<any>(null)

    const updateOrganisationForm = computed(() => ({
        scrollOnNext: true,
        id: "updateOrganisationForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["code", "name"],

        endpoint: async (form: any, payload: any) => {
            if (currentOrganisation.value?.id) {
                await updateOrganisation(currentOrganisation.value.id, payload.requestData)
            }
        },

        schema: {
            code: {
                type: 'text',
                label: "Code de l'organisation",
                description: "Code unique de l'organisation",
                placeholder: "Ex: ORG-001, ORG-MIN-EDU",
                rules: ['required'],
                default: currentOrganisation.value?.code || '',
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
                default: currentOrganisation.value?.name || '',
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
                default: currentOrganisation.value?.description || '',
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
                default: currentOrganisation.value?.status || 'ACTIVE',
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

    const isModalUpdateOrganisationOpen = ref(false)
    const toggleModalUpdateOrganisation = () => {
        isModalUpdateOrganisationOpen.value = !isModalUpdateOrganisationOpen.value
    }

    const openUpdateModal = (organisation: any) => {
        currentOrganisation.value = organisation
        isModalUpdateOrganisationOpen.value = true
    }

    return {
        updateOrganisation,
        updateOrganisationFormEl,
        updateOrganisationForm,
        isModalUpdateOrganisationOpen,
        toggleModalUpdateOrganisation,
        openUpdateModal,
        currentOrganisation
    }
}
