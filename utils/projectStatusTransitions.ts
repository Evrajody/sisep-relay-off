/**
 * Définition des transitions possibles entre les statuts de projet
 * Format: { statusActuel: [statusAcceptés] }
 */

export const PROJECT_STATUS_DRAFT = 'DRAFT';
export const PROJECT_STATUS_SUBMITTED = 'SUBMITTED';
export const PROJECT_STATUS_VALIDATED = 'VALIDATED';
export const PROJECT_STATUS_VALIDATED_BY_STRUCTURE = 'VALIDATED_BY_STRUCTURE';
export const PROJECT_STATUS_REJECTED = 'REJECTED';
export const PROJECT_STATUS_REJECTED_BY_STRUCTURE = 'REJECTED_BY_STRUCTURE';
export const PROJECT_STATUS_PUBLISHED = 'PUBLISHED';
export const PROJECT_STATUS_UNPUBLISHED = 'UNPUBLISHED';

/**
 * Transitions de statut autorisées
 * Chaque clé représente le statut actuel, la valeur est un tableau des statuts possibles
 */
export const PROJECT_STATUS_TRANSITIONS: Record<string, string[]> = {
  [PROJECT_STATUS_DRAFT]: [PROJECT_STATUS_SUBMITTED],

  [PROJECT_STATUS_SUBMITTED]: [
    PROJECT_STATUS_VALIDATED_BY_STRUCTURE,
    PROJECT_STATUS_REJECTED_BY_STRUCTURE
  ],

  [PROJECT_STATUS_VALIDATED_BY_STRUCTURE]: [PROJECT_STATUS_VALIDATED],

  [PROJECT_STATUS_VALIDATED]: [PROJECT_STATUS_PUBLISHED],

  [PROJECT_STATUS_REJECTED]: [PROJECT_STATUS_DRAFT], // Permet de corriger après rejet

  [PROJECT_STATUS_REJECTED_BY_STRUCTURE]: [PROJECT_STATUS_DRAFT], // Permet de corriger après rejet

  [PROJECT_STATUS_PUBLISHED]: [PROJECT_STATUS_UNPUBLISHED],

  [PROJECT_STATUS_UNPUBLISHED]: [PROJECT_STATUS_PUBLISHED],
};

/**
 * Vérifier si une transition est possible
 * @param currentStatus - Le statut actuel du projet
 * @param targetStatus - Le statut cible désiré
 * @returns true si la transition est possible, false sinon
 */
export const isStatusTransitionAllowed = (
  currentStatus: string | undefined,
  targetStatus: string
): boolean => {
  if (!currentStatus) return false;

  const allowedTransitions = PROJECT_STATUS_TRANSITIONS[currentStatus];
  if (!allowedTransitions) return false;

  return allowedTransitions.includes(targetStatus);
};

/**
 * Obtenir la liste des statuts possibles à partir du statut actuel
 * @param currentStatus - Le statut actuel du projet
 * @returns Array des statuts possibles
 */
export const getAllowedStatusTransitions = (currentStatus: string | undefined): string[] => {
  if (!currentStatus) return [];
  return PROJECT_STATUS_TRANSITIONS[currentStatus] || [];
};
