const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Regex Patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

// Schema Definition
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => EMAIL_REGEX.test(value),
        message: "Enter a valid email address",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: (value) => PHONE_REGEX.test(value),
        message: (props) =>
          `${props.value} is not a valid phone number (must be 10-15 digits, optional +)`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      maxlength: [60, "Password cannot exceed 60 characters"],
      validate: {
        validator: (value) => SPECIAL_CHAR_REGEX.test(value),
        message: "Password must contain at least one special character",
      },
    },
  },
  { timestamps: true }
);

// Pre-save Hook for Hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Password Check Method
UserSchema.methods.CheckPassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// Export Model
const User = mongoose.model("User", UserSchema);
module.exports = User;