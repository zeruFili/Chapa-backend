const express = require("express");
const {
    createTransaction,
    updateTransactionStatus,
    getAllTransactions,
} = require("../controllers/Transaction_Controller");
const {
    createTransactionSchema,
    updateTransactionStatusSchema,
} = require("../validations/transaction.validation");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

// Create a new transaction
router.post("/", protect, validate(createTransactionSchema), createTransaction);

// Update transaction status
router.patch("/:transactionId", protect, validate(updateTransactionStatusSchema), updateTransactionStatus);

// Get all transactions
router.get("/", protect, getAllTransactions);

module.exports = router;