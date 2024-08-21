const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = "testjwt";
const JWT_EXPIRATION = "1h";
const REFRESH_TOKEN_SECRET = "testjwtsecret"; // Secure refresh token secret

// Register route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = new User({ email, password: password });
    await user.save();

    const savedUser = await User.findOne({ email });
    console.log("Stored Password in DB:", savedUser.password); // Debugging line

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email } = req.body;
  const password = "123";
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("User's hashed password:", user.password);
    console.log("Password to compare:", password);

    const isMatch = await user.comparePassword(password);
    console.log("Password Match Result:", isMatch); // Debugging line
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET);

    res.json({ token, refreshToken });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Refresh token route
router.post("/token/refresh", async (req, res) => {
  const { refresh } = req.body;
  try {
    jwt.verify(refresh, REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const newAccessToken = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });
      res.json({ access: newAccessToken });
    });
  } catch (error) {
    console.error("Token Refresh Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
