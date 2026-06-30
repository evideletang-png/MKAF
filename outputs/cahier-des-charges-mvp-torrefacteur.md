# Cahier des charges MVP - Outil de cout cafe pour torrefacteur

Version: 0.1  
Date: 30 juin 2026  
Usage: outil interne pour un torrefacteur

## 1. Contexte

Le torrefacteur dispose deja d'un logiciel de gestion, mais celui-ci ne permet pas de suivre finement le cout reel des cafes en fonction :

- de l'origine du grain ;
- du fournisseur ;
- du prix negocie sur une periode donnee ;
- de la composition des assemblages ;
- de l'evolution des tarifs dans le temps.

L'information tarifaire n'est pas publique. Elle doit donc etre saisie manuellement par le torrefacteur, au jour le jour, au mois, au trimestre ou selon les conditions negociees avec ses fournisseurs.

Le nouvel outil n'a pas vocation a remplacer le logiciel de gestion existant. Il doit agir comme une surcouche metier dediee au calcul de cout, a la simulation et aux alertes.

## 2. Objectif du MVP

Le MVP doit permettre au torrefacteur de repondre rapidement a quatre questions :

1. Quel est le cout actuel d'un grain donne ?
2. Quel est le cout actuel d'un assemblage compose de plusieurs grains ?
3. Comment ce cout evolue-t-il entre deux dates ou deux periodes ?
4. A partir de quel moment un prix, un cout ou une marge devient-il problematique ?

## 3. Principes directeurs

- L'outil doit etre simple a maintenir au quotidien.
- La saisie des prix doit etre rapide.
- Chaque prix doit etre date et historise.
- Le cout d'un batch de production doit etre fige au moment de la production.
- Les calculs doivent etre transparents et exportables.
- L'utilisateur doit pouvoir travailler meme sans connexion a une API de marche.

## 4. Perimetre du MVP

### Inclus en version 1

- Catalogue des grains.
- Gestion des pays d'origine.
- Gestion des fournisseurs.
- Saisie des tarifs negocies par periode.
- Creation d'assemblages.
- Calcul du cout d'un assemblage a une date donnee.
- Comparaison de cout entre deux dates.
- Prise en compte d'une perte de torrefaction.
- Prise en compte optionnelle de frais fixes ou variables.
- Creation de batchs de production avec cout historique fige.
- Alertes simples sur prix, cout d'assemblage et marge.
- Import et export Excel ou CSV.

### Exclu en version 1

- Facturation.
- CRM.
- Comptabilite.
- Gestion commerciale complete.
- Connexion automatique aux marches a terme.
- Gestion multi-sites.
- Application mobile native.
- Synchronisation complexe avec le logiciel existant.

## 5. Utilisateur cible

Utilisateur principal : le torrefacteur ou la personne responsable des achats et de la production.

Besoins principaux :

- saisir ou mettre a jour les prix negocies ;
- consulter les couts des assemblages ;
- simuler l'impact d'une hausse de prix ;
- preparer une production ;
- savoir si un produit reste rentable ;
- exporter les calculs pour verification ou partage.

## 6. Objets metier

### Pays

Champs principaux :

- nom du pays ;
- zone geographique optionnelle ;
- actif / inactif.

### Fournisseur

Champs principaux :

- nom ;
- contact optionnel ;
- devise par defaut ;
- notes.

### Grain

Champs principaux :

- nom commercial ;
- pays d'origine ;
- fournisseur principal ;
- type : arabica, robusta ou autre ;
- variete optionnelle ;
- process optionnel : lave, naturel, honey, autre ;
- unite de prix : kg par defaut ;
- actif / inactif ;
- notes.

### Tarif grain

Le tarif grain est l'objet central du systeme.

Champs principaux :

- grain ;
- fournisseur ;
- prix par kg ;
- devise ;
- date de debut de validite ;
- date de fin de validite optionnelle ;
- type de tarif : contrat, spot, estimation, marche, autre ;
- commentaire ;
- date de saisie ;
- utilisateur ayant saisi le tarif.

Regles :

- un grain peut avoir plusieurs tarifs dans le temps ;
- deux tarifs du meme grain et du meme fournisseur ne devraient pas se chevaucher sur la meme periode ;
- si plusieurs tarifs sont possibles a une date donnee, l'outil doit le signaler a l'utilisateur.

### Assemblage

Champs principaux :

- nom ;
- description ;
- perte de torrefaction estimee en pourcentage ;
- frais d'emballage par kg optionnels ;
- frais d'energie par kg optionnels ;
- frais logistiques par kg optionnels ;
- prix de vente cible optionnel ;
- seuil de cout maximum optionnel ;
- actif / inactif.

### Composition d'assemblage

Champs principaux :

- assemblage ;
- grain ;
- pourcentage ;
- fournisseur impose optionnel ;
- commentaire.

Regles :

- la somme des pourcentages doit etre egale a 100 % ;
- un assemblage doit contenir au moins un grain ;
- le calcul doit indiquer clairement si un prix manque pour un grain a la date choisie.

### Batch de production

Champs principaux :

- date de production ;
- assemblage ;
- quantite produite ;
- quantite de cafe vert consommee ;
- perte reelle en pourcentage ;
- cout matiere calcule au moment de la production ;
- cout total calcule au moment de la production ;
- notes.

Regles :

- le cout d'un batch est fige a la creation ;
- une modification ulterieure des tarifs ne modifie pas les batchs historiques ;
- si necessaire, l'utilisateur peut recalculer un batch manuellement avec une action explicite.

### Alerte

Types d'alertes MVP :

- prix d'un grain superieur a un seuil ;
- cout d'un assemblage superieur a un seuil ;
- marge inferieure a un seuil ;
- tarif arrivant bientot a expiration ;
- prix manquant pour une periode.

## 7. Regles de calcul

### Cout d'un grain a une date donnee

Pour un grain et une date, l'outil cherche le tarif dont :

- date de debut <= date choisie ;
- date de fin vide ou date de fin >= date choisie.

Si aucun tarif n'est trouve, le cout est marque comme indisponible.

### Cout matiere d'un assemblage

Pour chaque grain de l'assemblage :

```
cout_ligne = prix_grain_a_la_date * pourcentage_du_grain
```

Puis :

```
cout_matiere_kg_vert = somme_des_couts_lignes
```

Exemple :

- Bresil : 50 % a 5,80 EUR/kg = 2,90 EUR
- Colombie : 30 % a 7,20 EUR/kg = 2,16 EUR
- Ethiopie : 20 % a 8,10 EUR/kg = 1,62 EUR

Cout matiere cafe vert :

```
2,90 + 2,16 + 1,62 = 6,68 EUR/kg vert
```

### Cout apres perte de torrefaction

Si la perte de torrefaction estimee est de 15 % :

```
cout_matiere_kg_torrefie = cout_matiere_kg_vert / (1 - perte)
```

Exemple :

```
6,68 / (1 - 0,15) = 7,86 EUR/kg torrefie
```

### Cout total

```
cout_total = cout_matiere_kg_torrefie + frais_emballage + frais_energie + frais_logistiques
```

### Marge

Si un prix de vente cible est renseigne :

```
marge_euros = prix_vente - cout_total
marge_pourcentage = marge_euros / prix_vente
```

## 8. Ecrans MVP

### Tableau de bord

Objectif : donner une vision immediate des points d'attention.

Contenu :

- cout actuel des principaux assemblages ;
- variation depuis la periode precedente ;
- alertes actives ;
- tarifs bientot expires ;
- grains sans tarif valide ;
- derniers batchs de production.

### Catalogue grains

Actions :

- creer un grain ;
- modifier un grain ;
- desactiver un grain ;
- consulter l'historique des tarifs du grain ;
- filtrer par pays, fournisseur ou type.

### Tarifs negocies

Actions :

- ajouter un tarif ;
- importer une grille de prix ;
- modifier une periode de validite ;
- voir les tarifs actifs a une date donnee ;
- detecter les chevauchements de periode ;
- exporter l'historique.

### Assemblages

Actions :

- creer un assemblage ;
- choisir les grains ;
- definir les pourcentages ;
- renseigner la perte de torrefaction estimee ;
- renseigner les frais ;
- visualiser le cout actuel ;
- tester le cout a une autre date.

### Calculateur de cout

Actions :

- choisir un assemblage ;
- choisir une date ;
- voir le detail ligne par ligne ;
- comparer avec une autre date ;
- afficher la variation en euros et en pourcentage ;
- exporter le calcul.

### Production

Actions :

- creer un batch ;
- choisir l'assemblage ;
- saisir la quantite produite ;
- saisir la perte reelle ;
- calculer et figer le cout ;
- consulter l'historique des batchs.

### Alertes

Actions :

- definir un seuil sur un grain ;
- definir un seuil sur un assemblage ;
- definir un seuil de marge ;
- consulter les alertes actives ;
- marquer une alerte comme traitee.

## 9. Imports et exports

### Import des tarifs

Format CSV ou Excel attendu :

- grain ;
- fournisseur ;
- prix par kg ;
- devise ;
- date de debut ;
- date de fin ;
- commentaire optionnel.

L'import doit verifier :

- que le grain existe ;
- que le fournisseur existe ;
- que le prix est numerique ;
- que les dates sont valides ;
- qu'il n'y a pas de chevauchement incoherent.

### Exports utiles

- historique des tarifs ;
- couts des assemblages ;
- comparaison de couts ;
- batchs de production ;
- alertes.

## 10. Exigences non fonctionnelles

- Application web privee avec authentification.
- Interface simple, orientee tableau et formulaire.
- Donnees sauvegardees dans une base fiable.
- Export Excel ou CSV disponible sur les ecrans principaux.
- Historique conserve pour audit interne.
- Calculs explicables ligne par ligne.
- Sauvegarde reguliere de la base.

## 11. Stack technique recommandee

Option pragmatique :

- Frontend : Next.js ou React.
- Backend : API integree Next.js ou FastAPI.
- Base de donnees : PostgreSQL.
- Authentification : login simple.
- Import/export : CSV au depart, Excel ensuite.
- Hebergement : VPS ou plateforme cloud privee.

Pour un outil interne, il faut privilegier la robustesse, la lisibilite des donnees et la facilite de maintenance.

## 12. Priorites de developpement

### Lot 1 - Fondation

- base de donnees ;
- gestion des pays ;
- gestion des fournisseurs ;
- gestion des grains ;
- saisie des tarifs dates.

### Lot 2 - Calculs

- creation des assemblages ;
- validation des pourcentages ;
- calcul du cout a une date ;
- comparaison entre deux dates ;
- prise en compte de la perte de torrefaction.

### Lot 3 - Production

- creation de batchs ;
- figer le cout historique ;
- historique des productions ;
- export.

### Lot 4 - Alertes

- seuils prix grain ;
- seuils cout assemblage ;
- seuils marge ;
- tarifs bientot expires ;
- prix manquants.

### Lot 5 - Confort d'usage

- imports CSV / Excel ;
- exports ;
- filtres avances ;
- tableau de bord.

## 13. Evolutions possibles en V2

- Synchronisation partielle avec le logiciel de gestion existant.
- Connexion a une API de taux de change.
- Connexion a une API de marche a terme.
- Gestion du stock cafe vert.
- Gestion du stock cafe torrefie.
- Simulation d'achat selon scenarios.
- Gestion des contrats fournisseurs.
- Analyse de rentabilite par produit fini.
- Role multi-utilisateur.

## 14. Questions a valider avec le torrefacteur

1. Combien de grains differents suit-il actuellement ?
2. Les prix sont-ils toujours au kg ?
3. Travaille-t-il uniquement en EUR ou aussi en USD ?
4. Les prix negocies sont-ils par fournisseur, par lot ou par origine ?
5. Les assemblages utilisent-ils des grains generiques ou des lots precis ?
6. La perte de torrefaction est-elle fixe par assemblage ou variable par production ?
7. A-t-il besoin de suivre le stock dans cette V1 ?
8. Quel format d'import utilise-t-il aujourd'hui : Excel, CSV ou autre ?
9. Quels sont ses 5 assemblages les plus importants ?
10. Quelle alerte serait la plus utile au quotidien : prix, marge, stock ou tarif expire ?

## 15. Proposition de prochaine etape

La prochaine etape consiste a transformer ce cahier des charges en modele de donnees detaille, puis en maquettes d'ecrans.

Ordre conseille :

1. Valider les objets metier avec le torrefacteur.
2. Choisir les champs obligatoires et optionnels.
3. Construire un exemple de donnees reel avec 3 grains, 2 fournisseurs et 2 assemblages.
4. Tester les calculs sur cet exemple.
5. Prototyper les ecrans principaux.

