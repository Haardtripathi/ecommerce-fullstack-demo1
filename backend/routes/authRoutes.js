const express = require('express');
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/isAuthenticated');

const router = express.Router();

router.post('/signup', authController.postSignup);
router.post('/login', authController.postLogin);

router.post('/logout', isAuthenticated, authController.logout);

router.get('/check-auth', authController.checkAuth);

module.exports = router;