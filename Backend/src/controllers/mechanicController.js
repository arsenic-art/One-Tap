const Mechanic = require("../models/mechanic");
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
      emailVerificationExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hrs
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/api/mechanic/verify-email?token=${token}`;

    await sendEmail({
      to: mechanic.email,
      subject: "Verify your OneTap account",
      html: `
        <h2>Hello ${mechanic.firstName},</h2>
        <p>Please verify your email by clicking below:</p>
        <a href="${verifyUrl}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    });

    res
      .status(201)
      .cookie("token", generateToken(mechanic._id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Registration successful. Please verify your email.",
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.status(500).json({ message: err.message });
  }
};

const loginMechanic = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mechanic = await Mechanic.findOne({ email });
    if (!mechanic.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    if (!mechanic || !(await mechanic.CheckPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let token = generateToken(mechanic._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      }).json({
        _id: mechanic._id,
        firstName: mechanic.firstName,
        email: mechanic.email,
        token,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMechanicProfile = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.mechanic.id).select(
      "-password"
    );
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }
    res.json(mechanic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMechanicProfile = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.mechanic._id);
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    mechanic.firstName = req.body.firstName ?? mechanic.firstName;
    mechanic.lastName = req.body.lastName ?? mechanic.lastName;
    mechanic.phoneNumber = req.body.phoneNumber ?? mechanic.phoneNumber;

    if (req.file) {
      if (mechanic.profileImage) {
        const publicId = mechanic.profileImage.split("/").pop().split(".")[0];

        await cloudinary.uploader.destroy(`One Tap/${publicId}`);
      }

      mechanic.profileImage = req.file.path;
    }

    const updated = await mechanic.save();

    res.json({
      _id: updated._id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      phoneNumber: updated.phoneNumber,
      profileImage: updated.profileImage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

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
  mechanic.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

  await mechanic.save();

  const resetLink = `${process.env.FRONTEND_URL}/api/mechanic/reset-password?token=${resetToken}`;

  await sendEmail({
    to: mechanic.email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset</p>
      <a href="${resetLink}">Click here to reset password</a>
      <p>This link expires in 15 minutes</p>
    `,
  });

  res.json({ message: "Password reset email sent" });
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

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
};

module.exports = {
  registerMechanic,
  loginMechanic,
  getMechanicProfile,
  updateMechanicProfile,
  verifyMechanicEmail,
  forgotPassword,
  resetPassword,
};
