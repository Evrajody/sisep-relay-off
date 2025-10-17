import type { SisebResponseType, Structure } from "~/types"
import {transformTmpPayload} from "~/utils/transformTmpPayload";

export const useAffectProject = (projectId: string) => {

    const { $sisepStatsApi, $sisepApi } = useNuxtApp()

    /**
     * Récupère la liste des structures pour l'affectation
     */
    const { data: structuresList, status: structuresStatus, refresh: refreshStructures } = useAsyncData<SisebResponseType<Structure>>(
        'structures-for-affect',
        () => {
            return $sisepStatsApi('organisations', {
                query: {
                    status: 'ACTIF', // On récupère uniquement les structures actives
                }
            })
        },
        {
            deep: false,
            transform: (p) => {
                return p.categories.map(entry => ({
                    denomination: entry.artefact.nameJson.fr,
                    id: entry.id,
                }))
            }
        }
    )

    // FORMULAIRE DE GESTION AFFECTATION DE PROJET

    const affectProjectFormEl = ref(null)

    const affectProjectForm = computed(() => ({

        scrollOnNext: true,
        id: "affectProjectFormEl",
        addClass: "max-w-full",
        displayErrors: true,
        showRequired: ["label"],

        endpoint: async (form: any, payload: any) => {

            const response = await $sisepApi(`projects/${projectId}/affect`, {

                method: 'POST',
                body: payload.requestData,

                onResponse: ({ response }) => {

                    if (response.status === 201 || response.status === 200) {

                        makeAlert({
                            type: "success",
                            title: "Projet affecté avec succès !",
                            message: `Le projet a été affecté à la structure avec succès.`,
                        })

                        return true
                    }

                    if (response.status === 400) {

                        makeAlert({
                            type: "error",
                            title: "OUPS ERREUR !",
                            message: `${response?._data?.message || 'Erreur lors de l\'affectation du projet'}`,
                            extraClass: "bg-red-500",
                        })

                        return false
                    }

                    if (response.status === 404) {

                        makeAlert({
                            type: "error",
                            title: "Ressource introuvable !",
                            message: `Le projet ou la structure n'a pas été trouvé.`,
                            extraClass: "bg-red-500",
                        })

                        return false
                    }

                    if (response.status === 500) {

                        makeAlert({
                            type: "error",
                            title: "Erreur serveur !",
                            message: `Une erreur s'est produite sur le serveur. Veuillez réessayer plus tard.`,
                            extraClass: "bg-red-500",
                        })

                        return false
                    }
                },
            })

        },

        schema: {

            structureId: {
                type: 'select',
                label: "Structure",
                info: "Structure d'affectation",
                rules: ['required'],
                items: structuresList,
                labelProp: "denomination",
                valueProp: "id",
                search: true,
                native: true,
                inputType: "search",
                autocomplete: "off",
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },
            },

            description: {
                type: 'editor',
                default: '',
                rows: 7,
                label: "Commentaire",
                info: "Indiquer un commentaire",
                rules: [],
                columns: {
                    lg: {container: 12, label: 12, wrapper: 12},
                },
            },

        }

    }))



    /**
     * Affecte un projet à une structure
     * @param projectId - ID du projet à affecter
     * @param structureId - ID de la structure à laquelle affecter le projet
     */
    const affectProject = async (projectId: string | number, structureId: string | number) => {

        try {
            const response = await $sisepApi(`projects/${projectId}/affect`, {
                method: 'POST',
                body: {
                    structureId: structureId
                },

                onResponse: ({ response }) => {

                    if (response.status === 201 || response.status === 200) {

                        makeAlert({
                            type: "success",
                            title: "Projet affecté avec succès !",
                            message: `Le projet a été affecté à la structure avec succès.`,
                        })

                        return true
                    }

                    if (response.status === 400) {

                        makeAlert({
                            type: "error",
                            title: "OUPS ERREUR !",
                            message: `${response?._data?.message || 'Erreur lors de l\'affectation du projet'}`,
                            extraClass: "bg-red-500",
                        })

                        return false
                    }

                    if (response.status === 404) {

                        makeAlert({
                            type: "error",
                            title: "Ressource introuvable !",
                            message: `Le projet ou la structure n'a pas été trouvé.`,
                            extraClass: "bg-red-500",
                        })

                        return false
                    }

                    if (response.status === 500) {

                        makeAlert({
                            type: "error",
                            title: "Erreur serveur !",
                            message: `Une erreur s'est produite sur le serveur. Veuillez réessayer plus tard.`,
                            extraClass: "bg-red-500",
                        })

                        return false
                    }
                },
            })

            return response

        } catch (error: any) {

            console.error('Erreur lors de l\'affectation du projet:', error)

            makeAlert({
                type: "error",
                title: "Erreur !",
                message: `Une erreur inattendue s'est produite lors de l'affectation du projet.`,
                extraClass: "bg-red-500",
            })

            return false
        }
    }

    return {

        structuresList,
        structuresStatus,
        refreshStructures,
        affectProject,

        affectProjectForm,
        affectProjectFormEl
    }
}
