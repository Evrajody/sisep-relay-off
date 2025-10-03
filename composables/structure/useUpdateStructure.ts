export const useUpdateStructure = (refreshStructures: () => void) => {

    const { $sisepApi } = useNuxtApp()

    const updateStructure = async (structureId: string, data: any) => {
        const response = await $sisepApi(`structures/${structureId}`, {
            method: 'PUT',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Structure mise à jour !",
                        message: `La structure ${response._data.label} (${response._data.abbreviation}) a été mise à jour avec succès`,
                    })
                    toggleModalUpdateStructure()
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

    const updateStructureFormEl = ref(null)
    const currentStructure = ref(null)

    const updateStructureForm = computed(() => ({
        scrollOnNext: true,
        id: "updateStructureForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["label", "abbreviation"],

        endpoint: async (form: any, payload: any) => {
            if (currentStructure.value?.id) {
                await updateStructure(currentStructure.value.id, payload.requestData)
            }
        },

        schema: {
            label: {
                type: 'text',
                label: "Libellé de la structure",
                description: "Nom complet de la structure",
                placeholder: "Ex: Ministère du Cadre de Vie et du Développement Durable",
                rules: ['required'],
                default: currentStructure.value?.label || '',
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
                default: currentStructure.value?.abbreviation || '',
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
                default: currentStructure.value?.description || '',
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
                default: currentStructure.value?.email || '',
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
                default: currentStructure.value?.phone || '',
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
                default: currentStructure.value?.address || '',
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
                default: currentStructure.value?.status || 'ACTIVE',
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

    const isModalUpdateStructureOpen = ref(false)
    const toggleModalUpdateStructure = () => {
        isModalUpdateStructureOpen.value = !isModalUpdateStructureOpen.value
    }

    const openUpdateModal = (structure: any) => {
        currentStructure.value = structure
        isModalUpdateStructureOpen.value = true
    }

    return {
        updateStructure,
        updateStructureFormEl,
        updateStructureForm,
        isModalUpdateStructureOpen,
        toggleModalUpdateStructure,
        openUpdateModal,
        currentStructure
    }
}
