const express = require('express');
const { createCompany } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route: /api/admin/create-company
// Middleware: protect (must be logged in) + authorizeRoles (must be ADMIN)
router.post('/create-company', protect, authorizeRoles('ADMIN'), createCompany);

module.exports = router;