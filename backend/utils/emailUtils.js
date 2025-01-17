const nodemailer = require("nodemailer");

// Function to send verification email
const sendVerificationEmail = async (email, subject,text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can change this to your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
      //   user: "shettypinky25@gmail.com",
      //   pass: "usfp zntr cvun mnuq",
      //actual paasword:Pinky@25
    },
  });

  const mailOptions = {
    from: "worldwise",
    to: email,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendVerificationEmail };
