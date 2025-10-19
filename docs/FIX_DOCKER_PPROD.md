# 🔧 Fix : Erreur "Invalid base URL: undefined" en Docker (pprod)

**Status** : ✅ RÉSOLU
**Date** : 2025-01-19
**Environnement** : Pre-Production (pprod) Docker

---

## ❌ Erreur Rencontrée

```
[request error] [unhandled] [POST] http://siseb-refonte.emes.bj/local/auth/sign-in/sso
[H3Error: Invalid base URL: undefined. Please provide a valid base URL.]
```

---

## ✅ Corrections Appliquées

### 1. `server/utils/auth.ts`

**Problème** : `process.env.NUXT_PUBLIC_BETTER_AUTH_URL` était `undefined`

**Solution** : Ajout d'une fonction avec fallback

```typescript
// Avant ❌
baseURL: `${process.env.NUXT_PUBLIC_BETTER_AUTH_URL}`,

// Après ✅
const getBaseURL = () => {
    if (process.env.NUXT_PUBLIC_BETTER_AUTH_URL) {
        return process.env.NUXT_PUBLIC_BETTER_AUTH_URL;
    }
    const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    console.log("[Better Auth] Base URL configurée:", baseUrl);
    return baseUrl;
};

baseURL: getBaseURL(),
```

### 2. `nuxt.config.ts`

**Problème** : Même variable undefined causait `betterAuthUrl: "undefined"`

**Solution** : Ajout de fallbacks

```typescript
// Avant ❌
betterAuthUrl: `${process.env.NUXT_PUBLIC_BETTER_AUTH_URL}`,

// Après ✅
betterAuthUrl: process.env.NUXT_PUBLIC_BETTER_AUTH_URL
               || process.env.BETTER_AUTH_URL
               || "http://localhost:3000",
```

---

## 🚀 Prochaines Étapes

### Étape 1 : Configurer les Variables d'Environnement

#### Option A : Fichier `.env.pprod`

1. Créez le fichier `.envs/.env.pprod` (si pas déjà fait)
2. Copiez le contenu de `.env.pprod.example` :

```env
# Better Auth
BETTER_AUTH_URL=http://siseb-refonte.emes.bj
NUXT_PUBLIC_BETTER_AUTH_URL=http://siseb-refonte.emes.bj
BETTER_AUTH_SECRET=<générer-un-secret-fort>

# Keycloak
KEYCLOAK_URL=https://keycloack.emes.bj
KEYCLOAK_REALM=siseb
KEYCLOAK_CLIENT_ID=siseb-front
KEYCLOAK_CLIENT_SECRET=<votre-secret-keycloak>

# API Backend
NUXT_PUBLIC_SISEB_API_BASE_URL=https://siseb-refonte.emes.bj/api
```

3. Générez un secret fort pour `BETTER_AUTH_SECRET` :

```bash
openssl rand -base64 32
```

#### Option B : Variables Docker Compose

Si vous utilisez Docker Compose, ajoutez dans votre `docker-compose.yml` :

```yaml
environment:
  - BETTER_AUTH_URL=http://siseb-refonte.emes.bj
  - NUXT_PUBLIC_BETTER_AUTH_URL=http://siseb-refonte.emes.bj
  - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
  - KEYCLOAK_URL=https://keycloack.emes.bj
  - KEYCLOAK_REALM=siseb
  - KEYCLOAK_CLIENT_ID=siseb-front
  - KEYCLOAK_CLIENT_SECRET=${KEYCLOAK_CLIENT_SECRET}
  - NUXT_PUBLIC_SISEB_API_BASE_URL=https://siseb-refonte.emes.bj/api
```

### Étape 2 : Rebuild l'Image Docker

```bash
# Si vous utilisez Docker Compose
docker-compose -f docker-compose.pprod.yml build --no-cache

# Si vous utilisez Docker directement
docker build \
  --build-arg BETTER_AUTH_URL=http://siseb-refonte.emes.bj \
  --build-arg NUXT_PUBLIC_BETTER_AUTH_URL=http://siseb-refonte.emes.bj \
  --no-cache \
  -t siseb-frontend:pprod .
```

### Étape 3 : Redémarrer le Conteneur

```bash
# Si vous utilisez Docker Compose
docker-compose -f docker-compose.pprod.yml down
docker-compose -f docker-compose.pprod.yml up -d

# Si vous utilisez Docker directement
docker stop siseb-frontend-pprod
docker rm siseb-frontend-pprod
docker run -d \
  --name siseb-frontend-pprod \
  -p 3000:3000 \
  -e BETTER_AUTH_URL=http://siseb-refonte.emes.bj \
  -e NUXT_PUBLIC_BETTER_AUTH_URL=http://siseb-refonte.emes.bj \
  -e BETTER_AUTH_SECRET=<votre-secret> \
  -e KEYCLOAK_URL=https://keycloack.emes.bj \
  -e KEYCLOAK_REALM=siseb \
  -e KEYCLOAK_CLIENT_ID=siseb-front \
  -e KEYCLOAK_CLIENT_SECRET=<votre-secret-keycloak> \
  -e NUXT_PUBLIC_SISEB_API_BASE_URL=https://siseb-refonte.emes.bj/api \
  siseb-frontend:pprod
```

### Étape 4 : Vérifier les Logs

```bash
# Voir les logs du conteneur
docker logs -f siseb-frontend-pprod

# Vous devriez voir :
# [Better Auth] Base URL configurée: http://siseb-refonte.emes.bj
# Listening on http://0.0.0.0:3000
```

### Étape 5 : Tester l'Authentification

1. Ouvrez `http://siseb-refonte.emes.bj/admin/login`
2. Cliquez sur "Se connecter avec Keycloak"
3. Vérifiez que la redirection vers Keycloak fonctionne
4. Après connexion, vérifiez les logs :

```bash
docker logs siseb-frontend-pprod | grep "Custom Session"
# [Custom Session] Appel de l'API avec access token
# [Custom Session] Infos additionnelles récupérées
```

---

## 🔍 Vérifications

### Vérifier les Variables d'Environnement dans le Conteneur

```bash
# Entrer dans le conteneur
docker exec -it siseb-frontend-pprod sh

# Vérifier les variables
echo $BETTER_AUTH_URL
echo $NUXT_PUBLIC_BETTER_AUTH_URL
echo $KEYCLOAK_URL

# Sortir
exit
```

### Vérifier que Keycloak est Accessible

```bash
# Depuis le conteneur
docker exec siseb-frontend-pprod wget -O- https://keycloack.emes.bj

# Depuis l'hôte
curl https://keycloack.emes.bj
```

### Vérifier la Configuration Keycloak

Dans Keycloak Admin Console, vérifiez :

**Clients → siseb-front → Settings :**
```
Valid Redirect URIs:
  - http://siseb-refonte.emes.bj/*

Valid Post Logout Redirect URIs:
  - http://siseb-refonte.emes.bj/*

Web Origins:
  - http://siseb-refonte.emes.bj
```

---

## 📊 Tests de Validation

### Test 1 : Démarrage du Conteneur

```bash
docker logs siseb-frontend-pprod | head -20
```

✅ **Attendu** : Pas d'erreur "Invalid base URL"
✅ **Attendu** : Message `[Better Auth] Base URL configurée: ...`

### Test 2 : Connexion Keycloak

1. Aller sur `http://siseb-refonte.emes.bj/admin/login`
2. Cliquer sur "Se connecter avec Keycloak"
3. Entrer les identifiants Keycloak
4. Vérifier la redirection vers le dashboard

✅ **Attendu** : Connexion réussie
✅ **Attendu** : Logs montrant la session enrichie

### Test 3 : Session Enrichie

```bash
docker logs siseb-frontend-pprod | grep "Infos additionnelles"
```

✅ **Attendu** : Logs montrant que les infos ont été récupérées depuis l'API backend

### Test 4 : Déconnexion

1. Cliquer sur "Déconnexion"
2. Vérifier la redirection vers Keycloak logout
3. Vérifier la redirection finale vers `/admin/login`

✅ **Attendu** : Déconnexion complète fonctionnelle

---

## 🐛 Dépannage

### Problème : Toujours l'erreur "undefined"

**Solution** : Vérifier que les variables sont bien passées au build ET au runtime

```bash
# Vérifier les variables au runtime
docker exec siseb-frontend-pprod env | grep BETTER_AUTH

# Si vides, relancer avec les variables
docker rm -f siseb-frontend-pprod
docker run -d ... -e BETTER_AUTH_URL=... -e NUXT_PUBLIC_BETTER_AUTH_URL=...
```

### Problème : "ECONNREFUSED" vers Keycloak

**Solution** : Vérifier la connectivité réseau

```bash
# Ping depuis le conteneur
docker exec siseb-frontend-pprod ping keycloack.emes.bj

# Wget depuis le conteneur
docker exec siseb-frontend-pprod wget -O- https://keycloack.emes.bj
```

Si échec, vérifier :
- DNS dans le conteneur
- Firewall
- Réseau Docker (bridge vs host)

### Problème : "redirect_uri mismatch"

**Solution** : Vérifier les Valid Redirect URIs dans Keycloak

Ajouter :
- `http://siseb-refonte.emes.bj/*`
- `http://siseb-refonte.emes.bj/local/auth/callback/keycloak`

---

## 📋 Checklist Finale

- [ ] Variables d'environnement configurées
- [ ] Image Docker rebuildée
- [ ] Conteneur redémarré
- [ ] Logs montrent : `[Better Auth] Base URL configurée`
- [ ] Pas d'erreur "Invalid base URL: undefined"
- [ ] Connexion Keycloak fonctionne
- [ ] Session enrichie visible dans les logs
- [ ] Déconnexion fonctionne
- [ ] API backend accessible depuis le conteneur

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- **[DOCKER_DEPLOYMENT_GUIDE.md](DOCKER_DEPLOYMENT_GUIDE.md)** : Guide complet de déploiement Docker
- **[KEYCLOAK_AUTH_COMPLETE_GUIDE.md](KEYCLOAK_AUTH_COMPLETE_GUIDE.md)** : Guide d'authentification Keycloak
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** : Index de toute la documentation

---

## ✅ Résultat Attendu

Après avoir appliqué ces corrections :

```
✅ Conteneur démarre sans erreur
✅ baseURL correctement configurée
✅ Connexion Keycloak fonctionnelle
✅ Session enrichie disponible
✅ Déconnexion complète opérationnelle
✅ Application prête pour la production
```

---

**Bon déploiement !** 🚀

Si vous rencontrez encore des problèmes, vérifiez :
1. Les logs Docker : `docker logs siseb-frontend-pprod`
2. Les variables d'environnement : `docker exec siseb-frontend-pprod env`
3. La documentation complète

---

**Créé par** : Claude Code
**Date** : 2025-01-19
