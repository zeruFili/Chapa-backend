const express = require("express");
const { UserController } = require("../controllers"); // Import the UserController

const {
    signupSchema,
    loginSchema,
    updateUserProfileSchema,
    deleteUserSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyEmailSchema
} = require("../validations/user.validation");

const { protect, adminValidator } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

// User registration
router.post("/signup", validate(signupSchema), UserController.signup);

// User login
router.post("/login", validate(loginSchema), UserController.login);

// Get user profile
router.get("/profile", protect, UserController.getMyProfile);

// Update user profile
router.put("/profile", protect, validate(updateUserProfileSchema), UserController.updateUserProfile);

// Delete user (admin only)
router.delete("/:id", protect, adminValidator, validate(deleteUserSchema), UserController.deleteUser);

// Get all users
router.get("/", protect, adminValidator, UserController.getAllUsers);

// Logout user
router.post("/logout", UserController.logout);

// Verify email
router.post("/verify-email", validate(verifyEmailSchema), UserController.verifyEmail);

// Forgot password
router.post("/forgot-password", validate(forgotPasswordSchema), UserController.forgotPassword);

// Reset password
router.post("/reset-password/:token", validate(resetPasswordSchema), UserController.resetPassword);

module.exports = router;