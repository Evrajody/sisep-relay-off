import { betterAuth } from "better-auth";
import { sso } from "@better-auth/sso";
import { customSession } from "better-auth/plugins";
// import Database from "better-sqlite3";

// Configuration Keycloak depuis les variables d'environnement
const keycloakUrl = process.env.KEYCLOAK_URL!;
const keycloakRealm = process.env.KEYCLOAK_REALM!;
const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID!;
const keycloakClientSecret = process.env.KEYCLOAK_CLIENT_SECRET!;

// Déterminer la baseURL en fonction de l'environnement
const getBaseURL = () => {
    // En production/Docker, utiliser l'URL publique si définie
    if (process.env.NUXT_PUBLIC_BETTER_AUTH_URL) {
        return process.env.NUXT_PUBLIC_BETTER_AUTH_URL;
    }

    // Fallback : construire l'URL depuis BETTER_AUTH_URL ou utiliser une URL par défaut
    const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

    console.log("[Better Auth] Base URL configurée:", baseUrl);

    return baseUrl;
};

export const auth = betterAuth({
    // Base URL pour l'authentification
    baseURL: getBaseURL(),

    // Configuration de la base de données SQLite
    // database: new Database("./auth.db"),

    // Mapping des champs de session
    session: {
        fields: {
            expiresAt: "expires",
            token: "sessionToken"
        }
    },

    // Mapping des champs de compte
    account: {
        fields: {
            accountId: "providerAccountId",
            refreshToken: "refresh_token",
            accessToken: "access_token",
            accessTokenExpiresAt: "access_token_expires",
            idToken: "id_token",
        }
    },

    plugins: [
        // Plugin SSO pour Keycloak
        sso({
            defaultSSO: [
                {
                    providerId: "keycloak",
                    domain: keycloakUrl,
                    oidcConfig: {
                        pkce: true,
                        clientSecret: keycloakClientSecret,
                        clientId: keycloakClientId,
                        issuer: `${keycloakUrl}/realms/${keycloakRealm}`,
                        authorizationEndpoint: `${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/auth`,
                        tokenEndpoint: `${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/token`,
                        jwksEndpoint: `${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/certs`,
                        userInfoEndpoint: `${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/userinfo`,
                        discoveryEndpoint: `${keycloakUrl}/realms/${keycloakRealm}/.well-known/openid-configuration`,
                        scopes: ["openid", "profile", "email"],
                        tokenEndpointAuthentication: "client_secret_basic",
                        overrideUserInfo: true,
                    }
                }
            ],
        }),

        // Plugin pour personnaliser la session avec les infos additionnelles
        customSession(async ({ user, session }, ctx) => {
            try {
                // Récupérer le compte de l'utilisateur pour obtenir l'access_token du provider (Keycloak)
                const accounts = await ctx.context.adapter.findMany({
                    model: "account",
                    where: [
                        {
                            field: "userId",
                            value: user.id,
                        },
                    ],
                });

                if (!accounts || accounts.length === 0) {
                    console.warn("[Custom Session] Aucun compte trouvé pour l'utilisateur:", user.id);
                    return { user, session };
                }

                // Récupérer le premier compte (normalement Keycloak)
                const account = accounts[0];
                const accessToken = account.accessToken;
                const providerId = account.providerId;

                if (!accessToken) {
                    console.warn("[Custom Session] Access token manquant pour l'utilisateur:", user.id);
                    return { user, session };
                }

                console.log("[Custom Session] Appel de l'API avec access token:", {
                    userId: user.id,
                    account: {
                        ...account,
                    },
                    providerId: providerId,
                    hasAccessToken: !!accessToken,
                });

                // Appeler l'API backend avec l'access_token du provider (Keycloak JWT)
                const realSession = await $fetch("auth/profile", {
                    method: "GET",
                    baseURL: process.env.NUXT_PUBLIC_SISEB_API_BASE_URL,
                    headers: {
                        authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });

                console.log("[Custom Session] Infos additionnelles récupérées:", {
                    userId: user.id,
                    email: user.email,
                    providerId: providerId,
                    idToken: account.idToken,
                    authorization: `Bearer ${accessToken}`,
                    hasData: !!realSession?.data,
                });

                // Retourner la session enrichie avec les infos additionnelles
                return {
                    user,
                    session: {
                        ...session,
                        auth_provider: providerId,
                        access_token: accessToken,
                        idToken: account.idToken,
                        additional_info: {
                            ...realSession?.data,
                        },
                    },
                };
            } catch (error: any) {
                // Gestion détaillée des erreurs
                console.error("[Custom Session] Erreur lors de la récupération des infos additionnelles:", {
                    userId: user.id,
                    email: user.email,
                    errorMessage: error.message,
                    errorStatus: error.statusCode || error.status,
                    errorData: error.data,
                    timestamp: new Date().toISOString(),
                });

                // En cas d'erreur, retourner la session de base sans les infos additionnelles
                // Cela permet à l'utilisateur de rester connecté même si l'API backend est indisponible
                return {
                    user,
                    session: {
                        ...session,
                        additional_info: null,
                    },
                };
            }
        }),
    ],
});