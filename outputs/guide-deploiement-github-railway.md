# Guide deploiement GitHub + Railway

## Etat actuel

Le depot local est initialise sur la branche `main`.

Commits existants :

- `4119795` - Initial coffee cost prototype
- `d296f51` - Add deployment guide

Le push GitHub n'a pas encore ete fait car le jeton GitHub CLI local est invalide.

Railway CLI est installe, mais pas authentifie.

## 1. Re-authentifier GitHub CLI

```bash
gh auth login -h github.com
```

Puis verifier :

```bash
gh auth status
```

## 2. Creer le depot GitHub prive et pousser

Depuis le dossier du projet :

```bash
gh repo create outil-cout-cafe-torrefacteur --private --source=. --remote=origin --push
```

Cette commande cree un depot prive, ajoute le remote `origin` et pousse la branche `main`.

Si le depot GitHub existe deja :

```bash
git remote add origin git@github.com:VOTRE_COMPTE/outil-cout-cafe-torrefacteur.git
git push -u origin main
```

## 3. Connecter Railway

Dans Railway :

1. Creer un nouveau projet.
2. Choisir un deploiement depuis GitHub.
3. Selectionner le depot `outil-cout-cafe-torrefacteur`.
4. Laisser Railway detecter l'application Node.js.
5. Verifier que la commande de demarrage est :

```bash
npm start
```

6. Deployer.
7. Generer un domaine depuis les parametres du service.

## 4. Variables

Aucune variable obligatoire pour la V0.

Railway fournit automatiquement `PORT`, utilise par le serveur :

```js
process.env.PORT || 3000
```

Pour tester localement si besoin :

```bash
HOST=127.0.0.1 npm start
```

Sur Railway, ne pas definir `HOST` sauf besoin particulier.

## 5. Verification apres deploiement

Verifier :

- le tableau de bord ;
- le calculateur sur `Espresso Maison` au `2026-02-15` ;
- l'ajout d'un tarif ;
- la creation d'un batch ;
- l'export JSON.

## 6. Prochaine evolution technique

La V0 stocke les donnees dans le navigateur.

Avant usage reel, ajouter :

- PostgreSQL Railway ;
- authentification ;
- API serveur ;
- imports/exports CSV ;
- sauvegarde des tarifs, assemblages et batchs en base.

