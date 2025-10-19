# Guide du Middleware d'Authentification Better Auth

**Date**: 2025-01-19
**Environnement**: Nuxt 3 + Better Auth

---

## 📋 Vue d'ensemble

Le middleware `auth.ts` vérifie automatiquement si un utilisateur est authentifié avant d'accéder à une page protégée. Si l'utilisateur n'est pas connecté, il sera redirigé vers la page d'accueil (`/`).

---

## 🎯 Fonctionnement

Le middleware :
1. Appelle l'endpoint Better Auth `/local/auth/get-session`
2. Vérifie si une session valide existe
3. **Si session valide** : Permet l'accès à la page
4. **Si pas de session** : Redirige vers `/`

---

## 🚀 Utilisation dans les Pages

### 1. Protection d'une Seule Page

Pour protéger une page spécifique, ajoutez le middleware dans `definePageMeta()` :

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth' // ✅ Active la protection de la page
});
</script>

<template>
  <div>
    <!-- Cette page est protégée -->
    <h1>Page protégée</h1>
  </div>
</template>
```

### 2. Exemple Concret : Page de Profil

```vue
<script setup lang="ts">
// pages/admin/profil.vue

definePageMeta({
  layout: "sisep-app-layout",
  middleware: 'auth' // ✅ Utilisateur doit être connecté
});

useHead({
  title: "Mon profil",
});

// Le code ici ne s'exécutera que si l'utilisateur est connecté
const user = ref({ /* ... */ });
</script>

<template>
  <div>
    <h1>Mon Profil</h1>
    <!-- Contenu du profil -->
  </div>
</template>
```

### 3. Exemple : Page Dashboard

```vue
<script setup lang="ts">
// pages/admin/project-module/dashboard/index.vue

definePageMeta({
  layout: "sisep-app-layout",
  middleware: 'auth' // ✅ Protège le dashboard
});

useHead({
  title: "Tableau de bord - Projets",
});

// Récupérer la session (sera toujours disponible grâce au middleware)
const { $authClient } = useNuxtApp();
const { data: session } = await $authClient.getSession();

console.log("Utilisateur connecté:", session.user.email);
</script>

<template>
  <div>
    <h1>Tableau de bord</h1>
    <p>Bienvenue {{ session?.user?.email }}</p>
  </div>
</template>
```

### 4. Combiner Plusieurs Middlewares

Vous pouvez combiner le middleware `auth` avec d'autres middlewares :

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'project-permissions'] // ✅ Vérifie auth ET permissions
});
</script>
```

**Ordre d'exécution** : Les middlewares s'exécutent dans l'ordre du tableau
1. D'abord `auth` : vérifie si connecté
2. Ensuite `project-permissions` : vérifie les permissions

---

## 🔧 Configuration du Middleware

### Fichier : `middleware/auth.ts`

```typescript
/**
 * Middleware d'authentification Better Auth
 * Redirige vers / si l'utilisateur n'est pas connecté
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
    const config = useRuntimeConfig();

    try {
        // Appeler l'endpoint de session Better Auth
        const session = await $fetch('/local/auth/get-session', {
            baseURL: config.public.betterAuthUrl,
            credentials: 'include', // Important : inclure les cookies
            headers: useRequestHeaders(['cookie']) as Record<string, string>,
        });

        // Vérifier si la session existe
        if (!session || !session.user) {
            console.warn('[Auth Middleware] Aucune session trouvée, redirection vers /');
            return navigateTo('/');
        }

        // Session valide
        console.log('[Auth Middleware] Session valide pour:', session.user.email);

    } catch (error: any) {
        // Erreur = pas authentifié
        console.error('[Auth Middleware] Erreur:', error.message);
        return navigateTo('/');
    }
});
```

---

## 🎨 Personnalisation

### 1. Changer la Route de Redirection

Par défaut, le middleware redirige vers `/`. Pour changer :

```typescript
// middleware/auth.ts

// Avant ❌
return navigateTo('/');

// Après ✅ (rediriger vers /admin/login)
return navigateTo('/admin/login');
```

### 2. Redirection Dynamique (Retour après Login)

Pour rediriger l'utilisateur vers la page qu'il voulait visiter après connexion :

```typescript
// middleware/auth.ts

export default defineNuxtRouteMiddleware(async (to, from) => {
    const config = useRuntimeConfig();

    try {
        const session = await $fetch('/local/auth/get-session', {
            baseURL: config.public.betterAuthUrl,
            credentials: 'include',
            headers: useRequestHeaders(['cookie']) as Record<string, string>,
        });

        if (!session || !session.user) {
            // ✅ Sauvegarder la route demandée dans la query
            return navigateTo({
                path: '/admin/login',
                query: { redirect: to.fullPath }
            });
        }

    } catch (error) {
        return navigateTo({
            path: '/admin/login',
            query: { redirect: to.fullPath }
        });
    }
});
```

Ensuite, sur la page de login :

```vue
<script setup lang="ts">
// pages/admin/login.vue

const route = useRoute();
const redirectPath = route.query.redirect as string || '/admin/dashboard';

const handleLoginSuccess = () => {
    navigateTo(redirectPath); // ✅ Retour à la page demandée
};
</script>
```

### 3. Middleware Global (Toutes les Pages)

Pour protéger **toutes** les pages sauf quelques exceptions :

```typescript
// middleware/auth.global.ts (note le .global)

export default defineNuxtRouteMiddleware(async (to, from) => {
    // Liste des routes publiques (pas de protection)
    const publicRoutes = ['/', '/admin/login', '/about', '/contact'];

    if (publicRoutes.includes(to.path)) {
        return; // ✅ Route publique, pas de vérification
    }

    // Vérifier la session pour toutes les autres routes
    const config = useRuntimeConfig();

    try {
        const session = await $fetch('/local/auth/get-session', {
            baseURL: config.public.betterAuthUrl,
            credentials: 'include',
            headers: useRequestHeaders(['cookie']) as Record<string, string>,
        });

        if (!session || !session.user) {
            return navigateTo('/admin/login');
        }

    } catch (error) {
        return navigateTo('/admin/login');
    }
});
```

---

## 📊 Logs et Debugging

Le middleware log automatiquement les événements :

```bash
# ✅ Session valide
[Auth Middleware] Session valide pour: user@example.com

# ❌ Pas de session
[Auth Middleware] Aucune session trouvée, redirection vers /

# ❌ Erreur
[Auth Middleware] Erreur lors de la vérification de la session: {
  message: "Unauthorized",
  statusCode: 401
}
```

### Activer le Mode Verbose

Pour plus de détails, modifiez le middleware :

```typescript
console.log('[Auth Middleware] Vérification de la session pour:', to.path);
console.log('[Auth Middleware] Headers:', useRequestHeaders(['cookie']));
console.log('[Auth Middleware] Base URL:', config.public.betterAuthUrl);
```

---

## 🔍 Tests

### Test 1 : Accès à une Page Protégée Sans Connexion

1. Ouvrez votre navigateur en mode navigation privée
2. Accédez à `http://localhost:3000/admin/profil`
3. **Résultat attendu** : Redirection vers `/`

### Test 2 : Accès à une Page Protégée Avec Connexion

1. Connectez-vous via `/admin/login`
2. Accédez à `http://localhost:3000/admin/profil`
3. **Résultat attendu** : Affichage de la page de profil

### Test 3 : Session Expirée

1. Connectez-vous
2. Supprimez les cookies dans les DevTools
3. Rafraîchissez la page
4. **Résultat attendu** : Redirection vers `/`

---

## 🚨 Erreurs Courantes

### Erreur 1 : "Cannot read properties of undefined (reading 'public')"

**Cause** : Runtime config non disponible

**Solution** :
```typescript
// Vérifier que nuxt.config.ts contient :
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      betterAuthUrl: process.env.NUXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"
    }
  }
})
```

### Erreur 2 : "CORS Error" ou "Credentials not included"

**Cause** : Les cookies ne sont pas envoyés avec la requête

**Solution** :
```typescript
const session = await $fetch('/local/auth/get-session', {
  credentials: 'include', // ✅ Indispensable !
  headers: useRequestHeaders(['cookie']) as Record<string, string>,
});
```

### Erreur 3 : Boucle de Redirection Infinie

**Cause** : La page de redirection (`/`) est elle-même protégée

**Solution** : Ne pas protéger la page d'accueil ou la page de login
```typescript
// ❌ Mauvais
// pages/index.vue
definePageMeta({ middleware: 'auth' });

// ✅ Bon
// pages/index.vue
definePageMeta({ middleware: undefined }); // Pas de middleware
```

---

## 📝 Résumé

| Scénario | Action | Résultat |
|----------|--------|----------|
| Utilisateur connecté accède à page protégée | Middleware vérifie session | ✅ Accès autorisé |
| Utilisateur NON connecté accède à page protégée | Middleware vérifie session | ❌ Redirection vers `/` |
| Utilisateur connecté, session expirée | Middleware vérifie session | ❌ Redirection vers `/` |
| Page sans middleware | Pas de vérification | ✅ Accès public |

---

## 🔗 Pages à Protéger (Recommandations)

Voici les pages qui **devraient** utiliser le middleware `auth` :

- ✅ `/admin/profil` - Page de profil utilisateur
- ✅ `/admin/project-module/*` - Toutes les pages de gestion de projets
- ✅ `/admin/project-module/dashboard` - Tableau de bord
- ✅ `/admin/project-module/create-project` - Création de projet
- ✅ Toute page sous `/admin/*` (sauf `/admin/login`)

Pages **publiques** (pas de middleware) :

- ❌ `/` - Page d'accueil
- ❌ `/admin/login` - Page de connexion
- ❌ `/about` - À propos (si public)

---

## 🎯 Exemple Complet : Protéger Toutes les Pages Admin

```typescript
// middleware/auth.global.ts

export default defineNuxtRouteMiddleware(async (to, from) => {
    // Routes publiques (pas de vérification)
    const publicRoutes = ['/', '/admin/login'];

    if (publicRoutes.includes(to.path)) {
        return;
    }

    // Protéger toutes les routes /admin/*
    if (to.path.startsWith('/admin')) {
        const config = useRuntimeConfig();

        try {
            const session = await $fetch('/local/auth/get-session', {
                baseURL: config.public.betterAuthUrl,
                credentials: 'include',
                headers: useRequestHeaders(['cookie']) as Record<string, string>,
            });

            if (!session || !session.user) {
                return navigateTo({
                    path: '/admin/login',
                    query: { redirect: to.fullPath }
                });
            }
        } catch (error) {
            return navigateTo({
                path: '/admin/login',
                query: { redirect: to.fullPath }
            });
        }
    }
});
```

---

## ✅ Checklist de Mise en Place

- [x] Middleware `auth.ts` créé dans `/middleware/`
- [ ] Runtime config configuré dans `nuxt.config.ts`
- [ ] Middleware ajouté aux pages protégées via `definePageMeta()`
- [ ] Tests effectués (accès sans connexion, avec connexion)
- [ ] Logs vérifiés dans la console
- [ ] Gestion des erreurs testée (session expirée)

---

## 🆘 Support

Si le middleware ne fonctionne pas :

1. **Vérifier les logs** : Console navigateur + terminal Nuxt
2. **Vérifier le runtime config** : `console.log(useRuntimeConfig().public.betterAuthUrl)`
3. **Vérifier l'endpoint** : Tester `/local/auth/get-session` manuellement
4. **Vérifier les cookies** : DevTools > Application > Cookies

---

**Créé par** : Claude Code
**Date** : 2025-01-19
**Version** : 1.0

---

**Prochaines étapes** : Consultez [KEYCLOAK_AUTH_COMPLETE_GUIDE.md](./KEYCLOAK_AUTH_COMPLETE_GUIDE.md) pour la configuration complète de l'authentification.
