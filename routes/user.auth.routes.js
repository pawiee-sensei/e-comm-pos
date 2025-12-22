const router = require('express').Router();
const ctrl = require('../controllers/user.auth.controller');

/* =========================
   USER AUTH PAGES
========================= */

// SIGN UP
router.get('/signup', ctrl.showSignup);
router.post('/signup', ctrl.signup);

// LOGIN
router.get('/user/login', ctrl.showLogin);
router.post('/user/login', ctrl.login);

// LOGOUT
router.get('/user/logout', ctrl.logout);

module.exports = router;
