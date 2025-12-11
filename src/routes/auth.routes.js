const { Router } = require("express");
const { userRegisterValidator, userLoginValidator, userForgotPasswordValidator, userPasswordValidator } = require("../validators");
const validate = require("../middlewares/validator.middleware");
const { register, login, logout, getCurrentUser, verifyEmail, resendVerificationEmail, refreshAccessToken, resetPassword, requestFogotPassword, changePassword } = require("../controllers/auth.controllers");
const { authenticateToken } = require("../middlewares/auth.middleware");
const router = Router();

router.route("/register").post(userRegisterValidator(), validate, register);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/logout").post(authenticateToken, logout);
router.route("/current-user").get(authenticateToken, getCurrentUser);
router.route("/verify-email/:verificationToken").post(verifyEmail);
router.route("/resend-verification-email").post(authenticateToken, resendVerificationEmail);
router.route("/refresh-access-token").post(authenticateToken, refreshAccessToken);
router.route("/reset-password").post(authenticateToken, userPasswordValidator(), resetPassword);
router.route("/forgot-password").post(authenticateToken, userForgotPasswordValidator(), requestFogotPassword);
router.route("/change-password").post(authenticateToken, userPasswordValidator(), changePassword);

module.exports = router;