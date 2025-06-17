const express = require('express');
const paymentController = require('../controllers/Payment_Controller'); // Import payment controller
const { protect, adminValidator } = require('../middleware/authMiddleware'); // Import protect and adminValidator

const router = express.Router();

router.post('/', protect, paymentController.processPayment);
router.post('/verify/:tx_ref', protect, paymentController.verifyPayment);
router.get('/', protect, paymentController.getAllTransactions);
router.get('/balance', protect, paymentController.getWalletBalance);
router.get('/banks', protect, paymentController.getBanks);
// router.post('/transfer', protect, paymentController.transferMoney);

module.exports = router;
