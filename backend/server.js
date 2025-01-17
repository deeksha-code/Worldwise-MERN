const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
//Admin register route
const user = require("./routes/userRoute");

// MongoDB connection URL

// Connect to MongoDB
mongoose
  .connect(process.env.dbURI)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

//middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow your frontend's origin
    credentials: true, // Allow cookies and headers if needed
  })
);
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/api/user", user);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// app.post("/send-email", sendEmail);
