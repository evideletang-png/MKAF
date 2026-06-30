# Strategie de prediction des commandes

Version: 0.1  
Date: 30 juin 2026

## Objectif

Ajouter une intelligence de prevision pour aider le torrefacteur a estimer :

- la demande attendue par jour ;
- la demande par assemblage ;
- le besoin en cafe vert par grain ;
- la quantite conseillee a commander apres prise en compte du stock.

Le point de depart est l'activite N-1 au jour le jour. L'outil ne remplace pas le jugement du torrefacteur : il fournit une base chiffree, ajustable avec des facteurs metier.

## Principe du modele V0

Pour chaque jour a prevoir :

1. Chercher l'activite du meme jour l'annee precedente.
2. Calculer une correction par jour de semaine a partir de l'historique.
3. Combiner les deux bases :
   - 75 % activite N-1 du jour exact ;
   - 25 % moyenne historique du meme jour de semaine.
4. Appliquer les facteurs saisis par l'utilisateur :
   - croissance vs N-1 ;
   - saison ou contexte local ;
   - evenements, meteo ou jours particuliers ;
   - promotions ou commandes connues ;
   - stock de securite.
5. Transformer la demande torrefiee en besoin de cafe vert selon les pertes de torrefaction.
6. Repartir le besoin par grain selon les recettes d'assemblage.
7. Soustraire le stock disponible pour obtenir une quantite conseillee a commander.

## Formule simplifiee

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

Prevision torrefiee :

```text
prevision_kg_torrefie = base * facteur
```

Besoin cafe vert :

```text
besoin_kg_vert = prevision_kg_torrefie / (1 - perte_torrefaction)
```

Commande conseillee :

```text
commande_kg = max(0, besoin_kg_vert * (1 + stock_securite) - stock_disponible)
```

## Facteurs a enrichir en V1

Les facteurs utiles a integrer dans une version avec base PostgreSQL :

- commandes confirmees par client ;
- calendrier des jours feries ;
- vacances scolaires ;
- meteo locale ;
- evenements locaux ;
- operation commerciale ou promotion ;
- canal de vente : boutique, CHR, web, marche, B2B ;
- ruptures passees ;
- delai fournisseur ;
- minimum de commande fournisseur ;
- conditionnement par sac.

## Donnees a stocker

Tables a prevoir :

- `sales_activity_daily` : activite historique par date, produit ou assemblage ;
- `forecast_runs` : lancement d'une prevision avec ses parametres ;
- `forecast_daily_lines` : resultat par jour ;
- `forecast_blend_lines` : resultat par assemblage ;
- `forecast_bean_requirements` : besoin par grain ;
- `forecast_factors` : facteurs appliques et justification.

## Pourquoi commencer par un modele explicable

Pour un outil interne, il vaut mieux commencer avec un modele transparent :

- le torrefacteur comprend pourquoi une quantite est proposee ;
- les erreurs sont visibles ;
- les facteurs peuvent etre ajustes manuellement ;
- le modele peut etre compare a la realite ;
- les donnees collectees serviront plus tard a entrainer un modele statistique plus avance.

Une V2 pourrait ajouter un vrai modele de machine learning, mais seulement apres plusieurs mois de donnees propres et comparables.

