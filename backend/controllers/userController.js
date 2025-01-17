const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const { sendVerificationEmail } = require("../utils/emailUtils"); // Utility function to send the email
const { v4: uuidv4 } = require("uuid");

//use registration
const registerUser = async (req, res) => {
  try {
    // console.log("entered registered user function");
    const { firstName, lastName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user with the hashed password
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
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
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}/`;
    const subject = "Welcome to worldwise Application";
    const text = `Please verify your email by clicking on the following link: ${verificationUrl}`;
    await sendVerificationEmail(email, subject, text);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification.",
    });
  } catch (error) {
    // console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//user verifyEmail
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    // console.log("Token received:", token);

    const verificationToken = await VerificationToken.findOne({ token });
    // console.log("Verification token found:", verificationToken);

    if (!verificationToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (verificationToken.expiresAt < new Date()) {
      // console.log("Token expired:", verificationToken.expiresAt);
      await VerificationToken.deleteOne({ token });
      return res.status(400).json({ message: "Token has expired" });
    }

    const user = await User.findById(verificationToken.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    await VerificationToken.deleteOne({ token });

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    // console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token valid for 1 day
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    // console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//forgot password logic
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Save the reset token to the database
    const resetToken = new VerificationToken({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
    });

    await resetToken.save();

    // Send password reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}/`;
    const subject = "Reset Password";
    const text = `Please reset your password by clicking on the following link: ${resetUrl}`;
    await sendVerificationEmail(email, subject, text);

    res.status(200).json({
      message:
        "Password reset link sent to your email. Please check your inbox.",
    });
  } catch (error) {
    // console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//reset password logic
const resetPassword = async (req, res) => {
  try {
    // console.log("entered reset password");

    const { token } = req.params;
    const { newPassword } = req.body;

    // Verify the token
    const resetToken = await VerificationToken.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Check if the token has expired
    if (resetToken.expiresAt < new Date()) {
      await VerificationToken.deleteOne({ token }); // Remove expired token
      return res.status(400).json({ message: "Token has expired" });
    }

    // Find the user by the token's userId
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the reset token after successful reset
    await VerificationToken.deleteOne({ token });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    // console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new city to the user's list
const addCity = async (req, res) => {
  try {
    // console.log("Entered add city function");

    const userId = req.query.userId;
    const { cityName, country, emoji, date, position, notes } = req.body;
    // console.log("req.body", req.body);
    // console.log("req.query", userId);

    // Find the user by ID
    const user = await User.findById(userId);
    // console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new city object
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      position,
      notes,
    };

    // Add the city to the user's cities array
    user.cities.push(newCity);

    // Save the user
    await user.save();

    // Get the newly added city (now includes _id)
    const addedCity = user.cities[user.cities.length - 1];

    res
      .status(201)
      .json({ message: "City added successfully", city: addedCity });
  } catch (error) {
    // console.error("Error adding city:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get all cities for a user
const getCities = async (req, res) => {
  try {
    // console.log("Entered get cities function");

    const userId = req.query.userId;

    // Find the user and populate the cities field
    const user = await User.findById(userId).populate("cities");
    // console.log("user")
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.cities);
  } catch (error) {
    // console.error("Error fetching cities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific city for a user
const getCity = async (req, res) => {
  try {
    // console.log("Entered get city function");
    const userId = req.query.userId;
    const { cityId } = req.params;

    // Find the user and get the city by cityId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const city = user.cities.id(cityId);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(200).json(city);
  } catch (error) {
    // console.error("Error fetching city:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a specific city for a user
const deleteCity = async (req, res) => {
  try {
    // console.log("Entered delete city function");
    const userId = req.query.userId;
    const { cityId } = req.params;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("user", user);

    // Check if the city exists in the cities array
    const cityExists = user.cities.id(cityId);
    // console.log("city", cityExists);
    if (!cityExists) {
      return res.status(404).json({ message: "City not found" });
    }

    // Remove the city from the array
    user.cities.pull(cityId);

    // Save the updated user document
    await user.save();
    res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    // console.error("Error deleting city:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  addCity,
  getCities,
  getCity,
  deleteCity,
};
