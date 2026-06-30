# Questionnaire atelier - Outil de coût café pour torréfacteur

Version: 0.1  
Date: 30 juin 2026

## Objectif de l'atelier

Valider les choix métier avant de construire le prototype.

L'objectif n'est pas de tout documenter, mais de comprendre comment le torréfacteur raisonne vraiment ses coûts, ses prix négociés et ses assemblages.

## 1. Activité et organisation

1. Combien de personnes utiliseront l'outil ?
2. Qui saisira les prix : le torréfacteur, un acheteur, une personne administrative ?
3. A quelle frequence les prix changent-ils en pratique : jour, semaine, mois, trimestre, contrat ?
4. Quels sont les moments ou le coût doit être connu : achat, production, vente, fin de mois ?
5. Le logiciel actuel sert a quoi exactement : stock, facturation, production, compta, tout ?

## 2. Grains et origines

1. Combien de pays d'origine sont suivis aujourd'hui ?
2. Combien de références de grains sont suivies environ ?
3. Une référence correspond-elle à une origine générique ou à un lot précis ?
4. Un même grain peut-il être acheté chez plusieurs fournisseurs ?
5. Le fournisseur fait-il partie de l'identité du grain ?
6. Quelles informations sont indispensables sur un grain ?
7. Quelles informations sont utiles mais non bloquantes ?

## 3. Prix et tarifs négociés

1. Les prix sont-ils toujours exprimes au kg ?
2. Les prix sont-ils toujours en EUR ?
3. Certains prix sont-ils en USD ou dans une autre devise ?
4. Les prix incluent-ils le transport ?
5. Les prix incluent-ils les frais d'import ou de douane ?
6. Un prix est-il rattaché à un contrat, à un lot, à une période ou à une commande ?
7. Que se passe-t-il quand un prix est renégocie en cours de mois ?
8. Faut-il pouvoir conserver plusieurs hypotheses de prix ?
9. Faut-il distinguer prix ferme, prix estimé et prix marché ?
10. Aujourd'hui, ou sont stockes les prix : Excel, emails, PDF, logiciel, memoire ?

## 4. Assemblages

1. Combien d'assemblages sont actifs aujourd'hui ?
2. Un assemblage est-il defini par des grains fixes ou par des profils remplaçables ?
3. Un assemblage impose-t-il un fournisseur précis pour chaque grain ?
4. Les pourcentages changent-ils souvent ?
5. Faut-il historiser les anciennes recettes ?
6. La perte de torréfaction est-elle propre a chaque assemblage ?
7. La perte de torréfaction est-elle estimée ou mesurée à chaque production ?
8. Quels frais doivent entrer dans le coût : emballage, énergie, transport, main-d'oeuvre, autre ?
9. Le prix de vente cible est-il connu par assemblage ?
10. Quelle marge minimale faut-il surveiller ?

## 5. Production

1. Faut-il que l'outil suive les productions, ou seulement les coûts theoriques ?
2. Quand une production est faite, quelles informations sont notees aujourd'hui ?
3. La quantité produite est-elle toujours connue en kg ?
4. La quantité de café vert consommée est-elle mesurée ?
5. La perte réelle doit-elle remplacer la perte estimée dans le calcul ?
6. Faut-il figer le coût du batch au moment de la production ?
7. Faut-il pouvoir recalculer un batch si une erreur de prix est corrigée ?
8. Le stock est-il gere dans le logiciel actuel ?
9. Faut-il eviter de dupliquer la gestion de stock dans ce nouvel outil ?

## 6. Alertes

1. Quelle alerte serait la plus utile des la première version ?
2. À partir de quel niveau de hausse un prix devient-il inquietant ?
3. Faut-il une alerte quand un tarif arrive a expiration ?
4. Faut-il une alerte quand un assemblage depasse un coût maximum ?
5. Faut-il une alerte quand la marge passe sous un seuil ?
6. Les alertes doivent-elles être vues dans le tableau de bord ou envoyees par email ?
7. Faut-il des alertes quotidiennes, hebdomadaires ou seulement à l'ouverture de l'outil ?

## 7. Imports, exports et données existantes

1. Le logiciel actuel permet-il un export CSV ou Excel ?
2. Peut-on exporter les produits, les productions, les stocks ou les achats ?
3. Existe-t-il déjà un fichier Excel de prix ?
4. Quel format serait le plus simple pour mettre à jour les tarifs ?
5. Qui corrigera les erreurs d'import ?
6. Quels exports sont indispensables : coûts, tarifs, productions, alertes ?

## 8. Priorités MVP

Demander au torréfacteur de classer ces fonctions de 1 a 5 :

| Fonction | Priorite |
|---|---:|
| Saisie des prix datés | |
| Calcul coût assemblage | |
| Comparaison entre périodes | |
| Production avec coût figé | |
| Alertes | |
| Import Excel | |
| Export Excel | |
| Tableau de bord | |
| Gestion stock | |
| Connexion logiciel actuel | |

## 9. Données d'exemple a recuperer

Pour construire un prototype credible, demander :

- 3 grains reels ;
- 2 fournisseurs reels ;
- 2 assemblages reels ;
- 2 périodes de prix ;
- 1 exemple de production ;
- 1 exemple de seuil d'alerte ;
- 1 export du logiciel actuel si disponible.

## 10. Decision attendue à la fin de l'atelier

A la fin de l'echange, on doit savoir :

1. si la V1 gere les lots ou seulement les références grains ;
2. si la V1 gere le stock ou seulement les coûts ;
3. quelles données sont obligatoires pour saisir un prix ;
4. quels frais entrent dans le coût de revient ;
5. quels sont les 2 ou 3 écrans a prototyper en premier.
