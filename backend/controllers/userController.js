const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const { sendVerificationEmail } = require("../utils/emailUtils"); // Utility function to send the email

// Registration function
const registerUser = async (req, res) => {
  try {
    console.log("entered registered user function");
    const { firstName, lastName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    // Generate a verification token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Calculate expiresAt based on the token expiration time
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Add 1 hour to current time

    // Save the verification token to the database
    const verificationToken = new VerificationToken({
      userId: newUser._id,
      token,
      expiresAt,
    });

    await verificationToken.save();

    // Send verification email
    const verificationUrl = `${process.env.BASE_URL}/verify/${token}`;
    await sendVerificationEmail(email, verificationUrl);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerUser };
