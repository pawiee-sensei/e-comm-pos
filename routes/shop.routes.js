const router = require('express').Router();
const ctrl = require('../controllers/shop.controller');

router.get('/shop', ctrl.index);
router.get('/shop/checkout', ctrl.checkout);

module.exports = router;
