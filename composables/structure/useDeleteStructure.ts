import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useDeleteStructure = () => {
  const { $sisepApi } = useNuxtApp();
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  const deleteStructure = async (structureId: string, structureLabel?: string, structureAbbreviation?: string) => {
    if (!structureId) {
      error.value = 'ID de la structure manquant';
      return false;
    }

    const displayName = structureLabel && structureAbbreviation
      ? `la structure "${structureLabel} (${structureAbbreviation})"`
      : structureLabel
      ? `la structure "${structureLabel}"`
      : 'cette structure';

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
      await $sisepApi(`/structures/${structureId}`, {
        method: 'DELETE',
      });

      // Afficher un message de succès
      makeAlert({
        type: 'success',
        title: 'Structure supprimée !',
        message: `${displayName} a été supprimée avec succès`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression de la structure:', err);
      error.value = 'Impossible de supprimer la structure';

      makeAlert({
        type: 'error',
        title: 'OUPS ERREUR !',
        message: 'Une erreur est survenue lors de la suppression de la structure',
        extraClass: 'bg-red-500',
      });

      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    deleteStructure,
    isDeleting,
    error,
  };
};

export default useDeleteStructure;
