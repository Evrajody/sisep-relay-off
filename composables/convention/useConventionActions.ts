export const useConventionActions = () => {
    const { $sisepApi } = useNuxtApp()

    // Publier une convention sur le site
    const publishConvention = async (conventionId: string, conventionTitle: string) => {
        try {
            const response = await $sisepApi(`conventions/${conventionId}/publish`, {
                method: 'POST'
            })

            makeAlert({
                type: "success",
                title: "Convention publiée !",
                message: `La convention "${conventionTitle}" a été publiée sur le site avec succès`,
            })

            return true
        } catch (error) {
            makeAlert({
                type: "error",
                title: "OUPS ERREUR !",
                message: "Une erreur est survenue lors de la publication de la convention",
                extraClass: "bg-red-500",
            })
            return false
        }
    }

    // Dépublier une convention du site
    const unpublishConvention = async (conventionId: string, conventionTitle: string) => {
        try {
            const response = await $sisepApi(`conventions/${conventionId}/unpublish`, {
                method: 'POST'
            })

            makeAlert({
                type: "success",
                title: "Convention dépubliée !",
                message: `La convention "${conventionTitle}" a été retirée du site avec succès`,
            })

            return true
        } catch (error) {
            makeAlert({
                type: "error",
                title: "OUPS ERREUR !",
                message: "Une erreur est survenue lors du retrait de la convention",
                extraClass: "bg-red-500",
            })
            return false
        }
    }

    // Dupliquer une convention
    const duplicateConvention = async (conventionId: string, conventionTitle: string) => {
        try {
            const response = await $sisepApi(`conventions/${conventionId}/duplicate`, {
                method: 'POST'
            })

            makeAlert({
                type: "success",
                title: "Convention dupliquée !",
                message: `Une copie de "${conventionTitle}" a été créée avec succès`,
            })

            return response.data
        } catch (error) {
            makeAlert({
                type: "error",
                title: "OUPS ERREUR !",
                message: "Une erreur est survenue lors de la duplication de la convention",
                extraClass: "bg-red-500",
            })
            return null
        }
    }

    // Exporter une convention en PDF
    const exportToPDF = async (conventionId: string, conventionTitle: string) => {
        try {
            const response = await $sisepApi(`conventions/${conventionId}/export/pdf`, {
                method: 'GET'
            })

            makeAlert({
                type: "success",
                title: "Export PDF !",
                message: `La convention "${conventionTitle}" a été exportée en PDF`,
            })

            return true
        } catch (error) {
            makeAlert({
                type: "error",
                title: "OUPS ERREUR !",
                message: "Une erreur est survenue lors de l'export PDF",
                extraClass: "bg-red-500",
            })
            return false
        }
    }

    return {
        publishConvention,
        unpublishConvention,
        duplicateConvention,
        exportToPDF
    }
}
