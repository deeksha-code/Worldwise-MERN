import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) {
      login(email, password);
    }
  }

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <div className={styles.passwordInput}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              autoComplete="current-password"
              required
            />
            {password && ( // Conditionally render the button only when password has text
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            )}
          </div>
        </div>

        <div className={styles.linkContainer}>
          <Link to="/forgot-password" className={styles.forgotPassword}>
            Forgot Password?
          </Link>
          <Link to="/register" className={styles.registerLink}>
            Not registered? Register here
          </Link>
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
