// bankRoutes.js

const express = require("express");
const { BankController } = require("../controllers"); // Import the BankController

const {
  bankSchema,
  updateBankSchema,
} = require("../validations/bank.validation");

const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

// Create a new bank record
router.post("/", protect, validate(bankSchema), BankController.createBank);

// Update an existing bank record
router.put("/", protect, validate(updateBankSchema), BankController.updateBank);

// Delete a bank record
router.delete("/", protect, BankController.deleteBank);

// Get all bank records by user ID
router.get("/", protect, BankController.getBanksByUserId);

module.exports = router;