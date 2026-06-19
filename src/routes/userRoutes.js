const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/profile/:id', userController.showProfile);
router.get('/settings', isAuth, userController.showSettings);
router.post('/settings', isAuth, userController.upload.single('avatar'), userController.updateSettings);

module.exports = router;