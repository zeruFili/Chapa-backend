const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMyProfile,
  deleteUser,
  updateUserProfile // Changed to match the updated naming convention
} = require('../controllers/User_Controller');
const { protect, adminValidator } = require('../middleware/authMiddleware');

// User registration
router.post('/', registerUser);

// User login
router.post('/login', loginUser);

// Get user profile
router.get('/profile', protect, getMyProfile);

// Delete user (admin only)
router.delete('/users/:id', protect, adminValidator, deleteUser);

// Update user profile
router.put('/users/profile', protect, updateUserProfile); // Changed to match the updated naming convention

module.exports = router;