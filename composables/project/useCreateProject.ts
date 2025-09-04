


export const useCreateProject = () => {

    const { $sisepApi } = useNuxtApp()

    const createProject = async (data: any) => {

        const response = await $sisepApi('projects', {
            method: 'post',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 201 || response.status === 200) {
                    // redirection vers la liste
                }
            }
        })
    }

    const createProjectFormEl = ref(null)

    const createProjectForm = computed(() => ({
        scrollOnNext: true,
        id: "createProjetForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["label"],

        endpoint: async (form: any, payload: any) => {

            console.log(JSON.stringify(payload.requestData));
            
            // await createProject(payload.requestData)
        },

        tabs: {
            info_project: {
                label: "Informations Générales",
                elements: [
                    "title",
                    "description",
                    "typeId",
                    "budget",
                    "location",
                    "image_principal",
                    "files",
                ],
            },

            actions: {
                label: "Actions",
                elements: [
                    "title",
                ],
            },

            indicateurs: {
                label: "Indicateurs",
                elements: [
                    "title",
                ],
            },

            financement: {
                label: "Financements",
                elements: [
                    "findingSource",
                    "reportingYear",
                    "instrumentType",
                    "amountCommitedCfa",
                    "amountDisbursedCfa",
                    "currency",
                    "exchangeRateUsed",
                ],
            },

            territoire: {
                label: "Territoire",
                elements: [
                    "title",
                ],
            },

            partenaires: {
                label: "Partenaires",
                elements: [
                    "title",
                ],
            },

            population_cible: {
                label: "Populations cibles",
                elements: [
                    "title",
                ],
            },

            verification: {
                label: "Verification",
                elements: [
                    "title",
                ],
            },


        },
        schema: {

            title: {
                type: 'text',
                label: "Intitulé du projet",
                info: "Fournisseur un titre génériques pour le projet",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
                rules: [],
            },

            description: {
                type: 'textarea',
                rows: 7,
                label: "Description du projet",
                info: "Décrivez le projet",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
                rules: [],
            },

            typeId: {
                type: 'select',
                label: "Type de projet",
                info: "Type de projet",
                rules: [],
                items: "project-types",
                dataKey: "data",
                labelProp: "name",
                valueProp: "id",
                search: true,
                native: true,
                inputType: "search",
                autocomplete: "off",
            },

            budget: {
                type: 'text',
                label: "Budget estimé",
                info: "Budget estimé",
                rules: [],
            },

            location: {
                label: "Lieu du projet",
                type: "object",
                addClasses: {
                    ElementLayout: {
                        innerContainer:
                            "border border-gray-200 bg-primary-50 px-3 px-2 py-5",
                    },

                    ElementLabel: {
                        wrapper: "text-lg py-1.5",
                        container_lg: "!pb-0",
                    },
                },
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
                schema: {
                    location: {
                        label: "Localisation",
                        info: "Localisation du projet",
                        type: "object",
                        schema: {
                            type: {
                                type: "text",
                                label: "Type",
                                rules: [],
                                columns: {
                                    default: { container: 12, label: 12, wrapper: 12 },
                                    sm: { container: 12, label: 12, wrapper: 12 },
                                    md: { container: 12, label: 12, wrapper: 12 },
                                    lg: { container: 12, label: 12, wrapper: 12 },
                                },
                            },

                            coordinates: {
                                label: "Coordonnées",
                                type: "object",
                                columns: {
                                    default: { container: 12, label: 12, wrapper: 12 },
                                    sm: { container: 12, label: 12, wrapper: 12 },
                                    md: { container: 12, label: 12, wrapper: 12 },
                                    lg: { container: 12, label: 12, wrapper: 12 },
                                },
                                schema: {
                                    latitude: {
                                        type: "text",
                                        label: "Latitude",
                                        rules: [],
                                    },
                                    longitude: {
                                        type: "text",
                                        label: "Longitude",
                                        rules: [],
                                    },
                                },
                            }
                        },
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 12, label: 12, wrapper: 12 },
                            lg: { container: 12, label: 12, wrapper: 12 },
                        },
                    },

                    region: {
                        label: "Region",
                        type: "select",
                        rules: [],
                        items: "project-types",
                        dataKey: "data",
                        labelProp: "name",
                        valueProp: "id",
                        search: true,
                        native: true,
                        inputType: "search",
                        autocomplete: "off",
                    },

                    city: {
                        label: "Villes",
                        type: "select",
                        rules: [],
                        items: "project-types",
                        dataKey: "data",
                        labelProp: "name",
                        valueProp: "id",
                        search: true,
                        native: true,
                        inputType: "search",
                        autocomplete: "off",
                    },
                },
            },

            image_principal: {
                type: 'file',
                accepted: ["image/jpeg", "image/jpg", "image/png"],
                label: "Image principale",
                info: "Image principale",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
                rules: [],
                drop:true
            },

            findingSource: {
                label: "Source de financement",
                type: "object",
                addClasses: {
                    ElementLayout: {
                        innerContainer:
                            "border border-gray-200 bg-primary-50 px-3 px-2 py-5",
                    },

                    ElementLabel: {
                        wrapper: "text-lg py-1.5",
                        container_lg: "!pb-0",
                    },
                },
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
                schema: {
                    donor: {
                        label: "Donateur",
                        info: "Donateur",
                        type: "text",
                        rules: [],
                    },
                    program: {
                        label: "Programme",
                        info: "Programme",
                        type: "text",
                        rules: [],
                    }
                },
            },

            reportingYear: {
                type: "date",
                label: "Date du rapport",
                info: "Date",
                rules: [],
            },

            instrumentType: {
                type: "select",
                label: "Type d'instrument",
                info: "Type d'instrument",
                rules: [],
                items: "project-types",
                dataKey: "data",
                labelProp: "name",
                valueProp: "id",
                search: true,
                native: true,
                inputType: "search",
                autocomplete: "off",
            },

            amountCommitedCfa: {
                type: "string",
                label: "Montant engagé",
                info: "Montant engagé",
                rules: [],
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            },

            amountDisbursedCfa: {
                type: "string",
                label: "Montant distribué",
                info: "Montant distribué",
                rules: [],
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 12, label: 12, wrapper: 12 },
                    lg: { container: 12, label: 12, wrapper: 12 },
                },
            }
        }

    }))

    return {
        createProject,
        createProjectFormEl,
        createProjectForm,
    }


}