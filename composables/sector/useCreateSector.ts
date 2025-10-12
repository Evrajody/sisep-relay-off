export const useCreateSector = (refreshSectors: () => void) => {

    const { $sisepApi } = useNuxtApp()

    const createSector = async (data: any) => {
        const response = await $sisepApi('sectors', {
            method: 'POST',
            body: data,
            onResponse: ({ response }) => {
                console.log(response);

                if (response.status === 201 || response.status === 200) {
                    makeAlert({
                        type: "success",
                        title: "Nouveau secteur créé !",
                        message: `Le secteur a été créé avec succès`,
                    })
                    toggleModalCreateSector()
                    refreshSectors()
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

    const createSectorFormEl = ref(null)
    const createSectorForm = computed(() => ({
        scrollOnNext: true,
        id: "createSectorForm",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["artefact.identifier", "artefact.version"],

        endpoint: async (form: any, payload: any) => {
            // Restructurer les données pour correspondre à la structure attendue
            const formattedData = {
                parentId: payload.requestData.parentId || null,
                artefactId: payload.requestData.artefactId || null,
                artefact: {
                    agencyId: payload.requestData.artefact.agencyId,
                    version: payload.requestData.artefact.version,
                    uri: payload.requestData.artefact.uri || null,
                    urn: payload.requestData.artefact.urn || null,
                    isFinal: payload.requestData.artefact.isFinal || false,
                    isExternal: payload.requestData.artefact.isExternal || false,
                    validFrom: payload.requestData.artefact.validFrom || null,
                    validTo: payload.requestData.artefact.validTo || null,
                    structureUrl: payload.requestData.artefact.structureUrl || null,
                    serviceUrl: payload.requestData.artefact.serviceUrl || null,
                    isPartial: payload.requestData.artefact.isPartial || false,
                    nameJson: payload.requestData.artefact.nameJson || {},
                    identifier: payload.requestData.artefact.identifier,
                    descriptionJson: payload.requestData.artefact.descriptionJson || {},
                }
            }
            await createSector(formattedData)
        },

        schema: {
            // Section Parent
            parentId: {
                type: 'text',
                label: "ID Parent (optionnel)",
                description: "Identifiant du secteur parent si hiérarchie",
                placeholder: "Ex: parent-sector-123",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            artefactId: {
                type: 'text',
                label: "ID Artefact (optionnel)",
                description: "Identifiant de l'artefact existant",
                placeholder: "Ex: artefact-123",
                columns: {
                    default: { container: 12, label: 12, wrapper: 12 },
                    sm: { container: 12, label: 12, wrapper: 12 },
                    md: { container: 6, label: 12, wrapper: 12 },
                    lg: { container: 6, label: 12, wrapper: 12 },
                },
            },

            // Section Artefact - Informations principales
            artefact_section_1: {
                type: 'static',
                content: '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">Informations de l\'artefact</h3>',
                columns: {
                    default: { container: 12 },
                },
            },

            artefact: {
                type: 'object',
                schema: {
                    identifier: {
                        type: 'text',
                        label: "Identifiant",
                        description: "Identifiant unique de l'artefact",
                        placeholder: "Ex: SEC001",
                        rules: ['required'],
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 6, label: 12, wrapper: 12 },
                            lg: { container: 6, label: 12, wrapper: 12 },
                        },
                    },

                    agencyId: {
                        type: 'text',
                        label: "ID Agence",
                        description: "Identifiant de l'agence",
                        placeholder: "Ex: AGENCY-001",
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 6, label: 12, wrapper: 12 },
                            lg: { container: 6, label: 12, wrapper: 12 },
                        },
                    },

                    version: {
                        type: 'text',
                        label: "Version",
                        description: "Version de l'artefact",
                        placeholder: "Ex: 1.0.0",
                        rules: ['required'],
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 6, label: 12, wrapper: 12 },
                            lg: { container: 6, label: 12, wrapper: 12 },
                        },
                    },

                    uri: {
                        type: 'text',
                        label: "URI",
                        description: "URI de l'artefact",
                        placeholder: "Ex: https://example.com/sector/001",
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 6, label: 12, wrapper: 12 },
                            lg: { container: 6, label: 12, wrapper: 12 },
                        },
                    },

                    urn: {
                        type: 'text',
                        label: "URN",
                        description: "URN de l'artefact",
                        placeholder: "Ex: urn:sector:001",
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 6, label: 12, wrapper: 12 },
                            lg: { container: 6, label: 12, wrapper: 12 },
                        },
                    },

                    structureUrl: {
                        type: 'text',
                        label: "URL Structure",
                        description: "URL vers la structure",
                        placeholder: "Ex: https://example.com/structure",
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 6, label: 12, wrapper: 12 },
                            lg: { container: 6, label: 12, wrapper: 12 },
                        },
                    },

                    serviceUrl: {
                        type: 'text',
                        label: "URL Service",
                        description: "URL vers le service",
                        placeholder: "Ex: https://example.com/service",
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 6, label: 12, wrapper: 12 },
                            lg: { container: 6, label: 12, wrapper: 12 },
                        },
                    },

                    // Section booléens
                    artefact_section_2: {
                        type: 'static',
                        content: '<h4 class="text-md font-semibold text-gray-900 dark:text-white mt-4 mb-2">Options</h4>',
                        columns: {
                            default: { container: 12 },
                        },
                    },

                    isFinal: {
                        type: 'toggle',
                        label: "Est final",
                        description: "Indique si l'artefact est dans sa version finale",
                        default: false,
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 4, label: 12, wrapper: 12 },
                            lg: { container: 4, label: 12, wrapper: 12 },
                        },
                    },

                    isExternal: {
                        type: 'toggle',
                        label: "Est externe",
                        description: "Indique si l'artefact est externe",
                        default: false,
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 4, label: 12, wrapper: 12 },
                            lg: { container: 4, label: 12, wrapper: 12 },
                        },
                    },

                    isPartial: {
                        type: 'toggle',
                        label: "Est partiel",
                        description: "Indique si l'artefact est partiel",
                        default: false,
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 4, label: 12, wrapper: 12 },
                            lg: { container: 4, label: 12, wrapper: 12 },
                        },
                    },

                    // Section dates
                    artefact_section_3: {
                        type: 'static',
                        content: '<h4 class="text-md font-semibold text-gray-900 dark:text-white mt-4 mb-2">Validité</h4>',
                        columns: {
                            default: { container: 12 },
                        },
                    },

                    validFrom: {
                        type: 'date',
                        label: "Valide à partir de",
                        description: "Date de début de validité",
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 6, label: 12, wrapper: 12 },
                            lg: { container: 6, label: 12, wrapper: 12 },
                        },
                    },

                    validTo: {
                        type: 'date',
                        label: "Valide jusqu'à",
                        description: "Date de fin de validité",
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 6, label: 12, wrapper: 12 },
                            lg: { container: 6, label: 12, wrapper: 12 },
                        },
                    },

                    // Section JSON
                    artefact_section_4: {
                        type: 'static',
                        content: '<h4 class="text-md font-semibold text-gray-900 dark:text-white mt-4 mb-2">Métadonnées</h4>',
                        columns: {
                            default: { container: 12 },
                        },
                    },

                    nameJson: {
                        type: 'textarea',
                        label: "Nom (JSON)",
                        description: "Données de nom au format JSON",
                        placeholder: '{"fr": "Nom du secteur", "en": "Sector name"}',
                        rows: 3,
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 12, label: 12, wrapper: 12 },
                            lg: { container: 12, label: 12, wrapper: 12 },
                        },
                    },

                    descriptionJson: {
                        type: 'textarea',
                        label: "Description (JSON)",
                        description: "Données de description au format JSON",
                        placeholder: '{"fr": "Description du secteur", "en": "Sector description"}',
                        rows: 3,
                        columns: {
                            default: { container: 12, label: 12, wrapper: 12 },
                            sm: { container: 12, label: 12, wrapper: 12 },
                            md: { container: 12, label: 12, wrapper: 12 },
                            lg: { container: 12, label: 12, wrapper: 12 },
                        },
                    },
                }
            },
        }
    }))

    const isModalCreateSectorOpen = ref(false)
    const toggleModalCreateSector = () => {
        isModalCreateSectorOpen.value = !isModalCreateSectorOpen.value
    }

    return {
        createSector,
        createSectorFormEl,
        createSectorForm,
        isModalCreateSectorOpen,
        toggleModalCreateSector
    }
}
