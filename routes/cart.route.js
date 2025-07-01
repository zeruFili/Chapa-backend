const express = require("express");
const { cartController } = require("../controllers"); // Import the cartController from the controllers index file
const { protectRoute } = require("../middleware/auth.middleware.js");
const validate = require('../middleware/validate'); // Your validation middleware
const { cartValidation } = require('../validations'); // Import cart validation

const router = express.Router();

// Route for getting cart products
router.get("/", protectRoute, validate(cartValidation.getCartProductsSchema), cartController.getCartProducts);

// Route for adding a product to the cart
router.post("/", protectRoute, validate(cartValidation.addToCartSchema), cartController.addToCart);

// Route for removing all items from the cart or a specific product
router.delete("/", protectRoute, validate(cartValidation.removeAllFromCartSchema), cartController.removeAllFromCart);

// Route for updating the quantity of a product in the cart
router.patch("/:id", protectRoute, validate(cartValidation.updateQuantitySchema), cartController.updateQuantity);

module.exports = router;