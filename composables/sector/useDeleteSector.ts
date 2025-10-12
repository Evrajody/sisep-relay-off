import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useDeleteSector = () => {
  const { $sisepApi } = useNuxtApp();
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  const deleteSector = async (sectorId: string, sectorName?: string) => {
    if (!sectorId) {
      error.value = 'ID du secteur manquant';
      return false;
    }

    // Demander confirmation avant la suppression
    const confirmed = await makeAlert({
      type: 'warning',
      title: 'Confirmation de suppression',
      message: `Êtes-vous sûr de vouloir supprimer ${sectorName ? `le secteur "${sectorName}"` : 'ce secteur'} ? Cette action est irréversible.`,
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
      await $sisepApi(`/sectors/${sectorId}`, {
        method: 'DELETE',
      });

      // Afficher un message de succès
      makeAlert({
        type: 'success',
        title: 'Secteur supprimé !',
        message: `Le secteur ${sectorName ? `"${sectorName}"` : ''} a été supprimé avec succès`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression du secteur:', err);
      error.value = 'Impossible de supprimer le secteur';

      makeAlert({
        type: 'error',
        title: 'OUPS ERREUR !',
        message: 'Une erreur est survenue lors de la suppression du secteur',
        extraClass: 'bg-red-500',
      });

      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    deleteSector,
    isDeleting,
    error,
  };
};

export default useDeleteSector;
