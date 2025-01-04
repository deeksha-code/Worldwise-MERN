const { registerUser } = require("../controllers/userController");
const express = require("express");
const router = express.Router();

// Registration route
router.post("/register", registerUser);

module.exports = router;
