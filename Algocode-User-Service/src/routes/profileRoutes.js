const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route for leaderboard
router.post('/bulk', profileController.getUsersBulk);

// Apply auth middleware to other profile routes
router.use(authMiddleware);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);

module.exports = router;
