const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the city schema
const citySchema = new Schema({
  cityName: { type: String, required: true },
  country: { type: String, required: true },
  emoji: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String, default: "" },
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  // id: { type: String, required: true },
});

// Define the main user schema
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false }, // Add isVerified field with default false
    cities: { type: [citySchema], default: [] }, // Allow cities to be an empty array by default
  },
  {
    timestamps: true, // Optionally, add createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model("User", userSchema);
