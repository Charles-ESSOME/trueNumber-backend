# TrueNumber Backend API

API backend pour l'application TrueNumber - un jeu de nombres aléatoires avec système de paris.

## 🚀 Démarrage rapide

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (local ou cloud)
- npm ou yarn

### Installation

1. Clonez le projet et naviguez vers le dossier backend
```bash
cd backend
```

2. Installez les dépendances
```bash
npm install
```

3. Configurez les variables d'environnement
```bash
cp .env.example .env
```
Modifiez le fichier `.env` avec vos propres valeurs.

4. Démarrez le serveur
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur sera accessible sur `http://localhost:5000`

## 📚 Documentation API

La documentation Swagger est disponible sur : `http://localhost:5000/api-docs`

## 🛣️ Routes disponibles

### Authentification (`/api/auth`)
- `POST /register` - Inscription d'un nouvel utilisateur
- `POST /login` - Connexion d'un utilisateur
- `POST /logout` - Déconnexion d'un utilisateur

### Utilisateurs (`/api/users`)
- `GET /me` - Profil de l'utilisateur connecté
- `GET /balance` - Solde de l'utilisateur connecté
- `GET /` - Liste tous les utilisateurs (Admin seulement)
- `GET /:id` - Récupérer un utilisateur par ID (Admin seulement)
- `POST /` - Créer un nouvel utilisateur (Admin seulement)
- `PUT /:id` - Mettre à jour un utilisateur (Admin seulement)
- `DELETE /:id` - Supprimer un utilisateur (Admin seulement)

### Jeu (`/api/game`)
- `POST /play` - Jouer une partie
- `GET /history` - Historique des parties de l'utilisateur
- `GET /history/all` - Historique complet de toutes les parties (Admin seulement)

### Système
- `GET /api/health` - Vérification de l'état du serveur

## 🎮 Logique du jeu

- Un nombre aléatoire entre 0 et 100 est généré
- Si le nombre > 70 : Victoire (+50 points)
- Si le nombre ≤ 70 : Défaite (-35 points)
- Le solde ne peut jamais être négatif

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Incluez le token dans l'en-tête Authorization :

```
Authorization: Bearer <votre_token>
```

## 👥 Rôles utilisateur

- **client** : Peut jouer et consulter son historique
- **admin** : Accès complet à toutes les fonctionnalités

## 🗄️ Structure de la base de données

### Utilisateur (User)
- username (unique)
- email (unique)
- password (hashé)
- phone
- role (client/admin)
- balance (solde de points)
- isActive (statut du compte)

### Historique de jeu (GameHistory)
- userId (référence utilisateur)
- generatedNumber (nombre généré)
- result (gagné/perdu)
- balanceChange (changement de solde)
- previousBalance (solde précédent)
- newBalance (nouveau solde)
- playedAt (date de la partie)

## 🛡️ Sécurité

- Hashage des mots de passe avec bcrypt
- Protection CORS configurée
- Rate limiting (100 requêtes/15min par IP)
- Validation des données d'entrée
- Headers de sécurité avec Helmet

## 📝 Variables d'environnement

Consultez le fichier `.env.example` pour la liste complète des variables requises.

## 🧪 Tests

```bash
npm test
```

## 📦 Dépendances principales

- **Express** : Framework web
- **Mongoose** : ODM MongoDB
- **JWT** : Authentification
- **Bcrypt** : Hashage des mots de passe
- **Swagger** : Documentation API
- **Helmet** : Sécurité HTTP
- **CORS** : Gestion des origines croisées

## 🚀 Déploiement

1. Configurez les variables d'environnement pour la production
2. Assurez-vous que MongoDB est accessible
3. Démarrez avec `npm start`

## 📞 Support

Pour toute question ou problème, consultez la documentation Swagger ou contactez l'équipe de développement.