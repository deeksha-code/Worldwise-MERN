import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import styles from "./VerifyEmail.module.css";

export default function VerifyEmail() {
  const { token } = useParams(); // Get the token from the URL
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false); // Track success

  // useEffect(() => {
  //   console.log("verifyEmail component rendered");
  //   async function verifyToken() {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3000/api/user/verify/${token}`
  //       );
  //       setMessage(response.data.message);
  //       setIsVerified(true); // Mark as verified on success
  //     } catch (error) {
  //       setMessage(error.response?.data?.message || "Verification failed");
  //       setIsVerified(false); // Mark as not verified on error
  //     }
  //   }

  //   if (token) {
  //     verifyToken();
  //   }
  // }, [token]);

  useEffect(() => {
    let isMounted = true; // Prevent redundant requests
    async function verifyToken() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/verify/${token}`);
        if (isMounted) {
          setMessage(response.data.message);
          setIsVerified(true);
        }
      } catch (error) {
        if (isMounted) {
          setMessage(error.response?.data?.message || "Verification failed");
          setIsVerified(false);
        }
      }
    }
    verifyToken();
    return () => {
      isMounted = false;
    }; // Cleanup to avoid duplicate calls
  }, [token]);

  return (
    <main className={styles.verifyEmail}>
      <div className={styles.messageContainer}>
        <p>{message}</p>
        {isVerified && ( // Show login button only on success
          <Link to="/login" className={styles.loginLink}>
            Go to Login
          </Link>
        )}
      </div>
    </main>
  );
}
