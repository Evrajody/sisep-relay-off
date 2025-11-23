import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useDeleteFunctionalGroup = () => {
  const { $sisepActiviteApi } = useNuxtApp();
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  const deleteFunctionalGroup = async (functionalGroupId: string, functionalGroupName?: string) => {
    if (!functionalGroupId) {
      error.value = 'ID du groupe fonctionnel manquant';
      return false;
    }

    const displayName = functionalGroupName
      ? `le groupe fonctionnel "${functionalGroupName}"`
      : 'ce groupe fonctionnel';

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
      await $sisepActiviteApi(`/functional-groups/${functionalGroupId}`, {
        method: 'DELETE',
      });

      // Afficher un message de succès
      makeAlert({
        type: 'success',
        title: 'Groupe fonctionnel supprimé !',
        message: `${displayName} a été supprimé avec succès`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression du groupe fonctionnel:', err);
      error.value = 'Impossible de supprimer le groupe fonctionnel';

      makeAlert({
        type: 'error',
        title: 'OUPS ERREUR !',
        message: 'Une erreur est survenue lors de la suppression du groupe fonctionnel',
        extraClass: 'bg-red-500',
      });

      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    deleteFunctionalGroup,
    isDeleting,
    error,
  };
};

export default useDeleteFunctionalGroup;
