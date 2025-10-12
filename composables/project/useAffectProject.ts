import type { SisebResponseType, Structure } from "~/types"

export const useAffectProject = () => {

    const { $sisepStatsApi } = useNuxtApp()

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
        }
    )

    console.log(structuresList)

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
    }
}
