const { findUserById, updateUser, getUserStats } = require('../models/userModel');
const path = require('path');
const multer = require('multer');

// Config upload avatar
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/public/uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.session.user.id}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Format non autorisé'));
  }
});

exports.upload = upload;

// Afficher profil
exports.showProfile = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.send('Utilisateur introuvable');
    const stats = await getUserStats(req.params.id);
    res.render('users/profile', { profileUser: user, stats });
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};

// Afficher page paramètres
exports.showSettings = async (req, res) => {
  try {
    const user = await findUserById(req.session.user.id);
    res.render('users/settings', { user, error: null, success: null });
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};

// Traiter modification profil
exports.updateSettings = async (req, res) => {
  const { bio } = req.body;
  const userId = req.session.user.id;

  try {
    const currentUser = await findUserById(userId);
    const avatar = req.file ? `/uploads/${req.file.filename}` : currentUser.avatar;

    await updateUser(userId, bio, avatar);

    const updatedUser = await findUserById(userId);
    req.session.user = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role
    };

    res.render('users/settings', { user: updatedUser, error: null, success: 'Profil mis à jour !' });
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};