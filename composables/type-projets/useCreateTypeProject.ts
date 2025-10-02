

export const useCreateTypeProject = ( refreshTypeProjets: () => void ) => {

    const { $sisepApi } = useNuxtApp()
    const createTypeProject = async (data: any) => {

        const response = await $sisepApi('project-types', {
            method: 'post',
            body: data,
            onResponse: ({response}) => {
                console.log(response);
                
                if (response.status === 201 || response.status === 200) {
                    // add toast
                    toogleModalCreateTypeProject()
                    refreshTypeProjets()
                }
            }
        })
    }

    const createTypeProjectFormEl = ref(null)
    const createTypeProjectForm = computed(() => ({
        scrollOnNext: true,
        id: "createTypeProjetForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["label"],


        endpoint: async (form: any, payload: any) => {
            await createTypeProject(payload.requestData)
        },

        schema: {

            name: {
                type: 'text',
                label: "Intitulé du type de projet",
                description: "Formuler un institulé pour le type de projet",
                placeholder: "Ex: Infrastructure hydraulique, Éducation environnementale",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            description: {
                type: 'textarea',
                label: "Description du type de projet",
                description: "Décrivez le type projet",
                placeholder: "Ex: Ce type de projet concerne la mise en place d'infrastructures pour améliorer l'accès à l'eau potable dans les zones rurales...",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

        }

    }))

    const isModalCreateTypeProjectOpen = ref(false)
    const toogleModalCreateTypeProject = () => {
        isModalCreateTypeProjectOpen.value = !isModalCreateTypeProjectOpen.value
    }
    return {
        createTypeProject,
        createTypeProjectFormEl,
        createTypeProjectForm,
        isModalCreateTypeProjectOpen,
        toogleModalCreateTypeProject
    }


}