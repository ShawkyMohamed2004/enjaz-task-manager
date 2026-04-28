const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../Controllers/authController");
const authenticator = require("../Middlewares/authMiddleware");

// --- Authentication Routes ---

// Local Auth
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/getUser", authController.getUser);

// Firebase Auth Sync
router.post("/firebase-auth", authController.firebaseAuth);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: process.env.FRONTEND_DOMAIN,
  successRedirect: `${process.env.FRONTEND_DOMAIN}/Home`,
}));

// Social Placeholders
router.get("/microsoft", (req, res) => authController.socialPlaceholder(req, res, "microsoft"));
router.get("/microsoft/callback", (req, res) => authController.socialPlaceholder(req, res, "microsoft"));
router.get("/apple", (req, res) => authController.socialPlaceholder(req, res, "apple"));
router.get("/apple/callback", (req, res) => authController.socialPlaceholder(req, res, "apple"));

// --- Password Reset Routes ---
router.post("/forgotpass", authController.forgotPassword);
router.post("/resetPassword/:id/:token", authController.resetPassword);

// --- Profile Routes ---
router.post("/editProfile", authenticator, authController.editProfile);
router.post("/updateFullProfile", authenticator, authController.updateFullProfile);
router.post("/updateNotifSettings", authenticator, authController.updateNotifSettings);
router.post("/deleteAccount", authenticator, authController.deleteAccount);

module.exports = {
  router,
  authenticator
};
