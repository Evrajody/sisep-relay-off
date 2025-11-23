export const useCreateActivity = (refreshActivities: () => void) => {

    const { $sisepActiviteApi } = useNuxtApp()

    const { loadConventions, loadStructures } = useSisebHelper()

    const createActivity = async (data: any) => {
        const response = await $sisepActiviteApi('activities', {
            method: 'POST',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 201 || response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Nouvelle activité créée !",
                        message: `L'activité "${response._data.nature}" a été créée avec succès`,
                    })
                    toggleModalCreateActivity()
                    refreshActivities()
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

    // Upload de fichier
    const uploadFile = async (file: File): Promise<string | null> => {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await $sisepActiviteApi('upload-files', {
                method: 'POST',
                body: formData,
            })
            return response?.id || null
        } catch (error) {
            console.error('Erreur upload:', error)
            makeAlert({
                type: "error",
                title: "Erreur d'upload",
                message: "Impossible d'uploader le fichier",
                extraClass: "bg-red-500",
            })
            return null
        }
    }

    const createActivityFormEl = ref(null)
    const uploadedFiles = ref<Array<{ id: string; fileTypeId: string }>>([])
    const coverImageId = ref<string | null>(null)

    const createActivityForm = computed(() => ({
        scrollOnNext: true,
        id: "createActivityForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["conventionId", "nature", "description"],

        endpoint: async (form: any, payload: any) => {
            const requestData = {
                ...payload.requestData,
                coverImageId: coverImageId.value,
                files: uploadedFiles.value.length > 0 ? uploadedFiles.value : undefined
            }
            await createActivity(requestData)
        },

        schema: {
            coverImageId: {
                type: 'file',
                accepted: ["image/jpeg", "image/jpg", "image/png"],
                label: "Image principale",
                info: "Image principale",
                columns: {
                    default: {container: 12, label: 12, wrapper: 12},
                    sm: {container: 12, label: 12, wrapper: 12},
                    md: {container: 12, label: 12, wrapper: 12},
                    lg: {container: 12, label: 12, wrapper: 12},
                },
                drop: true
            },
            conventionId: {
                type: 'select',
                label: "Convention",
                description: "Sélectionnez la convention associée",
                rules: ['required'],
                items: () => loadConventions(''),
                dataKey: "data",
                labelProp: "title",
                valueProp: "id",
                search: true,
                native: true,
                inputType: "search",
                autocomplete: "off",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            nature: {
                type: 'text',
                label: "Nature de l'activité",
                description: "Type d'activité (ex: Conférence, Atelier, Formation...)",
                placeholder: "Ex: Conférence",
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
                description: "Description détaillée de l'activité",
                placeholder: "Décrivez l'activité...",
                rules: ['required'],
                rows: 4,
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            youtubeUrl: {
                type: 'text',
                label: "URL YouTube",
                description: "Lien vers une vidéo YouTube (optionnel)",
                placeholder: "https://www.youtube.com/watch?v=...",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            structureId: {
                type: 'select',
                label: "Structure",
                description: "Identifiant de la structure (optionnel)",
                placeholder: "UUID de la structure",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
                items: () => loadStructures(''),
                dataKey: "data",
                labelProp: "name",
                valueProp: "id",
                search: true,
                native: true,
                inputType: "search",
                autocomplete: "off",
                
            }
        }
    }))

    const isModalCreateActivityOpen = ref(false)
    const toggleModalCreateActivity = () => {
        isModalCreateActivityOpen.value = !isModalCreateActivityOpen.value
        if (!isModalCreateActivityOpen.value) {
            // Reset upload state when closing modal
            uploadedFiles.value = []
            coverImageId.value = null
        }
    }

    return {
        createActivity,
        createActivityFormEl,
        createActivityForm,
        isModalCreateActivityOpen,
        toggleModalCreateActivity,
        uploadFile,
        uploadedFiles,
        coverImageId
    }
}
