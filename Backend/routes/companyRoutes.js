const express = require('express');
// MAKE SURE getMyJobs IS IMPORTED HERE
const { postJob, getApplicants, getMyJobs } = require('../controllers/companyController'); 
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/post-job', protect, authorizeRoles('COMPANY'), postJob);

// THIS IS THE MISSING ROUTE THAT CAUSED THE 404:
router.get('/my-jobs', protect, authorizeRoles('COMPANY'), getMyJobs);

router.get('/applicants/:jobId', protect, authorizeRoles('COMPANY'), getApplicants);

module.exports = router;