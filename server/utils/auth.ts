import { betterAuth } from "better-auth";
import { sso } from "@better-auth/sso";
import { customSession } from "better-auth/plugins";

const runtimeconfig = useRuntimeConfig()

/**
 * Récupère la configuration depuis les variables d'environnement
 * avec des valeurs par défaut et validation
 */
const getAuthConfig = () => {
    // Runtime config n'est pas disponible au niveau module dans utils
    // On utilise donc process.env avec validation et fallbacks
    const config = {
        baseURL: runtimeconfig.public.betterAuthUrl,

        keycloak: {
            url: runtimeconfig.public.keycloakUrl || "",
            realm: runtimeconfig.public.keycloakRealm || "siseb",
            clientId: runtimeconfig.public.keycloakClientId || "",
            clientSecret: "0b6iwJYqszGDvSMDMGu1okUMI4UrJhMF",
        },

        api: {
            baseUrl: runtimeconfig.public.sisebApiBaseUrl || "",
        }
    };

    // Validation des variables critiques
    if (!config.keycloak.url) {
        console.warn("[Better Auth] KEYCLOAK_URL non définie, l'authentification Keycloak ne fonctionnera pas");
    }
    if (!config.keycloak.clientId || !config.keycloak.clientSecret) {
        console.warn("[Better Auth] KEYCLOAK_CLIENT_ID ou KEYCLOAK_CLIENT_SECRET manquants");
    }

    console.log("[Better Auth] Configuration chargée:", {
        baseURL: config.baseURL,
        keycloakUrl: config.keycloak.url,
        keycloakRealm: config.keycloak.realm,
        apiBaseUrl: config.api.baseUrl,
    });

    return config;
};

// Charger la configuration
const authConfig = getAuthConfig();

export const auth = betterAuth({
    // Base URL pour l'authentification
    baseURL: authConfig.baseURL,

    // Configuration de la base de données SQLite
    // database: new Database("./auth.db"),

    // Mapping des champs de session
    session: {

        fields: {
            expiresAt: "expires",
            token: "sessionToken"
        },

        expiresIn: (60 * 60 * 24 * 2),

        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // Cache duration in seconds
        }
    },

    plugins: [
        // Plugin SSO pour Keycloak
        sso({
            defaultSSO: [
                {
                    providerId: "keycloak",
                    domain: authConfig.keycloak.url,
                    oidcConfig: {
                        pkce: true,
                        clientSecret: authConfig.keycloak.clientSecret,
                        clientId: authConfig.keycloak.clientId,
                        issuer: `${authConfig.keycloak.url}/realms/${authConfig.keycloak.realm}`,
                        authorizationEndpoint: `${authConfig.keycloak.url}/realms/${authConfig.keycloak.realm}/protocol/openid-connect/auth`,
                        tokenEndpoint: `${authConfig.keycloak.url}/realms/${authConfig.keycloak.realm}/protocol/openid-connect/token`,
                        jwksEndpoint: `${authConfig.keycloak.url}/realms/${authConfig.keycloak.realm}/protocol/openid-connect/certs`,
                        userInfoEndpoint: `${authConfig.keycloak.url}/realms/${authConfig.keycloak.realm}/protocol/openid-connect/userinfo`,
                        discoveryEndpoint: `${authConfig.keycloak.url}/realms/${authConfig.keycloak.realm}/.well-known/openid-configuration`,
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
                let account = accounts[0];
                const providerId = account.providerId;

                // ✅ NOUVEAU : Vérifier et rafraîchir le token si nécessaire
                const validTokens = await ensureValidToken(account, ctx.context.adapter);

                if (!validTokens) {
                    console.error("[Custom Session] Impossible d'obtenir un token valide, refresh token expiré ou invalide");
                    // Le refresh token est expiré, l'utilisateur doit se reconnecter
                    return { user, session, additional_info: null };
                }

                // Utiliser le token rafraîchi (ou le token original s'il était encore valide)
                const accessToken = validTokens.accessToken;
                const idToken = validTokens.idToken;
                const accessTokenExpiresAt = validTokens.expiresAts;

                if (!accessToken) {
                    console.warn("[Custom Session] Access token manquant pour l'utilisateur:", user.id);
                    return {
                        user,
                        session,
                        additional_info: null,
                    };
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
                    baseURL: authConfig.api.baseUrl,
                    headers: {
                        authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });

                console.log("[Custom Session] Infos additionnelles récupérées:", {
                    userId: user.id,
                    email: user.email,
                    providerId: providerId,
                    idToken: idToken,
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
                        idToken: idToken,
                        additional_info: {
                            accessTokenExpiresAt,
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
        }, {  }, {
            // shouldMutateListDeviceSessionsEndpoint: true,
        }),
    ],
});