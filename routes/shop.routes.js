const router = require('express').Router();
const ctrl = require('../controllers/shop.controller');
const { ensureAuthenticated } = require('../middleware/auth.middleware');

/* =========================
   SHOP PAGES
========================= */
router.get('/shop', ctrl.index);

/* =========================
   CHECKOUT (LOCKED)
========================= */
router.get('/shop/checkout', ensureAuthenticated, ctrl.checkout);
router.post('/shop/checkout/update', ensureAuthenticated, ctrl.updateCart);

module.exports = router;
