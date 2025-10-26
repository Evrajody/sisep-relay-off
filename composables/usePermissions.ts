/**
 * Composable pour gérer les permissions utilisateur
 * Accède à la session utilisateur Better Auth et fournit des méthodes pour vérifier les permissions
 *
 * La structure des permissions vient de: session.additional_info.persmissions (note: typo dans l'API)
 */

import { computed } from 'vue';

/**
 * Énumération des permissions disponibles pour les projets
 */
export enum ProjectPermission {
  CREATE = 'CAN_CREATE_PROJECT',
  UPDATE = 'CAN_UPDATE_PROJECT',
  UPDATE_ALL = 'CAN_UPDATE_ALL_PROJECT',
  UPDATE_OWN = 'CAN_UPDATE_OWN_PROJECT',
  MODIFY = 'CAN_MODIFY_PROJECT',
  DELETE = 'CAN_DELETE_PROJECT',
  PUBLISH = 'CAN_PUBLISH_PROJECT',
  UNPUBLISH = 'CAN_UNPUBLISH_PROJECT',
  VALIDATE = 'CAN_VALIDATE_PROJECT',
  REJECT = 'CAN_REJECT_PROJECT',
  SUBMIT = 'CAN_SUBMIT_PROJECT_FOR_VALIDATION',
  LIST_ALL = 'CAN_LIST_ALL_PROJECT',
  LIST_OWN = 'CAN_LIST_OWN_PROJECT',
  ASSIGN = 'CAN_ASSIGN_PROJECT',
}

export const usePermissions = () => {
  // Récupérer le plugin $authClient depuis Nuxt
  const { $authClient } = useNuxtApp();

  // Utiliser useSession() de Better Auth pour avoir la session réactive
  // useSession() retourne une Ref avec la structure: { data, isPending, isRefetching, error }
  const session = null;

  /**
   * Obtient l'objet des permissions depuis la session
   * Note: l'API utilise "persmissions" (avec une typo) au lieu de "permissions"
   */
  const userPermissions = computed(() => {
    try {
      const sessionData = session.value?.data;
      if (!sessionData) {
        return {};
      }

      const permissions = sessionData?.additional_info?.persmissions;
      if (!permissions || typeof permissions !== 'object') {
        return {};
      }
      return permissions as Record<string, boolean>;
    } catch (error) {
      console.warn('[usePermissions] Erreur lors de la récupération des permissions', error);
      return {};
    }
  });

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   * @param permission - La permission à vérifier (ProjectPermission ou string)
   * @returns true si l'utilisateur a la permission, false sinon
   */
  const hasPermission = (permission: ProjectPermission | string): boolean => {
    const perms = userPermissions.value;
    if (!perms || Object.keys(perms).length === 0) {
      return false;
    }
    return perms[permission] === true;
  };

  /**
   * Vérifie si l'utilisateur a AU MOINS UNE permission parmi celles fournies
   * @param permissions - Tableau de permissions à vérifier
   * @returns true si l'utilisateur a au moins une des permissions, false sinon
   */
  const hasAnyPermission = (permissions: (ProjectPermission | string)[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  /**
   * Vérifie si l'utilisateur a TOUTES les permissions fournies
   * @param permissions - Tableau de permissions à vérifier
   * @returns true si l'utilisateur a toutes les permissions, false sinon
   */
  const hasAllPermissions = (permissions: (ProjectPermission | string)[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  /**
   * Vérifie les permissions spécifiques pour les actions de projet
   */
  const canCreateProject = (): boolean => hasPermission(ProjectPermission.CREATE);

  const canUpdateProject = (): boolean =>
    hasAnyPermission([ProjectPermission.UPDATE, ProjectPermission.UPDATE_ALL, ProjectPermission.UPDATE_OWN, ProjectPermission.MODIFY]);

  const canModifyProject = (): boolean => hasPermission(ProjectPermission.MODIFY);

  const canDeleteProject = (): boolean => hasPermission(ProjectPermission.DELETE);

  const canPublishProject = (): boolean => hasPermission(ProjectPermission.PUBLISH);

  const canUnpublishProject = (): boolean => hasPermission(ProjectPermission.UNPUBLISH);

  const canValidateProject = (): boolean => hasPermission(ProjectPermission.VALIDATE);

  const canRejectProject = (): boolean => hasPermission(ProjectPermission.REJECT);

  const canSubmitProject = (): boolean => hasPermission(ProjectPermission.SUBMIT);

  const canListAllProjects = (): boolean => hasPermission(ProjectPermission.LIST_ALL);

  const canListOwnProjects = (): boolean => hasPermission(ProjectPermission.LIST_OWN);

  const canAssignProject = (): boolean => hasPermission(ProjectPermission.ASSIGN);

  /**
   * Obtient toutes les permissions de l'utilisateur
   */
  const getAllPermissions = (): Record<string, boolean> => {
    return userPermissions.value as Record<string, boolean>;
  };

  /**
   * Vérifie si l'utilisateur est admin
   */
  const isAdmin = (): boolean => {
    return hasPermission('CAN_ADMIN');
  };

  /**
   * Obtient les informations utilisateur depuis la session
   */
  const getUserInfo = () => {
    const sessionData = session.value?.data;
    return {
      user: sessionData?.user,
      username: sessionData?.additional_info?.user?.username,
      email: sessionData?.additional_info?.user?.email,
      fullName: sessionData?.additional_info?.user?.fullName,
      structures: sessionData?.additional_info?.structures || [],
      modules: sessionData?.additional_info?.modules || [],
    };
  };

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canCreateProject,
    canUpdateProject,
    canModifyProject,
    canDeleteProject,
    canPublishProject,
    canUnpublishProject,
    canValidateProject,
    canRejectProject,
    canSubmitProject,
    canListAllProjects,
    canListOwnProjects,
    canAssignProject,
    getAllPermissions,
    isAdmin,
    getUserInfo,
  };
};

export default usePermissions;
