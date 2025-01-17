const {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  addCity,
  getCities,
  getCity,
  deleteCity,
} = require("../controllers/userController");
const express = require("express");
const router = express.Router();

// Registration route
router.post("/register", registerUser);
// router.post("/verify", verifyEmail);
router.get("/verify/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Cities routes
router.post("/city", addCity); // Add city to user's cities list
router.get("/cities", getCities); // Get all cities for a user
router.get("/city/:cityId", getCity); // Get a specific city by ID
router.delete("/city/:cityId", deleteCity); // Delete a specific city by ID

module.exports = router;
