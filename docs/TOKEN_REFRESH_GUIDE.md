# Guide Complet du Système de Refresh Token

**Date**: 2025-01-19
**Environnement**: Nuxt 3 + Better Auth + Keycloak

---

## 📋 Vue d'ensemble

Ce système gère automatiquement le rafraîchissement des access tokens expirés pour maintenir l'utilisateur connecté sans interruption. Lorsqu'un access token expire, le système utilise le refresh token pour obtenir un nouveau access token depuis Keycloak.

---

## 🎯 Problème Résolu

### Avant le Système de Refresh Token

```
1. Utilisateur se connecte → Obtient access_token (expire après 5-15 min)
2. Access token expire
3. ❌ Requêtes API échouent avec erreur 401
4. ❌ Utilisateur doit se reconnecter manuellement
```

### Avec le Système de Refresh Token

```
1. Utilisateur se connecte → Obtient access_token + refresh_token
2. Access token expire
3. ✅ Système détecte l'expiration
4. ✅ Utilise refresh_token pour obtenir nouveau access_token
5. ✅ Utilisateur reste connecté (transparent)
```

---

## 🏗️ Architecture

### Composants du Système

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
├─────────────────────────────────────────────────────────────┤
│  useTokenRefresh Composable                                 │
│  - Détecte erreurs 401                                      │
│  - Déclenche refresh token                                  │
│  - Réessaye requêtes échouées                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    NUXT SERVER                               │
├─────────────────────────────────────────────────────────────┤
│  /api/refresh-token.post.ts                                 │
│  - Endpoint pour refresh manuel                             │
│  - Appelle ensureValidToken()                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 SERVER UTILITIES                             │
├─────────────────────────────────────────────────────────────┤
│  token-refresh.ts                                           │
│  - ensureValidToken(): Vérifie expiration                   │
│  - refreshAccessToken(): Appelle Keycloak                   │
│  - updateAccountTokens(): Met à jour DB                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      KEYCLOAK                                │
├─────────────────────────────────────────────────────────────┤
│  Token Endpoint                                             │
│  - Reçoit refresh_token                                     │
│  - Retourne nouveau access_token + refresh_token            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                                │
├─────────────────────────────────────────────────────────────┤
│  Account Table                                              │
│  - access_token (mis à jour)                                │
│  - refresh_token (mis à jour)                               │
│  - access_token_expires (mis à jour)                        │
│  - refresh_expires_in (mis à jour)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Fichiers Créés/Modifiés

### 1. `server/utils/token-refresh.ts` ⭐ NOUVEAU

Contient toutes les fonctions pour gérer le refresh token côté serveur.

**Fonctions principales** :

#### `isTokenExpired(expiresAt, bufferSeconds)`
Vérifie si un token est expiré ou va expirer bientôt.

```typescript
const expired = isTokenExpired(account.accessTokenExpiresAt?.getTime());
// true si token expiré ou expire dans moins de 60 secondes
```

#### `refreshAccessToken(refreshToken)`
Appelle Keycloak pour obtenir un nouveau access token.

```typescript
const newTokens = await refreshAccessToken(account.refreshToken);
// Retourne: { access_token, refresh_token, expires_in, ... }
```

#### `updateAccountTokens(adapter, accountId, tokens)`
Met à jour les tokens dans la base de données.

```typescript
await updateAccountTokens(adapter, accountId, newTokens);
// Met à jour access_token, refresh_token, et dates d'expiration
```

#### `ensureValidToken(account, adapter)` ⭐ PRINCIPAL
Fonction principale qui orchestre tout le processus.

```typescript
const validTokens = await ensureValidToken(account, adapter);
// Retourne: { accessToken, idToken } ou null si échec
```

**Logique** :
```
1. Vérifier si access token expiré
2. Si non expiré → Retourner token actuel
3. Si expiré :
   a. Vérifier que refresh token existe
   b. Vérifier que refresh token n'est pas expiré
   c. Appeler Keycloak pour refresh
   d. Mettre à jour DB avec nouveaux tokens
   e. Retourner nouveaux tokens
```

---

### 2. `server/utils/auth.ts` - MODIFIÉ

Le plugin `customSession` a été modifié pour utiliser `ensureValidToken()`.

**Avant** :
```typescript
const account = accounts[0];
const accessToken = account.accessToken; // ❌ Peut être expiré
```

**Après** :
```typescript
let account = accounts[0];

// ✅ Vérifie et rafraîchit automatiquement
const validTokens = await ensureValidToken(account, ctx.context.adapter);

if (!validTokens) {
    // Refresh token expiré, l'utilisateur doit se reconnecter
    return { user, session };
}

const accessToken = validTokens.accessToken; // ✅ Toujours valide
const idToken = validTokens.idToken;
```

---

### 3. `server/api/refresh-token.post.ts` ⭐ NOUVEAU

Endpoint API pour permettre au client de déclencher un refresh manuellement.

**Utilisation** :
```typescript
const response = await $fetch('/api/refresh-token', {
    method: 'POST',
    credentials: 'include'
});

if (response.success) {
    console.log('Token rafraîchi !');
} else if (response.requireReLogin) {
    // Rediriger vers login
    navigateTo('/admin/login');
}
```

---

### 4. `composables/useTokenRefresh.ts` ⭐ NOUVEAU

Composable Vue pour gérer le refresh automatique côté client.

**Fonctions disponibles** :

#### `refreshToken()`
Déclenche manuellement un refresh.

```typescript
const { refreshToken } = useTokenRefresh();

const success = await refreshToken();
if (success) {
    console.log('Token rafraîchi !');
}
```

#### `fetchWithTokenRefresh(url, options)`
Wrapper $fetch qui gère automatiquement les erreurs 401.

```typescript
const { fetchWithTokenRefresh } = useTokenRefresh();

// Si cette requête retourne 401, le token sera automatiquement rafraîchi
// et la requête sera réessayée
const data = await fetchWithTokenRefresh('/api/users', {
    method: 'GET'
});
```

#### `createApiClient(baseURL)`
Crée un client API complet avec gestion automatique du refresh.

```typescript
const api = createApiClient('https://api.example.com');

// Toutes ces requêtes gèrent automatiquement le refresh en cas de 401
const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'John' });
const updated = await api.put('/users/1', { name: 'Jane' });
await api.delete('/users/1');
```

---

## 🚀 Utilisation

### Scénario 1 : Refresh Automatique Côté Serveur (Recommandé)

**Où ça se passe** : Dans le plugin `customSession`

**Quand** : À chaque fois qu'une session est récupérée

**Comment** :
```typescript
// Automatique ! Rien à faire
// Le plugin customSession vérifie et rafraîchit automatiquement
const { $authClient } = useNuxtApp();
const { data: session } = await $authClient.getSession();

// session.access_token est toujours valide (rafraîchi si nécessaire)
```

**Avantages** :
- ✅ Complètement transparent
- ✅ Pas de code supplémentaire
- ✅ Fonctionne pour toutes les sessions

---

### Scénario 2 : Gestion des Erreurs 401 Côté Client

**Où** : Dans vos composants Vue

**Quand** : Lors d'appels API à votre backend

**Exemple 1 : Wrapper $fetch automatique**

```vue
<script setup lang="ts">
import { useTokenRefresh } from '~/composables/useTokenRefresh';

const { fetchWithTokenRefresh } = useTokenRefresh();

const loadUserData = async () => {
    try {
        // Si cette requête retourne 401 (token expiré),
        // le système rafraîchira automatiquement le token
        // et réessayera la requête
        const data = await fetchWithTokenRefresh('/api/users', {
            method: 'GET',
            baseURL: 'https://api.example.com'
        });

        console.log('Données utilisateur:', data);

    } catch (error) {
        console.error('Erreur après tentative de refresh:', error);
    }
};
</script>
```

**Exemple 2 : Client API complet**

```vue
<script setup lang="ts">
import { createApiClient } from '~/composables/useTokenRefresh';

// Créer un client API
const api = createApiClient('https://siseb-refonte.emes.bj/api');

const users = ref([]);
const loading = ref(false);

const fetchUsers = async () => {
    loading.value = true;
    try {
        // Gestion automatique du refresh en cas de 401
        users.value = await api.get('/users');
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        loading.value = false;
    }
};

const createUser = async (userData: any) => {
    try {
        const newUser = await api.post('/users', userData);
        users.value.push(newUser);
    } catch (error) {
        console.error('Erreur:', error);
    }
};

onMounted(() => {
    fetchUsers();
});
</script>

<template>
    <div>
        <div v-if="loading">Chargement...</div>
        <div v-else>
            <div v-for="user in users" :key="user.id">
                {{ user.name }}
            </div>
        </div>
    </div>
</template>
```

---

### Scénario 3 : Refresh Manuel

**Où** : Dans des situations spécifiques

**Quand** : Avant une opération critique ou après détection d'une erreur

```vue
<script setup lang="ts">
import { useTokenRefresh } from '~/composables/useTokenRefresh';

const { refreshToken, isRefreshing } = useTokenRefresh();

const performCriticalOperation = async () => {
    // S'assurer que le token est frais avant l'opération
    const refreshed = await refreshToken();

    if (!refreshed) {
        console.error('Impossible de rafraîchir le token');
        return;
    }

    // Continuer avec l'opération critique
    await $fetch('/api/critical-operation', {
        method: 'POST'
    });
};
</script>

<template>
    <div>
        <button
            @click="performCriticalOperation"
            :disabled="isRefreshing"
        >
            {{ isRefreshing ? 'Rafraîchissement...' : 'Opération Critique' }}
        </button>
    </div>
</template>
```

---

## 🔍 Flow Détaillé

### Flow 1 : Session Server-Side (getSession)

```
1. Client appelle $authClient.getSession()
   ↓
2. Better Auth → customSession plugin
   ↓
3. customSession récupère le compte depuis la DB
   ↓
4. ensureValidToken(account, adapter)
   ├─ Token valide ? → Retourne token actuel
   └─ Token expiré ?
      ├─ Refresh token valide ?
      │  ├─ Oui → Appelle Keycloak
      │  │         ├─ Réussi → Met à jour DB → Retourne nouveau token
      │  │         └─ Échec → Retourne null
      │  └─ Non → Retourne null (reconnexion requise)
   ↓
5. customSession utilise le token valide pour appeler l'API backend
   ↓
6. Retourne session enrichie avec access_token toujours valide
```

---

### Flow 2 : Requête Client avec Erreur 401

```
1. Client appelle fetchWithTokenRefresh('/api/users')
   ↓
2. Première tentative → $fetch('/api/users')
   ↓
3. API retourne 401 (Unauthorized)
   ↓
4. Intercepteur détecte l'erreur 401
   ↓
5. Appelle refreshToken()
   ├─ POST /api/refresh-token
   │  ├─ Récupère session
   │  ├─ Récupère compte
   │  ├─ Appelle ensureValidToken()
   │  └─ Retourne { success: true }
   ↓
6. Réessaye la requête originale
   ↓
7. $fetch('/api/users') → 200 OK
   ↓
8. Retourne les données au client
```

---

## 📊 Diagramme des États du Token

```
┌──────────────────┐
│  Token Frais     │ ← Login initial
│  (Just created)  │
└────────┬─────────┘
         │
         ↓ (Temps passe)
┌──────────────────┐
│  Token Valide    │ ← Utilisé normalement
│  (Still valid)   │
└────────┬─────────┘
         │
         ↓ (Approche expiration - 60s)
┌──────────────────┐
│  Token Proche    │ ← ensureValidToken() détecte
│  Expiration      │    et rafraîchit automatiquement
└────────┬─────────┘
         │
         ├─ Refresh Réussi ──→ Retour à "Token Frais"
         │
         └─ Refresh Échoué
                   ↓
         ┌──────────────────┐
         │  Token Expiré    │ ← Refresh token aussi expiré
         │  (Expired)       │
         └────────┬─────────┘
                  │
                  ↓
         ┌──────────────────┐
         │  Déconnexion     │ ← Redirection vers /admin/login
         │  (Logged out)    │
         └──────────────────┘
```

---

## ⚙️ Configuration

### Variables d'Environnement Requises

```env
# Keycloak
KEYCLOAK_URL=https://keycloack.emes.bj
KEYCLOAK_REALM=siseb
KEYCLOAK_CLIENT_ID=siseb-front
KEYCLOAK_CLIENT_SECRET=votre-secret-keycloak

# Better Auth
NUXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# API Backend
NUXT_PUBLIC_SISEB_API_BASE_URL=https://api.example.com
```

### Paramètres de Timing

**Dans `token-refresh.ts`** :

```typescript
// Temps de buffer avant expiration (60 secondes par défaut)
const bufferSeconds = 60;

// Le token est considéré comme "expiré" 60 secondes avant l'expiration réelle
// Cela permet de rafraîchir proactivement et d'éviter les erreurs
```

**Modifier le buffer** :
```typescript
// Dans token-refresh.ts, ligne ~47
const tokenExpired = isTokenExpired(account.accessTokenExpiresAt?.getTime(), 120);
// 120 secondes = 2 minutes de buffer
```

---

## 🔐 Sécurité

### Bonnes Pratiques Implémentées

✅ **Refresh Token jamais exposé au client**
- Le refresh token reste en base de données
- L'endpoint `/api/refresh-token` ne retourne que le nouveau access token

✅ **Validation de l'expiration**
- Vérifie que le refresh token n'est pas expiré avant de l'utiliser
- Double vérification : access token ET refresh token

✅ **Client Secret côté serveur uniquement**
- `KEYCLOAK_CLIENT_SECRET` n'est jamais exposé au client
- Utilisé uniquement dans les utilitaires serveur

✅ **Credentials included**
- Les cookies sont toujours envoyés avec les requêtes
- `credentials: 'include'` sur toutes les requêtes auth

✅ **Gestion des échecs**
- Si refresh échoue → Déconnexion propre
- Pas de boucle infinie de refresh

---

## 🐛 Dépannage

### Problème 1 : "Refresh token expiré"

**Symptôme** :
```
[Token Refresh] Refresh token expiré, reconnexion nécessaire
```

**Cause** : Le refresh token a une durée de vie (généralement 30 jours). Après ce délai, l'utilisateur doit se reconnecter.

**Solution** : Normal ! L'utilisateur sera redirigé vers `/admin/login`.

---

### Problème 2 : "Configuration Keycloak incomplète"

**Symptôme** :
```
[Token Refresh] Configuration Keycloak incomplète
```

**Cause** : Variables d'environnement manquantes

**Solution** :
```bash
# Vérifier que toutes les variables sont définies
echo $KEYCLOAK_URL
echo $KEYCLOAK_REALM
echo $KEYCLOAK_CLIENT_ID
echo $KEYCLOAK_CLIENT_SECRET
```

---

### Problème 3 : Boucle de refresh infinie

**Symptôme** : Logs montrent des tentatives de refresh en boucle

**Cause** : Le buffer est trop large ou l'heure système est incorrecte

**Solution** :
```typescript
// Réduire le buffer dans token-refresh.ts
const bufferSeconds = 30; // Au lieu de 60
```

---

### Problème 4 : "Cannot read properties of undefined (reading 'getTime')"

**Symptôme** : Erreur lors de la vérification d'expiration

**Cause** : Le champ `accessTokenExpiresAt` n'est pas défini en DB

**Solution** :
```typescript
// Vérifier le mapping dans auth.ts
account: {
    fields: {
        accessTokenExpiresAt: "access_token_expires", // ✅ Doit correspondre à votre schéma DB
    }
}
```

---

## 📈 Logs et Monitoring

### Logs Importants à Surveiller

**Refresh réussi** :
```
[Token Refresh] Tentative de refresh du token
[Token Refresh] Token rafraîchi avec succès
[Token Refresh] Tokens mis à jour dans la base de données
[Custom Session] Appel de l'API avec access token
```

**Token encore valide (pas de refresh nécessaire)** :
```
[Token Refresh] Token encore valide, pas de refresh nécessaire
```

**Refresh échoué** :
```
[Token Refresh] Refresh token expiré, reconnexion nécessaire
[Token Refresh] Erreur lors du refresh du token
```

**Refresh client-side** :
```
[Refresh Token API] Tentative de refresh pour l'utilisateur
[Refresh Token API] Token rafraîchi avec succès
```

---

## ✅ Tests

### Test 1 : Refresh Automatique Server-Side

```bash
# 1. Se connecter
# 2. Attendre que l'access token expire (voir logs)
# 3. Rafraîchir la page ou appeler getSession()

# Logs attendus :
[Token Refresh] Token expiré, tentative de refresh
[Token Refresh] Token rafraîchi avec succès
[Custom Session] Appel de l'API avec access token
```

### Test 2 : Erreur 401 Client-Side

```vue
<script setup>
const { fetchWithTokenRefresh } = useTokenRefresh();

// Simuler une requête avec token expiré
const testRefresh = async () => {
    try {
        const data = await fetchWithTokenRefresh('/api/protected-resource');
        console.log('Succès après refresh:', data);
    } catch (error) {
        console.error('Échec:', error);
    }
};
</script>
```

### Test 3 : Refresh Manual

```vue
<script setup>
const { refreshToken } = useTokenRefresh();

const testManualRefresh = async () => {
    const success = await refreshToken();
    console.log('Refresh manuel:', success ? 'Réussi' : 'Échoué');
};
</script>
```

---

## 📋 Checklist de Mise en Place

- [x] Fichier `server/utils/token-refresh.ts` créé
- [x] Fichier `server/utils/auth.ts` modifié (customSession)
- [x] Fichier `server/api/refresh-token.post.ts` créé
- [x] Fichier `composables/useTokenRefresh.ts` créé
- [ ] Variables d'environnement Keycloak configurées
- [ ] Mapping des champs dans `auth.ts` vérifié
- [ ] Tests effectués (refresh automatique)
- [ ] Tests effectués (erreur 401 client)
- [ ] Logs vérifiés

---

## 🎯 Résumé

| Composant | Rôle | Automatique ? |
|-----------|------|---------------|
| `customSession` plugin | Refresh lors de getSession() | ✅ Oui |
| `ensureValidToken()` | Vérifie et rafraîchit tokens | ✅ Oui (appelé par customSession) |
| `/api/refresh-token` | Endpoint pour refresh client | ❌ Manuel (appelé par composable) |
| `useTokenRefresh()` | Gestion erreurs 401 client | ✅ Oui (si utilisé avec fetchWithTokenRefresh) |

---

## 🚀 Prochaines Étapes

1. **Monitoring** : Mettre en place des métriques pour suivre les refresh
2. **Optimisation** : Ajuster le buffer selon les besoins
3. **Tests E2E** : Tester le scénario complet avec vrais utilisateurs
4. **Documentation Client** : Former les développeurs à utiliser `useTokenRefresh()`

---

**Créé par** : Claude Code
**Date** : 2025-01-19
**Version** : 1.0

---

**Fichiers liés** :
- [KEYCLOAK_AUTH_COMPLETE_GUIDE.md](./KEYCLOAK_AUTH_COMPLETE_GUIDE.md)
- [MIDDLEWARE_AUTH_GUIDE.md](MIDDLEWARE_AUTH_GUIDE.md)
- [LOGOUT_GUIDE.md](./LOGOUT_GUIDE.md)
