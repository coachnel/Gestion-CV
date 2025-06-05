# Projet client-cv-ai-mirror

## Project info

**URL**: 

## How can I edit this code?

Il existe plusieurs façons d'éditer votre application.

**Utilisez votre IDE préféré**

Si vous souhaitez travailler localement avec votre propre IDE, vous pouvez cloner ce dépôt et pousser vos modifications.

La seule exigence est d'avoir Node.js & npm installés - [installer avec nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Suivez ces étapes :

```sh
# Étape 1 : Clonez le dépôt avec l'URL Git du projet.
git clone <VOTRE_URL_GIT>

# Étape 2 : Accédez au dossier du projet.
cd <NOM_DU_PROJET>

# Étape 3 : Installez les dépendances nécessaires.
npm i

# Étape 4 : Démarrez le serveur de développement avec rechargement automatique et aperçu instantané.
npm run dev
```

## Quelles technologies sont utilisées pour ce projet ?

- React
- TypeScript
- Vite
- Tailwind CSS

## Comment déployer ce projet ?

Vous pouvez déployer ce projet sur n'importe quelle plateforme supportant les applications React/Vite (Vercel, Netlify, etc.).

## Puis-je connecter un domaine personnalisé à ce projet ?

Oui, configurez votre domaine sur la plateforme d'hébergement choisie.

## Déploiement sur Vercel

Ce projet est prêt à être déployé sur Vercel.

### Étapes de déploiement

1. Poussez votre code sur un dépôt GitHub, GitLab ou Bitbucket.
2. Rendez-vous sur https://vercel.com et connectez votre dépôt.
3. Lors de l’import, Vercel détectera automatiquement Vite/React.
4. Si besoin, configurez manuellement :
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
5. Déployez ! Votre application sera accessible via une URL Vercel.

### Configuration Vercel

Un fichier `vercel.json` est inclus :

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Cela permet le support du routing côté client (SPA) et la bonne prise en charge du build Vite.

## Technologies utilisées
- React
- TypeScript
- Vite
- Tailwind CSS

## Démarrage local

```sh
npm install
npm run dev
```

## Déploiement manuel

```sh
npm run build
# Le dossier dist/ sera généré, prêt à être déployé sur n'importe quel hébergeur statique.
```

## Personnalisation du domaine

Configurez votre domaine personnalisé directement dans le dashboard Vercel.
