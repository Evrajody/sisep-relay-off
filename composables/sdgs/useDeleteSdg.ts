import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useDeleteSdg = () => {
  const { $sisepActiviteApi } = useNuxtApp();
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  const deleteSdg = async (sdgId: string, sdgCode?: string, sdgTitle?: string) => {
    if (!sdgId) {
      error.value = 'ID du SDG manquant';
      return false;
    }

    const displayName = sdgCode && sdgTitle
      ? `le SDG "${sdgCode} - ${sdgTitle}"`
      : 'ce SDG';

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
      await $sisepActiviteApi(`/sdgs/${sdgId}`, {
        method: 'DELETE',
      });

      // Afficher un message de succès
      makeAlert({
        type: 'success',
        title: 'SDG supprimé !',
        message: `${displayName} a été supprimé avec succès`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression du SDG:', err);
      error.value = 'Impossible de supprimer le SDG';

      makeAlert({
        type: 'error',
        title: 'OUPS ERREUR !',
        message: 'Une erreur est survenue lors de la suppression du SDG',
        extraClass: 'bg-red-500',
      });

      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    deleteSdg,
    isDeleting,
    error,
  };
};

export default useDeleteSdg;
