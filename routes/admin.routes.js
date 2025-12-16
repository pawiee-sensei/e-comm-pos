const express = require('express');
const router = express.Router();

const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');

router.get('/admin', ensureAuthenticated, ensureAdmin, adminController.getAdminDashboard);

module.exports = router;
