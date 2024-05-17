var express = require("express");
var router = express.Router();
const authController = require("../controllers/Auth/auth.controller");
const authRequest = require("../validations/auth.validation");

router.post("/register", authRequest.registerRequest, authController.register);
router.post("/login", authRequest.loginRequest, authController.login);
router.post(
    "/verify-email",
    authRequest.verifyEmailRequest,
    authController.verifyEmail
);
router.post(
    "/send-activation",
    authRequest.sendActivationRequest,
    authController.resendActivationEmail
);
router.post(
    "/forgot-password",
    authRequest.forgotPasswordRequest,
    authController.forgotPassword
);
router.post(
    "/reset-password",
    authRequest.resetPasswordRequest,
    authController.resetPassword
);

module.exports = router;
