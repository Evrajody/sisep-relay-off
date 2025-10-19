/**
 * Middleware d'authentification Better Auth
 *
 * Vérifie si l'utilisateur est connecté via Better Auth.
 * Si non connecté, redirige vers la page d'accueil (/)
 *
 * Usage dans les pages :
 * ```typescript
 * definePageMeta({
 *   middleware: 'auth'
 * })
 * ```
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
    // Récupérer le runtime config pour l'URL de Better Auth
    const config = useRuntimeConfig();

    try {
        // Appeler l'endpoint de session Better Auth
        const session = await $fetch('get-session', {
            baseURL: config.public.betterAuthUrl,
            credentials: 'include', // Important pour inclure les cookies
            headers: useRequestHeaders(['cookie']) as Record<string, string>,
        });

        // Vérifier si la session existe et est valide
        if (!session || !session.user) {
            console.warn('[Auth Middleware] Aucune session trouvée, redirection vers /');
            return navigateTo('/');
        }

        // Session valide, continuer la navigation
        console.log('[Auth Middleware] Session valide pour:', session.user.email);

    } catch (error: any) {
        // En cas d'erreur (session expirée, non authentifié, etc.)
        console.error('[Auth Middleware] Erreur lors de la vérification de la session:', {
            message: error.message,
            statusCode: error.statusCode || error.status,
        });

        return navigateTo('/');
    }
});
