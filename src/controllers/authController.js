const { createUser, findUserByIdentifier, hashPassword } = require('../models/userModel');

// Afficher page inscription
exports.showRegister = (req, res) => {
  res.render('auth/register', { error: null });
};

// Traiter inscription
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validation username (lettres et chiffres uniquement)
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return res.render('auth/register', { error: 'Le pseudo ne doit contenir que des lettres et chiffres.' });
  }

  // Validation mot de passe
  if (password.length < 8) {
    return res.render('auth/register', { error: 'Le mot de passe doit faire au moins 8 caractères.' });
  }
  if (!/[A-Z]/.test(password)) {
    return res.render('auth/register', { error: 'Le mot de passe doit contenir au moins une majuscule.' });
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return res.render('auth/register', { error: 'Le mot de passe doit contenir au moins un caractère spécial.' });
  }

  try {
    await createUser(username, email, password);
    res.redirect('/login');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.render('auth/register', { error: 'Ce pseudo ou cet email est déjà utilisé.' });
    }
    console.error(err);
    res.render('auth/register', { error: 'Une erreur est survenue.' });
  }
};

// Afficher page connexion
exports.showLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

// Traiter connexion
exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await findUserByIdentifier(identifier);
    if (!user) {
      return res.render('auth/login', { error: 'Identifiant ou mot de passe incorrect.' });
    }

    if (user.is_banned) {
      return res.render('auth/login', { error: 'Votre compte a été banni.' });
    }

    const hashed = hashPassword(password);
    if (hashed !== user.password) {
      return res.render('auth/login', { error: 'Identifiant ou mot de passe incorrect.' });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'Une erreur est survenue.' });
  }
};

// Déconnexion
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};  