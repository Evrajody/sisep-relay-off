import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useDeleteOrganisation = () => {
  const { $sisepApi } = useNuxtApp();
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  const deleteOrganisation = async (organisationId: string, organisationCode?: string, organisationName?: string) => {
    if (!organisationId) {
      error.value = 'ID de l\'organisation manquant';
      return false;
    }

    const displayName = organisationCode && organisationName
      ? `l'organisation "${organisationCode} - ${organisationName}"`
      : 'cette organisation';

    // Demander confirmation avant la suppression
    const confirmed = await makeAlert({
      type: 'warning',
      title: 'Confirmation de suppression',
      message: `Êtes-vous sûr de vouloir supprimer ${displayName} ? Cette action est irréversible.`,
      confirmText: 'Oui, supprimer',
      cancelText: 'Annuler',
      requireConfirmation: true,
    });

    if (!confirmed) {
      return false;
    }

    isDeleting.value = true;
    error.value = null;

    try {
      await $sisepApi(`/organisations/${organisationId}`, {
        method: 'DELETE',
      });

      // Afficher un message de succès
      makeAlert({
        type: 'success',
        title: 'Organisation supprimée !',
        message: `${displayName} a été supprimée avec succès`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'organisation:', err);
      error.value = 'Impossible de supprimer l\'organisation';

      makeAlert({
        type: 'error',
        title: 'OUPS ERREUR !',
        message: 'Une erreur est survenue lors de la suppression de l\'organisation',
        extraClass: 'bg-red-500',
      });

      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    deleteOrganisation,
    isDeleting,
    error,
  };
};

export default useDeleteOrganisation;
