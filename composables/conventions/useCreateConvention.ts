
import { transformTmpPayload } from '~/utils/transformTmpPayload'


export const useCreateConvention = () => {

    const {$sisepApi} = useNuxtApp()

    const createConvention = async (data: any) => {

        const response = await $sisepApi('conventions', {

            method: 'POST',
            body: data,

            onResponse: ({response}) => {

                console.log(response);

                if (response.status === 201 || response.status === 200) {

                    makeAlert({
                        type: "success",
                        title: "Nouvelle convention créée !",
                        message: `La convention ${response._data.title} a été créée avec succès`,
                    })

                    navigateTo({name: 'project-module-conventions', params: {id: response._data.id}})

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

    const createConventionFormEl = ref(null)

    const createConventionForm = computed(() => ({
        scrollOnNext: true,
        id: "createConventionForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["label"],

        endpoint: async (form: any, payload: any) => {
            const d = payload.requestData || {}

            let payloadConvention = {
                ...d,
            }

            const transformedPayload = transformTmpPayload(payloadConvention)

            console.log(JSON.stringify(transformedPayload))

            await createConvention(transformedPayload)

        },

        tabs: {
            info_convention: {
                label: "Informations Générales",
                elements: [
                    "coverImageId",
                    "title",
                    "conventionNumber",
                    "conventionDate",
                    "status",
                    "description",
                    "objective",
                    "scope",
                    "obligations",
                ],
            },

            parties: {
                label: "Parties prenantes",
                elements: [
                    "signatories",
                ],
            },

            financial: {
                label: "Aspects financiers",
                elements: [
                    "budget",
                    "financialTerms",
                ],
            },

            documents: {
                label: "Documents",
                elements: [
                    "files"
                ]
            },

            validity: {
                label: "Durée et validité",
                elements: [
                    "startDate",
                    "endDate",
                    "renewalConditions",
                ],
            },

        },

        schema: {

            title: {
                type: 'text',
                default: '',
                label: "Titre de la convention",
                info: "Fournir un titre pour la convention",
                placeholder: "Ex: Convention de partenariat pour le développement rural",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },
                rules: ['required'],
            },

            conventionNumber: {
                type: 'text',
                label: 'Numéro de convention',
                placeholder: "Ex: CONV-2025-001",
                info: "Numéro unique d'identification de la convention",
            },

            conventionDate: {
                type: 'date',
                label: 'Date de signature',
                info: "Date à laquelle la convention a été signée",
            },

            startDate: {
                type: 'date',
                label: 'Date de début',
                info: "Date de prise d'effet de la convention",
            },

            endDate: {
                type: 'date',
                label: 'Date de fin',
                info: "Date de fin prévue de la convention",
            },

            description: {
                type: 'editor',
                default: '',
                rows: 7,
                label: "Description de la convention",
                info: "Décrivez la convention et son contexte",
                rules: [],
            },

            objective: {
                type: 'object',
                label: 'Objectif de la convention',
                schema: {
                    goal: {
                        type: 'editor',
                        columns: {
                            lg: {container: 12, label: 12, wrapper: 12},
                        },
                    }
                }
            },

            scope: {
                type: 'object',
                label: 'Champ d\'application',
                schema: {
                    content: {
                        type: 'editor',
                        label: 'Domaines couverts par la convention',
                        columns: {
                            lg: {container: 12, label: 12, wrapper: 12},
                        },
                    }
                }
            },

            status: {
                type: 'select',
                label: "Statut de la convention",
                items: [
                    {value: 'DRAFT', label: 'Brouillon'},
                    {value: 'ACTIVE', label: 'Active'},
                    {value: 'EXPIRED', label: 'Expirée'},
                    {value: 'TERMINATED', label: 'Résiliée'},
                ],
                native: false,
            },

            obligations: {
                type: 'list',
                initial: 0,
                addText: "Ajouter une obligation",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {
                    type: 'object',
                    label: (el$) => `Obligation ${parseInt(el$.dataPath.replace('obligations.', '')) + 1}`,

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
                        party: {
                            type: 'text',
                            label: 'Partie concernée',
                            placeholder: "Ex: Le Ministère, Le Partenaire",
                        },

                        description: {
                            type: 'editor',
                            label: 'Description de l\'obligation',
                            columns: {
                                lg: {container: 12, label: 12, wrapper: 12},
                            },
                        },

                        deadline: {
                            type: 'date',
                            label: 'Échéance',
                        },
                    }
                }
            },

            signatories: {
                type: 'list',
                initial: 0,
                addText: "Ajouter un signataire",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {
                    type: 'object',
                    label: (el$) => `Signataire ${parseInt(el$.dataPath.replace('signatories.', '')) + 1}`,

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
                            type: 'text',
                            label: 'Nom du signataire',
                            placeholder: "Ex: Dr. Jean Dupont",
                        },

                        title: {
                            type: 'text',
                            label: 'Titre/Fonction',
                            placeholder: "Ex: Ministre, Directeur Général",
                        },

                        organization: {
                            type: 'text',
                            label: 'Organisation',
                            placeholder: "Ex: Ministère de l'Environnement",
                        },

                        signature: {
                            type: 'file',
                            accepted: ["image/jpeg", "image/jpg", "image/png"],
                            label: "Signature",
                            drop: true,
                        },
                    }
                }
            },

            budget: {
                type: 'object',
                label: 'Budget',
                addClasses: {
                    ElementLayout: {
                        innerContainer: "border border-gray-200 bg-gray-50 px-3 py-5",
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
                    totalAmount: {
                        type: 'text',
                        mask: 'number',
                        label: 'Montant total',
                        placeholder: "Ex: 50000000",
                    },

                    currency: {
                        type: 'select',
                        label: 'Devise',
                        native: false,
                        items: [
                            {value: 'EUR', label: 'Euros'},
                            {value: 'USD', label: 'Dollar'},
                            {value: 'XOF', label: 'F CFA'},
                        ],
                    },

                    breakdown: {
                        type: 'editor',
                        label: 'Répartition du budget',
                        columns: {
                            lg: {container: 12, label: 12, wrapper: 12},
                        },
                    }
                }
            },

            financialTerms: {
                type: 'object',
                label: 'Modalités financières',
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },
                schema: {
                    paymentSchedule: {
                        type: 'editor',
                        label: 'Calendrier de paiement',
                        columns: {
                            lg: {container: 12, label: 12, wrapper: 12},
                        },
                    }
                }
            },

            renewalConditions: {
                type: 'object',
                label: 'Conditions de renouvellement',
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },
                schema: {
                    content: {
                        type: 'editor',
                        label: 'Conditions de renouvellement de la convention',
                        columns: {
                            lg: {container: 12, label: 12, wrapper: 12},
                        },
                    }
                }
            },

            coverImageId: {
                type: 'file',
                accepted: ["image/jpeg", "image/jpg", "image/png"],
                label: "Image principale",
                info: "Image représentant la convention",
                columns: {
                    default: {container: 12, label: 12, wrapper: 12},
                    sm: {container: 12, label: 12, wrapper: 12},
                    md: {container: 12, label: 12, wrapper: 12},
                    lg: {container: 12, label: 12, wrapper: 12},
                },
                rules: [],
                drop: true
            },

            files: {
                type: 'list',
                initial: 0,
                addText: "Ajouter un document",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {
                    type: 'object',
                    label: (el$) => `Document ${parseInt(el$.dataPath.replace('files.', '')) + 1}`,

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
                        documentType: {
                            type: 'select',
                            label: "Type de document",
                            items: [
                                {value: 'annexe', label: 'Annexe'},
                                {value: 'amendement', label: 'Amendement'},
                                {value: 'rapport', label: 'Rapport'},
                                {value: 'autre', label: 'Autre'},
                            ],
                            native: false,
                        },

                        fileId: {
                            type: 'file',
                            label: 'Fichier',
                            drop: true,
                        },
                    }
                }
            },
        }
    }))

    return {
        createConvention,
        createConventionFormEl,
        createConventionForm,
    }
}