# Outil coût café torréfacteur

Prototype interne Max Cafés pour suivre les tarifs datés des grains, calculer le coût des assemblages, prévoir les commandes et figer le coût des batchs de production.

## Fonctionnalités de la V0

- Catalogue de grains et fournisseurs de démonstration.
- Saisie de tarifs datés par grain et fournisseur.
- Calcul du coût d'un assemblage à une date donnée.
- Comparaison du coût entre deux dates.
- Estimation de commandes par rapport à l'activité N-1 jour par jour.
- Facteurs de prévision : croissance, saisonnalité, événements, météo, promos et stock de sécurité.
- Conversion de la demande prévue en besoin de café vert par grain.
- Alertes simples sur prix manquant, coût trop élevé et tarif bientôt expiré.
- Création de batchs de production avec coût figé.
- Sauvegarde locale dans le navigateur pour le prototype.

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
- écoute sur `process.env.PORT`.

Étapes conseillées :

1. Pousser ce dossier sur un dépôt GitHub privé.
2. Créer un projet Railway depuis ce dépôt GitHub.
3. Laisser Railway détecter l'application Node.js.
4. Vérifier que la commande de démarrage est `npm start`.
5. Générer un domaine public ou privé selon le besoin.

## Limite importante de cette V0

Les données sont stockées dans le `localStorage` du navigateur. C'est suffisant pour valider les calculs et les écrans, mais pas pour un usage multi-poste ou une production durable.

La prochaine version devra ajouter :

- une base PostgreSQL Railway ;
- une authentification ;
- des imports/exports CSV ;
- une vraie API serveur ;
- une sauvegarde des prix, assemblages, activité N-1, prévisions et batchs en base.
