require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db.js");
const PORT = process.env.PORT || 3000;
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./model/User.js");
const mechanicSchema = require("./model/NewMechanicForm.js");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());



app.post("/mechanicApi/registeruser", async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({ firstName, lastName, email, phoneNumber, password });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/mechanicApi/loginuser", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.CheckPassword(password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });


    res.status(200).json({
      message: "Login successful",
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/mechanicApi/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), 
  });
  res.status(200).json({ message: "Logout successful" });
});


app.post("/mechanicApi/registermechanic", async (req, res) => {
  try {
    const { email } = req.body;
    
    const existingMechanic = await mechanicSchema.findOne({ email });
    if (existingMechanic) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const newMechanic = new mechanicSchema(req.body);
    await newMechanic.save();

    res.status(201).json({
      message: "Application submitted successfully! We will be in touch soon.",
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ errors });
    }
    console.error("Error during mechanic registration:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});


app.post("/mechanicApi/loginmechanic", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const mechanic = await MechanicApplication.findOne({ email: email.toLowerCase().trim() });
    if (!mechanic) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    const isPasswordValid = await bcrypt.compare(password, mechanic.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.status(200).json({
      message: "Login successful.",
      mechanic: {
        id: mechanic._id,
        fullName: mechanic.fullName,
        email: mechanic.email,
        location: mechanic.location,
      },
    });
  } catch (err) {
    console.error("Error during mechanic login:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("App is listening on ", PORT);
  });
});
