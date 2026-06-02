const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/', topicController.index);
router.get('/topics/create', isAuth, topicController.showCreate);
router.post('/topics/create', isAuth, topicController.create);
router.get('/topics/:id', topicController.show);
router.post('/topics/:id/messages', isAuth, topicController.postMessage);
router.post('/topics/:topicId/messages/:messageId/delete', isAuth, topicController.deleteMessage);
router.post('/topics/:topicId/messages/:messageId/react', isAuth, topicController.reactMessage);

module.exports = router;