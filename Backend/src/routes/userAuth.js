const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  verifyUserEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/userAuthController");

const { userAuth } = require("../middlewares/userAuthMiddleware");

router.post("/register", registerUser);
router.get("/verify-email", verifyUserEmail);
router.post("/login", loginUser);
router
  .route("/profile")
  .get(userAuth, getUserProfile)
  .put(userAuth, updateUserProfile);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
module.exports = router;
