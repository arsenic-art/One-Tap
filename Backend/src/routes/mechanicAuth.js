const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload"); // ✅ FIXED
const { protectMechanic } = require("../middlewares/mechanicAuth"); // ✅ FIXED

const {
  registerMechanic,
  loginMechanic,
  getMechanicProfile,
  updateMechanicProfile,
  verifyMechanicEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/mechanicController");

// Auth
router.post("/register", upload.single("profileImage"), registerMechanic);
router.post("/login", loginMechanic);
router.get("/verify-email", verifyMechanicEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Profile
router
  .route("/profile")
  .get(protectMechanic, getMechanicProfile)
  .put(
    protectMechanic,
    upload.single("profileImage"),
    updateMechanicProfile
  );

module.exports = router;
