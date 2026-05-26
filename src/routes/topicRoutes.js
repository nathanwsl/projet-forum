const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/', topicController.index);
router.get('/topics/create', isAuth, topicController.showCreate);
router.post('/topics/create', isAuth, topicController.create);
router.get('/topics/:id', topicController.show);

module.exports = router;