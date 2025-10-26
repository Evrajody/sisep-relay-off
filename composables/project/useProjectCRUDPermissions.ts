/**
 * Composable pour gérer les permissions CRUD des projets
 * Simplifie l'accès aux permissions de création, modification et suppression
 */

import { usePermissions, ProjectPermission } from '~/composables/usePermissions';
import type { Project } from '~/types';

export const useProjectCRUDPermissions = () => {
  const permissions = usePermissions();

  /**
   * Vérifie si l'utilisateur peut créer un projet
   */
  const canCreateProject = (): boolean => {
    return permissions.hasPermission(ProjectPermission.CREATE);
  };

  /**
   * Vérifie si l'utilisateur peut modifier un projet
   * @param project - Le projet à vérifier (optionnel)
   * @param isOwnProject - Si c'est le projet de l'utilisateur (optionnel)
   * @returns true si l'utilisateur peut modifier le projet
   */
  const canModifyProject = (project?: Project, isOwnProject?: boolean): boolean => {
    // Admin ou super utilisateur peut toujours modifier
    if (permissions.hasPermission(ProjectPermission.UPDATE_ALL)) {
      return true;
    }

    // Vérifier les permissions de modification
    const hasModifyPermission = permissions.hasAnyPermission([
      ProjectPermission.MODIFY,
      ProjectPermission.UPDATE,
    ]);

    if (!hasModifyPermission) {
      return false;
    }

    // Si c'est son propre projet, vérifier la permission pour projet propre
    if (isOwnProject && !permissions.hasPermission(ProjectPermission.UPDATE_OWN)) {
      return false;
    }

    return true;
  };

  /**
   * Vérifie si l'utilisateur peut supprimer un projet
   * @param project - Le projet à vérifier (optionnel)
   * @returns true si l'utilisateur peut supprimer le projet
   */
  const canDeleteProject = (project?: Project): boolean => {
    return permissions.hasPermission(ProjectPermission.DELETE);
  };

  /**
   * Vérifie si l'utilisateur peut voir tous les projets
   */
  const canListAllProjects = (): boolean => {
    return permissions.hasPermission(ProjectPermission.LIST_ALL);
  };

  /**
   * Vérifie si l'utilisateur peut voir ses propres projets
   */
  const canListOwnProjects = (): boolean => {
    return permissions.hasPermission(ProjectPermission.LIST_OWN);
  };

  /**
   * Vérifie si l'utilisateur peut lister les projets (voir ses propres projets ou tous les projets)
   */
  const canListProjects = (): boolean => {
    return canListAllProjects() || canListOwnProjects();
  };

  /**
   * Vérifie si l'utilisateur peut affecter un projet
   */
  const canAssignProject = (): boolean => {
    return permissions.hasPermission(ProjectPermission.ASSIGN);
  };

  /**
   * Obtient une description textuelle des actions CRUD autorisées pour l'utilisateur
   */
  const getAvailableCRUDActions = (): {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    list: boolean;
  } => {
    return {
      create: canCreateProject(),
      read: canListProjects(), // Capacité à lire/consulter les projets
      update: canModifyProject(),
      delete: canDeleteProject(),
      list: canListProjects(),
    };
  };

  /**
   * Vérifie si l'utilisateur a au moins une permission CRUD
   */
  const hasAnyProjectPermission = (): boolean => {
    const actions = getAvailableCRUDActions();
    return Object.values(actions).some(action => action === true);
  };

  /**
   * Obtient le message d'erreur approprié quand une action CRUD est interdite
   */
  const getAccessDeniedMessage = (action: 'create' | 'read' | 'update' | 'delete'): string => {
    const messages: Record<string, string> = {
      create: 'Vous n\'avez pas la permission de créer un projet.',
      read: 'Vous n\'avez pas la permission de consulter les projets.',
      update: 'Vous n\'avez pas la permission de modifier ce projet.',
      delete: 'Vous n\'avez pas la permission de supprimer ce projet.',
    };
    return messages[action] || 'Action non autorisée.';
  };

  return {
    canCreateProject,
    canModifyProject,
    canDeleteProject,
    canListAllProjects,
    canListOwnProjects,
    canListProjects,
    canAssignProject,
    getAvailableCRUDActions,
    hasAnyProjectPermission,
    getAccessDeniedMessage,
  };
};

export default useProjectCRUDPermissions;
