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

## 4. Variables Railway

La V0 n'a besoin d'aucune variable obligatoire.

Railway fournit automatiquement `PORT`. Le serveur utilise :

```js
process.env.PORT || 3000
```

Pour forcer l'hote localement uniquement :

```bash
HOST=127.0.0.1 npm start
```

Sur Railway, ne pas définir `HOST` sauf besoin particulier.

## 5. Vérification après déploiement

Vérifier dans le navigateur :

- le tableau de bord s'affiche ;
- le calculateur affiche un coût pour `Espresso Maison` au `2026-02-15` ;
- l'ajout d'un tarif fonctionne ;
- la création d'un batch fige un coût ;
- l'export JSON télécharge les données.

## 6. Limite avant usage réel

Cette première version stocke les données dans le navigateur. Pour un usage réel, ajouter en priorité :

- PostgreSQL Railway ;
- authentification ;
- API serveur ;
- sauvegarde des tarifs, assemblages et batchs en base ;
- import/export CSV.
