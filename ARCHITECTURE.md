# Architecture du Backend TrueNumber

## 📁 Structure du projet

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuration MongoDB
│   │   └── swagger.js           # Configuration Swagger/OpenAPI
│   ├── controllers/
│   │   ├── auth/
│   │   │   └── auth.controller.js    # Contrôleurs d'authentification
│   │   ├── user/
│   │   │   └── user.controller.js    # Contrôleurs utilisateur
│   │   ├── game/
│   │   │   └── game.controller.js    # Contrôleurs de jeu
│   │   ├── balance.controller.js     # Contrôleur de solde
│   │   └── history.controller.js     # Contrôleur d'historique
│   ├── middleware/
│   │   └── auth.js              # Middleware d'authentification
│   ├── models/
│   │   ├── user.js              # Modèle utilisateur
│   │   ├── game.js              # Modèle de jeu
│   │   └── game-history.model.js    # Modèle d'historique
│   ├── routes/
│   │   ├── auth.routes.js       # Routes d'authentification
│   │   ├── user.route.js        # Routes utilisateur
│   │   └── game.routes.js       # Routes de jeu
│   ├── utils/
│   │   ├── validation.js        # Utilitaires de validation
│   │   └── gameLogic.js         # Logique de jeu
│   └── server.js                # Point d'entrée principal
├── scripts/
│   └── create-admin.js          # Script de création d'admin
├── .env.example                 # Variables d'environnement exemple
├── .env                         # Variables d'environnement (local)
├── package.json                 # Dépendances et scripts
├── README.md                    # Documentation principale
├── ARCHITECTURE.md              # Ce fichier
└── test-routes.http             # Tests des routes API
```

## 🏗️ Patterns architecturaux

### MVC (Model-View-Controller)
- **Models** : Définition des schémas de données (Mongoose)
- **Controllers** : Logique métier et traitement des requêtes
- **Routes** : Définition des endpoints et middleware

### Middleware Pattern
- Authentification JWT
- Validation des données
- Gestion des erreurs
- Rate limiting
- Sécurité (CORS, Helmet)

### Repository Pattern (implicite)
- Utilisation de Mongoose comme couche d'abstraction
- Séparation entre logique métier et accès aux données

## 🔄 Flux de données

```
Client Request
    ↓
Express Router
    ↓
Middleware (Auth, Validation, etc.)
    ↓
Controller
    ↓
Model (Mongoose)
    ↓
MongoDB
    ↓
Response
```

## 🛡️ Sécurité

### Authentification
- JWT (JSON Web Tokens)
- Hashage des mots de passe avec bcrypt
- Middleware d'authentification personnalisé

### Protection
- Rate limiting (100 req/15min par IP)
- CORS configuré
- Headers de sécurité (Helmet)
- Validation des entrées

### Autorisation
- Système de rôles (client/admin)
- Middleware de vérification des permissions

## 📊 Base de données

### MongoDB avec Mongoose
- **Users** : Gestion des utilisateurs et authentification
- **GameHistory** : Historique des parties jouées
- **Games** : Configuration et règles de jeu

### Relations
- GameHistory → User (référence userId)
- Soft delete pour les utilisateurs (isActive)

## 🎮 Logique métier

### Jeu TrueNumber
1. Génération d'un nombre aléatoire (0-100)
2. Détermination du résultat (>70 = gagné)
3. Calcul du changement de solde (+50/-35)
4. Mise à jour du solde utilisateur
5. Enregistrement en historique

### Gestion du solde
- Solde initial : 100 points
- Gain : +50 points
- Perte : -35 points
- Minimum : 0 points (pas de solde négatif)

## 🔌 API Design

### RESTful API
- Utilisation des verbes HTTP appropriés
- Structure d'URL cohérente
- Codes de statut HTTP standards

### Documentation
- Swagger/OpenAPI 3.0
- Annotations JSDoc dans les routes
- Exemples de requêtes/réponses

### Versioning
- Préfixe `/api` pour toutes les routes
- Prêt pour le versioning futur (`/api/v1`)

## 🚀 Déploiement

### Variables d'environnement
- Configuration flexible via .env
- Séparation dev/prod
- Secrets sécurisés

### Monitoring
- Logs structurés
- Health check endpoint
- Gestion d'erreurs centralisée

## 🧪 Tests

### Structure de test
- Tests unitaires (Jest)
- Tests d'intégration (Supertest)
- Mocking des dépendances

### Couverture
- Contrôleurs
- Middleware
- Modèles
- Utilitaires

## 📈 Performance

### Optimisations
- Indexation MongoDB
- Pagination des résultats
- Rate limiting
- Compression des réponses

### Monitoring
- Métriques de performance
- Logs d'erreurs
- Surveillance des ressources

## 🔧 Maintenance

### Code Quality
- ESLint pour la cohérence
- Prettier pour le formatage
- Structure modulaire

### Documentation
- README complet
- Commentaires dans le code
- Documentation API Swagger

## 🚀 Évolutions futures

### Fonctionnalités
- Système de notifications
- Historique détaillé
- Statistiques avancées
- Multi-jeux

### Technique
- Cache Redis
- Microservices
- WebSockets temps réel
- Tests automatisés CI/CD