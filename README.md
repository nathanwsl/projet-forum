# 💬 Projet Forum

Forum web développé par des étudiants dans le cadre d'un projet scolaire à Ynov Campus.

---

## 👥 Équipe

- **Nathan Wissle**
- **Allan Kartner**

---

## 🚀 Installation et lancement

### Prérequis

- [Node.js](https://nodejs.org) (v18 ou supérieur)
- [XAMPP](https://www.apachefriends.org) (MySQL + Apache)
- [Git](https://git-scm.com)

### Étapes

**1. Cloner le projet**
```bash
git clone https://github.com/VOTRE_USERNAME/forum.git
cd forum
```

**2. Installer les dépendances**
```bash
npm install
```

**3. Configurer l'environnement**

Créer un fichier `.env` à la racine du projet :
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=forum
SESSION_SECRET=supersecretkey123
PORT=3000
```

**4. Lancer XAMPP**
- Ouvrir le panneau de contrôle XAMPP
- Démarrer **MySQL** et **Apache** (les deux doivent être verts)

**5. Créer la base de données**
- Aller sur http://localhost/phpmyadmin
- Créer une base de données nommée `forum`
- Cliquer sur l'onglet **SQL**
- Importer et exécuter le fichier `database/schema.sql`

**6. Lancer le serveur**
```bash
node src/app.js
```

**7. Accéder au forum**

Ouvrir http://localhost:3000 dans votre navigateur.

---

## 📁 Structure du projet

```
projet-forum/
├── src/
│   ├── controllers/        # Logique métier
│   │   ├── authController.js
│   │   ├── topicController.js
│   │   ├── adminController.js
│   │   └── userController.js
│   ├── models/             # Accès base de données
│   │   ├── db.js
│   │   ├── userModel.js
│   │   ├── topicModel.js
│   │   ├── messageModel.js
│   │   └── reactionModel.js
│   ├── routes/             # Définition des routes
│   │   ├── authRoutes.js
│   │   ├── topicRoutes.js
│   │   ├── adminRoutes.js
│   │   └── userRoutes.js
│   ├── middlewares/        # Middlewares
│   │   └── authMiddleware.js
│   ├── views/              # Templates EJS
│   │   ├── auth/
│   │   ├── topics/
│   │   ├── users/
│   │   └── admin/
│   └── public/             # Fichiers statiques
│       ├── css/
│       ├── js/
│       └── uploads/
├── database/
│   └── schema.sql          # Script de création de la base de données
├── .env                    # Variables d'environnement (non versionné)
├── .gitignore
├── package.json
└── README.md
```

---

## 🛣️ Liste des routes

### Routes distribuant une vue (GET)

| Route | Description | Accès |
|-------|-------------|-------|
| `GET /` | Page d'accueil - liste des topics | Public |
| `GET /register` | Page d'inscription | Public |
| `GET /login` | Page de connexion | Public |
| `GET /topics/create` | Formulaire de création de topic | Connecté |
| `GET /topics/:id` | Consultation d'un topic et ses messages | Public |
| `GET /topics/:id/edit` | Formulaire de modification d'un topic | Propriétaire / Admin |
| `GET /profile/:id` | Page de profil d'un utilisateur | Public |
| `GET /settings` | Page de paramètres du profil | Connecté |
| `GET /admin` | Dashboard administrateur | Admin |

### Routes de traitement de données (POST)

| Route | Description | Accès |
|-------|-------------|-------|
| `POST /register` | Traitement de l'inscription | Public |
| `POST /login` | Traitement de la connexion | Public |
| `GET /logout` | Déconnexion | Connecté |
| `POST /topics/create` | Création d'un topic | Connecté |
| `POST /topics/:id/edit` | Modification d'un topic | Propriétaire / Admin |
| `POST /topics/:id/delete` | Suppression d'un topic | Propriétaire / Admin |
| `POST /topics/:id/messages` | Poster un message | Connecté |
| `POST /topics/:topicId/messages/:messageId/delete` | Supprimer un message | Propriétaire / Admin |
| `POST /topics/:topicId/messages/:messageId/react` | Liker ou disliker un message | Connecté |
| `POST /settings` | Mise à jour du profil | Connecté |
| `POST /admin/topics/:topicId/status` | Modifier l'état d'un topic | Admin |
| `POST /admin/topics/:topicId/delete` | Supprimer un topic | Admin |
| `POST /admin/messages/:messageId/delete` | Supprimer un message | Admin |
| `POST /admin/users/:userId/ban` | Bannir un utilisateur | Admin |
| `POST /admin/users/:userId/unban` | Débannir un utilisateur | Admin |

---

## 🛠️ Technologies utilisées

| Technologie | Usage |
|-------------|-------|
| **Node.js** | Runtime JavaScript côté serveur |
| **Express.js** | Framework web |
| **MySQL** | Base de données relationnelle |
| **EJS** | Moteur de templates HTML |
| **express-session** | Gestion des sessions utilisateur |
| **SHA512** (crypto natif) | Hachage des mots de passe |
| **Multer** | Upload de fichiers (avatars) |
| **dotenv** | Variables d'environnement |
| **Git / GitHub** | Versioning et collaboration |

---

## ✅ Fonctionnalités implémentées

### Fonctionnalités obligatoires

| ID | Fonctionnalité | Statut |
|----|----------------|--------|
| FT-1 | Inscription | ✅ |
| FT-2 | Connexion | ✅ |
| FT-3 | Création de topic | ✅ |
| FT-4 | Consulter un topic | ✅ |
| FT-5 | Poster un message | ✅ |
| FT-6 | Gestion des messages et topics par le propriétaire | ✅ |
| FT-7 | Like et dislike d'un message | ✅ |
| FT-8 | Tri des messages (date / popularité) | ✅ |
| FT-9 | Pagination (10, 20, 30, tout) | ✅ |
| FT-10 | Afficher les topics par catégorie (tags) | ✅ |
| FT-11 | Dashboard administrateur | ✅ |
| FT-12 | Recherche de topic (titre ou tag) | ✅ |

### Fonctionnalités optionnelles

| ID | Fonctionnalité | Statut |
|----|----------------|--------|
| FTB-1 | Images dans les messages | ⬜ |
| FTB-2 | Profil utilisateur | ✅ |
| FTB-3 | Système d'amis et topics privés | ⬜ |

### Fonctionnalités bonus (hors cahier des charges)
- ✅ Réponses aux messages (système de fil de discussion)
- ✅ Lien vers le profil des autres utilisateurs

---

## 📊 Synthèse de gestion de projet

### Décomposition du projet et phases

Le projet a été décomposé en plusieurs phases successives :

1. **Phase de conception** : Lecture et analyse du cahier des charges, identification des fonctionnalités obligatoires et optionnelles, conception du schéma de base de données.

2. **Phase de mise en place** : Initialisation du dépôt Git, configuration de l'environnement Node.js, création de la structure du projet et connexion à la base de données MySQL.

3. **Phase de développement des fonctionnalités obligatoires** : Développement itératif de chaque fonctionnalité dans l'ordre de priorité du cahier des charges (authentification → topics → messages → likes → pagination → recherche → dashboard admin).

4. **Phase des fonctionnalités optionnelles** : Ajout des profils utilisateurs, des réponses aux messages et de la navigation entre profils.

5. **Phase de finalisation** : Mise en forme CSS, rédaction du README, création du script SQL et préparation de la soutenance.

### Répartition des tâches

On a travaillé ensemble sur l'ensemble du projet en binôme, en codant côte à côte. Cette approche nous a permis de détecter les erreurs plus rapidement, de partager les connaissances en temps réel et de maintenir une compréhension commune du code à tout moment.

### Gestion du temps et priorités

Nous avons défini des priorités claires dès le début du projet :

- **Priorité 1** : Toutes les fonctionnalités obligatoires (FT-1 à FT-12)
- **Priorité 2** : L'aspect visuel et l'expérience utilisateur (CSS)
- **Priorité 3** : Les fonctionnalités optionnelles (FTB)
- **Priorité 4** : Les fonctionnalités bonus

Les commits Git réguliers (un commit par fonctionnalité) nous ont permis de suivre l'avancement du projet, de documenter notre progression et de revenir en arrière en cas de problème.

### Stratégie de documentation

Nous avons utilisé les ressources suivantes pour nous documenter tout au long du projet :

- La documentation officielle de **Node.js** et **Express.js**
- La documentation de **MySQL** et **EJS**
- Les exemples de forums fournis dans le cahier des charges (Stack Overflow, Reddit, JVC)
- **GitHub** comme outil de versioning, de suivi et de partage du code entre les deux membres de l'équipe
- Les messages d'erreur du terminal comme outil de débogage et d'apprentissage

---

## 🔑 Compte de test

Un compte administrateur peut être créé en :
1. S'inscrivant normalement sur le forum
2. Allant dans phpMyAdmin → table `users`
3. Exécutant : `UPDATE users SET role = 'admin' WHERE username = 'votre_pseudo';`
