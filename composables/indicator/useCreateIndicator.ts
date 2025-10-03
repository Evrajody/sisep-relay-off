export const useCreateIndicator = (refreshIndicators: () => void) => {

    const { $sisepApi } = useNuxtApp()

    const createIndicator = async (data: any) => {
        const response = await $sisepApi('indicators', {
            method: 'POST',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 201 || response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Nouvel indicateur créé !",
                        message: `L'indicateur ${response._data.code} - ${response._data.label} a été créé avec succès`,
                    })
                    toggleModalCreateIndicator()
                    refreshIndicators()
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

    const createIndicatorFormEl = ref(null)
    const createIndicatorForm = computed(() => ({
        scrollOnNext: true,
        id: "createIndicatorForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["categoryId", "code", "label"],

        endpoint: async (form: any, payload: any) => {
            await createIndicator(payload.requestData)
        },

        schema: {
            categoryId: {
                type: 'select',
                label: "Catégorie",
                description: "Sélectionnez la catégorie",
                rules: ['required'],
                items: "categories",
                dataKey: "data",
                labelProp: "name",
                valueProp: "id",
                search: true,
                native: true,
                inputType: "search",
                autocomplete: "off",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            subCategoryId: {
                type: 'select',
                label: "Sous-catégorie",
                description: "Sélectionnez la sous-catégorie (optionnel)",
                items: "subcategories",
                dataKey: "data",
                labelProp: "name",
                valueProp: "id",
                search: true,
                native: true,
                inputType: "search",
                autocomplete: "off",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            code: {
                type: 'text',
                label: "Code de l'indicateur",
                description: "Code unique de l'indicateur",
                placeholder: "Ex: IND-ENV-001, IND-EDU-002",
                rules: ['required'],
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            label: {
                type: 'text',
                label: "Libellé de l'indicateur",
                description: "Libellé descriptif de l'indicateur",
                placeholder: "Ex: Taux de couverture forestière, Taux d'alphabétisation",
                rules: ['required'],
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            coverage: {
                type: 'select',
                label: "Couverture",
                description: "Niveau de couverture de l'indicateur",
                default: 'NATIONAL',
                items: [
                    { value: 'REGIONAL', label: 'Régional' },
                    { value: 'NATIONAL', label: 'National' },
                    { value: 'INTERNATIONAL', label: 'International' },
                ],
                native: false,
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            description: {
                type: 'textarea',
                label: "Description de l'indicateur",
                description: "Description détaillée de l'indicateur",
                placeholder: "Ex: Cet indicateur mesure le pourcentage de la superficie du territoire national couverte par des forêts...",
                rows: 4,
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            unit: {
                type: 'text',
                label: "Unité de mesure (optionnel)",
                description: "Unité dans laquelle l'indicateur est mesuré",
                placeholder: "Ex: %, km², tonnes, habitants",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            status: {
                type: 'select',
                label: "Statut de l'indicateur",
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

    const isModalCreateIndicatorOpen = ref(false)
    const toggleModalCreateIndicator = () => {
        isModalCreateIndicatorOpen.value = !isModalCreateIndicatorOpen.value
    }

    return {
        createIndicator,
        createIndicatorFormEl,
        createIndicatorForm,
        isModalCreateIndicatorOpen,
        toggleModalCreateIndicator
    }
}
