import { useNuxtApp } from '#app';
import { ref } from 'vue';
import type { Project } from '~/types';

export const useProjectDetail = () => {
  const { $sisepApi } = useNuxtApp();
  const project = ref<Project | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Récupérer les détails d'un projet par son ID
  const fetchProject = async (projectId: string) => {
    if (!projectId) {
      error.value = 'ID du projet manquant';
      return null;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await $sisepApi(`/projects/${projectId}`, {
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
        method: 'PATCH',
        body: { status }
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
      PENDING: { color: 'yellow', label: 'En attente' },
      PUBLISHED: { color: 'green', label: 'Publié' },
      REJECTED: { color: 'red', label: 'Rejeté' },
    };

    return statusMap[status] || { color: 'gray', label: 'Inconnu' };
  };

  return {
    project,
    isLoading,
    error,
    fetchProject,
    updateProjectStatus,
    formatDate,
    getProjectProgress,
    getDaysRemaining,
    getStatusBadge,
  };
};

export default useProjectDetail;
