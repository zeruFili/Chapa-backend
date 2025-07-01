const express = require("express");
const {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFeaturedProducts,
    getProductsByCategory,
    getRecommendedProducts,
    toggleFeaturedProduct,
    updateProduct
} = require("../controllers/product.controller.js");
const { adminRoute, protectRoute } = require("../middleware/auth.middleware.js");
const { productValidation } = require('../validations'); // Import product validation
const validate = require('../middleware/validate'); // Your validation middleware

const router = express.Router();

// Route for creating a product
router.post("/", protectRoute, adminRoute, validate(productValidation.createProductSchema), createProduct);

// Route for updating a product
router.patch("/:id", protectRoute, adminRoute, validate(productValidation.updateProductSchema), updateProduct);

// Route for deleting a product
router.delete("/:id", protectRoute, adminRoute, validate(productValidation.productIdSchema), deleteProduct);

// Route for getting products by category
router.get("/category/:category", validate(productValidation.categorySchema), getProductsByCategory);

// Route for toggling featured status of a product
router.patch("/featured/:id", protectRoute, adminRoute, validate(productValidation.toggleFeaturedSchema), toggleFeaturedProduct);

// Route for getting all products
router.get("/", getAllProducts);

// Route for getting featured products
router.get("/featured", getFeaturedProducts);

// Route for getting recommended products
router.get("/recommended", getRecommendedProducts);

module.exports = router;