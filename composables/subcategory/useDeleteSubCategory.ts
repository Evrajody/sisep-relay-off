import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useDeleteSubCategory = () => {
  const { $sisepApi } = useNuxtApp();
  const isDeleting = ref(false);
  const error = ref<string | null>(null);

  const deleteSubCategory = async (subCategoryId: string, subCategoryName?: string) => {
    if (!subCategoryId) {
      error.value = 'ID de la sous-catégorie manquant';
      return false;
    }

    // Demander confirmation avant la suppression
    const confirmed = await makeAlert({
      type: 'warning',
      title: 'Confirmation de suppression',
      message: `Êtes-vous sûr de vouloir supprimer ${subCategoryName ? `la sous-catégorie "${subCategoryName}"` : 'cette sous-catégorie'} ? Cette action est irréversible.`,
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
      await $sisepApi(`/subcategories/${subCategoryId}`, {
        method: 'DELETE',
      });

      // Afficher un message de succès
      makeAlert({
        type: 'success',
        title: 'Sous-catégorie supprimée !',
        message: `La sous-catégorie ${subCategoryName ? `"${subCategoryName}"` : ''} a été supprimée avec succès`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression de la sous-catégorie:', err);
      error.value = 'Impossible de supprimer la sous-catégorie';

      makeAlert({
        type: 'error',
        title: 'OUPS ERREUR !',
        message: 'Une erreur est survenue lors de la suppression de la sous-catégorie',
        extraClass: 'bg-red-500',
      });

      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    deleteSubCategory,
    isDeleting,
    error,
  };
};

export default useDeleteSubCategory;
