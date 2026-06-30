# Déploiement GitHub + Railway

Ce guide part du principe que le dépôt local est déjà initialisé et que le commit initial existe.

## 1. Re-authentifier GitHub CLI

Le jeton `gh` local doit être valide avant de pouvoir créer le dépôt et pousser le code.

```bash
gh auth login -h github.com
```

Puis vérifier :

```bash
gh auth status
```

## 2. Créer le dépôt GitHub privé et pousser

Commande conseillée :

```bash
gh repo create outil-cout-cafe-torrefacteur --private --source=. --remote=origin --push
```

Cette commande :

- crée un dépôt GitHub privé ;
- ajoute le remote `origin` ;
- pousse la branche `main`.

Si le dépôt existe déjà :

```bash
git remote add origin git@github.com:VOTRE_COMPTE/outil-cout-cafe-torrefacteur.git
git push -u origin main
```

## 3. Connecter Railway a GitHub

Dans Railway :

1. Créer un nouveau projet.
2. Choisir un déploiement depuis GitHub.
3. Sélectionner le dépôt `outil-cout-cafe-torrefacteur`.
4. Laisser Railway détecter l'application Node.js.
5. Vérifier la commande de démarrage :

```bash
npm start
```

6. Deployer.
7. Générer un domaine depuis les paramètres du service.

## 4. Ajouter PostgreSQL Railway

Dans le projet Railway :

1. Ajouter un nouveau service PostgreSQL.
2. Ouvrir le service web de l'application.
3. Vérifier dans les variables que `DATABASE_URL` est disponible.
4. Si `DATABASE_URL` n'est pas automatiquement visible par le service web, ajouter une référence vers la variable du service PostgreSQL.
5. Redéployer le service web.

Au démarrage, l'application crée automatiquement la table `app_state`. Aucune migration manuelle n'est nécessaire pour cette V1.

## 5. Variables Railway

Variables utilisées :

- `PORT` : fourni automatiquement par Railway.
- `DATABASE_URL` : fourni par PostgreSQL Railway, nécessaire pour activer la sauvegarde en base.

Le serveur utilise :

```js
process.env.PORT || 3000
```

Pour forcer l'hote localement uniquement :

```bash
HOST=127.0.0.1 npm start
```

Sur Railway, ne pas définir `HOST` sauf besoin particulier.

## 6. Vérification après déploiement

Vérifier dans le navigateur :

- le badge affiche `Base connectée`, `Base initialisée` ou `Base synchronisée` ;
- le tableau de bord s'affiche ;
- le calculateur affiche un coût pour `Espresso Maison` au `2026-02-15` ;
- l'ajout d'un tarif fonctionne ;
- la création d'un batch fige un coût ;
- l'export JSON télécharge les données.

Vérifier aussi l'endpoint technique :

```text
https://votre-domaine-railway/api/health
```

Réponse attendue avec PostgreSQL :

```json
{
  "ok": true,
  "storage": "database",
  "database": "connected"
}
```

## 7. Mode secours sans base

Si `DATABASE_URL` n'est pas configurée, l'application reste utilisable en mode navigateur. Les données sont alors stockées dans le `localStorage` du poste utilisé.

Ce mode est pratique pour développer en local, mais il ne convient pas à des tests multi-postes avec de vraies données.

## 8. Limite avant usage réel

Cette version n'a pas encore d'authentification. Pour un usage réel, ajouter en priorité :

- authentification ;
- import/export CSV ;
- gestion complète des référentiels depuis l'interface ;
- modèle relationnel détaillé pour les prix, lots, stocks et productions.
