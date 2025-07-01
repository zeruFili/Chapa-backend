const express = require("express");
const { authController } = require("../controllers"); // Import the authController from the controllers index file

const { authValidation } = require('../validations'); 
const validate = require('../middleware/validate');

const router = express.Router();

// Uncomment this if you want to use it
// router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", validate(authValidation.signupSchema), authController.signup);
router.post("/login", validate(authValidation.loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/verify-email", validate(authValidation.verifyEmailSchema), authController.verifyEmail);
router.post("/forgot-password", validate(authValidation.forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password/:token", validate(authValidation.resetPasswordSchema), authController.resetPassword);

module.exports = router;