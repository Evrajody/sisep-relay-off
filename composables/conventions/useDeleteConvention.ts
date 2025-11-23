import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useDeleteConvention = () => {
  const { $sisepActiviteApi } = useNuxtApp();
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  const deleteConvention = async (conventionId: string, conventionTitle?: string) => {
    if (!conventionId) {
      error.value = 'ID de la convention manquant';
      return false;
    }

    const displayName = conventionTitle
      ? `la convention "${conventionTitle}"`
      : 'cette convention';

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
      await $sisepActiviteApi(`/conventions/${conventionId}`, {
        method: 'DELETE',
      });

      // Afficher un message de succès
      makeAlert({
        type: 'success',
        title: 'Convention supprimée !',
        message: `${displayName} a été supprimée avec succès`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression de la convention:', err);
      error.value = 'Impossible de supprimer la convention';

      makeAlert({
        type: 'error',
        title: 'OUPS ERREUR !',
        message: 'Une erreur est survenue lors de la suppression de la convention',
        extraClass: 'bg-red-500',
      });

      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    deleteConvention,
    isDeleting,
    error,
  };
};

export default useDeleteConvention;
