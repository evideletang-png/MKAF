# Outil coût café torréfacteur

Prototype interne Max Cafés pour piloter les grains, les fournisseurs, les assemblages, les stocks et la production d'un métier d'assembleur / transformateur.

## Fonctionnalités de la V0

- Catalogue de grains et fournisseurs de démonstration.
- Création de pays producteurs, fournisseurs, grains, assemblages, stocks et lignes d'activité N-1 depuis l'interface.
- Correction et suppression encadrée des fournisseurs, grains, assemblages et lignes d'activité N-1.
- Référentiel élargi de 57 origines café, avec région automatique et ajout depuis une liste contrôlée.
- Fiches grains enrichies : origine, région, variété, récolte, container, arrivée, altitude, score SCA, humidité, densité, calibre, coût rendu entrepôt, emplacement et notes qualité.
- Fiches fournisseurs enrichies : délai moyen, fiabilité, Incoterms, conditions de paiement et certifications.
- Saisie d'approvisionnements avec type, quantité, unité, statut, fournisseur, coût unitaire et coût total.
- Suivi séparé des approvisionnements hors grains : packaging, énergie, transport, consommables et autres achats.
- Saisie de tarifs datés par grain et fournisseur, avec suppression des lignes erronées.
- Calcul du coût d'un assemblage à une date donnée.
- Comparaison du coût entre deux dates.
- Estimation de commandes par rapport à l'activité N-1 jour par jour.
- Facteurs de prévision : croissance, saisonnalité, événements, météo, promos et stock de sécurité.
- Conversion de la demande prévue en besoin de grains café par origine.
- Imports CSV de l'activité N-1, des tarifs et des stocks, avec ajout / mise à jour ou remplacement selon le module.
- Exports CSV : grains, fournisseurs, tarifs, stocks, activité N-1 et prévisions.
- Stocks intelligents : consommation moyenne, autonomie, commande en cours, ETA, risque de rupture, valeur immobilisée et journal de mouvements.
- Alertes sur prix manquant, coût trop élevé, tarif bientôt expiré, autonomie courte, humidité élevée, score SCA faible et fiabilité fournisseur basse.
- Création de batchs de production avec coût figé, machine, opérateur, perte réelle et notes de courbe.
- Sauvegarde PostgreSQL sur Railway via `DATABASE_URL`.
- Sauvegarde locale dans le navigateur en mode secours si aucune base n'est configurée.
- Authentification par identifiant / mot de passe, session signée et cookie HTTP-only.

## Lancer en local

```bash
AUTH_PASSWORD="un-mot-de-passe-local" npm start
```

Puis ouvrir :

```text
http://localhost:3000
```

## Déployer sur Railway

L'application est compatible Railway telle quelle :

- runtime Node.js ;
- script `npm start` ;
- écoute sur `process.env.PORT` ;
- connexion PostgreSQL optionnelle via `DATABASE_URL`.

Étapes conseillées :

1. Pousser ce dossier sur un dépôt GitHub privé.
2. Créer un projet Railway depuis ce dépôt GitHub.
3. Laisser Railway détecter l'application Node.js.
4. Ajouter un service PostgreSQL dans le même projet Railway.
5. Vérifier que le service web reçoit bien la variable `DATABASE_URL`.
6. Ajouter les variables d'authentification ci-dessous.
7. Vérifier que la commande de démarrage est `npm start`.
8. Générer un domaine public ou privé selon le besoin.

Variables Railway à configurer :

- `AUTH_USERNAME` : identifiant de connexion. Par défaut : `admin`.
- `AUTH_PASSWORD` : mot de passe en clair, simple à gérer pour une première version.
- `SESSION_SECRET` : secret long utilisé pour signer les sessions.

Pour générer un secret de session :

```bash
openssl rand -hex 48
```

Option plus robuste : remplacer `AUTH_PASSWORD` par `AUTH_PASSWORD_HASH`.

```bash
node -e 'const {randomBytes,scryptSync}=require("crypto"); const password=process.argv[1]; const salt=randomBytes(16).toString("hex"); const hash=scryptSync(password,salt,64).toString("hex"); console.log("scrypt:"+salt+":"+hash);' 'mot-de-passe'
```

Copier la sortie complète dans `AUTH_PASSWORD_HASH`, au format `scrypt:<salt>:<hash>`.

## Base de données

Au démarrage, le serveur crée automatiquement une table PostgreSQL :

```sql
CREATE TABLE IF NOT EXISTS app_state (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Pour cette V1, l'état complet de l'outil est stocké dans une colonne `JSONB`. Cela permet de tester rapidement avec de vraies données, sans figer trop tôt un modèle relationnel complet. Les tarifs, les assemblages, les prévisions, les stocks, l'activité N-1 et les batchs sont donc persistés dans Railway.

Endpoints utiles :

- `GET /api/health` : vérifie si la base est connectée.
- `GET /api/session` : vérifie l'état de connexion.
- `POST /api/login` : ouvre une session.
- `POST /api/logout` : ferme la session.
- `GET /api/state` : charge l'état sauvegardé, protégé par login.
- `POST /api/state` : sauvegarde l'état courant, protégé par login.

Routes de l'interface :

- `/login` : connexion.
- `/` : tableau de bord.
- `/tarifs` : tarifs datés.
- `/calculateur` : calculateur de coût.
- `/previsions` : prévisions.
- `/production` : production.
- `/donnees` : données et référentiels.
- `/donnees/imports` : imports et exports CSV.

La prochaine version devra ajouter :

- l'import CSV des grains et fournisseurs complets ;
- une vraie gestion multi-utilisateurs si plusieurs personnes doivent avoir leur propre compte ;
- un schéma relationnel complet si l'outil sort du périmètre prototype ;
- un journal détaillé des erreurs d'import et des modifications.
