const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { ensureAuthenticated } = require('../middleware/auth.middleware');

router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/', ensureAuthenticated, (req, res) => {
  res.send(`Welcome ${req.session.user.name}`);
});

module.exports = router;
