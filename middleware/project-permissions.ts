/**
 * Middleware pour vérifier les permissions sur les routes de projets
 *
 * Usage dans les pages :
 * ```typescript
 * definePageMeta({
 *   middleware: 'project-permissions'
 * })
 * ```
 */

import type { UserSession } from "~/types/auth";
import { hasModuleAccess } from "~/types/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const { status, data: session } = useAuth();

  // Vérifier si l'utilisateur est authentifié
  if (status.value !== "authenticated") {
    return navigateTo("/admin/login");
  }

  // Vérifier si l'utilisateur a accès au module projet
  if (!hasModuleAccess(session.value as UserSession | null, "siseb-projet")) {
    return abortNavigation({
      statusCode: 403,
      message: "Vous n'avez pas accès au module de gestion de projets",
    });
  }
});
