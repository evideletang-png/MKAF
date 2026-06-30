# Outil coût café torréfacteur

Prototype interne Max Cafés pour suivre les tarifs datés des grains, calculer le coût des assemblages, prévoir les commandes et figer le coût des batchs de production.

## Fonctionnalités de la V0

- Catalogue de grains et fournisseurs de démonstration.
- Création de pays producteurs, fournisseurs, grains, assemblages, stocks et lignes d'activité N-1 depuis l'interface.
- Saisie de tarifs datés par grain et fournisseur.
- Calcul du coût d'un assemblage à une date donnée.
- Comparaison du coût entre deux dates.
- Estimation de commandes par rapport à l'activité N-1 jour par jour.
- Facteurs de prévision : croissance, saisonnalité, événements, météo, promos et stock de sécurité.
- Conversion de la demande prévue en besoin de café vert par grain.
- Alertes simples sur prix manquant, coût trop élevé et tarif bientôt expiré.
- Création de batchs de production avec coût figé.
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

## Limite importante

Cette version persiste les données dans PostgreSQL, mais sans authentification. Il faut donc garder le déploiement privé tant que l'accès utilisateur n'est pas ajouté.

La prochaine version devra ajouter :

- une authentification ;
- des imports/exports CSV ;
- un schéma relationnel complet si l'outil sort du périmètre prototype ;
- des écrans d'édition/suppression plus complets pour corriger les référentiels après saisie.
