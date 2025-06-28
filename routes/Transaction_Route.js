const express = require("express");
const { TransactionController } = require("../controllers"); // Import the TransactionController
const { transactionValidation } = require('../validations'); // Import transaction validation
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router(); 

// Create a new transaction
router.post("/", protect, validate(transactionValidation.createTransactionSchema), TransactionController.createTransaction);

// Update transaction status
router.patch("/:transactionId", protect, validate(transactionValidation.updateTransactionStatusSchema), TransactionController.updateTransactionStatus);

// Get all transactions
router.get("/", protect, TransactionController.getAllTransactions);

module.exports = router;