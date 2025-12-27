const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const { protectMechanic } = require("../middlewares/mechanicAuth.middleware");

const {
  registerMechanic,
  loginMechanic,
  getMechanicProfile,
  updateMechanicProfile,
  verifyMechanicEmail,
  mechanicForgotPassword,
  mechanicResetPassword,
  logoutMechanic,
} = require("../controllers/mechanicController");

router.post("/register", upload.single("profileImage"), registerMechanic);
router.post("/login", loginMechanic);
router.get("/verify-email", verifyMechanicEmail);
router.post("/logout", logoutMechanic);
router.post("/forgot-password", mechanicForgotPassword);
router.post("/reset-password", mechanicResetPassword);

router
  .route("/profile")
  .get(protectMechanic, getMechanicProfile)
  .put(protectMechanic, upload.single("profileImage"), updateMechanicProfile);

module.exports = router;
