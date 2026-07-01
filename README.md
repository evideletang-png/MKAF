# Outil coût café torréfacteur

Prototype interne Max Cafés pour piloter les grains, les fournisseurs, les assemblages, les stocks et la production d'un métier d'assembleur / transformateur.

## Fonctionnalités de la V0

- Catalogue de grains et fournisseurs de démonstration.
- Création de pays producteurs, fournisseurs, grains, assemblages, stocks et lignes d'activité N-1 depuis l'interface.
- Référentiel élargi de 57 origines café, avec région automatique et ajout depuis une liste contrôlée.
- Fiches grains enrichies : origine, région, variété, récolte, container, arrivée, altitude, score SCA, humidité, densité, calibre, coût rendu entrepôt, emplacement et notes qualité.
- Fiches fournisseurs enrichies : délai moyen, fiabilité, Incoterms, conditions de paiement et certifications.
- Saisie de tarifs datés par grain et fournisseur.
- Calcul du coût d'un assemblage à une date donnée.
- Comparaison du coût entre deux dates.
- Estimation de commandes par rapport à l'activité N-1 jour par jour.
- Facteurs de prévision : croissance, saisonnalité, événements, météo, promos et stock de sécurité.
- Conversion de la demande prévue en besoin de grains café par origine.
- Stocks intelligents : consommation moyenne, autonomie, commande en cours, ETA, risque de rupture et valeur immobilisée.
- Alertes sur prix manquant, coût trop élevé, tarif bientôt expiré, autonomie courte, humidité élevée, score SCA faible et fiabilité fournisseur basse.
- Création de batchs de production avec coût figé, machine, opérateur, perte réelle et notes de courbe.
- Sauvegarde PostgreSQL sur Railway via `DATABASE_URL`.
- Sauvegarde locale dans le navigateur en mode secours si aucune base n'est configurée.

## Lancer en local

```bash
npm start
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
6. Vérifier que la commande de démarrage est `npm start`.
7. Générer un domaine public ou privé selon le besoin.

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
- `GET /api/state` : charge l'état sauvegardé.
- `POST /api/state` : sauvegarde l'état courant.

Routes de l'interface :

- `/` : tableau de bord.
- `/tarifs` : tarifs datés.
- `/calculateur` : calculateur de coût.
- `/previsions` : prévisions.
- `/production` : production.
- `/donnees` : données et référentiels.

## Limite importante

Cette version persiste les données dans PostgreSQL, mais sans authentification. Il faut donc garder le déploiement privé tant que l'accès utilisateur n'est pas ajouté.

La prochaine version devra ajouter :

- une authentification ;
- des imports/exports CSV ;
- un schéma relationnel complet si l'outil sort du périmètre prototype ;
- des écrans d'édition/suppression plus complets pour corriger les référentiels après saisie.
