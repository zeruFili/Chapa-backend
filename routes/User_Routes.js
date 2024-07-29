const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMyProfile,
  deleteUser,
  UpdateUserProfile
} = require('../controllers/User_Controller')
const { protect , adminValidator} = require('../middleware/User_Validator')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/profile', protect, getMyProfile)
router.delete('/users/:id', protect, adminValidator, deleteUser);
router.put('/users/profile', protect, UpdateUserProfile);

module.exports = router