const { createTopic, getAllTopics, getTopicById } = require('../models/topicModel');

// Page d'accueil avec liste des topics
exports.index = async (req, res) => {
  try {
    const topics = await getAllTopics();
    res.render('topics/index', { topics });
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};

// Afficher formulaire création topic
exports.showCreate = (req, res) => {
  res.render('topics/create', { error: null });
};

// Traiter création topic
exports.create = async (req, res) => {
  const { title, body, tags } = req.body;
  const authorId = req.session.user.id;

  if (!title || !body) {
    return res.render('topics/create', { error: 'Le titre et le corps sont obligatoires.' });
  }

  try {
    const tagsArray = tags ? tags.split(',') : [];
    await createTopic(title, body, authorId, tagsArray);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('topics/create', { error: 'Erreur lors de la création.' });
  }
};

// Consulter un topic
exports.show = async (req, res) => {
  try {
    const topic = await getTopicById(req.params.id);
    if (!topic) return res.send('Topic introuvable');
    res.render('topics/show', { topic });
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};