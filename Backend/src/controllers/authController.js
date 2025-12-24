const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const verifyUserEmail = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.query.token)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification link",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const registerUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  try {
    const doesExist = await User.findOne({ email });
    if (doesExist) {
      return res.status(400).json({
        message: "User with given email already exists",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: Date.now() + 24 * 60 * 60 * 1000,
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/api/user/verify-email?token=${token}`;

    await sendEmail({
      to: newUser.email,
      subject: "Verify your OneTap account",
      html: `
        <h2>Hello ${newUser.firstName},</h2>
        <p>Please verify your email to activate your account.</p>
        <a href="${verifyUrl}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    });
    const t = generateToken(newUser._id);
    res
      .status(201)
      .cookie("token", t, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })

      .json({
        message: "Registration successful. Please verify your email.",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.CheckPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      if (
        !user.emailVerificationExpiry ||
        user.emailVerificationExpiry < Date.now()
      ) {
        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hrs
        await user.save();

        const verifyUrl = `${process.env.FRONTEND_URL}/api/user/verify-email?token=${token}`;

        await sendEmail({
          to: user.email,
          subject: "Verify your OneTap account",
          html: `
            <h2>Hello ${user.firstName},</h2>
            <p>Your previous verification link expired.</p>
            <p>Please verify your email to activate your account.</p>
            <a href="${verifyUrl}">Verify Email</a>
            <p>This link expires in 24 hours.</p>
          `,
        });

        return res.status(403).json({
          message:
            "Email not verified. A new verification link has been sent to your email.",
        });
      }

      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profileImage: user.profileImage || "",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    phoneNumber: req.user.phoneNumber,
    role: req.user.role,
    profileImage: req.user.profileImage || "",
  });
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      user.profileImage = req.file.path;
    }
    if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
    if (req.body.phoneNumber !== undefined)
      user.phoneNumber = req.body.phoneNumber;
    if (req.body.password !== undefined) user.password = req.body.password;

    await user.save();

    res.status(200).json({
      message: "Profile updated",
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error("updateUserProfile error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Set OTP with 10 min expiry
    user.otpCode = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await user.save();

    // Send OTP via email
    await sendEmail({
      to: user.email,
      subject: "OneTap Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Your OneTap Password Reset OTP</h2>
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 48px; font-weight: bold; color: #b91c1c; margin: 0; letter-spacing: 8px;">
              ${otp}
            </h1>
            <p style="margin: 10px 0 0 0; color: #92400e;">This code expires in 10 minutes</p>
          </div>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ 
      email, 
      otpCode: otp,
      otpExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired OTP" 
      });
    }

    user.otpCode = undefined;
    user.otpExpiry = undefined;
    user.password = newPassword;
    
    await user.save();

    res.json({ 
      message: "Password reset successful",
      success: true 
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};


const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = newPassword;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  verifyUserEmail,
  forgotPassword,
  resetPassword,
  verifyOtpAndResetPassword
};
