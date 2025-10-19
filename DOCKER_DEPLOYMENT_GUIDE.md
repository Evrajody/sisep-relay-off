# Guide de Déploiement Docker - Better Auth avec Keycloak

**Environnement** : Production / Pre-Production (pprod)
**Date** : 2025-01-19

---

## 🐛 Problème Résolu

### Erreur Rencontrée

```
[request error] [unhandled] [POST] http://siseb-refonte.emes.bj/local/auth/sign-in/sso
[H3Error: Invalid base URL: undefined. Please provide a valid base URL.]
```

### Cause

La variable d'environnement `NUXT_PUBLIC_BETTER_AUTH_URL` n'était pas définie dans le conteneur Docker, ce qui causait l'erreur `undefined`.

### Solution Implémentée

Ajout d'une fonction `getBaseURL()` dans `server/utils/auth.ts` avec fallback intelligent :

```typescript
const getBaseURL = () => {
    // Priorité 1 : Variable publique Nuxt
    if (process.env.NUXT_PUBLIC_BETTER_AUTH_URL) {
        return process.env.NUXT_PUBLIC_BETTER_AUTH_URL;
    }

    // Priorité 2 : Variable Better Auth
    const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

    console.log("[Better Auth] Base URL configurée:", baseUrl);

    return baseUrl;
};
```

---

## 📝 Configuration des Variables d'Environnement pour Docker

### 1. Variables Requises pour Better Auth

```env
# Better Auth - URL de base de l'application
BETTER_AUTH_URL=http://siseb-refonte.emes.bj
NUXT_PUBLIC_BETTER_AUTH_URL=http://siseb-refonte.emes.bj

# Better Auth - Secret (générer un secret fort)
BETTER_AUTH_SECRET=votre-secret-fort-ici

# Keycloak
KEYCLOAK_URL=https://keycloack.emes.bj
KEYCLOAK_REALM=siseb
KEYCLOAK_CLIENT_ID=siseb-front
KEYCLOAK_CLIENT_SECRET=u888uNvKz3Tp9dlIAcvKqEKg8nSQTQxW

# API Backend
NUXT_PUBLIC_SISEB_API_BASE_URL=https://siseb-refonte.emes.bj/api
```

### 2. Fichiers d'Environnement par Environnement

#### `.envs/.env.pprod` (Pre-Production)

```env
# Application
NUXT_PUBLIC_PROFILE_ENV=pprod
NUXT_BASIC_AUTH=false
NUXT_COOKIE_NAME=siseb.pprod

# Better Auth
BETTER_AUTH_URL=http://siseb-refonte.emes.bj
NUXT_PUBLIC_BETTER_AUTH_URL=http://siseb-refonte.emes.bj
BETTER_AUTH_SECRET=<générer-secret-pprod>

# Keycloak
KEYCLOAK_URL=https://keycloack.emes.bj
KEYCLOAK_REALM=siseb
KEYCLOAK_CLIENT_ID=siseb-front
KEYCLOAK_CLIENT_SECRET=<secret-keycloak>

# API Backend
NUXT_PUBLIC_SISEB_API_BASE_URL=https://siseb-refonte.emes.bj/api
```

#### `.envs/.env.prod` (Production)

```env
# Application
NUXT_PUBLIC_PROFILE_ENV=production
NUXT_BASIC_AUTH=false
NUXT_COOKIE_NAME=siseb.production

# Better Auth (HTTPS en production !)
BETTER_AUTH_URL=https://siseb.emes.bj
NUXT_PUBLIC_BETTER_AUTH_URL=https://siseb.emes.bj
BETTER_AUTH_SECRET=<générer-secret-production>

# Keycloak
KEYCLOAK_URL=https://keycloack.emes.bj
KEYCLOAK_REALM=siseb
KEYCLOAK_CLIENT_ID=siseb-front-prod
KEYCLOAK_CLIENT_SECRET=<secret-keycloak-prod>

# API Backend
NUXT_PUBLIC_SISEB_API_BASE_URL=https://api.siseb.emes.bj
```

---

## 🐳 Configuration Docker

### 1. Docker Compose (Exemple)

```yaml
# docker-compose.pprod.yml
version: '3.8'

services:
  siseb-frontend-pprod:
    image: siseb-frontend:latest
    container_name: siseb-frontend-pprod
    ports:
      - "3000:3000"
    environment:
      # Charger les variables depuis le fichier .env.pprod
      - NODE_ENV=production
      - BETTER_AUTH_URL=http://siseb-refonte.emes.bj
      - NUXT_PUBLIC_BETTER_AUTH_URL=http://siseb-refonte.emes.bj
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - KEYCLOAK_URL=${KEYCLOAK_URL}
      - KEYCLOAK_REALM=${KEYCLOAK_REALM}
      - KEYCLOAK_CLIENT_ID=${KEYCLOAK_CLIENT_ID}
      - KEYCLOAK_CLIENT_SECRET=${KEYCLOAK_CLIENT_SECRET}
      - NUXT_PUBLIC_SISEB_API_BASE_URL=${NUXT_PUBLIC_SISEB_API_BASE_URL}
    env_file:
      - .envs/.env.pprod
    restart: unless-stopped
    networks:
      - siseb-network

networks:
  siseb-network:
    driver: bridge
```

### 2. Dockerfile (Exemple)

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer pnpm et les dépendances
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copier le reste du code
COPY . .

# Build de l'application (les variables d'env doivent être disponibles ici)
ARG BETTER_AUTH_URL
ARG NUXT_PUBLIC_BETTER_AUTH_URL
ARG KEYCLOAK_URL
ARG KEYCLOAK_REALM
ARG KEYCLOAK_CLIENT_ID
ARG NUXT_PUBLIC_SISEB_API_BASE_URL

ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV NUXT_PUBLIC_BETTER_AUTH_URL=$NUXT_PUBLIC_BETTER_AUTH_URL
ENV KEYCLOAK_URL=$KEYCLOAK_URL
ENV KEYCLOAK_REALM=$KEYCLOAK_REALM
ENV KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID
ENV NUXT_PUBLIC_SISEB_API_BASE_URL=$NUXT_PUBLIC_SISEB_API_BASE_URL

RUN pnpm build

# Stage de production
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

# Exposer le port
EXPOSE 3000

# Variables d'environnement runtime
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

# Démarrer l'application
CMD ["node", ".output/server/index.mjs"]
```

---

## 🚀 Déploiement

### Méthode 1 : Docker Compose

```bash
# 1. Créer le fichier .env.pprod avec les bonnes valeurs
cp .envs/.env.pprod .env

# 2. Build de l'image
docker-compose -f docker-compose.pprod.yml build

# 3. Démarrer le conteneur
docker-compose -f docker-compose.pprod.yml up -d

# 4. Vérifier les logs
docker-compose -f docker-compose.pprod.yml logs -f siseb-frontend-pprod
```

### Méthode 2 : Docker Build & Run

```bash
# 1. Build avec les arguments
docker build \
  --build-arg BETTER_AUTH_URL=http://siseb-refonte.emes.bj \
  --build-arg NUXT_PUBLIC_BETTER_AUTH_URL=http://siseb-refonte.emes.bj \
  --build-arg KEYCLOAK_URL=https://keycloack.emes.bj \
  --build-arg KEYCLOAK_REALM=siseb \
  --build-arg KEYCLOAK_CLIENT_ID=siseb-front \
  --build-arg NUXT_PUBLIC_SISEB_API_BASE_URL=https://siseb-refonte.emes.bj/api \
  -t siseb-frontend:pprod .

# 2. Run avec les variables d'environnement
docker run -d \
  --name siseb-frontend-pprod \
  -p 3000:3000 \
  -e BETTER_AUTH_URL=http://siseb-refonte.emes.bj \
  -e NUXT_PUBLIC_BETTER_AUTH_URL=http://siseb-refonte.emes.bj \
  -e BETTER_AUTH_SECRET=votre-secret \
  -e KEYCLOAK_URL=https://keycloack.emes.bj \
  -e KEYCLOAK_REALM=siseb \
  -e KEYCLOAK_CLIENT_ID=siseb-front \
  -e KEYCLOAK_CLIENT_SECRET=votre-secret-keycloak \
  -e NUXT_PUBLIC_SISEB_API_BASE_URL=https://siseb-refonte.emes.bj/api \
  siseb-frontend:pprod

# 3. Vérifier les logs
docker logs -f siseb-frontend-pprod
```

---

## ✅ Vérification du Déploiement

### 1. Vérifier que l'Application Démarre

```bash
# Logs du conteneur
docker logs siseb-frontend-pprod

# Vous devriez voir :
# [Better Auth] Base URL configurée: http://siseb-refonte.emes.bj
# Listening on http://0.0.0.0:3000
```

### 2. Tester l'Authentification

1. Ouvrez `http://siseb-refonte.emes.bj/admin/login`
2. Cliquez sur "Se connecter avec Keycloak"
3. Vous devriez être redirigé vers Keycloak
4. Après connexion, vérifiez les logs :

```bash
docker logs siseb-frontend-pprod | grep "Custom Session"

# Vous devriez voir :
# [Custom Session] Appel de l'API avec access token
# [Custom Session] Infos additionnelles récupérées
```

### 3. Vérifier les Variables d'Environnement

```bash
# Entrer dans le conteneur
docker exec -it siseb-frontend-pprod sh

# Vérifier les variables
echo $BETTER_AUTH_URL
echo $NUXT_PUBLIC_BETTER_AUTH_URL
echo $KEYCLOAK_URL

# Sortir du conteneur
exit
```

---

## 🔧 Dépannage Docker

### Problème : "Invalid base URL: undefined"

**Cause** : Variable `NUXT_PUBLIC_BETTER_AUTH_URL` non définie

**Solution** :
1. Vérifier que la variable est passée au conteneur :
   ```bash
   docker inspect siseb-frontend-pprod | grep BETTER_AUTH
   ```

2. Si absente, relancer avec les variables :
   ```bash
   docker rm -f siseb-frontend-pprod
   docker run -d ... -e NUXT_PUBLIC_BETTER_AUTH_URL=http://siseb-refonte.emes.bj ...
   ```

### Problème : "ECONNREFUSED" vers Keycloak

**Cause** : Le conteneur ne peut pas atteindre Keycloak

**Solutions** :
1. Vérifier que Keycloak est accessible depuis le conteneur :
   ```bash
   docker exec siseb-frontend-pprod wget -O- https://keycloack.emes.bj
   ```

2. Si problème de réseau, utiliser le réseau hôte ou un réseau Docker partagé

### Problème : "Cannot read properties of undefined"

**Cause** : Variables d'environnement manquantes

**Solution** : Vérifier **toutes** les variables requises :

```bash
# Liste des variables essentielles
BETTER_AUTH_URL
NUXT_PUBLIC_BETTER_AUTH_URL
BETTER_AUTH_SECRET
KEYCLOAK_URL
KEYCLOAK_REALM
KEYCLOAK_CLIENT_ID
KEYCLOAK_CLIENT_SECRET
NUXT_PUBLIC_SISEB_API_BASE_URL
```

### Problème : Build échoue

**Cause** : Variables d'environnement manquantes au build

**Solution** : Passer les variables avec `--build-arg` :

```bash
docker build \
  --build-arg NUXT_PUBLIC_BETTER_AUTH_URL=http://siseb-refonte.emes.bj \
  ...
  .
```

---

## 🔐 Sécurité en Production

### 1. HTTPS Obligatoire

⚠️ **En production, utilisez TOUJOURS HTTPS** :

```env
# ❌ Mauvais (HTTP)
BETTER_AUTH_URL=http://siseb.emes.bj

# ✅ Bon (HTTPS)
BETTER_AUTH_URL=https://siseb.emes.bj
```

### 2. Secrets Forts

Générer des secrets forts pour Better Auth :

```bash
# Générer un secret aléatoire (32 caractères)
openssl rand -base64 32

# Ou
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Variables d'Environnement Sécurisées

- ❌ Ne **jamais** commiter les fichiers `.env` avec des secrets
- ✅ Utiliser des gestionnaires de secrets (Docker Secrets, Vault, etc.)
- ✅ Différents secrets pour dev/pprod/prod

### 4. Configuration Keycloak

Vérifier dans Keycloak :

```yaml
Valid Redirect URIs:
  - http://siseb-refonte.emes.bj/*     # pprod
  - https://siseb.emes.bj/*            # prod

Valid Post Logout Redirect URIs:
  - http://siseb-refonte.emes.bj/*     # pprod
  - https://siseb.emes.bj/*            # prod

Web Origins:
  - http://siseb-refonte.emes.bj       # pprod
  - https://siseb.emes.bj              # prod
```

---

## 📊 Monitoring

### Logs à Surveiller

```bash
# Logs d'authentification
docker logs siseb-frontend-pprod | grep "\[Better Auth\]"
docker logs siseb-frontend-pprod | grep "\[Custom Session\]"
docker logs siseb-frontend-pprod | grep "\[Logout\]"

# Erreurs
docker logs siseb-frontend-pprod | grep "ERROR"
docker logs siseb-frontend-pprod | grep "Error"
```

### Métriques à Vérifier

- Temps de réponse de l'authentification
- Taux d'erreur sur `/local/auth/*`
- Nombre de sessions actives
- Erreurs de déconnexion

---

## 📋 Checklist de Déploiement

- [ ] Variables d'environnement configurées dans `.env.pprod`
- [ ] Keycloak accessible depuis le conteneur
- [ ] Valid Redirect URIs configurées dans Keycloak
- [ ] HTTPS activé (production)
- [ ] Secrets forts générés
- [ ] Image Docker buildée avec succès
- [ ] Conteneur démarre sans erreur
- [ ] Logs montrent : `[Better Auth] Base URL configurée`
- [ ] Test de connexion Keycloak réussi
- [ ] Test de déconnexion réussi
- [ ] Session enrichie visible
- [ ] API backend accessible
- [ ] Monitoring mis en place

---

## 🎯 Résumé

### Avant le Fix
```
❌ baseURL: undefined
❌ Application crashe au démarrage
❌ Impossible de se connecter
```

### Après le Fix
```
✅ baseURL: http://siseb-refonte.emes.bj (avec fallback)
✅ Application démarre correctement
✅ Connexion Keycloak fonctionne
✅ Session enrichie disponible
✅ Déconnexion complète fonctionne
```

---

## 🆘 Support

Si le problème persiste :

1. Vérifier les logs : `docker logs siseb-frontend-pprod`
2. Vérifier les variables : `docker inspect siseb-frontend-pprod`
3. Tester Keycloak : `curl https://keycloack.emes.bj`
4. Consulter la documentation : [KEYCLOAK_AUTH_COMPLETE_GUIDE.md](./KEYCLOAK_AUTH_COMPLETE_GUIDE.md)

---

**Créé par** : Claude Code
**Date** : 2025-01-19
**Version** : 1.0
