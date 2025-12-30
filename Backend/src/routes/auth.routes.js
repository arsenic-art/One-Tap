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
  verifyOtp,
  logoutUser
} = require("../controllers/authController");
const { userAuth } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.post("/register", registerUser);
router.get("/verify-email", verifyUserEmail);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router
.route("/profile")
.get(userAuth, getUserProfile)
.put(
  userAuth,
  upload.single("profileImage"),  
  updateUserProfile
);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);


module.exports = router;
