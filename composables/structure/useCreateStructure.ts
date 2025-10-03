export const useCreateStructure = (refreshStructures: () => void) => {

    const { $sisepApi } = useNuxtApp()

    const createStructure = async (data: any) => {
        const response = await $sisepApi('structures', {
            method: 'POST',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 201 || response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Nouvelle structure créée !",
                        message: `La structure ${response._data.label} (${response._data.abbreviation}) a été créée avec succès`,
                    })
                    toggleModalCreateStructure()
                    refreshStructures()
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

    const createStructureFormEl = ref(null)
    const createStructureForm = computed(() => ({
        scrollOnNext: true,
        id: "createStructureForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["label", "abbreviation"],

        endpoint: async (form: any, payload: any) => {
            await createStructure(payload.requestData)
        },

        schema: {
            label: {
                type: 'text',
                label: "Libellé de la structure",
                description: "Nom complet de la structure",
                placeholder: "Ex: Ministère du Cadre de Vie et du Développement Durable",
                rules: ['required'],
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            abbreviation: {
                type: 'text',
                label: "Abréviation",
                description: "Sigle ou abréviation de la structure",
                placeholder: "Ex: MCVDD, MEMP, MEF",
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
                label: "Description de la structure",
                description: "Description des missions et attributions de la structure",
                placeholder: "Ex: Le Ministère du Cadre de Vie et du Développement Durable a pour mission...",
                rows: 4,
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            email: {
                type: 'text',
                label: "Email (optionnel)",
                description: "Adresse email de contact de la structure",
                placeholder: "Ex: contact@mcvdd.bj",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            phone: {
                type: 'text',
                label: "Téléphone (optionnel)",
                description: "Numéro de téléphone de la structure",
                placeholder: "Ex: +229 XX XX XX XX",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            address: {
                type: 'textarea',
                label: "Adresse (optionnel)",
                description: "Adresse physique de la structure",
                placeholder: "Ex: Cotonou, Quartier...",
                rows: 2,
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            status: {
                type: 'select',
                label: "Statut de la structure",
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
        }
    }))

    const isModalCreateStructureOpen = ref(false)
    const toggleModalCreateStructure = () => {
        isModalCreateStructureOpen.value = !isModalCreateStructureOpen.value
    }

    return {
        createStructure,
        createStructureFormEl,
        createStructureForm,
        isModalCreateStructureOpen,
        toggleModalCreateStructure
    }
}
