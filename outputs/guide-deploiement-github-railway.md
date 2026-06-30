# Guide déploiement GitHub + Railway

## État actuel

Le dépôt GitHub est connecté :

```text
git@github.com:evideletang-png/MKAF.git
```

L'application est déployable sur Railway avec :

- runtime Node.js ;
- commande de démarrage `npm start` ;
- écoute automatique sur `process.env.PORT` ;
- sauvegarde PostgreSQL dès que `DATABASE_URL` est disponible.

## 1. Connecter Railway au dépôt GitHub

Dans Railway :

1. Créer un nouveau projet.
2. Choisir un déploiement depuis GitHub.
3. Sélectionner le dépôt `evideletang-png/MKAF`.
4. Laisser Railway détecter l'application Node.js.
5. Vérifier que la commande de démarrage est :

```bash
npm start
```

6. Déployer.
7. Générer un domaine depuis les paramètres du service.

## 2. Ajouter PostgreSQL

Dans le même projet Railway :

1. Ajouter un service PostgreSQL.
2. Ouvrir le service web de l'application.
3. Vérifier que la variable `DATABASE_URL` est bien disponible pour ce service web.
4. Redéployer le service web.

Au démarrage, l'application crée automatiquement la table suivante :

```sql
CREATE TABLE IF NOT EXISTS app_state (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 3. Vérifier la connexion

Ouvrir :

```text
https://votre-domaine-railway/api/health
```

Réponse attendue :

```json
{
  "ok": true,
  "storage": "database",
  "database": "connected"
}
```

Dans l'interface, le badge en haut à droite doit afficher `Base connectée`, `Base initialisée` ou `Base synchronisée`.

## 4. Tester avec de vraies données

Scénario de test conseillé :

1. Ajouter un tarif négocié avec une date de début et une date de fin.
2. Rafraîchir la page.
3. Vérifier que le tarif est toujours présent.
4. Créer un batch de production.
5. Rafraîchir la page.
6. Vérifier que le batch est toujours présent.
7. Modifier les facteurs de prévision.
8. Rafraîchir la page.
9. Vérifier que les paramètres de prévision sont conservés.

## 5. Mode secours

Si `DATABASE_URL` n'est pas configurée, l'application reste utilisable en mode navigateur. Les données sont alors stockées uniquement dans le `localStorage` du poste.

Ce mode est utile en développement local, mais il ne convient pas aux tests multi-postes avec de vraies données.

## 6. Suite recommandée

Avant un usage réel durable :

- ajouter une authentification ;
- ajouter des imports/exports CSV ;
- permettre la gestion complète des grains, fournisseurs, assemblages et stocks depuis l'interface ;
- passer d'une persistance JSONB prototype à un modèle relationnel détaillé si les besoins métier se stabilisent.
