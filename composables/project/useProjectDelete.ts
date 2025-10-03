import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useProjectDelete = () => {
  const { $sisepApi } = useNuxtApp();
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  const deleteProject = async (projectId: string, projectTitle?: string) => {
    if (!projectId) {
      error.value = 'ID du projet manquant';
      return false;
    }

    // Demander confirmation avant la suppression
    const confirmed = await makeAlert({
      type: 'warning',
      title: 'Confirmation de suppression',
      message: `Êtes-vous sûr de vouloir supprimer ${projectTitle ? `le projet "${projectTitle}"` : 'ce projet'} ? Cette action est irréversible.`,
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
      await $sisepApi(`/projects/${projectId}`, {
        method: 'DELETE',
      });

      // Afficher un message de succès
      makeAlert({
        type: 'success',
        title: 'Projet supprimé !',
        message: `Le projet ${projectTitle ? `"${projectTitle}"` : ''} a été supprimé avec succès`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression du projet:', err);
      error.value = 'Impossible de supprimer le projet';

      makeAlert({
        type: 'error',
        title: 'OUPS ERREUR !',
        message: 'Une erreur est survenue lors de la suppression du projet',
        extraClass: 'bg-red-500',
      });

      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    deleteProject,
    isDeleting,
    error,
  };
};

export default useProjectDelete;
