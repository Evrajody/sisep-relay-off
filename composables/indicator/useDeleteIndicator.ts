import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useDeleteIndicator = () => {
  const { $sisepApi } = useNuxtApp();
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  const deleteIndicator = async (indicatorId: string, indicatorCode?: string, indicatorLabel?: string) => {
    if (!indicatorId) {
      error.value = 'ID de l\'indicateur manquant';
      return false;
    }

    const displayName = indicatorCode && indicatorLabel
      ? `l'indicateur "${indicatorCode} - ${indicatorLabel}"`
      : 'cet indicateur';

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
      await $sisepApi(`/indicators/${indicatorId}`, {
        method: 'DELETE',
      });

      // Afficher un message de succès
      makeAlert({
        type: 'success',
        title: 'Indicateur supprimé !',
        message: `${displayName} a été supprimé avec succès`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'indicateur:', err);
      error.value = 'Impossible de supprimer l\'indicateur';

      makeAlert({
        type: 'error',
        title: 'OUPS ERREUR !',
        message: 'Une erreur est survenue lors de la suppression de l\'indicateur',
        extraClass: 'bg-red-500',
      });

      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    deleteIndicator,
    isDeleting,
    error,
  };
};

export default useDeleteIndicator;
