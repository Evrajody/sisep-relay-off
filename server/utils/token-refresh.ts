/**
 * Utilitaires pour gérer le refresh token avec Keycloak
 */

import type { Adapter } from "better-auth";

interface RefreshTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    id_token?: string;
    "not-before-policy"?: number;
    session_state?: string;
    scope?: string;
}

/**
 * Récupère la configuration Keycloak depuis l'environnement
 */
const getKeycloakConfig = () => {
    const runtimeConfig = useRuntimeConfig();
    return {
        url: runtimeConfig.public.keycloakUrl || "",
        realm: runtimeConfig.public.keycloakRealm || "siseb",
        clientId: runtimeConfig.public.keycloakClientId || "",
        // Le client secret doit être stocké côté serveur uniquement
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
    };
};

/**
 * Vérifie si un access token est expiré ou va expirer bientôt
 * @param expiresAt Timestamp d'expiration en millisecondes
 * @param bufferSeconds Nombre de secondes avant expiration pour considérer le token comme expiré (défaut: 60s)
 * @returns true si le token est expiré ou va expirer dans moins de bufferSeconds
 */
export const isTokenExpired = (expiresAt: number | null | undefined, bufferSeconds = 60): boolean => {
    if (!expiresAt) return true;

    const now = Date.now();
    const expirationTime = expiresAt;
    const bufferTime = bufferSeconds * 1000;

    return (expirationTime - now) <= bufferTime;
};

/**
 * Rafraîchit l'access token via Keycloak
 * @param refreshToken Le refresh token à utiliser
 * @returns Les nouveaux tokens ou null en cas d'erreur
 */
export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResponse | null> => {
    const config = getKeycloakConfig();

    if (!config.url || !config.clientId || !config.clientSecret) {
        console.error("[Token Refresh] Configuration Keycloak incomplète");
        return null;
    }

    try {
        const tokenEndpoint = `${config.url}/realms/${config.realm}/protocol/openid-connect/token`;

        console.log("[Token Refresh] Tentative de refresh du token:", {
            endpoint: tokenEndpoint,
            realm: config.realm,
            clientId: config.clientId,
        });

        // Préparer les données du formulaire
        const formData = new URLSearchParams();
        formData.append("grant_type", "refresh_token");
        formData.append("client_id", config.clientId);
        formData.append("client_secret", config.clientSecret);
        formData.append("refresh_token", refreshToken);

        // Appeler l'endpoint de refresh token de Keycloak
        const response = await $fetch<RefreshTokenResponse>(tokenEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        });

        console.log("[Token Refresh] Token rafraîchi avec succès:", {
            tokenType: response.token_type,
            expiresIn: response.expires_in,
            hasAccessToken: !!response.access_token,
            hasRefreshToken: !!response.refresh_token,
            hasIdToken: !!response.id_token,
        });

        return response;

    } catch (error: any) {
        console.error("[Token Refresh] Erreur lors du refresh du token:", {
            message: error.message,
            statusCode: error.statusCode || error.status,
            data: error.data,
        });

        return null;
    }
};

/**
 * Met à jour les tokens dans la base de données via l'adapter Better Auth
 * @param adapter L'adapter Better Auth
 * @param accountId L'ID du compte à mettre à jour
 * @param tokens Les nouveaux tokens
 */
export const updateAccountTokens = async (
    adapter: Adapter,
    accountId: string,
    tokens: RefreshTokenResponse
): Promise<boolean> => {
    try {
        const now = Date.now();

        await adapter.update({
            model: "account",
            where: [
                {
                    field: "id",
                    value: accountId,
                }
            ],
            update: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                accessTokenExpiresAt: new Date(now + tokens.expires_in * 1000),
                refreshTokenExpiresAt: new Date(now + tokens.refresh_expires_in * 1000),
                idToken: tokens.id_token || null,
            }
        });

        console.log("[Token Refresh] Tokens mis à jour dans la base de données:", {
            accountId,
            newAccessTokenExpiresAt: new Date(now + tokens.expires_in * 1000).toISOString(),
            newRefreshTokenExpiresAt: new Date(now + tokens.refresh_expires_in * 1000).toISOString(),
        });

        return true;

    } catch (error: any) {
        console.error("[Token Refresh] Erreur lors de la mise à jour des tokens:", {
            accountId,
            error: error.message,
        });

        return false;
    }
};

/**
 * Gère automatiquement le refresh du token si nécessaire
 * @param account Le compte contenant les tokens
 * @param adapter L'adapter Better Auth
 * @returns Les tokens rafraîchis ou les tokens originaux si pas besoin de refresh
 */
export const ensureValidToken = async (
    account: any,
    adapter: Adapter
): Promise<{ accessToken: string; idToken?: string, expiresAts?: string } | null> => {
    // Vérifier si le token est expiré
    const tokenExpired = isTokenExpired(account.accessTokenExpiresAt?.getTime());

    if (!tokenExpired) {
        console.log("[Token Refresh] Token encore valide, pas de refresh nécessaire:", {
            expiresAt: account.accessTokenExpiresAt?.toISOString(),
        });

        return {
            accessToken: account.accessToken,
            idToken: account.idToken,
            expiresAts: account.accessTokenExpiresAt?.toISOString(),
        };
    }

    console.log("[Token Refresh] Token expiré, tentative de refresh:", {
        accountId: account.id,
        expiresAt: account.accessTokenExpiresAt?.toISOString(),
    });

    // Vérifier si on a un refresh token
    if (!account.refreshToken) {
        console.error("[Token Refresh] Aucun refresh token disponible");
        return null;
    }

    // TODO: SI EVENTUELLEMENT LE REFRESH TOKEN EST INVALIDE
    // Vérifier si le refresh token est encore valide
    // const refreshTokenExpired = isTokenExpired(account.refreshTokenExpiresAt?.getTime(), 0);
    // if (refreshTokenExpired) {
    //     console.error("[Token Refresh] Refresh token expiré, reconnexion nécessaire");
    //     return null;
    // }

    // Rafraîchir le token
    const newTokens = await refreshAccessToken(account.refreshToken);

    if (!newTokens) {
        console.error("[Token Refresh] Impossible de rafraîchir le token");
        return null;
    }

    // Mettre à jour dans la base de données
    const updated = await updateAccountTokens(adapter, account.id, newTokens);

    if (!updated) {
        console.error("[Token Refresh] Impossible de mettre à jour les tokens dans la DB");
        return null;
    }

    return {
        accessToken: newTokens.access_token,
        idToken: newTokens.id_token,
        expiresAts: account.accessTokenExpiresAt?.toISOString(),
    };
};
