import KeycloakProvider from "next-auth/providers/keycloak";
import {NuxtAuthHandler} from "#auth";

export default NuxtAuthHandler({

    debug: true,

    logger: {
        error(code, metadata) {
            console.log(code, metadata)
        },
        warn(code) {
            console.log(code)
        },
        debug(code, metadata) {
            console.log(code, metadata)
        }
    },

    theme: {
        colorScheme: "light", // "auto" | "dark" | "light"
        brandColor: "", // Hex color code
        logo: "", // Absolute URL to image
        buttonText: "Contituer" // Hex color code
    },

    secret: process.env.AUTH_SECRET || "f56a81d8-4110-4342-aa81-d84110b34246",

    jwt: {
        maxAge: 60 * 60 * 24 * 30
    },

    pages: {},

    providers: [
        // @ts-expect-error
        KeycloakProvider.default({
            idToken: true,
            scheme: "oauth2",
            name: "keycloak",
            issuer: process.env.KEYCLOAK_ISSUER,
            clientId: process.env.KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
            token: {
                property: "access_token",
                type: "Bearer",
                name: "Authorization",
                maxAge: 60 * 60 * 24,
            },
            refreshToken: {
                property: "refresh_token",
                maxAge: 60 * 60 * 24 * 30,
            },
            responseType: "code",
            grantType: "authorization_code",
            scope: ["openid", "profile", "email"],
            codeChallengeMethod: "S256",
            endpoints: {
                authorization: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/auth`,
                userInfo: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
                token: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
                logout: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(String(process.env.NUXT_AUTH_ORIGIN))}`,
            },
        }),
    ],

    cookies: {
        sessionToken: {
            name: `siseb.auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        },
        callbackUrl: {
            name: `siseb.auth.callback-url`,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        },
        csrfToken: {
            name: `sieb.auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        },
        pkceCodeVerifier: {
            name: `siseb.auth.pkce.code_verifier`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true,
                maxAge: 900
            }
        },
        state: {
            name: `siseb.auth.state`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: true,
                maxAge: 900
            },
        },
        nonce: {
            name: `siseb.auth.nonce`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: true,
            },
        },
    },

    events: {
        async signOut({token}) {
            console.log('SignOut event - token:', token)
            // Logout de Keycloak également
            if (token?.idToken) {
                try {
                    const issuerUrl = process.env.KEYCLOAK_ISSUER
                    const logoutUrl = `${issuerUrl}/protocol/openid-connect/logout`

                    const response = await fetch(logoutUrl, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        body: new URLSearchParams({
                            id_token_hint: token.idToken as string,
                            client_id: process.env.KEYCLOAK_CLIENT_ID || '',
                            post_logout_redirect_uri: process.env.AUTH_ORIGIN || '',
                        }),
                    })

                    console.log('Keycloak logout response:', response.status)
                } catch (err) {
                    console.error('Erreur logout Keycloak:', err)
                }
            } else {
                console.warn('Pas d\'id_token disponible pour la déconnexion Keycloak')
            }
        }
    },

    callbacks: {

        async redirect({url, baseUrl}) {
            // // Allows relative callback URLs
            // if (url.startsWith("/")) return `${baseUrl}${url}`
            // // Allows callback URLs on the same origin
            // else if (new URL(url).origin === baseUrl) return url
            // return baseUrl
            return `${baseUrl}/admin/project-module/dashboard`;
        },

        async jwt({token, account}) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
                token.idToken = account.id_token;
            } else if (Date.now() < (<number>token.expiresAt) * 1000) {
                return token;
            }

            // try refresh token
            const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: new URLSearchParams({
                    client_id: process.env.KEYCLOAK_CLIENT_ID ?? "",
                    client_secret: process.env.KEYCLOAK_CLIENT_SECRET ?? "",
                    grant_type: "refresh_token",
                    refresh_token: <string>token.refreshToken ?? "",
                }),
                method: "POST",
            })

            const newToken = await response.json();

            if (!response.ok) {
                /** @todo handle refresh token failed */
                return token
            }

            return {
                ...token,
                accessToken: newToken.access_token,
                expiresAt: Math.floor(Date.now() / 1000 + newToken.expires_in),
                refreshToken: newToken.refresh_token ?? token.refresh_token,
                idToken: token.idToken,
            }
        },
        async session({session, token, user}) {

            try {

                if (token && token?.auth_provider == "local") {

                    const realSession = await $fetch("api/auth/session/local", {
                        method: "GET",
                        key: "siseb-users-local",
                        baseURL: useRuntimeConfig().public.sisebApiBaseUrl,
                        headers: {
                            authorization: `Bearer ${token.accessToken}`,
                            "Content-Type": "application/json",
                            auth_provider: "local",
                        },
                    });

                    console.log("[AUTH SESSION - LOCAL] Session récupérée avec succès", {
                        timestamp: new Date().toISOString(),
                        email: session.user?.email,
                    });

                    return {
                        ...session,
                        auth_provider: "local",
                        additional_info: {
                            ...realSession?.data,
                            jwt: realSession?.data.jwt.token,
                        },
                    };
                }

                const realSession = await $fetch("auth/profile", {
                    method: "GET",
                    key: "siseb-users-keycloak",
                    baseURL: useRuntimeConfig().public.sisebApiBaseUrl,
                    headers: {
                        authorization: `Bearer ${token.accessToken}`,
                    },
                });

                console.log("[AUTH SESSION - KEYCLOAK] Session récupérée avec succès", {
                    timestamp: new Date().toISOString(),
                    email: session.user?.email,
                });

                return {
                    ...session,
                    ...token,
                    auth_provider: "keycloak",
                    additional_info: {
                        ...realSession?.data,
                    },
                };
            } catch (error: any) {
                console.error("[AUTH ERROR - SESSION] Échec de récupération de la session", {
                    timestamp: new Date().toISOString(),
                    auth_provider: token?.auth_provider || "unknown",
                    email: session.user?.email,
                    error: error.message,
                    statusCode: error.statusCode,
                    stack: error.stack,
                });
                throw error;
            }

        },
    },

});