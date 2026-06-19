const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const db = require('./models/db');
const app = express();

// Moteur de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Rendre l'utilisateur accessible dans toutes les vues
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Test connexion DB
db.query('SELECT 1')
  .then(() => console.log('✅ Connecté à MySQL'))
  .catch(err => console.error('❌ Erreur MySQL :', err));

// Routes
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/topicRoutes'));
app.use('/', require('./routes/adminRoutes'));
app.use('/', require('./routes/userRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${process.env.PORT}`);
});

module.exports = app;

