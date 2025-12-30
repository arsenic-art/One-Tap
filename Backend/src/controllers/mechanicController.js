const Mechanic = require("../models/Mechanic");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const registerMechanic = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    const exists = await Mechanic.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Mechanic already exists" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const mechanic = await Mechanic.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      profileImage: req.file ? req.file.path : null,
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: Date.now() + 24 * 60 * 60 * 1000,
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/api/mechanic/verify-email?token=${token}`;

    res.status(201).json({
      message:
        "Registration successful. Please verify your email before logging in.",
      email: mechanic.email,
    });

    await sendEmail({
      to: mechanic.email,
      subject: "Verify your OneTap mechanic account",
      html: `
        <h2>Hello ${mechanic.firstName},</h2>
        <p>Please verify your email by clicking below:</p>
        <a href="${verifyUrl}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    });
  } catch (err) {
    console.error("registerMechanic error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyMechanicEmail = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.query.token)
      .digest("hex");

    const mechanic = await Mechanic.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: Date.now() },
    });

    if (!mechanic) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    mechanic.isEmailVerified = true;
    mechanic.emailVerificationToken = undefined;
    mechanic.emailVerificationExpiry = undefined;

    await mechanic.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("verifyMechanicEmail error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginMechanic = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mechanic = await Mechanic.findOne({ email });

    if (!mechanic || !(await mechanic.CheckPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!mechanic.isEmailVerified) {
      if (
        !mechanic.emailVerificationExpiry ||
        mechanic.emailVerificationExpiry < Date.now()
      ) {
        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

        mechanic.emailVerificationToken = hashedToken;
        mechanic.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000;
        await mechanic.save();

        const verifyUrl = `${process.env.FRONTEND_URL}/api/mechanic/verify-email?token=${token}`;

        await sendEmail({
          to: mechanic.email,
          subject: "Verify your OneTap mechanic account",
          html: `
            <h2>Hello ${mechanic.firstName},</h2>
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

      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const token = generateToken(mechanic._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: mechanic._id,
      firstName: mechanic.firstName,
      lastName: mechanic.lastName,
      email: mechanic.email,
      phoneNumber: mechanic.phoneNumber,
      role: mechanic.role,
      profileImage: mechanic.profileImage || "",
    });
  } catch (err) {
    console.error("loginMechanic error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMechanicProfile = async (req, res) => {
  try {
    if (!req.mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    res.json({
      _id: req.mechanic._id,
      firstName: req.mechanic.firstName,
      lastName: req.mechanic.lastName,
      email: req.mechanic.email,
      phoneNumber: req.mechanic.phoneNumber,
      role: req.mechanic.role,
      profileImage: req.mechanic.profileImage || "",
    });
  } catch (err) {
    console.error("getMechanicProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateMechanicProfile = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.mechanic._id);
    if (!mechanic)
      return res.status(404).json({ message: "Mechanic not found" });

    if (req.body.firstName) mechanic.firstName = req.body.firstName;
    if (req.body.lastName) mechanic.lastName = req.body.lastName;
    if (req.body.phoneNumber) mechanic.phoneNumber = req.body.phoneNumber;
    if (req.body.password) mechanic.password = req.body.password;

    if (req.body.deleteProfileImage === "true") {
      mechanic.profileImage = null;
    }

    if (req.file) {
      mechanic.profileImage = req.file.path;
    }

    const updated = await mechanic.save();

    res.json({
      message: "Profile updated",
      _id: updated._id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      phoneNumber: updated.phoneNumber,
      role: updated.role,
      profileImage: updated.profileImage || "",
    });
  } catch (err) {
    console.error("updateMechanicProfile error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

const mechanicForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const mechanic = await Mechanic.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!mechanic) {
      return res
        .status(404)
        .json({ message: "No mechanic account found with this email" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    mechanic.otpCode = otp;
    mechanic.otpExpiry = Date.now() + 10 * 60 * 1000; 

    await mechanic.save();

    await sendEmail({
      to: mechanic.email,
      subject: "OneTap Mechanic Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Your OneTap Mechanic Password Reset OTP</h2>
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

    res.json({
      message: "OTP sent to your email",
      email: mechanic.email,
    });
  } catch (err) {
    console.error("mechanicForgotPassword error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyMechanicOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const mechanic = await Mechanic.findOne({
      email: email.trim().toLowerCase(),
      otpCode: otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!mechanic) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    res.json({
      message: "OTP verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Verify mechanic OTP error:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

const mechanicResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return res.status(400).json({
        message: "Password must contain at least one special character",
      });
    }

    const mechanic = await Mechanic.findOne({
      email: email.trim().toLowerCase(),
      otpCode: otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!mechanic) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    mechanic.otpCode = undefined;
    mechanic.otpExpiry = undefined;
    mechanic.password = newPassword;

    await mechanic.save();

    res.json({
      message: "Password reset successful",
      success: true,
    });
  } catch (err) {
    console.error("mechanicResetPassword error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

const logoutMechanic = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({ message: "Mechanic logged out successfully" });
};

module.exports = {
  registerMechanic,
  loginMechanic,
  getMechanicProfile,
  updateMechanicProfile,
  verifyMechanicEmail,
  mechanicForgotPassword,
  verifyMechanicOtp,
  mechanicResetPassword,
  logoutMechanic,
};
