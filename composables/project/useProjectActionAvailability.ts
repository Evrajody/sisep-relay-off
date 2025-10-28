/**
 * Composable pour vérifier la disponibilité des actions de projet
 * basé sur les transitions de statut autorisées ET les permissions utilisateur
 */

import {
  PROJECT_STATUS_DRAFT,
  PROJECT_STATUS_SUBMITTED,
  PROJECT_STATUS_VALIDATED,
  PROJECT_STATUS_VALIDATED_BY_STRUCTURE,
  PROJECT_STATUS_REJECTED,
  PROJECT_STATUS_REJECTED_BY_STRUCTURE,
  PROJECT_STATUS_PUBLISHED,
  PROJECT_STATUS_UNPUBLISHED,
  isStatusTransitionAllowed,
} from '~/utils/projectStatusTransitions';
import { usePermissions, ProjectPermission } from '~/composables/usePermissions';

/**
 * Interface pour décrire une action avec son statut cible et ses permissions requises
 */
export interface ProjectAction {
  label: string;
  targetStatus: string;
  key: string;
  requiredPermissions?: (ProjectPermission | string)[]; // Permissions requises pour cette action
}

/**
 * Liste de toutes les actions disponibles et leurs statuts cibles
 */
export const PROJECT_ACTIONS: Record<string, ProjectAction> = {
  SAVE_DRAFT: {
    label: 'Brouillon',
    targetStatus: PROJECT_STATUS_DRAFT,
    key: 'SAVE_DRAFT',
    requiredPermissions: [ProjectPermission.UPDATE, ProjectPermission.MODIFY],
  },
  SUBMIT: {
    label: 'Soumettre',
    targetStatus: PROJECT_STATUS_SUBMITTED,
    key: 'SUBMIT',
    requiredPermissions: [ProjectPermission.SUBMIT],
  },
  VALIDATE: {
    label: 'Valider',
    targetStatus: PROJECT_STATUS_VALIDATED,
    key: 'VALIDATE',
    requiredPermissions: [ProjectPermission.VALIDATE],
  },
  VALIDATE_BY_STRUCTURE: {
    label: 'Valider (Structure)',
    targetStatus: PROJECT_STATUS_VALIDATED_BY_STRUCTURE,
    key: 'VALIDATE_BY_STRUCTURE',
    requiredPermissions: [ProjectPermission.VALIDATE],
  },
  REJECT: {
    label: 'Rejeter',
    targetStatus: PROJECT_STATUS_REJECTED,
    key: 'REJECT',
    requiredPermissions: [ProjectPermission.REJECT],
  },
  REJECT_BY_STRUCTURE: {
    label: 'Rejeter (Structure)',
    targetStatus: PROJECT_STATUS_REJECTED_BY_STRUCTURE,
    key: 'REJECT_BY_STRUCTURE',
    requiredPermissions: [ProjectPermission.REJECT],
  },
  PUBLISH: {
    label: 'Publier',
    targetStatus: PROJECT_STATUS_PUBLISHED,
    key: 'PUBLISH',
    requiredPermissions: [ProjectPermission.PUBLISH],
  },
  UNPUBLISH: {
    label: 'Dépublier',
    targetStatus: PROJECT_STATUS_UNPUBLISHED,
    key: 'UNPUBLISH',
    requiredPermissions: [ProjectPermission.UNPUBLISH],
  },
};

export const useProjectActionAvailability = () => {
  const { hasAnyPermission } = usePermissions();

  /**
   * Vérifie si l'utilisateur a les permissions requises pour une action
   * @param action - L'action à vérifier
   * @returns true si l'utilisateur a les permissions requises, false sinon
   */
  const hasRequiredPermissions = (action: ProjectAction): boolean => {
    if (!action.requiredPermissions || action.requiredPermissions.length === 0) {
      return true; // Pas de permissions requises
    }
    return hasAnyPermission(action.requiredPermissions);
  };

  /**
   * Vérifie si une action est disponible selon le statut actuel du projet ET les permissions
   * @param currentStatus - Le statut actuel du projet
   * @param actionKey - La clé de l'action (ex: 'SUBMIT', 'VALIDATE', etc.)
   * @returns true si l'action est disponible et autorisée, false sinon
   */
  const isActionAvailable = (currentStatus: string | undefined, actionKey: string): boolean => {

    if (!currentStatus || !PROJECT_ACTIONS[actionKey]) {
      return false;
    }

    const action = PROJECT_ACTIONS[actionKey];
    // Vérifier à la fois la transition de statut ET les permissions
    return  isStatusTransitionAllowed(currentStatus, action.targetStatus);

  };

  /**
   * Vérifie si une transition de statut est possible (sans vérifier les permissions)
   * (version courte)
   */
  const canPerformAction = (currentStatus: string | undefined, targetStatus: string): boolean => {
    return isStatusTransitionAllowed(currentStatus, targetStatus);
  };

  /**
   * Obtient la liste des actions disponibles pour le statut actuel
   * Prend en compte à la fois les transitions de statut ET les permissions
   * @param currentStatus - Le statut actuel du projet
   * @returns Array des clés d'actions disponibles
   */
  const getAvailableActions = (currentStatus: string | undefined): string[] => {
    if (!currentStatus) return [];

    return Object.entries(PROJECT_ACTIONS)
      .filter(([_, action]) => {
        const transitionAllowed = isStatusTransitionAllowed(currentStatus, action.targetStatus);
        const permissionAllowed = hasRequiredPermissions(action);
        return transitionAllowed && permissionAllowed;
      })
      .map(([key, _]) => key);
  };

  /**
   * Obtient les raisons pour lesquelles une action n'est pas disponible
   * Utile pour afficher un message à l'utilisateur
   * @param currentStatus - Le statut actuel du projet
   * @param actionKey - La clé de l'action
   * @returns Objet contenant les raisons (transition, permission)
   */
  const getActionUnavailableReasons = (
    currentStatus: string | undefined,
    actionKey: string
  ): { transition: boolean; permission: boolean } => {
    if (!currentStatus || !PROJECT_ACTIONS[actionKey]) {
      return { transition: true, permission: false };
    }

    const action = PROJECT_ACTIONS[actionKey];
    const transitionAllowed = isStatusTransitionAllowed(currentStatus, action.targetStatus);
    const permissionAllowed = hasRequiredPermissions(action);

    return {
      transition: !transitionAllowed,
      permission: !permissionAllowed,
    };
  };

  return {
    isActionAvailable,
    canPerformAction,
    getAvailableActions,
    getActionUnavailableReasons,
    hasRequiredPermissions,
    PROJECT_ACTIONS,
  };
};

export default useProjectActionAvailability;
