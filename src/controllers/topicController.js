const { createTopic, getAllTopics, getTopicById, countTopics, getTopicsByTag, searchTopics, getAllTags, updateTopic, deleteTopic } = require('../models/topicModel');
const { createMessage, getMessagesByTopic, deleteMessage, getMessageById, countMessages } = require('../models/messageModel');
const { reactToMessage } = require('../models/reactionModel');
// Page d'accueil avec liste des topics
exports.index = async (req, res) => {
  try {
    const limitOptions = [10, 20, 30];
    const limit = req.query.all ? null : parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = limit ? (page - 1) * limit : 0;
    const search = req.query.search || '';
    const tag = req.query.tag || '';
    const tags = await getAllTags();

    let topics = [];
    let total = 0;

    if (search) {
      topics = await searchTopics(search, limit || 99999, offset);
      total = topics.length;
    } else if (tag) {
      topics = await getTopicsByTag(tag, limit || 99999, offset);
      total = topics.length;
    } else {
      total = await countTopics();
      topics = await getAllTopics(limit || 99999, offset);
    }

    const totalPages = limit ? Math.ceil(total / limit) : 1;

    res.render('topics/index', { topics, page, totalPages, limit, limitOptions, all: req.query.all, search, tag, tags });
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
    const limitOptions = [10, 20, 30];
    const limit = req.query.all ? null : parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = limit ? (page - 1) * limit : 0;
    const total = await countMessages(req.params.id);
    const messages = await getMessagesByTopic(req.params.id, sort, limit || 99999, offset);
    const totalPages = limit ? Math.ceil(total / limit) : 1;

    res.render('topics/show', { topic, messages, sort, page, totalPages, limit, limitOptions, all: req.query.all });
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};
exports.postMessage = async (req, res) => {
  const { body, parent_id } = req.body;
  const topicId = req.params.id;
  const authorId = req.session.user.id;

  if (!body) return res.redirect(`/topics/${topicId}`);

  try {
    const topic = await getTopicById(topicId);
    if (topic.status === 'closed' || topic.status === 'archived') {
      return res.redirect(`/topics/${topicId}`);
    }
    await createMessage(topicId, authorId, body, parent_id || null);
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
// Afficher formulaire modification topic
exports.showEdit = async (req, res) => {
  try {
    const topic = await getTopicById(req.params.id);
    if (!topic) return res.send('Topic introuvable');

    if (topic.author_id !== req.session.user.id && req.session.user.role !== 'admin') {
      return res.send('Non autorisé');
    }

    res.render('topics/edit', { topic, error: null });
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};

// Traiter modification topic
exports.edit = async (req, res) => {
  const { title, body, tags } = req.body;
  const topicId = req.params.id;

  try {
    const topic = await getTopicById(topicId);
    if (!topic) return res.send('Topic introuvable');

    if (topic.author_id !== req.session.user.id && req.session.user.role !== 'admin') {
      return res.send('Non autorisé');
    }

    const tagsArray = tags ? tags.split(',') : [];
    await updateTopic(topicId, title, body, tagsArray);
    res.redirect(`/topics/${topicId}`);
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};

// Supprimer un topic
exports.deleteTopic = async (req, res) => {
  const topicId = req.params.id;

  try {
    const topic = await getTopicById(topicId);
    if (!topic) return res.send('Topic introuvable');

    if (topic.author_id !== req.session.user.id && req.session.user.role !== 'admin') {
      return res.send('Non autorisé');
    }

    await deleteTopic(topicId);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Erreur serveur');
  }
};