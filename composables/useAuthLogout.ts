/**
 * Composable pour gérer la déconnexion complète
 * (Better Auth + Keycloak SSO)
 */
export const useAuthLogout = () => {
    const { $authClient } = useNuxtApp();

    /**
     * Déconnexion complète : Better Auth + Keycloak
     */
    const logout = async () => {
        try {
            // Appeler l'endpoint de déconnexion
            const response = await $fetch("/api/logout-keycloak", {
                method: "POST",
            });

            if (response.success && response.keycloakLogoutUrl) {
                // Rediriger vers Keycloak pour terminer la déconnexion SSO
                window.location.href = response.keycloakLogoutUrl;
            } else {
                // Si pas de logout Keycloak, rediriger vers la page de login
                await navigateTo("/admin/login");
            }
        } catch (error) {
            console.error("[Logout] Error:", error);
            // En cas d'erreur, essayer de déconnecter quand même de Better Auth
            try {
                await $authClient.signOut();
            } catch (e) {
                console.error("[Logout] Failed to sign out from Better Auth:", e);
            }
            // Rediriger vers la page de login
            await navigateTo("/admin/login");
        }
    };

    /**
     * Déconnexion simple (Better Auth seulement, sans Keycloak)
     */
    const simpleLogout = async () => {
        try {
            await $authClient.signOut();
            await navigateTo("/admin/login");
        } catch (error) {
            console.error("[Simple Logout] Error:", error);
            await navigateTo("/admin/login");
        }
    };

    return {
        logout,        // Déconnexion complète (Better Auth + Keycloak)
        simpleLogout,  // Déconnexion simple (Better Auth seulement)
    };
};
