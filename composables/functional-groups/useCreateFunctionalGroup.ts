export const useCreateFunctionalGroup = (refreshFunctionalGroups: () => void) => {

    const { $sisepActiviteApi } = useNuxtApp()

    const createFunctionalGroup = async (data: any) => {
        const response = await $sisepActiviteApi('functional-groups', {
            method: 'POST',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 201 || response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Nouveau groupe fonctionnel créé !",
                        message: `Le groupe fonctionnel "${response._data.name}" a été créé avec succès`,
                    })
                    toggleModalCreateFunctionalGroup()
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

    const createFunctionalGroupFormEl = ref(null)
    const createFunctionalGroupForm = computed(() => ({
        scrollOnNext: true,
        id: "createFunctionalGroupForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["name"],

        endpoint: async (form: any, payload: any) => {
            await createFunctionalGroup(payload.requestData)
        },

        schema: {
            name: {
                type: 'text',
                label: "Nom du groupe fonctionnel",
                description: "Nom unique du groupe fonctionnel",
                placeholder: "Ex: Éducation",
                rules: ['required'],
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
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },
        }
    }))

    const isModalCreateFunctionalGroupOpen = ref(false)
    const toggleModalCreateFunctionalGroup = () => {
        isModalCreateFunctionalGroupOpen.value = !isModalCreateFunctionalGroupOpen.value
    }

    return {
        createFunctionalGroup,
        createFunctionalGroupFormEl,
        createFunctionalGroupForm,
        isModalCreateFunctionalGroupOpen,
        toggleModalCreateFunctionalGroup
    }
}
