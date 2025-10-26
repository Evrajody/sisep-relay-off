import { computed } from "vue";
import type { UserSession } from "~/types/auth";
import {
  canCreateProject,
  canDeleteProject,
  canAssignProject,
  canUpdateProject,
  canValidateProject,
  canRejectProject,
  canPublishProject,
  canUnpublishProject,
} from "~/shared/utils/abilities";

/**
 * Composable pour gérer les abilities (permissions) de l'utilisateur
 *
 * @example
 * ```vue
 * <script setup>
 * const { can, cannot, abilities, canCreateProject } = useAbilities();
 *
 * // Vérifier si l'utilisateur peut créer un projet
 * if (canCreateProject.value) {
 *   // Afficher le bouton "Créer un projet"
 * }
 *
 * // Vérifier une action personnalisée
 * if (can(Action.VALIDATE, Subject.PROJECT)) {
 *   // L'utilisateur peut valider un projet
 * }
 * </script>
 * ```
 */
export function useAbilities() {
  const { data: session } = useAuth();

  // Créer une instance d'AbilityManager basée sur la session
  const abilityManager = computed(
    () => new AbilityManager(session.value as UserSession | null)
  );

  /**
   * Vérifie si l'utilisateur peut effectuer une action sur un sujet
   */
  const can = (action: Action, subject: Subject) => {
    return computed(() => abilityManager.value.can(action, subject));
  };

  /**
   * Vérifie si l'utilisateur ne peut pas effectuer une action sur un sujet
   */
  const cannot = (action: Action, subject: Subject) => {
    return computed(() => abilityManager.value.cannot(action, subject));
  };

  /**
   * Vérifie si l'utilisateur peut effectuer l'une des actions sur un sujet
   */
  const canAny = (actions: Action[], subject: Subject) => {
    return computed(() => abilityManager.value.canAny(actions, subject));
  };

  /**
   * Vérifie si l'utilisateur peut effectuer toutes les actions sur un sujet
   */
  const canAll = (actions: Action[], subject: Subject) => {
    return computed(() => abilityManager.value.canAll(actions, subject));
  };

  /**
   * Retourne toutes les abilities de l'utilisateur
   */
  const abilities = computed(() => abilityManager.value.getAbilities());

  /**
   * Retourne les actions disponibles pour un sujet donné
   */
  const getActionsForSubject = (subject: Subject) => {
    return computed(() => abilityManager.value.getActionsForSubject(subject));
  };

  /**
   * Helpers pour les vérifications d'abilities courantes
   */

  // L'utilisateur a accès au module projet
  const hasProjectModuleAccess = computed(() =>
    canAccessProjectModule(session.value as UserSession | null)
  );

  // L'utilisateur peut consulter la liste des projets
  const canList = computed(() =>
    canListProjects(session.value as UserSession | null)
  );

  // L'utilisateur peut créer un projet
  const canCreate = computed(() =>
    canCreateProject(session.value as UserSession | null)
  );

  // L'utilisateur peut supprimer un projet
  const canDelete = computed(() =>
    canDeleteProject(session.value as UserSession | null)
  );

  // L'utilisateur peut affecter un projet
  const canAssign = computed(() =>
    canAssignProject(session.value as UserSession | null)
  );

  // L'utilisateur peut modifier un projet
  const canUpdate = computed(() =>
    canUpdateProject(session.value as UserSession | null)
  );

  // L'utilisateur peut valider un projet
  const canValidate = computed(() =>
    canValidateProject(session.value as UserSession | null)
  );

  // L'utilisateur peut rejeter un projet
  const canReject = computed(() =>
    canRejectProject(session.value as UserSession | null)
  );

  // L'utilisateur peut demander une modification
  const canRequestChange = computed(() =>
    canRequestModification(session.value as UserSession | null)
  );

  // L'utilisateur peut publier un projet
  const canPublish = computed(() =>
    canPublishProject(session.value as UserSession | null)
  );

  // L'utilisateur peut dépublier un projet
  const canUnpublish = computed(() =>
    canUnpublishProject(session.value as UserSession | null)
  );

  return {
    // Méthodes de vérification
    can,
    cannot,
    canAny,
    canAll,

    // Abilities et actions
    abilities,
    getActionsForSubject,

    // Helpers de permissions courantes
    hasProjectModuleAccess,
    canList,
    canCreate,
    canDelete,
    canAssign,
    canUpdate,
    canValidate,
    canReject,
    canRequestChange,
    canPublish,
    canUnpublish,

    // Export des enums pour utilisation dans les templates
    Action,
    Subject,
  };
}
