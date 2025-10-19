# Refresh Token - Démarrage Rapide ⚡

Guide rapide pour utiliser le système de refresh token. Pas de blabla, juste le code.

---

## 🚀 TL;DR

```typescript
// Dans votre composant Vue
import { createApiClient } from '~/composables/useTokenRefresh';

const api = createApiClient('https://api.example.com');

// Toutes ces requêtes gèrent automatiquement le refresh du token en cas d'expiration
const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'John' });
const updated = await api.put('/users/1', { name: 'Jane' });
await api.delete('/users/1');
```

**C'est tout !** Le reste se fait automatiquement.

---

## 📦 Fichiers du Système

```
server/
├── utils/
│   ├── auth.ts                    # ✅ Modifié (customSession avec refresh)
│   └── token-refresh.ts           # ⭐ NOUVEAU (fonctions de refresh)
└── api/
    └── refresh-token.post.ts      # ⭐ NOUVEAU (endpoint pour refresh client)

composables/
└── useTokenRefresh.ts             # ⭐ NOUVEAU (composable client)
```

---

## 🎯 Méthode 1 : Client API (Recommandé)

```vue
<script setup lang="ts">
import { createApiClient } from '~/composables/useTokenRefresh';

// Créer le client une fois
const api = createApiClient('https://siseb-refonte.emes.bj/api');

// Utiliser partout
const projects = ref([]);

const loadProjects = async () => {
    projects.value = await api.get('/projects');
};

const createProject = async (data: any) => {
    const newProject = await api.post('/projects', data);
    projects.value.push(newProject);
};

onMounted(() => loadProjects());
</script>
```

**Avantages** :
- ✅ Simple
- ✅ Refresh automatique
- ✅ Gestion d'erreurs incluse

---

## 🎯 Méthode 2 : Wrapper $fetch

```vue
<script setup lang="ts">
import { useTokenRefresh } from '~/composables/useTokenRefresh';

const { fetchWithTokenRefresh } = useTokenRefresh();

const loadData = async () => {
    const data = await fetchWithTokenRefresh('/api/users', {
        method: 'GET',
        baseURL: 'https://api.example.com'
    });
    return data;
};
</script>
```

---

## 🎯 Méthode 3 : Refresh Manuel

```vue
<script setup lang="ts">
import { useTokenRefresh } from '~/composables/useTokenRefresh';

const { refreshToken } = useTokenRefresh();

const beforeCriticalOperation = async () => {
    // S'assurer que le token est frais
    const success = await refreshToken();

    if (!success) {
        console.error('Token expiré');
        return;
    }

    // Continuer...
};
</script>
```

---

## 🔧 Composable Personnalisé pour votre API

```typescript
// composables/useSisebApi.ts
import { createApiClient } from '~/composables/useTokenRefresh';

export const useSisebApi = () => {
    const config = useRuntimeConfig();
    const api = createApiClient(config.public.sisebApiBaseUrl);

    return {
        projects: {
            list: () => api.get('/projects'),
            get: (id: string) => api.get(`/projects/${id}`),
            create: (data: any) => api.post('/projects', data),
            update: (id: string, data: any) => api.put(`/projects/${id}`, data),
            delete: (id: string) => api.delete(`/projects/${id}`),
        },
        users: {
            list: () => api.get('/users'),
            // ... etc
        }
    };
};
```

**Utilisation** :
```vue
<script setup>
const siseb = useSisebApi();

const projects = await siseb.projects.list();
const newProject = await siseb.projects.create({ title: 'Test' });
</script>
```

---

## 🚨 Gestion d'Erreurs

```vue
<script setup lang="ts">
const { fetchWithTokenRefresh } = useTokenRefresh();

try {
    const data = await fetchWithTokenRefresh('/api/data');
} catch (error: any) {
    if (error.statusCode === 401) {
        // Token expiré ET refresh échoué
        // L'utilisateur sera redirigé automatiquement
        console.error('Session expirée');
    } else {
        // Autre erreur
        console.error('Erreur:', error.message);
    }
}
</script>
```

---

## 🔍 Debugging

### Logs à Surveiller

**Token rafraîchi automatiquement** :
```
[Token Refresh] Token expiré, tentative de refresh
[Token Refresh] Token rafraîchi avec succès
[Custom Session] Appel de l'API avec access token
```

**Token encore valide** :
```
[Token Refresh] Token encore valide, pas de refresh nécessaire
```

**Refresh échoué** :
```
[Token Refresh] Refresh token expiré, reconnexion nécessaire
```

---

## ⚙️ Configuration Requise

### `.env`

```env
KEYCLOAK_URL=https://keycloack.emes.bj
KEYCLOAK_REALM=siseb
KEYCLOAK_CLIENT_ID=siseb-front
KEYCLOAK_CLIENT_SECRET=votre-secret

NUXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NUXT_PUBLIC_SISEB_API_BASE_URL=https://api.example.com
```

### `server/utils/auth.ts`

Vérifier le mapping des champs :

```typescript
account: {
    fields: {
        accessToken: "access_token",
        refreshToken: "refresh_token",
        accessTokenExpiresAt: "access_token_expires",
        refreshTokenExpiresAt: "refresh_expires_in",
        idToken: "id_token",
    }
}
```

---

## ✅ Checklist

- [ ] Variables d'environnement configurées
- [ ] Mapping des champs vérifié dans `auth.ts`
- [ ] Test : Requête avec token valide → Succès
- [ ] Test : Attendre expiration → Refresh automatique → Succès
- [ ] Test : Refresh token expiré → Redirection vers login

---

## 🎯 Ce qu'il Faut Retenir

| Scénario | Ce qui se passe |
|----------|-----------------|
| Token valide | ✅ Requête normale |
| Token expiré | ✅ Refresh automatique → Requête réessayée |
| Refresh token expiré | ❌ Redirection vers `/admin/login` |

**En résumé** : Utilisez `createApiClient()` ou `fetchWithTokenRefresh()`, et le système gère tout automatiquement.

---

## 📚 Documentation Complète

- **Guide détaillé** : [TOKEN_REFRESH_GUIDE.md](TOKEN_REFRESH_GUIDE.md)
- **Exemples d'utilisation** : [EXAMPLE_TOKEN_REFRESH_USAGE.md](EXAMPLE_TOKEN_REFRESH_USAGE.md)
- **Guide d'authentification** : [KEYCLOAK_AUTH_COMPLETE_GUIDE.md](./KEYCLOAK_AUTH_COMPLETE_GUIDE.md)

---

**Créé par** : Claude Code
**Date** : 2025-01-19
