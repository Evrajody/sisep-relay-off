export const useUpdateActivity = (refreshActivities: () => void) => {

    const { $sisepActiviteApi } = useNuxtApp()

    const updateActivity = async (activityId: string, data: any) => {
        const response = await $sisepActiviteApi(`activities/${activityId}`, {
            method: 'PUT',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Activité mise à jour !",
                        message: `L'activité "${response._data.nature}" a été mise à jour avec succès`,
                    })
                    toggleModalUpdateActivity()
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

    const updateActivityFormEl = ref(null)
    const currentActivity = ref<any>(null)
    const uploadedFiles = ref<Array<{ id: string; fileTypeId: string }>>([])
    const coverImageId = ref<string | null>(null)

    const updateActivityForm = computed(() => ({
        scrollOnNext: true,
        id: "updateActivityForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["conventionId", "nature", "description"],

        endpoint: async (form: any, payload: any) => {
            if (currentActivity.value?.id) {
                const requestData = {
                    ...payload.requestData,
                    coverImageId: coverImageId.value || currentActivity.value?.coverImageId,
                    files: uploadedFiles.value.length > 0 ? uploadedFiles.value : currentActivity.value?.files?.map((f: any) => ({ id: f.id, fileTypeId: f.fileTypeId }))
                }
                await updateActivity(currentActivity.value.id, requestData)
            }
        },

        schema: {
            conventionId: {
                type: 'select',
                label: "Convention",
                description: "Sélectionnez la convention associée",
                rules: ['required'],
                items: "conventions",
                dataKey: "data",
                labelProp: "title",
                valueProp: "id",
                search: true,
                native: true,
                inputType: "search",
                autocomplete: "off",
                default: currentActivity.value?.conventionId || currentActivity.value?.convention?.id || '',
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
                default: currentActivity.value?.nature || '',
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
                default: currentActivity.value?.description || '',
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
                default: currentActivity.value?.youtubeUrl || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            structureId: {
                type: 'text',
                label: "ID de la structure",
                description: "Identifiant de la structure (optionnel)",
                placeholder: "UUID de la structure",
                default: currentActivity.value?.structureId || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            structureName: {
                type: 'text',
                label: "Nom de la structure",
                description: "Nom de la structure associée",
                placeholder: "Ex: Ministère de l'Environnement",
                default: currentActivity.value?.structure?.name || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            structureType: {
                type: 'text',
                label: "Type de structure",
                description: "Type de la structure",
                placeholder: "Ex: Organisation",
                default: currentActivity.value?.structure?.type || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            structureLocation: {
                type: 'text',
                label: "Localisation",
                description: "Localisation de la structure",
                placeholder: "Ex: Libreville",
                default: currentActivity.value?.structure?.location || '',
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },
        }
    }))

    const isModalUpdateActivityOpen = ref(false)
    const toggleModalUpdateActivity = () => {
        isModalUpdateActivityOpen.value = !isModalUpdateActivityOpen.value
        if (!isModalUpdateActivityOpen.value) {
            uploadedFiles.value = []
            coverImageId.value = null
        }
    }

    const openUpdateModal = (activity: any) => {
        currentActivity.value = activity
        coverImageId.value = activity.coverImageId || null
        uploadedFiles.value = activity.files?.map((f: any) => ({ id: f.id, fileTypeId: f.fileTypeId })) || []
        isModalUpdateActivityOpen.value = true
    }

    return {
        updateActivity,
        updateActivityFormEl,
        updateActivityForm,
        isModalUpdateActivityOpen,
        toggleModalUpdateActivity,
        openUpdateModal,
        currentActivity,
        uploadedFiles,
        coverImageId
    }
}
