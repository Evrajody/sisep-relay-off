/**
 * Exemple d'API endpoint protégé par le système d'abilities
 *
 * POST /api/projects/validate/:id
 *
 * Valide un projet si l'utilisateur a la permission VALIDATE_PROJECT
 */

import { getServerSession } from "#auth";
import type { UserSession } from "~/types/auth";
import { canValidateProject } from "~/shared/utils/abilities";

export default defineEventHandler(async (event) => {
  try {
    // Récupérer la session utilisateur
    const session = await getServerSession(event) as UserSession | null;

    // Vérifier si l'utilisateur est authentifié
    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Vous devez être authentifié pour effectuer cette action",
      });
    }

    // Vérifier les permissions
    if (!canValidateProject(session)) {
      // Logger l'accès refusé pour audit
      console.warn("[SECURITY] Accès refusé - Validation de projet", {
        timestamp: new Date().toISOString(),
        userId: session.sub,
        userEmail: session.email,
        action: "VALIDATE_PROJECT",
        projectId: getRouterParam(event, "id"),
      });

      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
        message:
          "Vous n'avez pas la permission de valider un projet. Le rôle VALIDATEUR ou VALIDATE_PROJECT est requis.",
      });
    }

    // Récupérer l'ID du projet depuis les paramètres de route
    const projectId = getRouterParam(event, "id");

    if (!projectId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "L'identifiant du projet est requis",
      });
    }

    // Récupérer le corps de la requête (optionnel : commentaire de validation)
    const body = await readBody(event);
    const validationComment = body?.comment || "";

    // TODO: Implémenter la logique de validation du projet
    // Exemple :
    // - Vérifier que le projet existe
    // - Vérifier que le projet est dans un état validable
    // - Mettre à jour le statut du projet
    // - Envoyer des notifications
    // - Logger l'action

    // Simuler la validation du projet
    console.log("[PROJECT] Validation du projet", {
      projectId,
      validatedBy: session.email,
      comment: validationComment,
      timestamp: new Date().toISOString(),
    });

    // Retourner la réponse
    return {
      success: true,
      message: "Projet validé avec succès",
      data: {
        projectId,
        validatedAt: new Date().toISOString(),
        validatedBy: session.email,
      },
    };
  } catch (error: any) {
    // Si c'est déjà une erreur HTTP, la relancer
    if (error.statusCode) {
      throw error;
    }

    // Sinon, logger l'erreur et retourner une erreur 500
    console.error("[ERROR] Erreur lors de la validation du projet", {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Une erreur est survenue lors de la validation du projet",
    });
  }
});
