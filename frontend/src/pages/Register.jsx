import { useState } from "react";
import styles from "./Register.module.css";
import PageNav from "../components/PageNav";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../contexts/FakeAuthContext";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();

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

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordError(validatePassword(value));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const error = validatePassword(formData.password);
    if (error) {
      setPasswordError(error);
      return;
    }
    // Simulate successful registration
    // console.log("User registered:", formData);
    register(formData);
  }

  return (
    <main className={styles.register}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            onChange={handleChange}
            value={formData.firstName}
            required
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            onChange={handleChange}
            value={formData.lastName}
            required
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <div className={styles.passwordInput}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              required
            />
            {formData.password && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            )}
          </div>
        </div>
        {passwordError && <p className={styles.error}>{passwordError}</p>}

        <div className={styles.linkContainer}>
          <Link to="/login" className={styles.loginLink}>
            Already registered? Login here
          </Link>
        </div>

        <div>
          <Button type="primary">Register</Button>
        </div>
      </form>
    </main>
  );
}
