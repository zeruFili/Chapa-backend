const express = require("express");
const {
    processPayment,
    verifyPayment,
    getAllTransactions,
    getWalletBalance,
    getBanks
} = require("../controllers/Payment_Controller");
const {
    paymentSchema,
    txRefSchema
} = require("../validations/payment.validation");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

// Process payment
router.post("/process", protect, validate(paymentSchema), processPayment);

// Verify payment
router.get("/verify/:tx_ref", validate(txRefSchema), verifyPayment);

// Get all transactions
router.get("/transactions", protect, getAllTransactions);

// Get wallet balance
router.get("/balance", protect, getWalletBalance);

// Get list of banks
router.get("/banks", protect, getBanks);

module.exports = router;