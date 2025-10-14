import type { ProjectRole, UserSession } from "~/types/auth";
import { getUserRolesForModule, hasRole, hasAnyRole } from "~/types/auth";

/**
 * Actions disponibles dans le système
 */
export enum Action {
  // Actions sur les projets
  LIST = "list",
  READ = "read",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  ASSIGN = "assign",

  // Actions de validation
  VALIDATE = "validate",
  REJECT = "reject",
  REQUEST_MODIFICATION = "request_modification",

  // Actions de publication
  PUBLISH = "publish",
  UNPUBLISH = "unpublish",

  // Actions d'administration
  MANAGE_USERS = "manage_users",
  MANAGE_ROLES = "manage_roles",
}

/**
 * Sujets (ressources) disponibles dans le système
 */
export enum Subject {
  PROJECT = "project",
  USER = "user",
  ROLE = "role",
  MODULE = "module",
  ALL = "all",
}

/**
 * Type pour une ability (permission)
 */
export interface Ability {
  action: Action;
  subject: Subject;
  conditions?: Record<string, any>;
}

/**
 * Mapping des rôles Keycloak vers les abilities
 * Définit quelles actions un rôle peut effectuer sur quels sujets
 */
const ROLE_ABILITIES_MAP: Record<ProjectRole, Ability[]> = {
  // Rôle: Liste les projets
  LIST_PROJECT: [
    { action: Action.LIST, subject: Subject.PROJECT },
    { action: Action.READ, subject: Subject.PROJECT },
  ],

  // Rôle: Créer un projet
  CREATE_PROJECT: [
    { action: Action.CREATE, subject: Subject.PROJECT },
  ],

  // Rôle: Modifier un projet
  UPDATE_PROJECT: [
    { action: Action.UPDATE, subject: Subject.PROJECT },
  ],

  // Rôle: Supprimer un projet
  DELETE_PROJECT: [
    { action: Action.DELETE, subject: Subject.PROJECT },
  ],

  // Rôle: Affecter un projet
  ASSIGN_PROJECT: [
    { action: Action.ASSIGN, subject: Subject.PROJECT },
  ],

  // Rôle: Valider un projet
  VALIDATE_PROJECT: [
    { action: Action.VALIDATE, subject: Subject.PROJECT },
  ],

  // Rôle: Rejeter un projet
  REJECT_PROJECT: [
    { action: Action.REJECT, subject: Subject.PROJECT },
  ],

  // Rôle: Demander une modification
  REQUEST_MODIFICATION: [
    { action: Action.REQUEST_MODIFICATION, subject: Subject.PROJECT },
  ],

  // Rôle: Publier un projet
  PUBLISH_PROJECT: [
    { action: Action.PUBLISH, subject: Subject.PROJECT },
  ],

  // Rôle: Dépublier un projet
  UNPUBLISH_PROJECT: [
    { action: Action.UNPUBLISH, subject: Subject.PROJECT },
  ],

  // Rôle: Validateur (rôle composite avec plusieurs permissions)
  VALIDATEUR: [
    { action: Action.LIST, subject: Subject.PROJECT },
    { action: Action.READ, subject: Subject.PROJECT },
    { action: Action.VALIDATE, subject: Subject.PROJECT },
    { action: Action.REJECT, subject: Subject.PROJECT },
    { action: Action.REQUEST_MODIFICATION, subject: Subject.PROJECT },
  ],
};

/**
 * Classe pour gérer les abilities (permissions) de l'utilisateur
 */
export class AbilityManager {
  private abilities: Ability[] = [];
  private session: UserSession | null = null;

  constructor(session: UserSession | null) {
    this.session = session;
    this.abilities = this.computeAbilities();
  }

  /**
   * Calcule toutes les abilities de l'utilisateur en fonction de ses rôles
   */
  private computeAbilities(): Ability[] {
    if (!this.session) {
      return [];
    }

    const userRoles = getUserRolesForModule(this.session);
    const abilities: Ability[] = [];

    // Pour chaque rôle de l'utilisateur, ajouter les abilities correspondantes
    userRoles.forEach((role) => {
      const roleAbilities = ROLE_ABILITIES_MAP[role];
      if (roleAbilities) {
        abilities.push(...roleAbilities);
      }
    });

    // Supprimer les doublons
    return this.deduplicateAbilities(abilities);
  }

  /**
   * Supprime les abilities en double
   */
  private deduplicateAbilities(abilities: Ability[]): Ability[] {
    const seen = new Set<string>();
    return abilities.filter((ability) => {
      const key = `${ability.action}:${ability.subject}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Vérifie si l'utilisateur peut effectuer une action sur un sujet
   */
  can(action: Action, subject: Subject): boolean {
    return this.abilities.some(
      (ability) =>
        ability.action === action &&
        (ability.subject === subject || ability.subject === Subject.ALL)
    );
  }

  /**
   * Vérifie si l'utilisateur ne peut pas effectuer une action sur un sujet
   */
  cannot(action: Action, subject: Subject): boolean {
    return !this.can(action, subject);
  }

  /**
   * Vérifie si l'utilisateur peut effectuer l'une des actions sur un sujet
   */
  canAny(actions: Action[], subject: Subject): boolean {
    return actions.some((action) => this.can(action, subject));
  }

  /**
   * Vérifie si l'utilisateur peut effectuer toutes les actions sur un sujet
   */
  canAll(actions: Action[], subject: Subject): boolean {
    return actions.every((action) => this.can(action, subject));
  }

  /**
   * Retourne toutes les abilities de l'utilisateur
   */
  getAbilities(): Ability[] {
    return [...this.abilities];
  }

  /**
   * Retourne les actions disponibles pour un sujet donné
   */
  getActionsForSubject(subject: Subject): Action[] {
    return this.abilities
      .filter((ability) => ability.subject === subject || ability.subject === Subject.ALL)
      .map((ability) => ability.action);
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: ProjectRole): boolean {
    return hasRole(this.session, role);
  }

  /**
   * Vérifie si l'utilisateur a l'un des rôles spécifiés
   */
  hasAnyRole(roles: ProjectRole[]): boolean {
    return hasAnyRole(this.session, roles);
  }
}

/**
 * Helpers pour les vérifications d'abilities courantes
 */

// L'UTILISATEUR A ACCES AU MODULE PROJET
export function canAccessProjectModule(session: UserSession | null): boolean {
  const manager = new AbilityManager(session);
  return manager.canAny(
    [Action.LIST, Action.READ, Action.CREATE],
    Subject.PROJECT
  );
}

// L'UTILISATEUR PEUT CONSULTER LA LISTE DES PROJETS
export function canListProjects(session: UserSession | null): boolean {
  const manager = new AbilityManager(session);
  return manager.can(Action.LIST, Subject.PROJECT);
}

// L'UTILISATEUR PEUT CREER UN PROJET
export function canCreateProject(session: UserSession | null): boolean {
  const manager = new AbilityManager(session);
  return manager.can(Action.CREATE, Subject.PROJECT);
}

// L'UTILISATEUR PEUT SUPPRIMER UN PROJET
export function canDeleteProject(session: UserSession | null): boolean {
  const manager = new AbilityManager(session);
  return manager.can(Action.DELETE, Subject.PROJECT);
}

// L'UTILISATEUR PEUT AFFECTER UN PROJET
export function canAssignProject(session: UserSession | null): boolean {
  const manager = new AbilityManager(session);
  return manager.can(Action.ASSIGN, Subject.PROJECT);
}

// L'UTILISATEUR PEUT MODIFIER UN PROJET
export function canUpdateProject(session: UserSession | null): boolean {
  const manager = new AbilityManager(session);
  return manager.can(Action.UPDATE, Subject.PROJECT);
}

// L'UTILISATEUR PEUT VALIDER UN PROJET
export function canValidateProject(session: UserSession | null): boolean {
  const manager = new AbilityManager(session);
  return manager.can(Action.VALIDATE, Subject.PROJECT);
}

// L'UTILISATEUR PEUT REJETER UN PROJET
export function canRejectProject(session: UserSession | null): boolean {
  const manager = new AbilityManager(session);
  return manager.can(Action.REJECT, Subject.PROJECT);
}

// L'UTILISATEUR PEUT DEMANDER UNE MODIFICATION
export function canRequestModification(session: UserSession | null): boolean {
  const manager = new AbilityManager(session);
  return manager.can(Action.REQUEST_MODIFICATION, Subject.PROJECT);
}

// L'UTILISATEUR PEUT PUBLIER UN PROJET
export function canPublishProject(session: UserSession | null): boolean {
  const manager = new AbilityManager(session);
  return manager.can(Action.PUBLISH, Subject.PROJECT);
}

// L'UTILISATEUR PEUT DEPUBLIER UN PROJET
export function canUnpublishProject(session: UserSession | null): boolean {
  const manager = new AbilityManager(session);
  return manager.can(Action.UNPUBLISH, Subject.PROJECT);
}