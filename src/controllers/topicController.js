const { createTopic, getAllTopics, getTopicById } = require('../models/topicModel');
const { createMessage, getMessagesByTopic, deleteMessage, getMessageById } = require('../models/messageModel');
const { reactToMessage } = require('../models/reactionModel');

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

exports.show = async (req, res) => {
  try {
    const topic = await getTopicById(req.params.id);
    if (!topic) return res.send('Topic introuvable');
    const sort = req.query.sort || 'date';
    const messages = await getMessagesByTopic(req.params.id, sort);
    res.render('topics/show', { topic, messages, sort });
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};

// Poster un message
exports.postMessage = async (req, res) => {
  const { body } = req.body;
  const topicId = req.params.id;
  const authorId = req.session.user.id;
  if (!body) return res.redirect(`/topics/${topicId}`);
  try {
    const topic = await getTopicById(topicId);
    if (topic.status === 'closed' || topic.status === 'archived') {
      return res.redirect(`/topics/${topicId}`);
    }
    await createMessage(topicId, authorId, body);
    res.redirect(`/topics/${topicId}`);
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};

// Supprimer un message
exports.deleteMessage = async (req, res) => {
  const { topicId, messageId } = req.params;
  const userId = req.session.user.id;
  try {
    const topic = await getTopicById(topicId);
    const message = await getMessageById(messageId);
    if (!message) return res.send('Message introuvable');
    if (topic.author_id !== userId && message.author_id !== userId && req.session.user.role !== 'admin') {
      return res.send('Non autorisé');
    }
    await deleteMessage(messageId);
    res.redirect(`/topics/${topicId}`);
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};

// Liker ou disliker un message
exports.reactMessage = async (req, res) => {
  const { topicId, messageId } = req.params;
  const { type } = req.body;
  const userId = req.session.user.id;
  if (type !== 'like' && type !== 'dislike') {
    return res.redirect(`/topics/${topicId}`);
  }
  try {
    await reactToMessage(messageId, userId, type);
    res.redirect(`/topics/${topicId}`);
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};