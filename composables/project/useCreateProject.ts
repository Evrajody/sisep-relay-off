export const useCreateProject = () => {

    const {$sisepApi} = useNuxtApp()

    const createProject = async (data: any) => {

        const response = await $sisepApi('projects', {

            method: 'POST',
            body: data,

            onResponse: ({response}) => {

                console.log(response);

                if (response.status === 201 || response.status === 200) {

                    // redirection vers la liste
                    // alert('Projet créé avec succès')
                    makeAlert({
                        type: "success",
                        title: "Nouveau projet créé !",
                        message: `Le projet ${response._data.title} a été créé avec succès`,
                    })

                    navigateTo({name: 'project-module', params: {id: response._data.id}})

                }

                if (response.status === 400) {

                    makeAlert({
                        type: "error",
                        title: "OUPS ERREUR !",
                        message: `Erreur sur la cle ${response?._data?.errors[0]?.path}, ${response?._data?.errors[0]?.message}`,
                        extraClass: "bg-red-500",
                    })

                }
            },

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
            // Build the request object to match the expected API structure
            const d = payload.requestData || {}

            // console.log(JSON.stringify(req))

            let payloadProject = {
                ...d,
                location: {
                    ...d.location,
                    location: (d.location.location.latitude && d.location.location.longitude) ? {
                        ...d.location.location,
                        coordinates:   [[d.location.location.latitude, d.location.location.longitude]]
                    } : null,
                }
            }

            console.log(JSON.stringify(payloadProject))

            await createProject(payloadProject)
        },

        tabs: {
            info_project: {
                label: "Informations Générales",
                elements: [
                    "coverImageId",
                    "title",
                    "typeId",
                    "status",
                    "startDate",
                    "endDate",
                    "description",
                    "objective",
                    "expectedResults",
                    "lessonsLearned",
                    'infoLinks'
                ],
            },

            indicateurs: {
                label: "Indicateurs",
                elements: [
                    "indicators",
                ],
            },

            actions: {
                label: "Actions",
                elements: [
                    "actions",
                ],
            },

            partenaires: {
                label: "Partenaires",
                elements: [
                    "partners",
                ],
            },

            targets: {
                label: "Cibles",
                elements: [
                    "targets",
                ],
            },

            filesAssocieted: {
                label: "Fichiers associés",
                elements: [
                    "files"
                ]
            },


            financement: {
                label: "Financements",
                elements: [
                    // "budget",
                    "finance",
                ],
            },

            territoire: {
                label: "Territoire",
                elements: [
                    "location",
                    "region",
                    "city"
                ],
            },

            verification: {
                label: "Verification",
                elements: [
                    "verifications",
                ],
            },

        },
        schema: {

            title: {
                type: 'text', default: '',
                label: "Intitulé du projet",
                info: "Fournisseur un titre génériques pour le projet",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },
                rules: [],
            },

            startDate: {
                type: 'date',
                label: 'Date de début'
            },

            endDate: {
                type: 'date',
                label: 'Date de fin'
            },

            description: {
                type: 'editor',
                default: '',
                rows: 7,
                label: "Description du projet",
                info: "Décrivez le projet",
                rules: [],
            },

            objective: {
                type: 'object',
                label: 'Objectif du projet',
                schema: {
                    goal: {
                        type: 'editor',
                        columns: {
                            lg: {container: 12, label: 12, wrapper: 12},
                        },
                    }
                }
            },

            expectedResults: {
                type: 'object',
                label: 'Résultats attendus',
                schema: {
                    result: {
                        type: 'editor',
                        columns: {
                            lg: {container: 12, label: 12, wrapper: 12},
                        },
                    }
                }
            },

            lessonsLearned: {
                type: 'object',
                label: 'Leçons apprises',
                schema: {
                    lesson:
                        {
                            type: 'editor',
                            columns: {
                                lg: {container: 12, label: 12, wrapper: 12},
                            },
                        }
                }
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

            status: {
                type: 'select',
                label: "Statut du projet",
                items: [
                    {value: 'DRAFT', label: 'Brouillon'},
                    {value: 'PUBLISHED', label: 'Publié'},
                    {value: 'ARCHIVED', label: 'Archivé'},
                ],

                native: false,
            },


            indicators: {

                type: "list",
                initial: 0,
                addText: "Ajouter un nouvel indicateur",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {

                    type: "object",

                    addClasses: {
                        ElementLayout: {
                            innerContainer: "border border-gray-200 bg-gray-50 px-3 py-5",
                        },

                        ElementLabel: {
                            wrapper: "text-xl text-primary py-1.5",
                            container_lg: "!pb-0",
                        },
                    },

                    columns: {
                        lg: {container: 12, label: 12, wrapper: 12},
                    },

                    schema: {

                        activate_select_indicators: {
                            type: "toggle",
                            text: "Activer la selection d'un indicateur",
                        },

                        separator: {
                            type: "static",
                            tag: "hr",
                            columns: {
                                lg: {container: 12, label: 12, wrapper: 12},
                            },
                        },

                        indicatorss: {

                            label: "Indicateur associable au projet",
                            type: "select",
                            description: "Sélectionnez un indicateur existant associé au projet",
                            conditions: [["indicators.*.activate_select_indicators", true]], //
                            search: true,
                            native: true,
                            object: true,
                            inputType: "search",
                            searchParam: "search",
                            valueProp: "id",
                            labelProp: "nom",
                            delay: 1,
                            autocomplete: "off",
                            columns: {
                                lg: {container: 12, label: 12, wrapper: 12},
                            },

                            addClasses: {
                                dropdown: "max-h-60 overflow-y-auto",
                                ElementDescription: {
                                    container_lg: "!text-gray-400 font-medium",
                                },
                            },

                            items: [
                                'indicatoris 01',
                                'indicatoris 02',
                                'indicatoris 03',
                            ],

                        },

                        create_indicator_stuff: {
                            conditions: [["indicators.*.activate_select_indicators", false]],
                            type: "group",
                            columns: {
                                lg: {container: 12, label: 12, wrapper: 12},
                            },

                            schema: {

                                indicatorName: {
                                    type: 'text', default: '',
                                    label: "Libelle de l'indicateur",
                                    rules: ["required"],
                                    info: "Formuler un libelle pour l'indicateur",
                                    columns: {
                                        lg: {container: 12, label: 12, wrapper: 12},
                                    },
                                },

                                baselineYear: {
                                    type: 'date',
                                    label: "Année de base",
                                    rules: ["required"],
                                    info: "Formuler un libelle pour l'indicateur",
                                },

                                baselineValue: {
                                    type: 'text', default: '',
                                    label: "Valeur de base",
                                    rules: ["required"],
                                    info: "Formuler un libelle pour l'indicateur",
                                },

                                targetYear: {
                                    type: 'date',
                                    label: "Année cible",
                                    rules: ["required"],
                                    info: "Formuler un libelle pour l'indicateur",
                                },

                                targetValue: {
                                    type: 'text', default: '',
                                    label: "Valeur cible",
                                    rules: ["required"],
                                    info: "Formuler un libelle pour l'indicateur",
                                },

                                latestYear: {
                                    type: 'date',
                                    label: "Année la plus récente",
                                    rules: ["required"],
                                    info: "Formuler un libelle pour l'indicateur",
                                },

                                latestValue: {
                                    type: 'text', default: '',
                                    label: "Valeur la plus récente",
                                    rules: ["required"],
                                    info: "Formuler un libelle pour l'indicateur",
                                },

                                methodologyReference: {
                                    type: 'object',
                                    columns: {
                                        lg: {container: 12, label: 12, wrapper: 12},
                                    },
                                    schema: {
                                        url: {
                                            rules: [],
                                            type: 'text', default: '',
                                            label: "Methodologie de référence",
                                            info: "Url de la methodologie de référence",
                                            columns: {
                                                lg: {container: 12, label: 12, wrapper: 12},
                                            },
                                        },
                                    }
                                }
                            }
                        }

                    },
                },

            },

            actions: {
                type: 'list',
                initial: 0,
                label: 'Actions',
                addText: "Ajouter une action",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },
                element: {

                    type: 'object',

                    columns: {
                        lg: {container: 12, label: 12, wrapper: 12},
                    },

                    addClasses: {

                        ElementLayout: {
                            innerContainer: "border border-gray-200 bg-gray-50 px-3 py-5",
                        },

                        ElementLabel: {
                            wrapper: "text-xl text-primary py-1.5",
                            container_lg: "!pb-0",
                        },
                    },

                    schema: {

                        type: {
                            type: 'text', default: '',
                            label: "Type de l'action",
                            description: "Nature de l'action",
                            rules: [],
                        },

                        status: {
                            type: 'text', default: '',
                            label: "Statut de l'action",
                            rules: [],
                        },

                        description: {
                            type: 'text', default: '',
                            label: "Description de l'action",
                            description: "Décrivez l'action",
                            rules: [],
                            columns: {
                                lg: {container: 12, label: 12, wrapper: 12},
                            },
                        },
                    }
                }
            },

            partners: {

                type: 'list',
                initial: 0,
                label: 'Partenaires du projet',
                addText: "Ajouter un partenaire",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {

                    type: 'object',

                    columns: {
                        lg: {container: 12, label: 12, wrapper: 12},
                    },

                    addClasses: {

                        ElementLayout: {
                            innerContainer: "border border-gray-200 bg-gray-50 px-3 py-5",
                        },

                        ElementLabel: {
                            wrapper: "text-xl text-primary py-1.5",
                            container_lg: "!pb-0",
                        },
                    },
                    schema: {

                        name: {
                            type: 'text', default: '',
                            label: 'Nom',
                        },

                        type: {
                            type: 'text', default: '',
                            label: 'Type de partenaire',
                        },

                        otherData: {

                            type: 'object',

                            columns: {
                                lg: {container: 12, label: 12, wrapper: 12},
                            },
                            schema: {
                                role: {
                                    label: 'Role',
                                    type: 'text', default: '',
                                    columns: {
                                        lg: {container: 12, label: 12, wrapper: 12},
                                    },
                                },

                                partnerImage: {
                                    type: 'file',
                                    accepted: ["image/jpeg", "image/jpg", "image/png"],
                                    label: "Image du partenaire",
                                    rules: [],
                                },
                            },
                        }
                    }
                }

            },

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
                rules: [],
                drop: true
            },

            targets: {

                type: 'list',
                initial: 0,
                label: 'Cible du projet',
                addText: "Ajouter une cible",

                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {

                    type: 'object',

                    columns: {
                        lg: {container: 12, label: 12, wrapper: 12},
                    },

                    addClasses: {

                        ElementLayout: {
                            innerContainer: "border border-gray-200 bg-gray-50 px-3 py-5",
                        },

                        ElementLabel: {
                            wrapper: "text-xl text-primary py-1.5",
                            container_lg: "!pb-0",
                        },

                    },

                    schema: {

                        name: {
                            type: 'text', default: '',
                            label: 'Nom',
                        },

                        description: {
                            type: 'text', default: '',
                            label: 'Description',
                        },


                    }
                }

            },

            verifications: {
                type: 'list',
                canAdd: true,
                addText: "Ajouter une vérification",

                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {
                    type: 'object',
                    addClasses: {
                        ElementLayout: {
                            innerContainer: "border border-gray-200 bg-gray-50 px-3 py-5",
                        },

                        ElementLabel: {
                            wrapper: "text-xl text-primary py-1.5",
                            container_lg: "!pb-0",
                        },
                    },
                    columns: {
                        lg: {container: 12, label: 12, wrapper: 12},
                    },
                    schema: {
                        verificationLevel: {
                            type: "text",
                            label: "Niveau de vérification",
                        },
                        verificationDate: {
                            type: "date",
                            label: "Date de vérification",
                        },
                        verifier: {
                            type: "object",
                            columns: {
                                lg: {container: 12, label: 12, wrapper: 12},
                            },
                            schema: {
                                name: {
                                    type: 'text', default: '',
                                    label: 'Nom',
                                },
                                organization: {
                                    type: "text",
                                    label: "Organisation",
                                }
                            }
                        },
                        verificationReportReference: {
                            type: "file",
                            label: "Rapport de vérification",
                            columns: {
                                default: {container: 12, label: 12, wrapper: 12},
                                sm: {container: 12, label: 12, wrapper: 12},
                                md: {container: 12, label: 12, wrapper: 12},
                                lg: {container: 12, label: 12, wrapper: 12},
                            },
                            drop: true
                        }
                    }
                }
            },

            finance: {
                type: 'object',
                label: 'Finances',
                addClasses: {

                    ElementLayout: {
                        innerContainer: "border border-gray-200 bg-gray-50 px-3 py-5",
                    },

                    ElementLabel: {
                        wrapper: "text-xl text-primary py-1.5",
                        container_lg: "!pb-0",
                    },
                },
                columns: {
                    default: {container: 12, label: 12, wrapper: 12},
                    sm: {container: 12, label: 12, wrapper: 12},
                    md: {container: 12, label: 12, wrapper: 12},
                    lg: {container: 12, label: 12, wrapper: 12},
                },
                schema: {
                    reportingYear: {type: 'date', label: 'Date du rapport'},
                    instrumentType: {type: 'text', default: '', label: 'Type d\'instrument'},
                    amountCommitedCfa: {type: 'text', default: '', label: 'Montant engagé'},
                    amountDisbursedCfa: {type: 'text', default: '', label: 'Montant distribué'},
                    currency: {
                        type: 'select',
                        label: 'Devise',
                        native: false,
                        items: [
                            {value: 'EUR', label: 'Euros'},
                            {value: 'US', label: 'Dollar'},
                            {value: 'XOF', label: 'F CFA'},
                        ],
                    },
                    exchangeRateUsed: {type: 'text', default: '', label: 'Taux de change utilisé'},
                    fundingSource: {
                        type: 'object',
                        label: 'Source de financement',
                        columns: {
                            default: {container: 12, label: 12, wrapper: 12},
                            sm: {container: 12, label: 12, wrapper: 12},
                            md: {container: 12, label: 12, wrapper: 12},
                            lg: {container: 12, label: 12, wrapper: 12},
                        },
                        schema: {
                            donor: {type: 'text', default: '', label: 'Donateur'},
                            program: {type: 'text', default: '', label: 'Programme'},
                        },
                    }
                }
            },

            files: {
                type: 'list',
                initial: 0,
                label: 'Fichier associé au projet',
                addText: "Ajouter un fichier",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {

                    type: 'object',

                    columns: {
                        lg: {container: 12, label: 12, wrapper: 12},
                    },

                    addClasses: {

                        ElementLayout: {
                            innerContainer: "border border-gray-200 bg-gray-50 px-3 py-5",
                        },

                        ElementLabel: {
                            wrapper: "text-xl text-primary py-1.5",
                            container_lg: "!pb-0",
                        },
                    },

                    schema: {

                        fileLabel: {
                            label: 'Indications sur le fichier / document',
                            type: 'text', default: '',
                        },

                        fileId: {
                            type: 'file',
                            label: 'Fichier',
                        },

                    }
                }

            },

            location: {
                label: "Lieu du projet",
                type: "object",
                addClasses: {
                    ElementLayout: {
                        innerContainer: "border border-gray-200 bg-gray-50 px-3 px-2 py-5",
                    },

                    ElementLabel: {
                        wrapper: "text-lg py-1.5",
                        container_lg: "!pb-0",
                    },
                },
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },
                schema: {
                    region: {
                        label: "Département",
                        type: "select",
                        rules: [],
                        items: [
                            'cotonou',
                            'calavi'
                        ],
                        valueProp: "id",
                        search: true,
                        native: true,
                        inputType: "search",
                        autocomplete: "off",
                    },

                    city: {
                        label: "Villes (Communes)",
                        type: "select",
                        rules: [],
                        items: [
                            'cotonou',
                            'calavi'
                        ],
                        labelProp: "name",
                        valueProp: "id",
                        search: true,
                        native: true,
                        inputType: "search",
                        autocomplete: "off",
                    },

                    location: {
                        type: "object",
                        schema: {
                            type: {
                                type: "hidden",
                                default: "point",
                                columns: {
                                    lg: {container: 12, label: 12, wrapper: 12},
                                },
                            },
                            coordinates: {
                                type: "object",
                                columns: {
                                    lg: {container: 12, label: 12, wrapper: 12},
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
                            lg: {container: 12, label: 12, wrapper: 12},
                        },
                    },
                },
            },

            infoLinks: {
                type: 'object',
                label: 'Liens d\'infos',
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },
                schema: {
                    infoLinks_website: {
                        type: 'text', default: '',
                        label: 'Site web'
                    }
                }
            },

        }

    }))

    return {
        createProject,
        createProjectFormEl,
        createProjectForm,
    }


}