var express = require("express");
var router = express.Router();
const AuthController = require("../controllers/Auth/auth.controller");
const AuthRequest = require("../validations/auth.validation");
const AuthorizationMiddleware = require("../middlewares/authorization.middleware");

/** Route dont need to be authenticated  */
router.post("/register", AuthRequest.registerRequest, AuthController.register);
router.post("/login", AuthRequest.loginRequest, AuthController.login);
router.post(
    "/verify-email",
    AuthRequest.verifyEmailRequest,
    AuthController.verifyEmail
);
router.post(
    "/send-activation",
    AuthRequest.sendActivationRequest,
    AuthController.resendActivationEmail
);
router.post(
    "/forgot-password",
    AuthRequest.forgotPasswordRequest,
    AuthController.forgotPassword
);
router.post(
    "/reset-password",
    AuthRequest.resetPasswordRequest,
    AuthController.resetPassword
);

/** Route need to be authenticated  */
router.use(AuthorizationMiddleware.verifyJWT);
router.get(
    "/current-user",
    AuthRequest.currentUserRequest,
    AuthController.currentUser
);
router.post("/logout");
router.put("/update-profile");

module.exports = router;
