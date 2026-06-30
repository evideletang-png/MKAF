# Cahier des charges MVP - Outil de coût café pour torréfacteur

Version: 0.1  
Date: 30 juin 2026  
Usage: outil interne pour un torréfacteur

## 1. Contexte

Le torréfacteur dispose déjà d'un logiciel de gestion, mais celui-ci ne permet pas de suivre finement le coût réel des cafés en fonction :

- de l'origine du grain ;
- du fournisseur ;
- du prix négocié sur une période donnée ;
- de la composition des assemblages ;
- de l'evolution des tarifs dans le temps.

L'information tarifaire n'est pas publique. Elle doit donc être saisie manuellement par le torréfacteur, au jour le jour, au mois, au trimestre ou selon les conditions négociées avec ses fournisseurs.

Le nouvel outil n'a pas vocation à remplacer le logiciel de gestion existant. Il doit agir comme une surcouche métier dédiée au calcul de coût, à la simulation et aux alertes.

## 2. Objectif du MVP

Le MVP doit permettre au torréfacteur de répondre rapidement à quatre questions :

1. Quel est le coût actuel d'un grain donné ?
2. Quel est le coût actuel d'un assemblage composé de plusieurs grains ?
3. Comment ce coût évolue-t-il entre deux dates ou deux périodes ?
4. À partir de quel moment un prix, un coût ou une marge devient-il problématique ?

## 3. Principes directeurs

- L'outil doit être simple à maintenir au quotidien.
- La saisie des prix doit être rapide.
- Chaque prix doit être daté et historisé.
- Le coût d'un batch de production doit être figé au moment de la production.
- Les calculs doivent être transparents et exportables.
- L'utilisateur doit pouvoir travailler même sans connexion à une API de marché.

## 4. Périmètre du MVP

### Inclus en version 1

- Catalogue des grains.
- Gestion des pays d'origine.
- Gestion des fournisseurs.
- Saisie des tarifs négociés par période.
- Création d'assemblages.
- Calcul du coût d'un assemblage à une date donnée.
- Comparaison de coût entre deux dates.
- Prise en compte d'une perte de torréfaction.
- Prise en compte optionnelle de frais fixes ou variables.
- Création de batchs de production avec coût historique figé.
- Alertes simples sur prix, coût d'assemblage et marge.
- Import et export Excel ou CSV.

### Exclu en version 1

- Facturation.
- CRM.
- Comptabilité.
- Gestion commerciale complète.
- Connexion automatique aux marchés à terme.
- Gestion multi-sites.
- Application mobile native.
- Synchronisation complexe avec le logiciel existant.

## 5. Utilisateur cible

Utilisateur principal : le torréfacteur ou la personne responsable des achats et de la production.

Besoins principaux :

- saisir ou mettre à jour les prix négociés ;
- consulter les coûts des assemblages ;
- simuler l'impact d'une hausse de prix ;
- préparer une production ;
- savoir si un produit reste rentable ;
- exporter les calculs pour vérification ou partage.

## 6. Objets métier

### Pays

Champs principaux :

- nom du pays ;
- zone géographique optionnelle ;
- actif / inactif.

### Fournisseur

Champs principaux :

- nom ;
- contact optionnel ;
- devise par défaut ;
- notes.

### Grain

Champs principaux :

- nom commercial ;
- pays d'origine ;
- fournisseur principal ;
- type : arabica, robusta ou autre ;
- variété optionnelle ;
- process optionnel : lave, naturel, honey, autre ;
- unité de prix : kg par défaut ;
- actif / inactif ;
- notes.

### Tarif grain

Le tarif grain est l'objet central du système.

Champs principaux :

- grain ;
- fournisseur ;
- prix par kg ;
- devise ;
- date de début de validité ;
- date de fin de validité optionnelle ;
- type de tarif : contrat, spot, estimation, marche, autre ;
- commentaire ;
- date de saisie ;
- utilisateur ayant saisi le tarif.

Règles :

- un grain peut avoir plusieurs tarifs dans le temps ;
- deux tarifs du même grain et du même fournisseur ne devraient pas se chevaucher sur la même période ;
- si plusieurs tarifs sont possibles à une date donnée, l'outil doit le signaler à l'utilisateur.

### Assemblage

Champs principaux :

- nom ;
- description ;
- perte de torréfaction estimée en pourcentage ;
- frais d'emballage par kg optionnels ;
- frais d'énergie par kg optionnels ;
- frais logistiques par kg optionnels ;
- prix de vente cible optionnel ;
- seuil de coût maximum optionnel ;
- actif / inactif.

### Composition d'assemblage

Champs principaux :

- assemblage ;
- grain ;
- pourcentage ;
- fournisseur impose optionnel ;
- commentaire.

Règles :

- la somme des pourcentages doit être égale à 100 % ;
- un assemblage doit contenir au moins un grain ;
- le calcul doit indiquer clairement si un prix manque pour un grain à la date choisie.

### Batch de production

Champs principaux :

- date de production ;
- assemblage ;
- quantité produite ;
- quantité de café vert consommée ;
- perte réelle en pourcentage ;
- coût matière calculé au moment de la production ;
- coût total calculé au moment de la production ;
- notes.

Règles :

- le coût d'un batch est figé à la création ;
- une modification ultérieure des tarifs ne modifie pas les batchs historiques ;
- si nécessaire, l'utilisateur peut recalculer un batch manuellement avec une action explicite.

### Alerte

Types d'alertes MVP :

- prix d'un grain supérieur à un seuil ;
- coût d'un assemblage supérieur à un seuil ;
- marge inférieure à un seuil ;
- tarif arrivant bientôt à expiration ;
- prix manquant pour une période.

## 7. Règles de calcul

### Coût d'un grain à une date donnée

Pour un grain et une date, l'outil cherche le tarif dont :

- date de début <= date choisie ;
- date de fin vide ou date de fin >= date choisie.

Si aucun tarif n'est trouvé, le coût est marqué comme indisponible.

### Coût matière d'un assemblage

Pour chaque grain de l'assemblage :

```
cout_ligne = prix_grain_a_la_date * pourcentage_du_grain
```

Puis :

```
cout_matiere_kg_vert = somme_des_couts_lignes
```

Exemple :

- Brésil : 50 % a 5,80 EUR/kg = 2,90 EUR
- Colombie : 30 % a 7,20 EUR/kg = 2,16 EUR
- Éthiopie : 20 % a 8,10 EUR/kg = 1,62 EUR

Coût matière café vert :

```
2,90 + 2,16 + 1,62 = 6,68 EUR/kg vert
```

### Coût après perte de torréfaction

Si la perte de torréfaction estimée est de 15 % :

```
cout_matiere_kg_torrefie = cout_matiere_kg_vert / (1 - perte)
```

Exemple :

```
6,68 / (1 - 0,15) = 7,86 EUR/kg torrefie
```

### Coût total

```
cout_total = cout_matiere_kg_torrefie + frais_emballage + frais_energie + frais_logistiques
```

### Marge

Si un prix de vente cible est renseigné :

```
marge_euros = prix_vente - cout_total
marge_pourcentage = marge_euros / prix_vente
```

## 8. Écrans MVP

### Tableau de bord

Objectif : donner une vision immédiate des points d'attention.

Contenu :

- coût actuel des principaux assemblages ;
- variation depuis la période précédente ;
- alertes actives ;
- tarifs bientôt expirés ;
- grains sans tarif valide ;
- derniers batchs de production.

### Catalogue grains

Actions :

- créer un grain ;
- modifier un grain ;
- désactiver un grain ;
- consulter l'historique des tarifs du grain ;
- filtrer par pays, fournisseur ou type.

### Tarifs négociés

Actions :

- ajouter un tarif ;
- importer une grille de prix ;
- modifier une période de validité ;
- voir les tarifs actifs à une date donnée ;
- détecter les chevauchements de période ;
- exporter l'historique.

### Assemblages

Actions :

- créer un assemblage ;
- choisir les grains ;
- définir les pourcentages ;
- renseigner la perte de torréfaction estimée ;
- renseigner les frais ;
- visualiser le coût actuel ;
- tester le coût à une autre date.

### Calculateur de coût

Actions :

- choisir un assemblage ;
- choisir une date ;
- voir le détail ligne par ligne ;
- comparer avec une autre date ;
- afficher la variation en euros et en pourcentage ;
- exporter le calcul.

### Production

Actions :

- créer un batch ;
- choisir l'assemblage ;
- saisir la quantité produite ;
- saisir la perte réelle ;
- calculer et figer le coût ;
- consulter l'historique des batchs.

### Alertes

Actions :

- définir un seuil sur un grain ;
- définir un seuil sur un assemblage ;
- définir un seuil de marge ;
- consulter les alertes actives ;
- marquer une alerte comme traitée.

## 9. Imports et exports

### Import des tarifs

Format CSV ou Excel attendu :

- grain ;
- fournisseur ;
- prix par kg ;
- devise ;
- date de début ;
- date de fin ;
- commentaire optionnel.

L'import doit vérifier :

- que le grain existe ;
- que le fournisseur existe ;
- que le prix est numérique ;
- que les dates sont valides ;
- qu'il n'y a pas de chevauchement incohérent.

### Exports utiles

- historique des tarifs ;
- coûts des assemblages ;
- comparaison de coûts ;
- batchs de production ;
- alertes.

## 10. Exigences non fonctionnelles

- Application web privée avec authentification.
- Interface simple, orientée tableau et formulaire.
- Données sauvegardées dans une base fiable.
- Export Excel ou CSV disponible sur les écrans principaux.
- Historique conservé pour audit interne.
- Calculs explicables ligne par ligne.
- Sauvegarde régulière de la base.

## 11. Stack technique recommandée

Option pragmatique :

- Frontend : Next.js ou React.
- Backend : API intégrée Next.js ou FastAPI.
- Base de données : PostgreSQL.
- Authentification : login simple.
- Import/export : CSV au départ, Excel ensuite.
- Hébergement : VPS ou plateforme cloud privée.

Pour un outil interne, il faut privilégier la robustesse, la lisibilité des données et la facilité de maintenance.

## 12. Priorités de développement

### Lot 1 - Fondation

- base de données ;
- gestion des pays ;
- gestion des fournisseurs ;
- gestion des grains ;
- saisie des tarifs datés.

### Lot 2 - Calculs

- création des assemblages ;
- validation des pourcentages ;
- calcul du coût à une date ;
- comparaison entre deux dates ;
- prise en compte de la perte de torréfaction.

### Lot 3 - Production

- création de batchs ;
- figer le coût historique ;
- historique des productions ;
- export.

### Lot 4 - Alertes

- seuils prix grain ;
- seuils coût assemblage ;
- seuils marge ;
- tarifs bientôt expirés ;
- prix manquants.

### Lot 5 - Confort d'usage

- imports CSV / Excel ;
- exports ;
- filtres avancés ;
- tableau de bord.

## 13. Évolutions possibles en V2

- Synchronisation partielle avec le logiciel de gestion existant.
- Connexion à une API de taux de change.
- Connexion à une API de marché a terme.
- Gestion du stock café vert.
- Gestion du stock café torréfié.
- Simulation d'achat selon scénarios.
- Gestion des contrats fournisseurs.
- Analyse de rentabilité par produit fini.
- Rôle multi-utilisateur.

## 14. Questions à valider avec le torréfacteur

1. Combien de grains différents suit-il actuellement ?
2. Les prix sont-ils toujours au kg ?
3. Travaille-t-il uniquement en EUR ou aussi en USD ?
4. Les prix négociés sont-ils par fournisseur, par lot ou par origine ?
5. Les assemblages utilisent-ils des grains génériques ou des lots précis ?
6. La perte de torréfaction est-elle fixe par assemblage ou variable par production ?
7. A-t-il besoin de suivre le stock dans cette V1 ?
8. Quel format d'import utilise-t-il aujourd'hui : Excel, CSV ou autre ?
9. Quels sont ses 5 assemblages les plus importants ?
10. Quelle alerte serait la plus utile au quotidien : prix, marge, stock ou tarif expiré ?

## 15. Proposition de prochaine étape

La prochaine étape consiste à transformer ce cahier des charges en modèle de données détaillé, puis en maquettes d'écrans.

Ordre conseillé :

1. Valider les objets métier avec le torréfacteur.
2. Choisir les champs obligatoires et optionnels.
3. Construire un exemple de données réel avec 3 grains, 2 fournisseurs et 2 assemblages.
4. Tester les calculs sur cet exemple.
5. Prototyper les écrans principaux.
