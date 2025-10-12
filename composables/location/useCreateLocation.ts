export const useCreateLocation = (refreshLocations: () => void) => {

    const { $sisepApi } = useNuxtApp()

    const createLocation = async (data: any) => {
        const response = await $sisepApi('locations', {
            method: 'POST',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 201 || response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Nouvelle localisation créée !",
                        message: `La localisation ${response._data.name} a été créée avec succès`,
                    })
                    toggleModalCreateLocation()
                    refreshLocations()
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

    const createLocationFormEl = ref(null)
    const createLocationForm = computed(() => ({
        scrollOnNext: true,
        id: "createLocationForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["name", "code", "level"],

        endpoint: async (form: any, payload: any) => {
            await createLocation(payload.requestData)
        },

        schema: {
            name: {
                type: 'text',
                label: "Nom de la localisation",
                description: "Nom de la localisation",
                placeholder: "Ex: Cotonou, Abomey-Calavi, Porto-Novo",
                rules: ['required'],
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            code: {
                type: 'text',
                label: "Code",
                description: "Code unique de la localisation",
                placeholder: "Ex: CTN, ABC, PNV",
                rules: ['required'],
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            level: {
                type: 'select',
                label: "Niveau",
                description: "Niveau hiérarchique de la localisation",
                placeholder: "Sélectionner un niveau",
                rules: ['required'],
                items: [
                    { value: 'PAYS', label: 'Pays' },
                    { value: 'DEPARTEMENT', label: 'Département' },
                    { value: 'COMMUNE', label: 'Commune' },
                    { value: 'ARRONDISSEMENT', label: 'Arrondissement' },
                    { value: 'QUARTIER', label: 'Quartier / Village' },
                ],
                native: false,
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            parentCode: {
                type: 'text',
                label: "Code parent (optionnel)",
                description: "Code de la localisation parente dans la hiérarchie",
                placeholder: "Ex: BEN (pour le pays Bénin)",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            parentId: {
                type: 'text',
                label: "ID Parent (optionnel)",
                description: "Identifiant UUID de la localisation parente",
                placeholder: "Ex: 3fa85f64-5717-4562-b3fc-2c963f66afa6",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            description: {
                type: 'textarea',
                label: "Description (optionnel)",
                description: "Description de la localisation",
                placeholder: "Ex: Capitale économique du Bénin, située sur le littoral atlantique...",
                rows: 4,
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },
        }
    }))

    const isModalCreateLocationOpen = ref(false)
    const toggleModalCreateLocation = () => {
        isModalCreateLocationOpen.value = !isModalCreateLocationOpen.value
    }

    return {
        createLocation,
        createLocationFormEl,
        createLocationForm,
        isModalCreateLocationOpen,
        toggleModalCreateLocation
    }
}
