const { deleteTopic, getTopicById, updateTopic } = require('../models/topicModel');
const { deleteMessage } = require('../models/messageModel');

// Afficher le dashboard
exports.dashboard = async (req, res) => {
  try {
    const [topics] = await db.query(`
      SELECT t.*, u.username as author
      FROM topics t
      JOIN users u ON t.author_id = u.id
      ORDER BY t.created_at DESC
    `);

    const [users] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    const [messages] = await db.query(`
      SELECT m.*, u.username as author, t.title as topic_title
      FROM messages m
      JOIN users u ON m.author_id = u.id
      JOIN topics t ON m.topic_id = t.id
      ORDER BY m.sent_at DESC
    `);

    res.render('admin/dashboard', { topics, users, messages });
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};

// Modifier l'état d'un topic
exports.changeTopicStatus = async (req, res) => {
  const { topicId } = req.params;
  const { status } = req.body;

  try {
    await db.query('UPDATE topics SET status = ? WHERE id = ?', [status, topicId]);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};

// Supprimer un topic
exports.deleteTopic = async (req, res) => {
  try {
    await deleteTopic(req.params.topicId);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};

// Supprimer un message
exports.deleteMessage = async (req, res) => {
  try {
    await deleteMessage(req.params.messageId);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};

// Bannir un utilisateur
exports.banUser = async (req, res) => {
  try {
    await db.query('UPDATE users SET is_banned = TRUE WHERE id = ?', [req.params.userId]);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};

// Débannir un utilisateur
exports.unbanUser = async (req, res) => {
  try {
    await db.query('UPDATE users SET is_banned = FALSE WHERE id = ?', [req.params.userId]);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};
