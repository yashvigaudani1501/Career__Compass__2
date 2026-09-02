const express = require('express');

const {
    getUserProfile,
    updateProfile,
    getJobs,
    uploadResume,
    applyForJob
} = require('../controllers/userController');

const {
    protect,
    authorizeRoles
} = require('../middlewares/authMiddleware');

const upload = require('../middlewares/uploadMiddleware');

// ===== DEBUG =====
console.log("========== ROUTE DEBUG ==========");
console.log("protect:", typeof protect);
console.log("authorizeRoles:", typeof authorizeRoles);
console.log("getUserProfile:", typeof getUserProfile);
console.log("updateProfile:", typeof updateProfile);
console.log("getJobs:", typeof getJobs);
console.log("uploadResume:", typeof uploadResume);
console.log("applyForJob:", typeof applyForJob);
console.log("upload:", typeof upload);

if (upload) {
    console.log("upload.single:", typeof upload.single);
}
console.log("===============================");
// =================

const router = express.Router();

// Profile
router.get(
    '/profile',
    protect,
    authorizeRoles('USER'),
    getUserProfile
);

router.put(
    '/profile',
    protect,
    authorizeRoles('USER'),
    updateProfile
);

// Jobs
router.get(
    '/jobs',
    protect,
    authorizeRoles('USER'),
    getJobs
);

// Resume Upload
router.post(
    '/upload-resume',
    protect,
    authorizeRoles('USER'),
    upload.single('resume'),
    uploadResume
);

// Apply Job
router.post(
    '/apply/:jobId',
    protect,
    authorizeRoles('USER'),
    applyForJob
);

module.exports = router;