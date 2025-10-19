# Guide Complet : Authentification Keycloak avec Better Auth

**Version** : 1.0
**Date** : 2025-01-19
**Auteur** : Claude Code & SISEB Team

---

## 📋 Table des Matières

1. [Introduction](#introduction)
2. [Prérequis](#prérequis)
3. [Architecture du Système](#architecture-du-système)
4. [Configuration Keycloak](#configuration-keycloak)
5. [Installation et Configuration Better Auth](#installation-et-configuration-better-auth)
6. [Enrichissement de la Session](#enrichissement-de-la-session)
7. [Implémentation de la Déconnexion](#implémentation-de-la-déconnexion)
8. [Utilisation dans l'Application](#utilisation-dans-lapplication)
9. [Tests et Vérification](#tests-et-vérification)
10. [Dépannage](#dépannage)
11. [Sécurité et Bonnes Pratiques](#sécurité-et-bonnes-pratiques)

---

## Introduction

Ce guide explique comment mettre en place un système d'authentification complet avec :
- **Keycloak** comme serveur d'authentification SSO (Single Sign-On)
- **Better Auth** pour gérer les sessions dans votre application Nuxt 3
- **Session enrichie** avec les informations utilisateur de votre API backend
- **Déconnexion complète** (Better Auth + Keycloak SSO)

### Flux d'authentification

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│ Utilisateur │─────▶│   Keycloak   │─────▶│ Better Auth │─────▶│ API Backend  │
│             │◀─────│     SSO      │◀─────│   Session   │◀─────│    SISEB     │
└─────────────┘      └──────────────┘      └─────────────┘      └──────────────┘
                                                    │
                                                    ▼
                                           Session Enrichie
                                           - access_token
                                           - idToken
                                           - additional_info
```

---

## Prérequis

### Logiciels Requis

- **Node.js** : v18+ ou v20+
- **Nuxt 3** : Version 3.x
- **Better Auth** : Version latest
- **Keycloak** : Version 21+ (ou Keycloak installé et configuré)

### Connaissances Requises

- OAuth 2.0 / OIDC (OpenID Connect)
- Nuxt 3 et Vue 3
- TypeScript (basique)
- Concepts de session et JWT

---

## Architecture du Système

### Composants

```
┌─────────────────────────────────────────────────────────────────┐
│                      Application Nuxt 3                         │
│                                                                 │
│  ┌────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Composants    │  │   Composables   │  │    Plugins      │ │
│  │    Vue         │  │ useAuthLogout() │  │ auth-better-    │ │
│  │                │  │                 │  │ client.ts       │ │
│  └────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Server API Routes                           │  │
│  │  - /local/auth/[...].ts    (Better Auth handler)        │  │
│  │  - /api/logout-keycloak.post.ts  (Logout custom)        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Server Utils                                │  │
│  │  - auth.ts  (Better Auth config + customSession)        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ▲           │
                            │           ▼
                    ┌───────────────────────┐
                    │      Keycloak SSO     │
                    │  - Authentification   │
                    │  - Génération tokens  │
                    │  - Gestion sessions   │
                    └───────────────────────┘
                            ▲           │
                            │           ▼
                    ┌───────────────────────┐
                    │    API Backend SISEB  │
                    │  - Profile utilisateur│
                    │  - Permissions/Roles  │
                    │  - Données métier     │
                    └───────────────────────┘
```

---

## Configuration Keycloak

### Étape 1 : Créer un Realm

1. Connectez-vous à **Keycloak Admin Console**
2. Cliquez sur **Create Realm**
3. Nom : `siseb` (ou autre nom de votre choix)
4. Activez le realm

### Étape 2 : Créer un Client

1. Dans votre realm, allez dans **Clients** → **Create Client**
2. Configurez le client :

```yaml
General Settings:
  Client type: OpenID Connect
  Client ID: siseb-nuxt-app
  Name: SISEB Nuxt Application
  Description: Application web SISEB avec authentification Keycloak

Capability config:
  Client authentication: ON (pour confidential client)
  Authorization: OFF
  Authentication flow:
    ✅ Standard flow
    ✅ Direct access grants
    ❌ Implicit flow (deprecated)
    ❌ Service accounts roles

Login settings:
  Root URL: http://localhost:3000
  Home URL: http://localhost:3000
  Valid redirect URIs:
    - http://localhost:3000/*
    - http://localhost:3000/local/auth/callback/keycloak
  Valid post logout redirect URIs:
    - http://localhost:3000/*
    - http://localhost:3000/admin/login
  Web origins:
    - http://localhost:3000
```

3. Sauvegardez

### Étape 3 : Récupérer les Credentials

1. Allez dans l'onglet **Credentials**
2. Copiez le **Client Secret**
3. Notez-le dans un endroit sûr (vous en aurez besoin dans le `.env`)

### Étape 4 : Configurer les Scopes

1. Allez dans **Client scopes**
2. Vérifiez que les scopes suivants sont assignés :
   - `openid` (requis pour OIDC)
   - `profile`
   - `email`

### Étape 5 : Créer un Utilisateur de Test

1. Allez dans **Users** → **Add user**
2. Configurez :
   ```
   Username: admin@emes.bj
   Email: admin@emes.bj
   First name: Admin
   Last name: EMES
   Email verified: ON
   ```
3. Sauvegardez
4. Allez dans **Credentials** → **Set password**
5. Définissez un mot de passe (désactivez "Temporary")

---

## Installation et Configuration Better Auth

### Étape 1 : Installer les Dépendances

```bash
# Better Auth core
pnpm add better-auth

# Plugin SSO pour Keycloak
pnpm add @better-auth/sso

# Database adapter (si vous utilisez SQLite)
pnpm add better-sqlite3
```

### Étape 2 : Variables d'Environnement

Créez ou modifiez votre fichier `.env` :

```env
# Keycloak Configuration
KEYCLOAK_URL=https://keycloak.example.com
KEYCLOAK_REALM=siseb
KEYCLOAK_CLIENT_ID=siseb-nuxt-app
KEYCLOAK_CLIENT_SECRET=votre-client-secret-ici

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
NUXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# API Backend
NUXT_PUBLIC_SISEB_API_BASE_URL=https://siseb-api.example.com/api
```

### Étape 3 : Configuration Better Auth Server

Créez `server/utils/auth.ts` :

```typescript
import { betterAuth } from "better-auth";
import { sso } from "@better-auth/sso";
import { customSession } from "better-auth/plugins";
import Database from "better-sqlite3";

// Configuration Keycloak depuis les variables d'environnement
const keycloakUrl = process.env.KEYCLOAK_URL!;
const keycloakRealm = process.env.KEYCLOAK_REALM!;
const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID!;
const keycloakClientSecret = process.env.KEYCLOAK_CLIENT_SECRET!;

export const auth = betterAuth({
    // Base URL pour l'authentification
    baseURL: `${process.env.BETTER_AUTH_URL}/local/auth`,

    // Configuration de la base de données SQLite
    database: new Database("./auth.db"),

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
                // Récupérer le compte de l'utilisateur pour obtenir l'access_token du provider
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

                // Récupérer le premier compte
                const account = accounts[0];
                const accessToken = account.accessToken;
                const providerId = account.providerId;

                if (!accessToken) {
                    console.warn("[Custom Session] Access token manquant pour l'utilisateur:", user.id);
                    return { user, session };
                }

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
```

### Étape 4 : Route Handler Better Auth

Créez `server/routes/local/auth/[...].ts` :

```typescript
import { auth } from "~/server/utils/auth";

export default defineEventHandler((event) => {
    return auth.handler(toWebRequest(event));
});
```

### Étape 5 : Configuration Client Better Auth

Créez `plugins/auth-better-client.ts` :

```typescript
import { createAuthClient } from "better-auth/client"
import { ssoClient } from "@better-auth/sso/client"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "~/server/utils/auth"

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const authClient = createAuthClient({
        baseURL: `${config.public.betterAuthUrl}/local/auth`,
        plugins: [
            ssoClient(),
            inferAdditionalFields<typeof auth>()
        ]
    })

    return {
        provide: {
            authClient
        }
    }
})
```

---

## Enrichissement de la Session

### Pourquoi Enrichir la Session ?

L'enrichissement de la session permet de :
1. Centraliser toutes les données utilisateur dans un seul endroit
2. Éviter des appels répétés à la base de données
3. Avoir accès aux tokens (access_token, idToken) partout dans l'application
4. Simplifier le code de déconnexion

### Comment ça Fonctionne ?

Le plugin `customSession` intercepte chaque appel `getSession()` et :

1. Récupère les comptes de l'utilisateur depuis la base de données
2. Extrait l'`access_token` et l'`idToken` de Keycloak
3. Appelle votre API backend avec l'access_token
4. Enrichit la session avec toutes ces informations

```typescript
// Session de base (Better Auth)
{
  user: { id, email, name },
  session: { sessionToken, expiresAt }
}

// Session enrichie (après customSession)
{
  user: { id, email, name },
  session: {
    sessionToken,
    expiresAt,
    auth_provider: "keycloak",        // Provider utilisé
    access_token: "eyJhbGc...",       // JWT Keycloak pour API backend
    idToken: "eyJhbGc...",            // ID token pour logout
    additional_info: {                 // Données de votre API
      tokenDetails: { ... },
      userRoles: [ ... ],
      permissions: [ ... ]
    }
  }
}
```

### Accéder à la Session Enrichie

#### Côté Client

```typescript
// Dans un composant Vue
const { $authClient } = useNuxtApp();

const { data: session } = await $authClient.getSession();

console.log("Provider:", session?.session?.auth_provider);
console.log("Access Token:", session?.session?.access_token);
console.log("User Roles:", session?.session?.additional_info?.userRoles);
```

#### Côté Serveur

```typescript
// Dans un endpoint API
import { auth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    console.log("Provider:", session?.session?.auth_provider);
    console.log("Access Token:", session?.session?.access_token);
});
```

---

## Implémentation de la Déconnexion

### Étape 1 : Endpoint de Déconnexion

Créez `server/api/logout-keycloak.post.ts` :

```typescript
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

        // 4. Construire l'URL de déconnexion Keycloak
        const keycloakUrl = process.env.KEYCLOAK_URL;
        const keycloakRealm = process.env.KEYCLOAK_REALM;
        const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID;
        const appUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

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
        if (idToken) {
            logoutUrl.searchParams.set("id_token_hint", idToken);
            console.log("[Logout] Utilisation de id_token_hint");
        } else if (keycloakClientId) {
            logoutUrl.searchParams.set("client_id", keycloakClientId);
            console.log("[Logout] Utilisation de client_id comme fallback");
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
```

### Étape 2 : Composable de Déconnexion

Créez `composables/useAuthLogout.ts` :

```typescript
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
                console.error("[Logout] Failed to sign out:", e);
            }
            // Rediriger vers la page de login
            await navigateTo("/admin/login");
        }
    };

    /**
     * Déconnexion simple (Better Auth seulement)
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
        logout,        // Déconnexion complète
        simpleLogout,  // Déconnexion simple
    };
};
```

---

## Utilisation dans l'Application

### Page de Connexion

Créez `pages/admin/login.vue` :

```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
      <h1 class="text-2xl font-bold text-center mb-6">
        Connexion SISEB
      </h1>

      <button
        @click="handleKeycloakLogin"
        class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Se connecter avec Keycloak
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $authClient } = useNuxtApp();

const handleKeycloakLogin = async () => {
  try {
    // Rediriger vers Keycloak pour l'authentification
    await $authClient.signIn.social({
      provider: "keycloak",
      callbackURL: "/admin/project-module/dashboard",
    });
  } catch (error) {
    console.error("Login error:", error);
  }
};
</script>
```

### Page Protégée (Dashboard)

Créez `pages/admin/project-module/dashboard/index.vue` :

```vue
<template>
  <div>
    <nav class="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Dashboard SISEB</h1>

      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">{{ userEmail }}</span>
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Déconnexion
        </button>
      </div>
    </nav>

    <main class="p-8">
      <h2 class="text-2xl font-bold mb-4">Bienvenue !</h2>

      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Informations de session</h3>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{ sessionInfo }}</pre>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Protéger la page
definePageMeta({
  middleware: 'auth' // Vous devrez créer ce middleware
});

const { $authClient } = useNuxtApp();
const { logout } = useAuthLogout();

// État
const userEmail = ref("");
const sessionInfo = ref({});

// Récupérer la session au chargement
onMounted(async () => {
  const { data: session } = await $authClient.getSession();

  if (session) {
    userEmail.value = session.user.email;
    sessionInfo.value = {
      user: session.user,
      provider: session.session?.auth_provider,
      hasAccessToken: !!session.session?.access_token,
      hasIdToken: !!session.session?.idToken,
      additionalInfo: session.session?.additional_info,
    };
  }
});

// Déconnexion
const handleLogout = async () => {
  if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
    await logout();
  }
};
</script>
```

### Middleware d'Authentification

Créez `middleware/auth.ts` :

```typescript
export default defineNuxtRouteMiddleware(async (to, from) => {
    const { $authClient } = useNuxtApp();

    // Vérifier la session
    const { data: session } = await $authClient.getSession();

    if (!session) {
        // Pas de session, rediriger vers login
        return navigateTo("/admin/login");
    }
});
```

---

## Tests et Vérification

### Test 1 : Connexion via Keycloak

1. Démarrez votre application : `npm run dev`
2. Allez sur `http://localhost:3000/admin/login`
3. Cliquez sur "Se connecter avec Keycloak"
4. Vous devriez être redirigé vers Keycloak
5. Entrez vos identifiants
6. Vous devriez être redirigé vers `/admin/project-module/dashboard`

**Vérification des logs** :

```
[Custom Session] Appel de l'API avec access token: { ... }
[Custom Session] Infos additionnelles récupérées: { hasData: true }
```

### Test 2 : Session Enrichie

Dans la console du navigateur :

```javascript
const { data: session } = await $authClient.getSession();
console.log("Session enrichie:", session);
```

Vous devriez voir :

```javascript
{
  user: { id: "...", email: "...", name: "..." },
  session: {
    sessionToken: "...",
    expiresAt: "...",
    auth_provider: "keycloak",
    access_token: "eyJhbGc...",
    idToken: "eyJhbGc...",
    additional_info: { ... }
  }
}
```

### Test 3 : Appel API Backend

Vérifiez que l'API backend reçoit bien le Bearer token :

```typescript
// Dans un composant
const { $authClient } = useNuxtApp();

const { data: session } = await $authClient.getSession();
const accessToken = session?.session?.access_token;

const response = await $fetch("https://api.example.com/data", {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
});
```

### Test 4 : Déconnexion

1. Cliquez sur "Déconnexion" dans le dashboard
2. Vérifiez les logs serveur :

```
[Logout] Session info: { userId: "...", hasIdToken: true, auth_provider: "keycloak" }
[Logout] Utilisation de id_token_hint
[Logout] User logged out successfully
```

3. Vous devriez être redirigé vers Keycloak
4. Keycloak termine la session SSO
5. Vous êtes redirigé vers `/admin/login`
6. Vérifiez que vous êtes bien déconnecté (essayez d'accéder à `/admin/project-module/dashboard`)

---

## Dépannage

### Problème : Erreur "redirect_uri mismatch"

**Cause** : L'URL de callback n'est pas dans les Valid Redirect URIs de Keycloak

**Solution** :
1. Allez dans Keycloak → Clients → Votre client
2. Ajoutez dans Valid Redirect URIs :
   ```
   http://localhost:3000/*
   http://localhost:3000/local/auth/callback/keycloak
   ```

### Problème : Session non enrichie (pas d'additional_info)

**Cause** : L'API backend n'est pas accessible ou retourne une erreur

**Solution** :
1. Vérifiez les logs serveur :
   ```
   [Custom Session] Erreur lors de la récupération des infos additionnelles
   ```
2. Vérifiez que `NUXT_PUBLIC_SISEB_API_BASE_URL` est correct
3. Vérifiez que votre API backend accepte le Bearer token Keycloak
4. Testez l'API manuellement avec curl :
   ```bash
   curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
        https://api.example.com/auth/profile
   ```

### Problème : "Missing parameters: id_token_hint" lors du logout

**Cause** : L'id_token n'est pas disponible dans la session

**Solution** : Le code utilise automatiquement le fallback avec `client_id`. Vérifiez que `KEYCLOAK_CLIENT_ID` est bien défini dans `.env`.

### Problème : Boucle de redirection infinie

**Cause** : Le middleware `auth` redirige même quand l'utilisateur est sur `/admin/login`

**Solution** : Modifiez le middleware :

```typescript
export default defineNuxtRouteMiddleware(async (to, from) => {
    // Ne pas vérifier l'auth sur la page de login
    if (to.path === "/admin/login") {
        return;
    }

    const { $authClient } = useNuxtApp();
    const { data: session } = await $authClient.getSession();

    if (!session) {
        return navigateTo("/admin/login");
    }
});
```

### Problème : Access token expiré

**Cause** : Le JWT Keycloak a une durée de vie limitée (5-15 min généralement)

**Solution** : Better Auth peut rafraîchir automatiquement le token avec le refresh_token. Vérifiez la configuration Keycloak pour augmenter la durée de vie des tokens si nécessaire.

---

## Sécurité et Bonnes Pratiques

### 1. Gestion des Secrets

- ✅ **Ne jamais commiter** les fichiers `.env`
- ✅ Ajouter `.env` dans `.gitignore`
- ✅ Utiliser des variables d'environnement différentes pour dev/prod
- ✅ Stocker les secrets dans un gestionnaire de secrets (Vault, AWS Secrets Manager, etc.)

### 2. HTTPS en Production

- ✅ **Toujours utiliser HTTPS** en production
- ✅ Configurer les URLs Keycloak avec `https://`
- ✅ Mettre à jour les Valid Redirect URIs avec les URLs de production

### 3. Validation des Tokens

- ✅ Better Auth valide automatiquement les tokens OIDC
- ✅ Votre API backend devrait aussi valider le JWT Keycloak
- ✅ Vérifier la signature du JWT
- ✅ Vérifier l'expiration (`exp` claim)
- ✅ Vérifier l'issuer (`iss` claim)

### 4. Protection CSRF

- ✅ Better Auth inclut une protection CSRF par défaut
- ✅ Utiliser les cookies SameSite

### 5. Gestion des Sessions

- ✅ Définir une durée de vie raisonnable pour les sessions
- ✅ Implémenter un système de rafraîchissement automatique
- ✅ Déconnecter l'utilisateur après inactivité

### 6. Logging et Monitoring

- ✅ Logger les connexions/déconnexions
- ✅ Logger les erreurs d'authentification
- ✅ Monitorer les tentatives de connexion échouées
- ✅ Ne **jamais** logger les tokens ou secrets

### 7. Configuration Keycloak

- ✅ Utiliser des Client Secrets forts
- ✅ Activer "Client authentication" pour les clients confidentiels
- ✅ Configurer des "Valid Redirect URIs" strictes
- ✅ Activer PKCE (Proof Key for Code Exchange)
- ✅ Utiliser des scopes minimum nécessaires

---

## Conclusion

Vous avez maintenant un système d'authentification complet avec :

✅ **Keycloak SSO** pour l'authentification centralisée
✅ **Better Auth** pour la gestion des sessions
✅ **Session enrichie** avec les tokens et infos utilisateur
✅ **Déconnexion complète** (Better Auth + Keycloak)
✅ **API Backend** appelée avec Bearer token JWT
✅ **Gestion d'erreurs** robuste
✅ **Logs détaillés** pour le debug

### Prochaines Étapes

1. ✅ Tester en développement
2. ✅ Configurer l'environnement de production
3. ✅ Mettre en place les tests automatisés
4. ✅ Configurer le monitoring et les alertes
5. ✅ Former l'équipe sur le système d'authentification

### Ressources Supplémentaires

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [OAuth 2.0 / OIDC Specification](https://openid.net/connect/)
- [Nuxt 3 Documentation](https://nuxt.com/docs)

---

**Félicitations !** Vous avez mis en place un système d'authentification moderne, sécurisé et évolutif ! 🎉

**Support** : Si vous rencontrez des problèmes, consultez la section [Dépannage](#dépannage) ou vérifiez les logs du serveur.

---

**Auteur** : Claude Code & SISEB Team
**Date** : 2025-01-19
**Version** : 1.0
