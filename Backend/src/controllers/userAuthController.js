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

    res
      .status(201)
      .cookie("token", generateToken(newUser._id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
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
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
const updateUserProfile = async (req, res) => {
  const { firstName, lastName, phoneNumber, password } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      if (password) {
        user.password = password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNumber: updatedUser.phoneNumber,
        token: generateToken(updatedUser._id),
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/api/user/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
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
};
