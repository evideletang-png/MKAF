# Outil cout cafe torrefacteur

Prototype interne pour suivre les tarifs dates des grains, calculer le cout des assemblages et figer le cout des batchs de production.

## Fonctionnalites de la V0

- Catalogue de grains et fournisseurs de demonstration.
- Saisie de tarifs dates par grain et fournisseur.
- Calcul du cout d'un assemblage a une date donnee.
- Comparaison du cout entre deux dates.
- Estimation de commandes par rapport a l'activite N-1 jour par jour.
- Facteurs de prevision : croissance, saisonnalite, evenements, meteo, promos et stock de securite.
- Conversion de la demande prevue en besoin de cafe vert par grain.
- Alertes simples sur prix manquant, cout trop eleve et tarif bientot expire.
- Creation de batchs de production avec cout fige.
- Sauvegarde locale dans le navigateur pour le prototype.

## Lancer en local

```bash
npm start
```

Puis ouvrir :

```text
http://localhost:3000
```

## Deployer sur Railway

L'application est compatible Railway telle quelle :

- runtime Node.js ;
- script `npm start` ;
- ecoute sur `process.env.PORT`.

Etapes conseillees :

1. Pousser ce dossier sur un depot GitHub prive.
2. Creer un projet Railway depuis ce depot GitHub.
3. Laisser Railway detecter l'application Node.js.
4. Verifier que la commande de demarrage est `npm start`.
5. Generer un domaine public ou prive selon le besoin.

## Limite importante de cette V0

Les donnees sont stockees dans le `localStorage` du navigateur. C'est suffisant pour valider les calculs et les ecrans, mais pas pour un usage multi-poste ou une production durable.

La prochaine version devra ajouter :

- une base PostgreSQL Railway ;
- une authentification ;
- des imports/exports CSV ;
- une vraie API serveur ;
- une sauvegarde des prix, assemblages, activite N-1, previsions et batchs en base.
