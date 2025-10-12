import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useDeleteLocation = () => {
  const { $sisepApi } = useNuxtApp();
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  const deleteLocation = async (locationId: string, locationName?: string) => {
    if (!locationId) {
      error.value = 'ID de la localisation manquant';
      return false;
    }

    // Demander confirmation avant la suppression
    const confirmed = await makeAlert({
      type: 'warning',
      title: 'Confirmation de suppression',
      message: `Êtes-vous sûr de vouloir supprimer ${locationName ? `la localisation "${locationName}"` : 'cette localisation'} ? Cette action est irréversible.`,
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
      await $sisepApi(`/locations/${locationId}`, {
        method: 'DELETE',
      });

      // Afficher un message de succès
      makeAlert({
        type: 'success',
        title: 'Localisation supprimée !',
        message: `La localisation ${locationName ? `"${locationName}"` : ''} a été supprimée avec succès`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression de la localisation:', err);
      error.value = 'Impossible de supprimer la localisation';

      makeAlert({
        type: 'error',
        title: 'OUPS ERREUR !',
        message: 'Une erreur est survenue lors de la suppression de la localisation',
        extraClass: 'bg-red-500',
      });

      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    deleteLocation,
    isDeleting,
    error,
  };
};

export default useDeleteLocation;
