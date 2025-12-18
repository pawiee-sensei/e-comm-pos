const router = require('express').Router();
const ctrl = require('../controllers/shop.controller');

router.get('/shop', ctrl.index);

module.exports = router;
