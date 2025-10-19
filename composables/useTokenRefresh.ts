/**
 * Composable pour gérer le refresh automatique des tokens
 * Utilise Better Auth pour maintenir les tokens à jour
 */

import { ref } from 'vue';

export const useTokenRefresh = () => {
    const isRefreshing = ref(false);
    const refreshPromise = ref<Promise<boolean> | null>(null);

    /**
     * Rafraîchit le token d'accès
     * @returns true si le refresh a réussi, false sinon
     */
    const refreshToken = async (): Promise<boolean> => {
        // Si un refresh est déjà en cours, attendre qu'il se termine
        if (isRefreshing.value && refreshPromise.value) {
            console.log('[Token Refresh] Refresh déjà en cours, attente...');
            return await refreshPromise.value;
        }

        isRefreshing.value = true;

        // Créer une promesse pour que les autres requêtes puissent attendre
        refreshPromise.value = (async () => {
            try {
                console.log('[Token Refresh] Tentative de refresh du token...');

                const response = await $fetch<{
                    success: boolean;
                    error?: string;
                    requireReLogin?: boolean;
                    accessToken?: string;
                }>('/api/refresh-token', {
                    method: 'POST',
                    credentials: 'include', // Important pour envoyer les cookies
                });

                if (response.success) {
                    console.log('[Token Refresh] Token rafraîchi avec succès');
                    return true;
                }

                if (response.requireReLogin) {
                    console.error('[Token Refresh] Refresh token expiré, reconnexion nécessaire');
                    // Rediriger vers la page de login
                    await navigateTo('/admin/login');
                    return false;
                }

                console.error('[Token Refresh] Erreur lors du refresh:', response.error);
                return false;

            } catch (error: any) {
                console.error('[Token Refresh] Erreur inattendue:', error);
                return false;
            } finally {
                isRefreshing.value = false;
                refreshPromise.value = null;
            }
        })();

        return await refreshPromise.value;
    };

    /**
     * Crée un wrapper $fetch qui gère automatiquement le refresh en cas d'erreur 401
     * @param url URL de la requête
     * @param options Options de la requête
     * @returns La réponse de la requête
     */
    const fetchWithTokenRefresh = async <T = any>(
        url: string,
        options: any = {}
    ): Promise<T> => {
        try {
            // Première tentative
            return await $fetch<T>(url, {
                ...options,
                credentials: 'include',
            });

        } catch (error: any) {
            // Si erreur 401 (Unauthorized), tenter de rafraîchir le token
            if (error.statusCode === 401 || error.status === 401) {
                console.log('[Token Refresh] Erreur 401 détectée, tentative de refresh...');

                const refreshed = await refreshToken();

                if (refreshed) {
                    // Réessayer la requête avec le nouveau token
                    console.log('[Token Refresh] Nouvelle tentative de la requête...');
                    return await $fetch<T>(url, {
                        ...options,
                        credentials: 'include',
                    });
                } else {
                    console.error('[Token Refresh] Impossible de rafraîchir le token');
                    throw error;
                }
            }

            // Autres erreurs, les laisser passer
            throw error;
        }
    };

    /**
     * Intercepteur pour Better Auth client
     * À utiliser avec le plugin auth-better-client
     */
    const createAuthInterceptor = () => {
        return {
            onRequest: async (context: any) => {
                // Rien à faire avant la requête
                return context;
            },

            onResponse: async (context: any) => {
                return context;
            },

            onResponseError: async (context: any) => {
                const { response } = context;

                // Si erreur 401, tenter de rafraîchir
                if (response?.status === 401) {
                    console.log('[Auth Interceptor] Erreur 401, tentative de refresh...');

                    const refreshed = await refreshToken();

                    if (refreshed) {
                        // Réessayer la requête originale
                        console.log('[Auth Interceptor] Nouvelle tentative...');
                        // Note: Better Auth gère automatiquement la nouvelle tentative
                    }
                }

                return context;
            }
        };
    };

    return {
        isRefreshing,
        refreshToken,
        fetchWithTokenRefresh,
        createAuthInterceptor,
    };
};

/**
 * Helper pour créer un client API avec gestion automatique du refresh
 * Exemple d'utilisation:
 *
 * ```typescript
 * const api = createApiClient('https://api.example.com');
 * const data = await api.get('/users');
 * ```
 */
export const createApiClient = (baseURL: string) => {
    const { fetchWithTokenRefresh } = useTokenRefresh();

    return {
        get: <T = any>(url: string, options?: any) =>
            fetchWithTokenRefresh<T>(url, { ...options, method: 'GET', baseURL }),

        post: <T = any>(url: string, body?: any, options?: any) =>
            fetchWithTokenRefresh<T>(url, { ...options, method: 'POST', body, baseURL }),

        put: <T = any>(url: string, body?: any, options?: any) =>
            fetchWithTokenRefresh<T>(url, { ...options, method: 'PUT', body, baseURL }),

        delete: <T = any>(url: string, options?: any) =>
            fetchWithTokenRefresh<T>(url, { ...options, method: 'DELETE', baseURL }),

        patch: <T = any>(url: string, body?: any, options?: any) =>
            fetchWithTokenRefresh<T>(url, { ...options, method: 'PATCH', body, baseURL }),
    };
};
