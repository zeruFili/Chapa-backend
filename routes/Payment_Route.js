const express = require("express");
const { PaymentController } = require("../controllers"); // Import the PaymentController
const { paymentValidation } = require('../validations'); // Import payment validation
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

// Process payment
router.post("/process", protect, validate(paymentValidation.paymentSchema), PaymentController.processPayment);

// Verify payment
router.post("/verify/:tx_ref", validate(paymentValidation.txRefSchema), PaymentController.verifyPayment);

// Get all transactions
router.get("/transactions", protect, PaymentController.getAllTransactions);

// Get wallet balance
router.get("/balance", protect, PaymentController.getWalletBalance);

// Get list of banks
router.get("/banks", protect, PaymentController.getBanks);

module.exports = router;