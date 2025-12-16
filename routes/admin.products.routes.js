const router = require('express').Router();
const ctrl = require('../controllers/admin.products.controller');
const { ensureAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

router.get('/admin/products', ensureAdmin, ctrl.renderPanel);
router.get('/admin/api/products', ensureAdmin, ctrl.list);

router.post('/admin/api/products', ensureAdmin, upload.single('image'), ctrl.create);
router.put('/admin/api/products/:id', ensureAdmin, upload.single('image'), ctrl.update);
router.delete('/admin/api/products/:id', ensureAdmin, ctrl.remove);

module.exports = router;
