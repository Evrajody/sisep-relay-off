export const useCreateProject = () => {

    const {$sisepApi} = useNuxtApp()

    const createProject = async (data: any) => {

        const response = await $sisepApi('projects', {
            method: 'post',
            body: data,
            onResponse: ({response}) => {
                console.log(response);

                if (response.status === 201 || response.status === 200) {
                    // redirection vers la liste
                    alert('Projet créé avec succès')
                }
            },

            onError: ({response}) => {
                console.log(response)
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
            // Build the request object to match the expected API structure
            const d = payload.requestData || {}

            // Helper: parse JSON textarea safely
            // const parseJson = (val: any, fallback: any) => {
            //     if (typeof val !== 'string') return fallback
            //     try {
            //         const out = JSON.parse(val);
            //         return out ?? fallback
            //     } catch {
            //         return fallback
            //     }
            // }
            // // Helper: split lines to array (ignores empty lines)
            // const splitLines = (val: any) => (typeof val === 'string' ? val.split(/\r?\n/).map(s => s.trim()).filter(Boolean) : Array.isArray(val) ? val : [])
            //
            // // Map coordinates to [lon, lat]
            // const lon = Number(d?.location?.location?.coordinates?.longitude ?? d?.location?.longitude)
            // const lat = Number(d?.location?.location?.coordinates?.latitude ?? d?.location?.latitude)
            // const hasCoords = !Number.isNaN(lon) && !Number.isNaN(lat)
            //
            // const req = {
            //     title: d.title ?? '',
            //     description: d.description ?? '',
            //     typeId: d.typeId ?? undefined,
            //     status: d.status ?? 'DRAFT',
            //     createdBy: d.createdBy ?? undefined,
            //     coverImageId: d.coverImageId ?? undefined,
            //     indicatorIds: splitLines(d.indicatorIds),
            //     implementingPartners: {
            //         partner1: {
            //             name: d?.implementingPartners?.partner1_name ?? '',
            //             role: d?.implementingPartners?.partner1_role ?? '',
            //         },
            //         partner2: {
            //             name: d?.implementingPartners?.partner2_name ?? '',
            //             role: d?.implementingPartners?.partner2_role ?? '',
            //         },
            //     },
            //     moduleClimat: {
            //         mitigation: {actions: splitLines(d?.moduleClimat?.mitigation_actions)},
            //         adaptation: {actions: splitLines(d?.moduleClimat?.adaptation_actions)},
            //     },
            //     objective: {goal: d?.objective?.objective_goal ?? ''},
            //     expectedResults: {result: d?.expectedResults?.expectedResults_result ?? ''},
            //     lessonsLearned: {lesson: d?.lessonsLearned?.lessonsLearned_lesson ?? ''},
            //     totalBudget: d.totalBudget ? Number(d.totalBudget) : undefined,
            //     infoLinks: {website: d.infoLinks_website ?? ''},
            //     startDate: d.startDate ?? undefined,
            //     endDate: d.endDate ?? undefined,
            //     sectorId: d.sectorId ?? undefined,
            //     subsectorId: d.subsectorId ?? undefined,
            //     budget: {
            //         projectId: d.budget_projectId ?? undefined,
            //         budget: d.budget_budget ? Number(d.budget_budget) : undefined,
            //         currency: d.budget_currency ?? undefined,
            //         deletedAt: d.budget_deletedAt ?? null,
            //     },
            //     location: {
            //         projectId: d.location_projectId ?? undefined,
            //         location: hasCoords ? {
            //             type: (d?.location?.location?.type ?? d?.location?.type ?? 'Point'),
            //             coordinates: [lon, lat],
            //         } : undefined,
            //         region: d?.location?.region ?? d?.region ?? undefined,
            //         city: d?.location?.city ?? d?.city ?? undefined,
            //         deletedAt: d.location_deletedAt ?? null,
            //     },
            //     files: parseJson(d.filesJson, []),
            //     finances: parseJson(d.financesJson, []),
            //     verifications: parseJson(d.verificationsJson, []),
            //     partners: parseJson(d.partnersJson, []),
            //     targets: parseJson(d.targetsJson, []),
            //     actions: parseJson(d.actionsJson, []),
            //     indicators: parseJson(d.indicatorsJson, []),
            // }
            //
            // console.log(JSON.stringify(req))

            console.log(JSON.stringify(d))
            await createProject(d)
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
                    // "totalBudget",
                    // "infoLinks",
                    // "sectorId",
                    // "subsectorId",
                ],
            },

            // indicateurs: {
            //     label: "Indicateurs",
            //     elements: [
            //         "indicatorIds",
            //     ],
            // },
            //
            // partenaires: {
            //     label: "Partenaires",
            //     elements: [
            //         "partners",
            //         // "implementingPartners",
            //     ],
            // },
            //
            // actions: {
            //     label: "Actions",
            //     elements: [
            //         "actionsJson",
            //     ],
            // },
            //
            // financement: {
            //     label: "Financements",
            //     elements: [
            //         // "totalBudget",
            //         "budget",
            //         "finance",
            //     ],
            // },
            //
            // territoire: {
            //     label: "Territoire",
            //     elements: [
            //         "location",
            //         "region",
            //         "city"
            //     ],
            // },
            //
            // population_cible: {
            //     label: "Populations cibles",
            //     elements: [
            //         "targets",
            //     ],
            // },
            //
            // verification: {
            //     label: "Verification",
            //     elements: [
            //         "verifications",
            //     ],
            // },

        },
        schema: {

            title: {
                type: 'text',
                label: "Intitulé du projet",
                info: "Fournisseur un titre génériques pour le projet",
                columns: {
                    default: {container: 12, label: 12, wrapper: 12},
                    sm: {container: 12, label: 12, wrapper: 12},
                    md: {container: 12, label: 12, wrapper: 12},
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
                rows: 7,
                label: "Description du pro" +
                    "jet",
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
                            default: {container: 12, label: 12, wrapper: 12},
                            sm: {container: 12, label: 12, wrapper: 12},
                            md: {container: 12, label: 12, wrapper: 12},
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
                            default: {container: 12, label: 12, wrapper: 12},
                            sm: {container: 12, label: 12, wrapper: 12},
                            md: {container: 12, label: 12, wrapper: 12},
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
                                default: {container: 12, label: 12, wrapper: 12},
                                sm: {container: 12, label: 12, wrapper: 12},
                                md: {container: 12, label: 12, wrapper: 12},
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


            indicatorIds: {

                type: "list",
                // label: "Indicateurs",
                addText: "Ajouter un nouvel indicateur",
                columns: {
                    default: {container: 12, label: 12, wrapper: 12},
                    sm: {container: 12, label: 12, wrapper: 12},
                    md: {container: 12, label: 12, wrapper: 12},
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
                        default: {container: 12, label: 12, wrapper: 12},
                        sm: {container: 12, label: 12, wrapper: 12},
                        md: {container: 12, label: 12, wrapper: 12},
                        lg: {container: 12, label: 12, wrapper: 12},
                    },

                    schema: {

                        code: {
                            type: "select",
                            label: "Libelle de l'indicateur",
                            search: true,
                            native: false,
                            inputType: 'search',
                            autocomplete: 'off',
                            items: [
                                {value: 'DRAFT', label: 'Brouillon'},
                                {value: 'PUBLISHED', label: 'Publié'},
                                {value: 'ARCHIVED', label: 'Archivé'},
                            ],
                            rules: [],
                            columns: {
                                default: {container: 12, label: 12, wrapper: 12},
                                sm: {container: 12, label: 12, wrapper: 12},
                                md: {container: 12, label: 12, wrapper: 12},
                                lg: {container: 12, label: 12, wrapper: 12},
                            },
                        },


                    },
                },


            },

            implementingPartners: {
                type: 'object',
                label: 'Partenaires d\'exécution',
                schema: {
                    partner1_name: {type: 'text', label: 'Partenaire 1 - Nom'},
                    partner1_role: {type: 'text', label: 'Partenaire 1 - Rôle'},
                    partner2_name: {type: 'text', label: 'Partenaire 2 - Nom'},
                    partner2_role: {type: 'text', label: 'Partenaire 2 - Rôle'},
                },
            },

            moduleClimat: {
                type: 'object',
                label: 'Module Climat',
                schema: {
                    mitigation_actions: {type: 'textarea', label: 'Atténuation - actions (1/ligne)', rows: 3},
                    adaptation_actions: {type: 'textarea', label: 'Adaptation - actions (1/ligne)', rows: 3},
                },
            },


            totalBudget: {
                type: 'text',
                label: "Budget total",
                info: "Montant total du budget",
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
                    default: {container: 12, label: 12, wrapper: 12},
                    sm: {container: 12, label: 12, wrapper: 12},
                    md: {container: 12, label: 12, wrapper: 12},
                    lg: {container: 12, label: 12, wrapper: 12},
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
                                    default: {container: 12, label: 12, wrapper: 12},
                                    sm: {container: 12, label: 12, wrapper: 12},
                                    md: {container: 12, label: 12, wrapper: 12},
                                    lg: {container: 12, label: 12, wrapper: 12},
                                },
                            },

                            coordinates: {
                                label: "Coordonnées",
                                type: "object",
                                columns: {
                                    default: {container: 12, label: 12, wrapper: 12},
                                    sm: {container: 12, label: 12, wrapper: 12},
                                    md: {container: 12, label: 12, wrapper: 12},
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
                            default: {container: 12, label: 12, wrapper: 12},
                            sm: {container: 12, label: 12, wrapper: 12},
                            md: {container: 12, label: 12, wrapper: 12},
                            lg: {container: 12, label: 12, wrapper: 12},
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

            infoLinks: {
                type: 'object',
                label: 'Liens d\'infos',
                schema: {infoLinks_website: {type: 'text', label: 'Site web'}}
            },

            sectorId: {type: 'text', label: 'Secteur (ID)'},
            subsectorId: {type: 'text', label: 'Sous-secteur (ID)'},

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

            budget: {
                label: "Budget (objet)",
                type: "object",
                schema: {
                    budget_projectId: {type: 'text', label: 'Project ID (optionnel)'},
                    budget_budget: {type: 'text', label: 'Montant'},
                    budget_currency: {type: 'text', label: 'Devise'},
                    budget_deletedAt: {type: 'text', label: 'Supprimé le (null si actif)'},
                },
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
                    default: {container: 12, label: 12, wrapper: 12},
                    sm: {container: 12, label: 12, wrapper: 12},
                    md: {container: 12, label: 12, wrapper: 12},
                    lg: {container: 12, label: 12, wrapper: 12},
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
                    default: {container: 12, label: 12, wrapper: 12},
                    sm: {container: 12, label: 12, wrapper: 12},
                    md: {container: 12, label: 12, wrapper: 12},
                    lg: {container: 12, label: 12, wrapper: 12},
                },
            },

            amountDisbursedCfa: {
                type: "string",
                label: "Montant distribué",
                info: "Montant distribué",
                rules: [],
                columns: {
                    default: {container: 12, label: 12, wrapper: 12},
                    sm: {container: 12, label: 12, wrapper: 12},
                    md: {container: 12, label: 12, wrapper: 12},
                    lg: {container: 12, label: 12, wrapper: 12},
                },
            }

            , filesJson: {type: 'textarea', label: 'Fichiers (JSON)'},
            finance: {
                type: 'object',
                label: 'Finances',
                columns: {
                    default: {container: 12, label: 12, wrapper: 12},
                    sm: {container: 12, label: 12, wrapper: 12},
                    md: {container: 12, label: 12, wrapper: 12},
                    lg: {container: 12, label: 12, wrapper: 12},
                },
                schema: {
                    reportingYear: {type: 'date', label: 'Date du rapport'},
                    instrumentType: {type: 'text', label: 'Type d\'instrument'},
                    amountCommitedCfa: {type: 'text', label: 'Montant engagé'},
                    amountDisbursedCfa: {type: 'text', label: 'Montant distribué'},
                    currency: {
                        type: 'select',
                        label: 'Devise',
                        columns: {
                            default: {container: 12, label: 12, wrapper: 12},
                            sm: {container: 12, label: 12, wrapper: 12},
                            md: {container: 12, label: 12, wrapper: 12},
                            lg: {container: 12, label: 12, wrapper: 12},
                        },
                        items: [
                            {value: 'EUR', label: 'Euros'},
                            {value: 'US', label: 'Dollar'},
                            {value: 'XOF', label: 'XOF'},
                        ],
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
                            donor: {type: 'text', label: 'Donateur'},
                            program: {type: 'text', label: 'Programme'},
                        },
                    }
                }
            },
            verifications: {
                type: 'object',
                // label: 'Vérifications',
                columns: {
                    default: {container: 12, label: 12, wrapper: 12},
                    sm: {container: 12, label: 12, wrapper: 12},
                    md: {container: 12, label: 12, wrapper: 12},
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
                        label: "Vérificateur",
                        columns: {
                            default: {container: 12, label: 12, wrapper: 12},
                            sm: {container: 12, label: 12, wrapper: 12},
                            md: {container: 12, label: 12, wrapper: 12},
                            lg: {container: 12, label: 12, wrapper: 12},
                        },
                        schema: {
                            name: {
                                type: 'text',
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
            },
            partners: {
                type: 'object', // Normalement ceci c'est une liste pour permettre d'ajpouter plusieurs partenaires (j'arrivais pas à configurer cela)
                label: 'Partenaires',
                columns: {
                    default: {container: 12, label: 12, wrapper: 12},
                    sm: {container: 12, label: 12, wrapper: 12},
                    md: {container: 12, label: 12, wrapper: 12},
                    lg: {container: 12, label: 12, wrapper: 12},
                },
                schema: {
                    name: {
                        type: 'text',
                        label: 'Nom',
                        columns: {
                            default: {container: 12, label: 12, wrapper: 12},
                            sm: {container: 4, label: 12, wrapper: 12},
                            md: {container: 4, label: 12, wrapper: 12},
                            lg: {container: 4, label: 12, wrapper: 12},
                        },
                    },
                    type: {
                        type: 'text',
                        label: 'Type',
                        columns: {
                            default: {container: 12, label: 12, wrapper: 12},
                            sm: {container: 4, label: 12, wrapper: 12},
                            md: {container: 4, label: 12, wrapper: 12},
                            lg: {container: 4, label: 12, wrapper: 12},
                        },
                    },
                    otherData: {
                        type: 'object',
                        // label: 'Autres données',
                        columns: {
                            default: {container: 4, label: 12, wrapper: 12},
                            sm: {container: 4, label: 12, wrapper: 12},
                            md: {container: 4, label: 12, wrapper: 12},
                            lg: {container: 4, label: 12, wrapper: 12},
                        },
                        schema: {
                            role: {
                                label: 'Role',
                                type: 'text',
                                columns: {
                                    default: {container: 12, label: 12, wrapper: 12},
                                    sm: {container: 12, label: 12, wrapper: 12},
                                    md: {container: 12, label: 12, wrapper: 12},
                                    lg: {container: 12, label: 12, wrapper: 12},
                                },
                            },
                        }
                    }
                }
            },
            targets: {
                type: 'object',
                label: 'Cibles',
                columns: {
                    default: {container: 12, label: 12, wrapper: 12},
                    sm: {container: 12, label: 12, wrapper: 12},
                    md: {container: 12, label: 12, wrapper: 12},
                    lg: {container: 12, label: 12, wrapper: 12},
                },
                schema: {
                    name: {
                        type: 'text',
                        label: 'Nom',
                        columns: {
                            default: {container: 12, label: 12, wrapper: 12},
                            sm: {container: 6, label: 12, wrapper: 12},
                            md: {container: 6, label: 12, wrapper: 12},
                            lg: {container: 6, label: 12, wrapper: 12},
                        },
                    },
                    otherData: {
                        type: 'object',
                        // label: 'Autres données',
                        columns: {
                            default: {container: 6, label: 12, wrapper: 12},
                            sm: {container: 6, label: 12, wrapper: 12},
                            md: {container: 6, label: 12, wrapper: 12},
                            lg: {container: 6, label: 12, wrapper: 12},
                        },
                        schema: {
                            size: {
                                label: 'Taille',
                                type: 'text',
                                inputType: 'number',
                                columns: {
                                    default: {container: 12, label: 12, wrapper: 12},
                                    sm: {container: 12, label: 12, wrapper: 12},
                                    md: {container: 12, label: 12, wrapper: 12},
                                    lg: {container: 12, label: 12, wrapper: 12},
                                },
                            },
                        }
                    },
                    description: {
                        type: 'textarea',
                        label: 'Description',
                        columns: {
                            default: {container: 12, label: 12, wrapper: 12},
                            sm: {container: 12, label: 12, wrapper: 12},
                            md: {container: 12, label: 12, wrapper: 12},
                            lg: {container: 12, label: 12, wrapper: 12},
                        },
                    },
                }
            },
            actionsJson: {type: 'textarea', label: 'Actions (JSON)'},
        }

    }))

    return {
        createProject,
        createProjectFormEl,
        createProjectForm,
    }


}