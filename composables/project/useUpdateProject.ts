import { transformProjectToPayload, transformPayloadToAPI, cleanPayload } from '~/utils/transformProjectToPayload';
import { transformTmpPayload } from '~/utils/transformTmpPayload';

export const useUpdateProject = (projectRef: any) => {

    const { $sisepApi } = useNuxtApp();
    const router = useRouter();

    /**
     * Met à jour un projet existant
     */
    const updateProject = async (data: any) => {
        try {
            const projectId = projectRef.value?.id;

            if (!projectId) {
                throw new Error('ID du projet manquant');
            }

            const response = await $sisepApi(`projects/${projectId}`, {
                method: 'PUT',
                body: data,

                onResponse: ({ response }) => {
                    console.log('Update response:', response);

                    if (response.status === 200 || response.status === 201) {
                        makeAlert({
                            type: "success",
                            title: "Projet mis à jour !",
                            message: `Le projet ${response._data.title} a été modifié avec succès`,
                        });

                        // Redirection vers la page de détail
                        navigateTo(`/project-module/${projectId}`);
                    }

                    if (response.status === 400) {
                        makeAlert({
                            type: "error",
                            title: "OUPS ERREUR !",
                            message: `Erreur sur la clé ${response?._data?.errors[0]?.path}, ${response?._data?.errors[0]?.message}`,
                            extraClass: "bg-red-500",
                        });
                    }

                    if (response.status === 404) {
                        makeAlert({
                            type: "error",
                            title: "Projet introuvable !",
                            message: `Le projet que vous essayez de modifier n'existe pas`,
                            extraClass: "bg-red-500",
                        });
                    }
                },
            });

            return response;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du projet:', error);
            throw error;
        }
    };

    const updateProjectFormEl = ref(null);

    /**
     * Transforme le projet en données de formulaire
     */
    const getFormDefaults = () => {
        if (!projectRef.value) {
            return {};
        }

        const formData = transformProjectToPayload(projectRef.value);
        console.log('Données transformées pour le formulaire:', formData);
        return formData;
    };

    /**
     * Génère la configuration du formulaire de modification
     * Utilise la même structure que le formulaire de création
     */
    const updateProjectForm = computed(() => ({
        scrollOnNext: true,
        id: "updateProjetForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["label"],

        // Chargement automatique des données du projet
        default: getFormDefaults(),

        endpoint: async (form: any, payload: any) => {
            const formData = payload.requestData || {};

            // Transformation du payload avec gestion de la location
            let payloadProject = {
                ...formData,
                location: {
                    ...formData.location,
                    location: (formData.location?.location?.latitude && formData.location?.location?.longitude) ? {
                        type: 'point',
                        coordinates: [[formData.location.location.latitude, formData.location.location.longitude]]
                    } : null,
                }
            };

            // Nettoyage et transformation des champs tmp
            const transformedPayload = transformTmpPayload(payloadProject);

            // Transformation vers le format API
            const apiPayload = transformPayloadToAPI(transformedPayload);

            // Nettoyage des champs vides
            const cleanedPayload = cleanPayload(apiPayload);

            console.log('Payload final envoyé:', JSON.stringify(cleanedPayload, null, 2));

            await updateProject(cleanedPayload);
        },

        // Réutilisation de la même structure de tabs que le formulaire de création
        // (copier depuis useCreateProject)
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
                elements: ["indicators"],
            },

            actions: {
                label: "Actions",
                elements: ["actions"],
            },

            partenaires: {
                label: "Partenaires",
                elements: ["partners"],
            },

            targets: {
                label: "Cibles",
                elements: ["targets"],
            },

            filesAssocieted: {
                label: "Fichiers associés",
                elements: ["files"]
            },

            financement: {
                label: "Financements",
                elements: ["finances"],
            },

            territoire: {
                label: "Territoire",
                elements: ["location", "region", "city"],
            },

            verification: {
                label: "Verification",
                elements: ["verifications"],
            },
        },

        // Schema identique à celui de création
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
                    lesson: {
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
                    label: (el$: any) => `Indicateur ${parseInt(el$.dataPath.replace('indicators.', '')) + 1}`,

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
                        indicatorId: {
                            label: "Indicateur associable au projet",
                            type: "select",
                            description: "Sélectionnez un indicateur existant associé au projet",
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
                    label: (el$: any) => `Action ${parseInt(el$.dataPath.replace('actions.', '')) + 1}`,
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
                    label: (el$: any) => `Partenaire ${parseInt(el$.dataPath.replace('partners.', '')) + 1}`,

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
                addText: "Ajouter une cible",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {
                    type: 'object',
                    label: (el$: any) => `Cible ${parseInt(el$.dataPath.replace('targets.', '')) + 1}`,

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
                    label: (el$: any) => `Vérification ${parseInt(el$.dataPath.replace('verifications.', '')) + 1}`,
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

            files: {
                type: 'list',
                initial: 0,
                addText: "Ajouter un fichier",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },

                element: {
                    type: 'object',
                    label: (el$: any) => `Fichier ${parseInt(el$.dataPath.replace('files.', '')) + 1}`,

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
    }));

    return {
        updateProject,
        updateProjectFormEl,
        updateProjectForm,
        getFormDefaults,
    };
};
