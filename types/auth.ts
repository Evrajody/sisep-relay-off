/**
 * Types pour l'authentification avec Keycloak et le système local
 */

/**
 * Rôles disponibles dans le module siseb-projet
 */
export type ProjectRole =
  | "VALIDATEUR"
  | "PUBLISH_PROJECT"
  | "VALIDATE_PROJECT"
  | "UNPUBLISH_PROJECT"
  | "REJECT_PROJECT"
  | "LIST_PROJECT"
  | "CREATE_PROJECT"
  | "UPDATE_PROJECT"
  | "DELETE_PROJECT"
  | "ASSIGN_PROJECT"
  | "REQUEST_MODIFICATION";

/**
 * Modules disponibles dans l'application
 */
export type AppModule = "siseb-projet" | string;

/**
 * Structure des ressources utilisateur par module
 */
export interface UserResources {
  [module: string]: {
    roles: ProjectRole[];
  };
}

/**
 * Détails du token retourné par l'API backend
 */
export interface TokenDetails {
  username: string;
  userFullName: string;
  liste_modules: AppModule[];
  userEmail: string;
  userResources: UserResources;
  userRoles: string[];
}

/**
 * Informations additionnelles de la session
 */
export interface AdditionalInfo {
  message: string;
  tokenDetails: TokenDetails;
}

/**
 * Structure de base de l'utilisateur
 */
export interface UserInfo {
  name: string;
  email: string;
}

/**
 * Session utilisateur complète avec authentification Keycloak
 */
export interface KeycloakUserSession {
  user: UserInfo;
  expires: string;
  name: string;
  email: string;
  sub: string;
  access_token: string;
  refresh_token: string;
  iat: number;
  exp: number;
  jti: string;
  auth_provider: "keycloak";
  additional_info: AdditionalInfo;
}

/**
 * Session utilisateur pour l'authentification locale
 */
export interface LocalUserSession {
  user: UserInfo;
  expires: string;
  name: string;
  email: string;
  sub?: string;
  access_token: string;
  refresh_token: string;
  iat: number;
  exp: number;
  jti: string;
  auth_provider: "local";
  additional_info: {
    jwt: string;
    [key: string]: any;
  };
}

/**
 * Type union pour les sessions utilisateur
 */
export type UserSession = KeycloakUserSession | LocalUserSession;

/**
 * Type guard pour vérifier si la session est de type Keycloak
 */
export function isKeycloakSession(
  session: UserSession | null
): session is KeycloakUserSession {
  return session?.auth_provider === "keycloak";
}

/**
 * Type guard pour vérifier si la session est de type Local
 */
export function isLocalSession(
  session: UserSession | null
): session is LocalUserSession {
  return session?.auth_provider === "local";
}

/**
 * Extrait les rôles d'un utilisateur pour un module spécifique
 */
export function getUserRolesForModule(
  session: UserSession | null,
  module: AppModule = "siseb-projet"
): ProjectRole[] {
  if (!session || !isKeycloakSession(session)) {
    return [];
  }

  const userResources = session.additional_info?.tokenDetails?.userResources;
  return userResources?.[module]?.roles || [];
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique pour un module
 */
export function hasRole(
  session: UserSession | null,
  role: ProjectRole,
  module: AppModule = "siseb-projet"
): boolean {
  const roles = getUserRolesForModule(session, module);
  return roles.includes(role);
}

/**
 * Vérifie si l'utilisateur a l'un des rôles spécifiés pour un module
 */
export function hasAnyRole(
  session: UserSession | null,
  roles: ProjectRole[],
  module: AppModule = "siseb-projet"
): boolean {
  const userRoles = getUserRolesForModule(session, module);
  return roles.some((role) => userRoles.includes(role));
}

/**
 * Vérifie si l'utilisateur a tous les rôles spécifiés pour un module
 */
export function hasAllRoles(
  session: UserSession | null,
  roles: ProjectRole[],
  module: AppModule = "siseb-projet"
): boolean {
  const userRoles = getUserRolesForModule(session, module);
  return roles.every((role) => userRoles.includes(role));
}

/**
 * Récupère tous les modules accessibles par l'utilisateur
 */
export function getUserModules(session: UserSession | null): AppModule[] {
  if (!session || !isKeycloakSession(session)) {
    return [];
  }

  return session.additional_info?.tokenDetails?.liste_modules || [];
}

/**
 * Vérifie si l'utilisateur a accès à un module spécifique
 */
export function hasModuleAccess(
  session: UserSession | null,
  module: AppModule
): boolean {
  const modules = getUserModules(session);
  return modules.includes(module);
}
