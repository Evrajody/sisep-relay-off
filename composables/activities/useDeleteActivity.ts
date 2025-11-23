import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useDeleteActivity = () => {
  const { $sisepActiviteApi } = useNuxtApp();
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  const deleteActivity = async (activityId: string, activityNature?: string) => {
    if (!activityId) {
      error.value = 'ID de l\'activité manquant';
      return false;
    }

    const displayName = activityNature
      ? `l'activité "${activityNature}"`
      : 'cette activité';

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
      await $sisepActiviteApi(`/activities/${activityId}`, {
        method: 'DELETE',
      });

      // Afficher un message de succès
      makeAlert({
        type: 'success',
        title: 'Activité supprimée !',
        message: `${displayName} a été supprimée avec succès`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'activité:', err);
      error.value = 'Impossible de supprimer l\'activité';

      makeAlert({
        type: 'error',
        title: 'OUPS ERREUR !',
        message: 'Une erreur est survenue lors de la suppression de l\'activité',
        extraClass: 'bg-red-500',
      });

      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    deleteActivity,
    isDeleting,
    error,
  };
};

export default useDeleteActivity;
