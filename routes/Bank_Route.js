const express = require("express");
const {
  createBank,
  updateBank,
  deleteBank,
  getBanksByUserId,
} = require("../controllers/Bank_Controller");
const {
  bankSchema,
  updateBankSchema,
} = require("../validations/bank.validation");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

// Create a new bank record
router.post("/", protect, validate(bankSchema), createBank);

// Update an existing bank record
router.put("/", protect, validate(updateBankSchema), updateBank);

// Delete a bank record
router.delete("/", protect, deleteBank);

// Get all bank records by user ID
router.get("/", protect, getBanksByUserId);

module.exports = router;