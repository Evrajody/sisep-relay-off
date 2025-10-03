export const useAssignIndicators = (refreshStructures: () => void) => {

    const { $sisepApi } = useNuxtApp()

    const assignIndicators = async (structureId: string, indicatorIds: string[]) => {
        const response = await $sisepApi(`structures/${structureId}/assign-indicators`, {
            method: 'POST',
            body: { indicatorIds },
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Indicateurs assignés !",
                        message: `Les indicateurs ont été assignés avec succès à la structure`,
                    })
                    toggleModalAssignIndicators()
                    refreshStructures()
                }

                if (response.status === 400) {
                    makeAlert({
                        type: "error",
                        title: "OUPS ERREUR !",
                        message: `Erreur lors de l'assignation des indicateurs`,
                        extraClass: "bg-red-500",
                    })
                }
            }
        })
    }

    const assignIndicatorsFormEl = ref(null)
    const currentStructure = ref(null)

    const assignIndicatorsForm = computed(() => ({
        scrollOnNext: true,
        id: "assignIndicatorsForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["indicatorIds"],

        endpoint: async (form: any, payload: any) => {
            if (currentStructure.value?.id && payload.requestData.indicatorIds) {
                await assignIndicators(currentStructure.value.id, payload.requestData.indicatorIds)
            }
        },

        schema: {
            structureInfo: {
                type: 'static',
                content: `<div class="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-900 dark:text-white">${currentStructure.value?.label || ''}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">${currentStructure.value?.abbreviation || ''}</p>
                        </div>
                    </div>
                </div>`,
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            indicatorIds: {
                type: 'select',
                label: "Sélectionner les indicateurs",
                description: "Choisissez un ou plusieurs indicateurs à assigner à cette structure",
                rules: ['required'],
                items: "indicators",
                dataKey: "data",
                labelProp: (indicator: any) => `${indicator.code} - ${indicator.label}`,
                valueProp: "id",
                search: true,
                native: false,
                inputType: "search",
                mode: "multiple",
                closeOnSelect: false,
                autocomplete: "off",
                default: currentStructure.value?.indicators?.map((ind: any) => ind.id) || [],
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },
        }
    }))

    const isModalAssignIndicatorsOpen = ref(false)
    const toggleModalAssignIndicators = () => {
        isModalAssignIndicatorsOpen.value = !isModalAssignIndicatorsOpen.value
    }

    const openAssignModal = (structure: any) => {
        currentStructure.value = structure
        isModalAssignIndicatorsOpen.value = true
    }

    return {
        assignIndicators,
        assignIndicatorsFormEl,
        assignIndicatorsForm,
        isModalAssignIndicatorsOpen,
        toggleModalAssignIndicators,
        openAssignModal,
        currentStructure
    }
}
