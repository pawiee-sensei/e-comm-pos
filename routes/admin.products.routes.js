const router = require('express').Router();
const ctrl = require('../controllers/admin.products.controller');
const { ensureAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

/* =========================
   ADMIN PRODUCT PAGES
========================= */
router.get('/admin/products', ensureAdmin, ctrl.renderPanel);

/* =========================
   ADMIN PRODUCT API
========================= */
router.get('/admin/api/products', ensureAdmin, ctrl.list);
router.get('/admin/api/products/:id', ensureAdmin, ctrl.getOne);

router.post(
  '/admin/api/products',
  ensureAdmin,
  upload.single('image'),
  ctrl.create
);

router.put(
  '/admin/api/products/:id',
  ensureAdmin,
  upload.single('image'),
  ctrl.update
);

router.delete(
  '/admin/api/products/:id',
  ensureAdmin,
  ctrl.remove
);

module.exports = router;
