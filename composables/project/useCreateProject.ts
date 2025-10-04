
import { transformTmpPayload } from '~/utils/transformTmpPayload'


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

            const transformedPayload = transformTmpPayload(payloadProject)

            console.log(JSON.stringify(transformedPayload))

            await createProject(transformedPayload)

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
                    "finances",
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
                placeholder: "Ex: Projet d'amélioration de l'accès à l'eau potable",
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
                    label: (el$) => `Indicateur ${parseInt(el$.dataPath.replace('indicators.', '')) + 1}`,

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

                        // activate_select_indicators: {
                        //     type: "toggle",
                        //     text: "Activer la selection d'un indicateur",
                        // },

                        // separator: {
                        //     type: "static",
                        //     tag: "hr",
                        //     columns: {
                        //         lg: {container: 12, label: 12, wrapper: 12},
                        //     },
                        // },

                        indicatorId: {

                            label: "Indicateur associable au projet",
                            type: "select",
                            description: "Sélectionnez un indicateur existant associé au projet",
                            // conditions: [["indicators.*.activate_select_indicators", true]], //
                            search: true,
                            native: true,
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
                            // conditions: [["indicators.*.activate_select_indicators", false]],
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
                                    placeholder: "Ex: Taux d'accès à l'eau potable",
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
                                    placeholder: "Ex: 45%",
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
                                    placeholder: "Ex: 80%",
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
                                    placeholder: "Ex: 65%",
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
                                            placeholder: "Ex: https://exemple.com/methodologie.pdf",
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
                addText: "Ajouter une action",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {

                    type: 'object',
                    label: (el$) => `Action ${parseInt(el$.dataPath.replace('actions.', '')) + 1}`,
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
                            placeholder: "Ex: Formation, Sensibilisation, Construction",
                            rules: [],
                        },

                        status: {
                            type: 'text', default: '',
                            label: "Statut de l'action",
                            placeholder: "Ex: En cours, Terminée, Planifiée",
                            rules: [],
                        },

                        description: {
                            type: 'text', default: '',
                            label: "Description de l'action",
                            description: "Décrivez l'action",
                            placeholder: "Ex: Formation de 50 agents sur les techniques de purification",
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
                addText: "Ajouter un partenaire",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {

                    type: 'object',
                    label: (el$) => `Partenaire ${parseInt(el$.dataPath.replace('partners.', '')) + 1}`,

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
                            placeholder: "Ex: Ministère de l'Eau, ONG XYZ",
                        },

                        type: {
                            type: 'text', default: '',
                            label: 'Type de partenaire',
                            placeholder: "Ex: Technique, Financier, Institutionnel",
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
                                    placeholder: "Ex: Bailleur de fonds, Expert technique, Coordonnateur",
                                    columns: {
                                        lg: {container: 12, label: 12, wrapper: 12},
                                    },
                                },

                                coverageFileId: {
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
                addText: "Ajouter une cible",

                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {

                    type: 'object',
                    label: (el$) => `Cible ${parseInt(el$.dataPath.replace('targets.', '')) + 1}`,

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
                            placeholder: "Ex: Femmes rurales, Enfants de 5-15 ans",
                        },

                        description: {
                            type: 'text', default: '',
                            label: 'Description',
                            placeholder: "Ex: Population des zones rurales de 18 à 60 ans",
                        },


                    }
                }

            },

            verifications: {
                type: 'list',
                initial: 0,
                addText: "Ajouter une vérification",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {
                    type: 'object',
                    label: (el$) => `Vérification ${parseInt(el$.dataPath.replace('verifications.', '')) + 1}`,
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
                            placeholder: "Ex: Niveau 1, Niveau 2, Audit complet",
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
                                    placeholder: "Ex: Jean Dupont",
                                },
                                organization: {
                                    type: "text",
                                    label: "Organisation",
                                    placeholder: "Ex: Bureau d'Audit National",
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

            finances: {
                type: 'list',
                initial: 1,
                canAdd: false,
                canRemove: false,
                min: 1,
                max: 1,
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {

                    type: 'object',
                    //  label: (el$) => `Fichier ${parseInt(el$.dataPath.replace('finances.', '')) + 1}`,

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
                        reportingYear: {type: 'date', label: 'Date du rapport'},
                        instrumentType: {type: 'text', default: '', label: 'Type d\'instrument', placeholder: "Ex: Subvention, Prêt, Don"},
                        amountCommitedCfa: {
                            type: 'text',
                            default: '',
                            label: 'Montant engagé',
                            mask: 'number',
                            placeholder: "Ex: 50000000"
                        },

                        amountDisbursedCfa: {
                            type: 'text',
                            default: '',
                            label: 'Montant distribué',
                            mask: 'number',
                            placeholder: "Ex: 25000000"
                        },

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

                        exchangeRateUsed: {
                            type: 'text',
                            mask: 'number',
                            default: '',
                            label: 'Taux de change utilisé',
                            placeholder: "Ex: 655.957"
                        },
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
                                donor: {type: 'text', default: '', label: 'Donateur', placeholder: "Ex: Banque Mondiale, UE, AFD"},
                                program: {type: 'text', default: '', label: 'Programme', placeholder: "Ex: Programme de développement rural"},
                            },
                        }
                    }

                }

            },

            // finances: {
            //     type: 'object',
            //     label: 'Finances',
            //     addClasses: {
            //
            //         ElementLayout: {
            //             innerContainer: "border border-gray-200 bg-gray-50 px-3 py-5",
            //         },
            //
            //         ElementLabel: {
            //             wrapper: "text-xl text-primary py-1.5",
            //             container_lg: "!pb-0",
            //         },
            //     },
            //     columns: {
            //         default: {container: 12, label: 12, wrapper: 12},
            //         sm: {container: 12, label: 12, wrapper: 12},
            //         md: {container: 12, label: 12, wrapper: 12},
            //         lg: {container: 12, label: 12, wrapper: 12},
            //     },
            // },

            files: {
                type: 'list',
                initial: 0,
                addText: "Ajouter un fichier",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {

                    type: 'object',
                    label: (el$) => `Fichier ${parseInt(el$.dataPath.replace('files.', '')) + 1}`,

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

                        fileTypeId: {
                            type: 'select',
                            label: "Type de fichier",
                            info: "Nature du fichier par rapport au projet",
                            rules: [],
                            items: "file-types",
                            dataKey: "fileTypes",
                            labelProp: "name",
                            valueProp: "id",
                            search: true,
                            native: true,
                            inputType: "search",
                            autocomplete: "off",
                        },

                        fileId: {
                            type: 'file',
                            label: 'Fichier',
                        },

                    }
                }

            },

            location: {
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
                                        placeholder: "Ex: 6.3703",
                                    },
                                    longitude: {
                                        type: "text",
                                        label: "Longitude",
                                        rules: [],
                                        placeholder: "Ex: 2.3912",
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
                        type: 'text',
                        default: '',
                        label: 'Site web',
                        placeholder: "Ex: https://www.projet-exemple.bj"
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