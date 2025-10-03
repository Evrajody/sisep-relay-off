import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useDeleteAgent = () => {
  const { $sisepApi } = useNuxtApp();
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  const deleteAgent = async (agentId: string, agentFirstName?: string, agentLastName?: string) => {
    if (!agentId) {
      error.value = 'ID de l\'agent manquant';
      return false;
    }

    const displayName = agentFirstName && agentLastName
      ? `l'agent "${agentFirstName} ${agentLastName}"`
      : 'cet agent';

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
      await $sisepApi(`/agents/${agentId}`, {
        method: 'DELETE',
      });

      // Afficher un message de succès
      makeAlert({
        type: 'success',
        title: 'Agent supprimé !',
        message: `${displayName} a été supprimé avec succès`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'agent:', err);
      error.value = 'Impossible de supprimer l\'agent';

      makeAlert({
        type: 'error',
        title: 'OUPS ERREUR !',
        message: 'Une erreur est survenue lors de la suppression de l\'agent',
        extraClass: 'bg-red-500',
      });

      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    deleteAgent,
    isDeleting,
    error,
  };
};

export default useDeleteAgent;
