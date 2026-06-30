# Stratégie de prédiction des commandes

Version: 0.1  
Date: 30 juin 2026

## Objectif

Ajouter une intelligence de prévision pour aider le torréfacteur à estimer :

- la demande attendue par jour ;
- la demande par assemblage ;
- le besoin en café vert par grain ;
- la quantité conseillée à commander après prise en compte du stock.

Le point de départ est l'activité N-1 au jour le jour. L'outil ne remplace pas le jugement du torréfacteur : il fournit une base chiffrée, ajustable avec des facteurs métier.

## Principe du modèle V0

Pour chaque jour à prévoir :

1. Chercher l'activité du même jour l'année précédente.
2. Calculer une correction par jour de semaine à partir de l'historique.
3. Combiner les deux bases :
   - 75 % activité N-1 du jour exact ;
   - 25 % moyenne historique du même jour de semaine.
4. Appliquer les facteurs saisis par l'utilisateur :
   - croissance vs N-1 ;
   - saison ou contexte local ;
   - événements, météo ou jours particuliers ;
   - promotions ou commandes connues ;
   - stock de sécurité.
5. Transformer la demande torréfiée en besoin de café vert selon les pertes de torréfaction.
6. Repartir le besoin par grain selon les recettes d'assemblage.
7. Soustraire le stock disponible pour obtenir une quantité conseillée à commander.

## Formule simplifiée

Base journaliere :

```text
base = activite_N_1_exacte * 0,75 + moyenne_meme_jour_semaine * 0,25
```

Facteur global :

```text
facteur =
  (1 + croissance)
  * (1 + saison)
  * (1 + evenement_meteo)
  * (1 + promos_commandes_connues)
```

Prévision torréfiée :

```text
prevision_kg_torrefie = base * facteur
```

Besoin café vert :

```text
besoin_kg_vert = prevision_kg_torrefie / (1 - perte_torrefaction)
```

Commande conseillée :

```text
commande_kg = max(0, besoin_kg_vert * (1 + stock_securite) - stock_disponible)
```

## Facteurs a enrichir en V1

Les facteurs utiles à intégrer dans une version avec base PostgreSQL :

- commandes confirmées par client ;
- calendrier des jours fériés ;
- vacances scolaires ;
- météo locale ;
- événements locaux ;
- opération commerciale ou promotion ;
- canal de vente : boutique, CHR, web, marche, B2B ;
- ruptures passees ;
- délai fournisseur ;
- minimum de commande fournisseur ;
- conditionnement par sac.

## Données à stocker

Tables à prévoir :

- `sales_activity_daily` : activité historique par date, produit ou assemblage ;
- `forecast_runs` : lancement d'une prévision avec ses paramètres ;
- `forecast_daily_lines` : resultat par jour ;
- `forecast_blend_lines` : resultat par assemblage ;
- `forecast_bean_requirements` : besoin par grain ;
- `forecast_factors` : facteurs appliques et justification.

## Pourquoi commencer par un modèle explicable

Pour un outil interne, il vaut mieux commencer avec un modèle transparent :

- le torréfacteur comprend pourquoi une quantité est proposée ;
- les erreurs sont visibles ;
- les facteurs peuvent être ajustes manuellement ;
- le modèle peut être compare à la realite ;
- les données collectées serviront plus tard à entraîner un modèle statistique plus avancé.

Une V2 pourrait ajouter un vrai modèle de machine learning, mais seulement après plusieurs mois de données propres et comparables.
