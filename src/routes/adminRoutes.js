javascriptconst express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

router.get('/admin', isAuth, isAdmin, adminController.dashboard);
router.post('/admin/topics/:topicId/status', isAuth, isAdmin, adminController.changeTopicStatus);
router.post('/admin/topics/:topicId/delete', isAuth, isAdmin, adminController.deleteTopic);
router.post('/admin/messages/:messageId/delete', isAuth, isAdmin, adminController.deleteMessage);
router.post('/admin/users/:userId/ban', isAuth, isAdmin, adminController.banUser);
router.post('/admin/users/:userId/unban', isAuth, isAdmin, adminController.unbanUser);

module.exports = router;