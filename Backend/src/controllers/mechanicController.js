const Mechanic = require("../models/Mechanic");
const generateToken = require("../utils/generateToken");
const cloudinary = require("cloudinary").v2;
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

    res.status(201).json({
      message:
        "Registration successful. Please verify your email before logging in.",
      email: mechanic.email,
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
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const token = generateToken(mechanic._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    if (req.body.firstName !== undefined)
      mechanic.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) mechanic.lastName = req.body.lastName;
    if (req.body.phoneNumber !== undefined)
      mechanic.phoneNumber = req.body.phoneNumber;
    if (req.body.password !== undefined) mechanic.password = req.body.password;

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
    const mechanic = await Mechanic.findOne({ email });
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    mechanic.resetPasswordToken = hashedToken;
    mechanic.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

    await mechanic.save();

    const resetLink = `${process.env.FRONTEND_URL}/api/mechanic/reset-password?token=${resetToken}`;

    await sendEmail({
      to: mechanic.email,
      subject: "Reset your OneTap mechanic password",
      html: `
        <p>You requested a password reset.</p>
        <a href="${resetLink}">Click here to reset password</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("mechanicForgotPassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const mechanicResetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const mechanic = await Mechanic.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!mechanic) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    mechanic.password = newPassword;
    mechanic.resetPasswordToken = undefined;
    mechanic.resetPasswordExpiry = undefined;

    await mechanic.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("mechanicResetPassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerMechanic,
  loginMechanic,
  getMechanicProfile,
  updateMechanicProfile,
  verifyMechanicEmail,
  mechanicForgotPassword,
  mechanicResetPassword,
};
