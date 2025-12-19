const router = require('express').Router();
const ctrl = require('../controllers/admin.categories.controller');
const { ensureAdmin } = require('../middleware/auth.middleware');

router.get('/admin/api/categories', ensureAdmin, ctrl.list);
router.post('/admin/api/categories', ensureAdmin, ctrl.create);
router.put('/admin/api/categories/:id', ensureAdmin, ctrl.update);
router.delete('/admin/api/categories/:id', ensureAdmin, ctrl.remove);

module.exports = router;
