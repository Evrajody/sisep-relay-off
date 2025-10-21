import { useNuxtApp } from '#app';
import { ref, computed } from 'vue';
import type { Project } from '~/types';

export const useProjectDetail = (projectId?: string) => {
  const { $sisepApi } = useNuxtApp();

  // Si un projectId est fourni, utiliser useFetch
  if (projectId) {
    const {
      data: projectData,
      status: projectDetailStatus,
      error: projectDetailError,
      refresh: refreshProjectDetail,
    } = useFetch<Project>(`projects/${projectId}`, {
      method: 'GET',
      key: `project-detail-${projectId}`,
      $fetch: $sisepApi,
    });

    const projectDetail = computed(() => projectData.value);

    return {
      projectDetail,
      projectDetailStatus,
      projectDetailError,
      refreshProjectDetail,
    };
  }

  // Sinon, utiliser l'ancienne méthode avec ref
  const project = ref<Project | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Récupérer les détails d'un projet par son ID
  const fetchProject = async (id: string) => {
    if (!id) {
      error.value = 'ID du projet manquant';
      return null;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await $sisepApi(`/projects/${id}`, {
        method: 'GET'
      });

      if (!response) {
        throw new Error('Réponse du serveur invalide');
      }

      project.value = response;
      return response;
    } catch (err) {
      console.error('Erreur lors de la récupération du projet:', err);
      error.value = 'Impossible de charger les détails du projet';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Mettre à jour le statut d'un projet
  const updateProjectStatus = async (projectId: string, status: string) => {
    if (!projectId) {
      error.value = 'ID du projet manquant';
      return false;
    }

    isLoading.value = true;
    error.value = null;



    try {
      const response = await $sisepApi(`/projects/${projectId}/update-status`, {

        method: 'PUT',
        body: { status },

        onResponse: ({response}) => {
            if (![200, 201].includes(response.status)) {
                makeAlert({
                    title: "Oups Erreur !",
                    message: `${response._data.message}`,
                    type: "error",
                });
            }
        }
      });

      if (response && project.value) {
        project.value.status = status;
        return true;
      }

      return false;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      error.value = 'Impossible de mettre à jour le statut du projet';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Soumettre un projet pour validation (endpoint spécifique)
  const submitProject = async (projectId: string) => {
    if (!projectId) {
      error.value = 'ID du projet manquant';
      return false;
    }

    isLoading.value = true;
    error.value = null;

    try {

      const response = await $sisepApi(`/projects/${projectId}/submit`, {
        method: 'POST'
      });

      if (response && project.value) {
        project.value.status = 'SUBMITTED';
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erreur lors de la soumission du projet:', err);
      error.value = 'Impossible de soumettre le projet pour validation';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Formater une date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifié';
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC'
    };
    
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Calculer la progression du projet
  const getProjectProgress = (project: Project) => {
    if (!project.startDate || !project.endDate) return 0;
    
    const start = new Date(project.startDate).getTime();
    const end = new Date(project.endDate).getTime();
    const now = new Date().getTime();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };

  // Calculer le nombre de jours restants
  const getDaysRemaining = (endDate: string) => {
    if (!endDate) return 0;
    
    const end = new Date(endDate);
    const now = new Date();
    
    if (now > end) return 0;
    
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Obtenir la classe CSS pour le badge de statut
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      DRAFT: { color: 'gray', label: 'Brouillon' },
      SUBMITTED: { color: 'blue', label: 'Soumis' },
      VALIDATED: { color: 'green', label: 'Validé' },
      VALIDATED_BY_STRUCTURE: { color: 'emerald', label: 'Validé par la structure' },
      REJECTED: { color: 'red', label: 'Rejeté' },
      REJECTED_BY_STRUCTURE: { color: 'orange', label: 'Rejeté par la structure' },
      PUBLISHED: { color: 'green', label: 'Publié' },
      UNPUBLISHED: { color: 'gray', label: 'Non publié' },
      PENDING: { color: 'yellow', label: 'En attente' },
    };

    return statusMap[status] || { color: 'gray', label: 'Inconnu' };
  };

  return {
    project,
    isLoading,
    error,
    fetchProject,
    updateProjectStatus,
    submitProject,
    formatDate,
    getProjectProgress,
    getDaysRemaining,
    getStatusBadge,
  };
};

export default useProjectDetail;
