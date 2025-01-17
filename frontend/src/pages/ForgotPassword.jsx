import { useState } from "react";
import styles from "./ForgotPassword.module.css"; // Import the module CSS
import PageNav from "../components/PageNav"; // Import PageNav for navigation
import axios from "axios"; // Import axios for making the API request
import Button from "../components/Button"; // Import the Button component

export default function ForgotPassword() {
  const [email, setEmail] = useState(""); // State for the email input
  const [message, setMessage] = useState(""); // State for any response or error messages

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission
    try {
      // Make a POST request to the forgot-password API
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/forgot-password`,{email});
      setMessage(response.data.message); // Set the message from the API response
      setEmail("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <main className={styles.forgotPassword}>
      <PageNav /> {/* PageNav component for navigation */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Enter your email</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)} // Update email state
            value={email}
          />
        </div>
        <div>
          <Button type="primary">Send Reset Link</Button>{" "}
          {/* Button to submit the form */}
        </div>
        {/* {message && <p className={styles.message}>{message}</p>}{" "} */}
        {/* Show message if available */}
        {message && alert(message)}{" "}
      </form>
    </main>
  );
}
