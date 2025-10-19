import { auth } from "~/server/utils/auth";

/**
 * Endpoint de déconnexion complète :
 * 1. Déconnecte de Better Auth (révoque la session)
 * 2. Déconnecte de Keycloak (SSO logout)
 */
export default defineEventHandler(async (event) => {
    try {
        // 1. Récupérer la session actuelle
        const session = await auth.api.getSession({
            headers: event.headers,
        });

        if (!session) {
            return {
                success: false,
                error: "No active session",
            };
        }

        const userId = session.user.id;

        // 2. Récupérer l'id_token directement depuis la session
        // L'id_token est maintenant stocké dans la session par customSession
        const idToken = (session.session as any)?.idToken || null;

        console.log("[Logout] Session info:", {
            userId,
            hasIdToken: !!idToken,
            auth_provider: (session.session as any)?.auth_provider,
        });

        // 3. Déconnexion de Better Auth
        await auth.api.signOut({
            headers: event.headers,
        });

        const runtimeconfig = useRuntimeConfig()

        // 4. Construire l'URL de déconnexion Keycloak
        const keycloakUrl = runtimeconfig.public.keycloakUrl || "";
        const keycloakRealm = runtimeconfig.public.keycloakRealm || "siseb";
        const keycloakClientId = runtimeconfig.public.keycloakClientId || "";
        const appUrl = runtimeconfig.public.baseSiseb || "";


        if (!keycloakUrl || !keycloakRealm) {
            console.error("[Logout] Keycloak configuration missing");
            return {
                success: true,
                keycloakLogoutUrl: null,
            };
        }

        // URL de déconnexion Keycloak (OIDC End Session Endpoint)
        const logoutUrl = new URL(`${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/logout`);

        // Paramètres de déconnexion
        // Option 1 : Si on a l'id_token, l'utiliser (recommandé)
        if (idToken) {
            logoutUrl.searchParams.set("id_token_hint", idToken);
            console.log("[Logout] Utilisation de id_token_hint");
        }
        // Option 2 : Sinon utiliser client_id comme fallback (accepté par Keycloak)
        else if (keycloakClientId) {
            logoutUrl.searchParams.set("client_id", keycloakClientId);
            console.log("[Logout] Utilisation de client_id comme fallback");
        }
        // Option 3 : Sans paramètres (déconnexion basique)
        else {
            console.warn("[Logout] Déconnexion Keycloak sans id_token_hint ni client_id");
        }

        logoutUrl.searchParams.set("post_logout_redirect_uri", `${appUrl}`);

        console.log("[Logout] User logged out successfully", {
            userId,
            keycloakLogout: !!idToken,
            redirectUrl: logoutUrl.toString(),
        });

        // 5. Retourner l'URL de déconnexion Keycloak
        return {
            success: true,
            keycloakLogoutUrl: logoutUrl.toString(),
        };

    } catch (error: any) {
        console.error("[Logout] Error during logout:", {
            error: error.message,
            stack: error.stack,
        });

        return {
            success: false,
            error: error.message,
        };
    }
});
