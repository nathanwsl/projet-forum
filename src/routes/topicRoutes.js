const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/', topicController.index);
router.get('/topics/create', isAuth, topicController.showCreate);
router.post('/topics/create', isAuth, topicController.create);
router.get('/topics/:id', topicController.show);
router.get('/topics/:id/edit', isAuth, topicController.showEdit);
router.post('/topics/:id/edit', isAuth, topicController.edit);
router.post('/topics/:id/delete', isAuth, topicController.deleteTopic);
router.post('/topics/:topicId/messages', isAuth, topicController.postMessage);
router.post('/topics/:topicId/messages/:messageId/delete', isAuth, topicController.deleteMessage);
router.post('/topics/:topicId/messages/:messageId/react', isAuth, topicController.reactMessage);

module.exports = router;