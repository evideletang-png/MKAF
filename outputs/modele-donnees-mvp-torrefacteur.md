# Modèle de données MVP - Outil de coût café pour torréfacteur

Version: 0.1  
Date: 30 juin 2026

## 1. Objectif du modèle

Ce modèle de données sert à construire une première version de l'outil centrée sur :

- les grains ;
- les fournisseurs ;
- les tarifs datés ;
- les assemblages ;
- les calculs de coût ;
- les batchs de production avec coût figé ;
- les alertes.

Le principe clé : un prix n'est jamais une simple valeur attachée à un grain. C'est un tarif daté, rattaché à un grain, à un fournisseur et à une période de validité.

## 2. Diagramme simplifie

```mermaid
erDiagram
    COUNTRY ||--o{ BEAN : origin
    SUPPLIER ||--o{ BEAN : default_supplier
    BEAN ||--o{ BEAN_PRICE : has
    SUPPLIER ||--o{ BEAN_PRICE : offers
    BLEND ||--o{ BLEND_COMPONENT : contains
    BEAN ||--o{ BLEND_COMPONENT : used_in
    SUPPLIER ||--o{ BLEND_COMPONENT : optional_forced_supplier
    BLEND ||--o{ PRODUCTION_BATCH : produced_as
    PRODUCTION_BATCH ||--o{ PRODUCTION_BATCH_COMPONENT : freezes
    BEAN ||--o{ PRODUCTION_BATCH_COMPONENT : consumed_snapshot
    SUPPLIER ||--o{ PRODUCTION_BATCH_COMPONENT : supplier_snapshot
    ALERT_RULE ||--o{ ALERT_EVENT : triggers
```

## 3. Tables principales

## countries

Pays d'origine du café.

| Champ | Type | Obligatoire | Notes |
|---|---|---:|---|
| id | uuid | oui | identifiant technique |
| name | text | oui | nom du pays |
| region | text | non | Afrique, Amerique latine, Asie, etc. |
| is_active | boolean | oui | true par défaut |
| created_at | datetime | oui | date de création |
| updated_at | datetime | oui | date de modification |

## suppliers

Fournisseurs ou importateurs.

| Champ | Type | Obligatoire | Notes |
|---|---|---:|---|
| id | uuid | oui | identifiant technique |
| name | text | oui | nom fournisseur |
| contact_name | text | non | contact principal |
| email | text | non | email |
| phone | text | non | telephone |
| default_currency | text | oui | EUR par défaut |
| notes | text | non | remarques |
| is_active | boolean | oui | true par défaut |
| created_at | datetime | oui | date de création |
| updated_at | datetime | oui | date de modification |

## beans

Grains ou références café vert.

| Champ | Type | Obligatoire | Notes |
|---|---|---:|---|
| id | uuid | oui | identifiant technique |
| commercial_name | text | oui | ex. Brésil Santos, Colombie Excelso |
| country_id | uuid | oui | lien vers countries |
| default_supplier_id | uuid | non | fournisseur principal |
| species | text | oui | arabica, robusta, blend vert, autre |
| variety | text | non | bourbon, caturra, etc. |
| process | text | non | lave, naturel, honey, autre |
| unit | text | oui | kg par défaut |
| notes | text | non | informations qualité |
| is_active | boolean | oui | true par défaut |
| created_at | datetime | oui | date de création |
| updated_at | datetime | oui | date de modification |

## bean_prices

Tarifs négociés ou estimés pour un grain.

| Champ | Type | Obligatoire | Notes |
|---|---|---:|---|
| id | uuid | oui | identifiant technique |
| bean_id | uuid | oui | lien vers beans |
| supplier_id | uuid | oui | lien vers suppliers |
| price_per_kg | decimal(12,4) | oui | prix du café vert par kg |
| currency | text | oui | EUR, USD, etc. |
| valid_from | date | oui | début de validité inclus |
| valid_to | date | non | fin de validité incluse, vide = ouvert |
| tariff_type | text | oui | contract, spot, estimate, market, other |
| source_reference | text | non | numero contrat, email, note interne |
| notes | text | non | commentaire |
| created_at | datetime | oui | date de saisie |
| updated_at | datetime | oui | date de modification |

Règles importantes :

- `price_per_kg` doit être strictement positif.
- `valid_to` doit être vide ou supérieur ou égal à `valid_from`.
- Pour un même couple `bean_id` + `supplier_id`, deux périodes ne doivent pas se chevaucher sans validation explicite.
- Un tarif ouvert avec `valid_to` vide doit être fermé automatiquement ou manuellement avant de saisir un nouveau tarif ouvert sur le même grain et fournisseur.

## blends

Assemblages ou recettes de café.

| Champ | Type | Obligatoire | Notes |
|---|---|---:|---|
| id | uuid | oui | identifiant technique |
| name | text | oui | nom de l'assemblage |
| description | text | non | notes métier |
| roast_loss_pct | decimal(5,2) | oui | perte estimée, ex. 15.00 |
| packaging_cost_per_kg | decimal(12,4) | oui | 0 par défaut |
| energy_cost_per_kg | decimal(12,4) | oui | 0 par défaut |
| logistics_cost_per_kg | decimal(12,4) | oui | 0 par défaut |
| target_sale_price_per_kg | decimal(12,4) | non | prix de vente cible |
| max_cost_per_kg | decimal(12,4) | non | seuil de coût |
| is_active | boolean | oui | true par défaut |
| created_at | datetime | oui | date de création |
| updated_at | datetime | oui | date de modification |

Règles importantes :

- `roast_loss_pct` doit être compris entre 0 et 50 pour eviter les erreurs de saisie.
- Les frais par kg doivent être positifs ou egaux a 0.

## blend_components

Composition d'un assemblage.

| Champ | Type | Obligatoire | Notes |
|---|---|---:|---|
| id | uuid | oui | identifiant technique |
| blend_id | uuid | oui | lien vers blends |
| bean_id | uuid | oui | lien vers beans |
| percentage | decimal(6,3) | oui | ex. 50.000 |
| forced_supplier_id | uuid | non | fournisseur impose pour ce grain |
| sort_order | integer | oui | ordre d'affichage |
| notes | text | non | commentaire |
| created_at | datetime | oui | date de création |
| updated_at | datetime | oui | date de modification |

Règles importantes :

- La somme des `percentage` d'un assemblage doit être égale à 100.
- Un même grain peut apparaitre une seule fois par assemblage, sauf si le fournisseur impose est different.
- Si `forced_supplier_id` est rempli, le calcul doit utiliser ce fournisseur.
- Si `forced_supplier_id` est vide, le calcul utilise le fournisseur principal du grain.

## production_batches

Productions réalisées. Cette table fige le résultat global du calcul au moment de la production.

| Champ | Type | Obligatoire | Notes |
|---|---|---:|---|
| id | uuid | oui | identifiant technique |
| production_date | date | oui | date de production |
| blend_id | uuid | oui | assemblage produit |
| roasted_quantity_kg | decimal(12,3) | oui | quantité obtenue |
| green_quantity_kg | decimal(12,3) | oui | quantité café vert consommée |
| actual_roast_loss_pct | decimal(5,2) | non | perte réelle |
| frozen_green_cost_per_kg | decimal(12,4) | oui | coût vert calculé |
| frozen_roasted_cost_per_kg | decimal(12,4) | oui | coût après perte |
| frozen_total_cost_per_kg | decimal(12,4) | oui | coût total |
| notes | text | non | remarques |
| created_at | datetime | oui | date de création |
| updated_at | datetime | oui | date de modification |

Règles importantes :

- Les champs `frozen_*` ne changent pas automatiquement après création.
- Si l'utilisateur veut recalculer, il faut une action explicite et historisée.

## production_batch_components

Détail figé des grains utilisés dans un batch.

| Champ | Type | Obligatoire | Notes |
|---|---|---:|---|
| id | uuid | oui | identifiant technique |
| production_batch_id | uuid | oui | lien vers production_batches |
| bean_id | uuid | oui | grain utilise |
| supplier_id | uuid | oui | fournisseur retenu |
| percentage | decimal(6,3) | oui | pourcentage au moment de la prod |
| price_per_kg_snapshot | decimal(12,4) | oui | prix figé |
| currency_snapshot | text | oui | devise figée |
| green_quantity_kg | decimal(12,3) | oui | quantité estimée ou réelle |
| line_cost_per_kg | decimal(12,4) | oui | contribution au coût |
| created_at | datetime | oui | date de création |

Utilite :

- expliquer un coût batch ligne par ligne ;
- conserver l'historique même si la recette ou les tarifs changent plus tard.

## alert_rules

Règles d'alerte configurées par l'utilisateur.

| Champ | Type | Obligatoire | Notes |
|---|---|---:|---|
| id | uuid | oui | identifiant technique |
| name | text | oui | nom de l'alerte |
| alert_type | text | oui | bean_price, blend_cost, margin, tariff_expiry, missing_price |
| bean_id | uuid | non | selon type |
| blend_id | uuid | non | selon type |
| threshold_value | decimal(12,4) | non | seuil |
| comparison_operator | text | non | gt, gte, lt, lte |
| days_before_expiry | integer | non | pour expiration tarif |
| is_active | boolean | oui | true par défaut |
| created_at | datetime | oui | date de création |
| updated_at | datetime | oui | date de modification |

## alert_events

Alertes détectées.

| Champ | Type | Obligatoire | Notes |
|---|---|---:|---|
| id | uuid | oui | identifiant technique |
| alert_rule_id | uuid | oui | lien vers alert_rules |
| detected_at | datetime | oui | date de detection |
| status | text | oui | active, acknowledged, resolved |
| message | text | oui | message lisible |
| observed_value | decimal(12,4) | non | valeur observee |
| threshold_value | decimal(12,4) | non | seuil concerne |
| acknowledged_at | datetime | non | date de traitement |
| resolved_at | datetime | non | date de resolution |

## 4. Sélection d'un tarif pour un calcul

Pour calculer le prix d'un grain à une date donnée :

1. Identifier le grain.
2. Identifier le fournisseur a utiliser :
   - fournisseur impose dans la composition si present ;
   - sinon fournisseur principal du grain.
3. Chercher un tarif dans `bean_prices` avec :
   - même grain ;
   - même fournisseur ;
   - `valid_from <= date_calcul` ;
   - `valid_to` vide ou `valid_to >= date_calcul`.
4. Si un seul tarif est trouvé, l'utiliser.
5. Si aucun tarif n'est trouvé, remonter une erreur de prix manquant.
6. Si plusieurs tarifs sont trouvés, remonter une erreur de conflit de tarifs.

## 5. Calcul d'un assemblage

Entrées :

- `blend_id` ;
- date de calcul ;
- devise cible, EUR par défaut.

Sorties :

- coût café vert par kg ;
- coût après perte de torréfaction ;
- coût total par kg ;
- détail ligne par ligne ;
- prix manquants ;
- conflits de tarifs ;
- marge si prix de vente cible present.

Formule ligne :

```
line_cost = bean_price_per_kg * (component_percentage / 100)
```

Formule coût vert :

```
green_cost_per_kg = sum(line_cost)
```

Formule coût torréfié :

```
roasted_cost_per_kg = green_cost_per_kg / (1 - roast_loss_pct / 100)
```

Formule coût total :

```
total_cost_per_kg =
  roasted_cost_per_kg
  + packaging_cost_per_kg
  + energy_cost_per_kg
  + logistics_cost_per_kg
```

## 6. Création d'un batch de production

Lorsqu'un batch est créé :

1. L'utilisateur choisit une date de production.
2. L'utilisateur choisit un assemblage.
3. L'utilisateur saisit la quantité produite.
4. L'outil calcule le coût à la date de production.
5. L'outil enregistre le resultat dans `production_batches`.
6. L'outil enregistre le détail figé dans `production_batch_components`.

Le batch ne depend plus des tarifs futurs après sa création.

## 7. Contraintes de qualité des données

Contraintes à prévoir dès la V1 :

- noms de pays uniques ;
- noms de fournisseurs uniques ou au moins alertes en cas de doublon ;
- prix strictement positifs ;
- pourcentages d'assemblage totalisant 100 ;
- dates de tarifs cohérentes ;
- detection des chevauchements de tarifs ;
- devise obligatoire ;
- impossibilité de calculer un assemblage si un prix manque.

## 8. Exemple de données MVP

### Pays

| Pays | Region |
|---|---|
| Brésil | Amerique latine |
| Colombie | Amerique latine |
| Éthiopie | Afrique |

### Fournisseurs

| Fournisseur | Devise |
|---|---|
| Importateur A | EUR |
| Importateur B | EUR |

### Grains

| Grain | Pays | Fournisseur principal | Type |
|---|---|---|---|
| Brésil Santos | Brésil | Importateur A | arabica |
| Colombie Excelso | Colombie | Importateur B | arabica |
| Éthiopie Sidamo | Éthiopie | Importateur B | arabica |

### Tarifs

| Grain | Fournisseur | Prix | Début | Fin |
|---|---|---:|---|---|
| Brésil Santos | Importateur A | 5.80 | 2026-01-01 | 2026-03-31 |
| Colombie Excelso | Importateur B | 7.20 | 2026-01-01 | 2026-01-31 |
| Colombie Excelso | Importateur B | 7.55 | 2026-02-01 | 2026-03-31 |
| Éthiopie Sidamo | Importateur B | 8.10 | 2026-01-01 | 2026-03-31 |

### Assemblage

Espresso Maison :

| Grain | Pourcentage |
|---|---:|
| Brésil Santos | 50 |
| Colombie Excelso | 30 |
| Éthiopie Sidamo | 20 |

Avec une perte de torréfaction estimée a 15 %.

## 9. Decisions a prendre avant développement

Questions a trancher :

1. Faut-il gerer les lots précis de café vert dès la V1, ou seulement les références grains ?
2. Le fournisseur doit-il toujours être impose dans un assemblage ?
3. Les prix sont-ils parfois négociés en USD ?
4. Les frais logistiques doivent-ils être par grain, par fournisseur ou par assemblage ?
5. Le logiciel existant exporte-t-il des fichiers exploitables ?
6. La production doit-elle mettre à jour un stock dans cet outil, ou seulement figer les coûts ?
