# 🌍 SISEB Bénin - La Boussole des Données Environnementales

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nuxt.js](https://img.shields.io/badge/Nuxt.js-00C58E?style=flat&logo=nuxt.js&logoColor=white)](https://nuxt.com/)

Le Système d'Information sur le Suivi de l'Environnement au Bénin (SISEB) est une plateforme innovante dédiée à la collecte, la gestion et la diffusion des données statistiques sur l'état de l'environnement au Bénin. Notre objectif est de fournir des informations fiables et actualisées pour soutenir la prise de décision en matière de politique environnementale.

## ✨ Fonctionnalités

- 📊 Tableaux de bord interactifs pour la visualisation des données environnementales
- 🌱 Suivi des indicateurs clés de l'environnement
- 📱 Interface responsive et conviviale
- 🔄 Mises à jour régulières des données
- 🔐 Gestion des utilisateurs et des autorisations

## 🚀 Technologies utilisées

- **Framework Frontend**: Nuxt.js 3
- **Langage**: TypeScript
- **Styling**: TailwindCSS
- **Base de données**: PostgreSQL
- **Cartographie**: Mapbox/Leaflet
- **Visualisation**: Chart.js/D3.js
- **Authentification**: Auth.js

## 🛠️ Prérequis

- Node.js 18+ (LTS recommandé)
- npm, pnpm, yarn ou bun
- PostgreSQL 12+
- Git

## 🚀 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-utilisateur/sisep-benin.git
   cd sisep-benin
   ```

2. **Installer les dépendances**
   Utilisez votre gestionnaire de paquets préféré :
   ```bash
   # Avec npm
   npm install

   # Avec pnpm
   pnpm install

   # Avec yarn
   yarn install

   # Avec bun
   bun install
   ```

3. **Configurer les variables d'environnement**
   Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example`
   ```bash
   cp .env.example .env
   ```
   Puis configurez les variables nécessaires dans le fichier `.env`

## 🖥️ Démarrage en mode développement

Lancez le serveur de développement sur `http://localhost:3000` :

```bash
# Avec npm
npm run dev

# Avec pnpm
pnpm dev

# Avec yarn
yarn dev

# Avec bun
bun run dev
```

Le site sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## 🏗️ Construction pour la production

Construisez l'application pour la production :

```bash
# Avec npm
npm run build

# Avec pnpm
pnpm build

# Avec yarn
yarn build

# Avec bun
bun run build
```

### 📦 Prévisualisation en local

Pour prévisualiser la version de production localement :

```bash
# Avec npm
npm run preview

# Avec pnpm
pnpm preview

# Avec yarn
yarn preview

# Avec bun
bun run preview
```

## 🚀 Déploiement

Consultez la [documentation de déploiement Nuxt](https://nuxt.com/docs/getting-started/deployment) pour plus d'informations sur le déploiement sur différentes plateformes.

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Ajouter une fonctionnalité incroyable'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- Équipe du Ministère du Cadre de vie et du développement durable du Bénin
- Tous les contributeurs qui ont aidé à améliorer ce projet

## 📞 Contact

Pour toute question ou suggestion, veuillez ouvrir une issue sur GitHub ou nous contacter à [evrajodygildas@gmail.com](mailto:evrajodygildas@gmail.com)
