const express = require('express');
const router = express.Router();
const {
  registerUser,
  checkAuth,
  getAllUsers,
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
router.post('/check-auth', protect ,checkAuth);

// Get user profile
router.get('/profile', protect, getMyProfile);

// Delete user (admin only)
router.delete('/:id', protect, adminValidator, deleteUser);

// Update user profile
router.put('/profile', protect, updateUserProfile); // Changed to match the updated naming convention
router.get('/', protect, getAllUsers);
module.exports = router;