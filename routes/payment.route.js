const express = require("express");
const { protectRoute } = require("../middleware/auth.middleware.js");
const validate = require('../middleware/validate'); // Your validation middleware
const { paymentController } = require("../controllers"); // Import the paymentController from the controllers index file
const { paymentValidation } = require('../validations'); // Import payment validation

const router = express.Router();

// Route for creating a checkout session
router.post("/create-checkout-session", protectRoute, validate(paymentValidation.createCheckoutSessionSchema), paymentController.createCheckoutSession);

// Route for payment success verification
router.post("/checkout-success", protectRoute, validate(paymentValidation.checkoutSuccessSchema), paymentController.checkoutSuccess);

module.exports = router;