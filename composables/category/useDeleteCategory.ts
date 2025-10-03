import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useDeleteCategory = () => {
  const { $sisepApi } = useNuxtApp();
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  const deleteCategory = async (categoryId: string, categoryName?: string) => {
    if (!categoryId) {
      error.value = 'ID de la catégorie manquant';
      return false;
    }

    // Demander confirmation avant la suppression
    const confirmed = await makeAlert({
      type: 'warning',
      title: 'Confirmation de suppression',
      message: `Êtes-vous sûr de vouloir supprimer ${categoryName ? `la catégorie "${categoryName}"` : 'cette catégorie'} ? Cette action est irréversible.`,
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
      await $sisepApi(`/categories/${categoryId}`, {
        method: 'DELETE',
      });

      // Afficher un message de succès
      makeAlert({
        type: 'success',
        title: 'Catégorie supprimée !',
        message: `La catégorie ${categoryName ? `"${categoryName}"` : ''} a été supprimée avec succès`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression de la catégorie:', err);
      error.value = 'Impossible de supprimer la catégorie';

      makeAlert({
        type: 'error',
        title: 'OUPS ERREUR !',
        message: 'Une erreur est survenue lors de la suppression de la catégorie',
        extraClass: 'bg-red-500',
      });

      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    deleteCategory,
    isDeleting,
    error,
  };
};

export default useDeleteCategory;
