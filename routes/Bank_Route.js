const express = require('express');
const router = express.Router();
const bankController = require('../controllers/Bank_Controller'); // Adjust the path as necessary
const { protect, adminValidator } = require('../middleware/authMiddleware');
// Create a new bank record
router.post('/', protect, bankController.createBank);

// Update an existing bank record
router.put('/', protect, bankController.updateBank);

// Delete a bank record
router.delete('/', protect, bankController.deleteBank);

// View the list of  based on user ID
router.get('/', protect, bankController.getBanksByUserId);

module.exports = router;