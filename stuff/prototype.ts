import CredentialsProvider from "next-auth/providers/credentials";
import KeycloakProvider from "next-auth/providers/keycloak";
import { NuxtAuthHandler } from "#auth";

export default NuxtAuthHandler({

    debug: true,

    secret: process.env.AUTH_SECRET || "f56a81d8-4110-4342-aa81-d84110b34246",

    jwt: {
        maxAge: 60 * 60 * 24 * 30
    },

    pages: {

    },

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

    callbacks: {

        async signIn(payload) {
            return true;
        },

        async redirect({ url, baseUrl }) {
            return `${baseUrl}/admin/project-module/dashboard`;
        },

        async jwt({ token, account, user, trigger, session }) {

            if (user && user?.auth_provider == "local" && trigger === "signIn") {
                token.name = `${user.userToSend.user.nom} ${user.userToSend.user.prenoms}`;
                token.email = user.userToSend.user.email;
                token.access_token = user.token;
                token.refresh_token = user.userToSend.refreshToken;
                token.auth_provider = user.auth_provider;
                return Promise.resolve(token);
            }

            if (
                token &&
                user &&
                account &&
                account.access_token &&
                trigger === "signIn"
            ) {
                token.access_token = account.access_token;
                token.refresh_token = account.refresh_token;
                return Promise.resolve(token);
            }

            if (token && trigger === undefined) {
                return Promise.resolve(token);
            }

            return Promise.resolve(token);
        },

        async session({ session, user, token }) {

            console.log("FROM SERVER", token);

            try {

                if (token && token?.auth_provider == "local") {

                    const realSession = await $fetch("api/auth/session/local", {
                        method: "GET",
                        key: "siseb-users-local",
                        baseURL: useRuntimeConfig().public.sisebApiBaseUrl,
                        headers: {
                            authorization: `Bearer ${token.access_token}`,
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
                        authorization: `Bearer ${token.access_token}`,
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

    }

});