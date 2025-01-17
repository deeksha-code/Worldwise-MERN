import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ResetPassword.module.css";
import PageNav from "../components/PageNav";
import axios from "axios";
import Button from "../components/Button";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Validate the password based on conditions
  function validatePassword(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNoWhitespace = /^\S*$/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUppercase) {
      return "Password must include at least one uppercase letter.";
    }
    if (!hasLowercase) {
      return "Password must include at least one lowercase letter.";
    }
    if (!hasDigit) {
      return "Password must include at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must include at least one special character.";
    }
    if (!hasNoWhitespace) {
      return "Password must not contain spaces.";
    }
    return "";
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    const error = validatePassword(newPassword);
    if (error) {
      setPasswordError(error);
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password/${token}`,
        { newPassword }
      );
      setMessage(response.data.message);
      setPasswordError("");
      // navigate("/login");
      setTimeout(() => {
        navigate("/login");
      }, 1000); // Adjust the delay (in milliseconds) as needed
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <main className={styles.resetPassword}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="newPassword">New Password</label>
          <div className={styles.passwordInput}>
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value));
              }}
              value={newPassword}
              required
            />
            {newPassword && ( // Conditionally render the button only when newPassword has text
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            )}
          </div>
        </div>
        {passwordError && <p className={styles.error}>{passwordError}</p>}{" "}
        {/* Show password validation error */}
        <div>
          <Button type="primary">Reset Password</Button>
        </div>
        {/* {message && <p className={styles.message}>{message}</p>} */}
        {message && alert(message)}{" "}
      </form>
    </main>
  );
}
