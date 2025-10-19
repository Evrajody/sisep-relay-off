# 🚀 Quick Start - Authentification Keycloak

**Pour démarrer rapidement** | [Documentation Complète](./KEYCLOAK_AUTH_COMPLETE_GUIDE.md) | [Index](./DOCUMENTATION_INDEX.md)

---

## ⚡ Installation Rapide (5 minutes)

### 1. Variables d'Environnement

Créez `.env` :

```env
# Keycloak
KEYCLOAK_URL=https://keycloak.example.com
KEYCLOAK_REALM=siseb
KEYCLOAK_CLIENT_ID=siseb-nuxt-app
KEYCLOAK_CLIENT_SECRET=votre-secret-ici

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
NUXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# API Backend
NUXT_PUBLIC_SISEB_API_BASE_URL=https://api.example.com
```

### 2. Installation

```bash
pnpm add better-auth @better-auth/sso better-sqlite3
```

### 3. Fichiers Requis

✅ Déjà créés dans votre projet :
- `server/utils/auth.ts` - Configuration Better Auth
- `server/routes/local/auth/[...].ts` - Handler
- `server/api/logout-keycloak.post.ts` - Déconnexion
- `plugins/auth-better-client.ts` - Client
- `composables/useAuthLogout.ts` - Composable

### 4. Démarrer

```bash
npm run dev
```

### 5. Tester

1. Allez sur `http://localhost:3000/admin/login`
2. Cliquez sur "Se connecter avec Keycloak"
3. Entrez vos identifiants Keycloak
4. Vous devriez être connecté ! ✅

---

## 🎯 Utilisation de Base

### Se Connecter

```vue
<template>
  <button @click="login">
    Se connecter
  </button>
</template>

<script setup>
const { $authClient } = useNuxtApp();

const login = async () => {
  await $authClient.signIn.social({
    provider: "keycloak",
    callbackURL: "/dashboard",
  });
};
</script>
```

### Se Déconnecter

```vue
<template>
  <button @click="handleLogout">
    Déconnexion
  </button>
</template>

<script setup>
const { logout } = useAuthLogout();

const handleLogout = () => logout();
</script>
```

### Récupérer la Session

```vue
<script setup>
const { $authClient } = useNuxtApp();

const { data: session } = await $authClient.getSession();

// Accéder aux données
const email = session?.user?.email;
const accessToken = session?.session?.access_token;
const userRoles = session?.session?.additional_info?.userRoles;
</script>
```

---

## 📚 Documentation Complète

| Document | Description |
|----------|-------------|
| **[KEYCLOAK_AUTH_COMPLETE_GUIDE.md](./KEYCLOAK_AUTH_COMPLETE_GUIDE.md)** | 📖 Guide complet A-Z |
| **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** | 📑 Index de tous les docs |
| [ACCESS_TOKEN_EXPLAINED.md](./ACCESS_TOKEN_EXPLAINED.md) | 🔑 Origine de l'access_token |
| [LOGOUT_GUIDE.md](./LOGOUT_GUIDE.md) | 🚪 Guide déconnexion |
| [SESSION_ENRICHMENT_SUMMARY.md](./SESSION_ENRICHMENT_SUMMARY.md) | 🎨 Session enrichie |

---

## ❓ Problèmes Courants

### "redirect_uri mismatch"
➡️ Ajouter `http://localhost:3000/*` dans Valid Redirect URIs Keycloak

### "Missing parameters: id_token_hint"
➡️ Déjà géré avec fallback `client_id` ✅

### Session non enrichie
➡️ Vérifier les logs serveur et l'URL de l'API backend

### Boucle de redirection
➡️ Vérifier le middleware `auth.ts`

**Plus de détails** : [Guide Complet - Section Dépannage](./KEYCLOAK_AUTH_COMPLETE_GUIDE.md#dépannage)

---

## ✅ Checklist

- [ ] Variables d'environnement configurées
- [ ] Dépendances installées
- [ ] Keycloak configuré (Realm, Client)
- [ ] Application démarre sans erreur
- [ ] Connexion fonctionne
- [ ] Session enrichie visible
- [ ] Déconnexion fonctionne

---

## 🆘 Besoin d'Aide ?

1. 📖 Lire le [Guide Complet](./KEYCLOAK_AUTH_COMPLETE_GUIDE.md)
2. 🔍 Chercher dans l'[Index](./DOCUMENTATION_INDEX.md)
3. 📊 Vérifier les logs serveur
4. 💬 Demander à l'équipe

---

**C'est tout !** Vous êtes prêt à utiliser l'authentification Keycloak avec Better Auth. 🎉

Pour aller plus loin, consultez la [Documentation Complète](./KEYCLOAK_AUTH_COMPLETE_GUIDE.md).
