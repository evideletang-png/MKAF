# Deploiement GitHub + Railway

Ce guide part du principe que le depot local est deja initialise et que le commit initial existe.

## 1. Re-authentifier GitHub CLI

Le jeton `gh` local doit etre valide avant de pouvoir creer le depot et pousser le code.

```bash
gh auth login -h github.com
```

Puis verifier :

```bash
gh auth status
```

## 2. Creer le depot GitHub prive et pousser

Commande conseillee :

```bash
gh repo create outil-cout-cafe-torrefacteur --private --source=. --remote=origin --push
```

Cette commande :

- cree un depot GitHub prive ;
- ajoute le remote `origin` ;
- pousse la branche `main`.

Si le depot existe deja :

```bash
git remote add origin git@github.com:VOTRE_COMPTE/outil-cout-cafe-torrefacteur.git
git push -u origin main
```

## 3. Connecter Railway a GitHub

Dans Railway :

1. Creer un nouveau projet.
2. Choisir un deploiement depuis GitHub.
3. Selectionner le depot `outil-cout-cafe-torrefacteur`.
4. Laisser Railway detecter l'application Node.js.
5. Verifier la commande de demarrage :

```bash
npm start
```

6. Deployer.
7. Generer un domaine depuis les parametres du service.

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

Sur Railway, ne pas definir `HOST` sauf besoin particulier.

## 5. Verification apres deploiement

Verifier dans le navigateur :

- le tableau de bord s'affiche ;
- le calculateur affiche un cout pour `Espresso Maison` au `2026-02-15` ;
- l'ajout d'un tarif fonctionne ;
- la creation d'un batch fige un cout ;
- l'export JSON telecharge les donnees.

## 6. Limite avant usage reel

Cette premiere version stocke les donnees dans le navigateur. Pour un usage reel, ajouter en priorite :

- PostgreSQL Railway ;
- authentification ;
- API serveur ;
- sauvegarde des tarifs, assemblages et batchs en base ;
- import/export CSV.

