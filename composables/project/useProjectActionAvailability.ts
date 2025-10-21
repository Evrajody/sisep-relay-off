/**
 * Composable pour vérifier la disponibilité des actions de projet
 * basé sur les transitions de statut autorisées
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

/**
 * Interface pour décrire une action avec son statut cible
 */
export interface ProjectAction {
  label: string;
  targetStatus: string;
  key: string;
}

/**
 * Liste de toutes les actions disponibles et leurs statuts cibles
 */
export const PROJECT_ACTIONS: Record<string, ProjectAction> = {
  SAVE_DRAFT: {
    label: 'Brouillon',
    targetStatus: PROJECT_STATUS_DRAFT,
    key: 'SAVE_DRAFT',
  },
  SUBMIT: {
    label: 'Soumettre',
    targetStatus: PROJECT_STATUS_SUBMITTED,
    key: 'SUBMIT',
  },
  VALIDATE: {
    label: 'Valider',
    targetStatus: PROJECT_STATUS_VALIDATED,
    key: 'VALIDATE',
  },
  VALIDATE_BY_STRUCTURE: {
    label: 'Valider (Structure)',
    targetStatus: PROJECT_STATUS_VALIDATED_BY_STRUCTURE,
    key: 'VALIDATE_BY_STRUCTURE',
  },
  REJECT: {
    label: 'Rejeter',
    targetStatus: PROJECT_STATUS_REJECTED,
    key: 'REJECT',
  },
  REJECT_BY_STRUCTURE: {
    label: 'Rejeter (Structure)',
    targetStatus: PROJECT_STATUS_REJECTED_BY_STRUCTURE,
    key: 'REJECT_BY_STRUCTURE',
  },
  PUBLISH: {
    label: 'Publier',
    targetStatus: PROJECT_STATUS_PUBLISHED,
    key: 'PUBLISH',
  },
  UNPUBLISH: {
    label: 'Dépublier',
    targetStatus: PROJECT_STATUS_UNPUBLISHED,
    key: 'UNPUBLISH',
  },
};

export const useProjectActionAvailability = () => {
  /**
   * Vérifie si une action est disponible selon le statut actuel du projet
   * @param currentStatus - Le statut actuel du projet
   * @param actionKey - La clé de l'action (ex: 'SUBMIT', 'VALIDATE', etc.)
   * @returns true si l'action est disponible, false sinon
   */
  const isActionAvailable = (currentStatus: string | undefined, actionKey: string): boolean => {
    if (!currentStatus || !PROJECT_ACTIONS[actionKey]) {
      return false;
    }

    const action = PROJECT_ACTIONS[actionKey];
    return isStatusTransitionAllowed(currentStatus, action.targetStatus);
  };

  /**
   * Vérifie si une action est disponible selon le statut actuel du projet
   * (version courte)
   */
  const canPerformAction = (currentStatus: string | undefined, targetStatus: string): boolean => {
    return isStatusTransitionAllowed(currentStatus, targetStatus);
  };

  /**
   * Obtient la liste des actions disponibles pour le statut actuel
   * @param currentStatus - Le statut actuel du projet
   * @returns Array des clés d'actions disponibles
   */
  const getAvailableActions = (currentStatus: string | undefined): string[] => {
    if (!currentStatus) return [];

    return Object.entries(PROJECT_ACTIONS)
      .filter(([_, action]) => isStatusTransitionAllowed(currentStatus, action.targetStatus))
      .map(([key, _]) => key);
  };

  return {
    isActionAvailable,
    canPerformAction,
    getAvailableActions,
    PROJECT_ACTIONS,
  };
};

export default useProjectActionAvailability;
