import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(sessionStorage.getItem("user")) || null,
  isAuthenticated: !!sessionStorage.getItem("token"),
  token: sessionStorage.getItem("token") || null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "logout":
      return { ...state, user: null, token: null, isAuthenticated: false };
    default:
      throw new Error("Unknown action type");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, token }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const navigate = useNavigate();

  // Function to log in the user
  async function login(email, password) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        { email, password }
      );

      const { user, token } = response.data;

      // Save to sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      // Dispatch login action
      dispatch({ type: "login", payload: { user, token } });
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  }

  // Function to register a new user
  async function register({ firstName, lastName, email, password }) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
        { firstName, lastName, email, password }
      );
      const { message } = response.data;
      alert(message);
      navigate("/login");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error
      );
      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  }

  // Function to log out the user
  function logout() {
    dispatch({ type: "logout" });

    // Remove from sessionStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Navigate to home or login page
    navigate("/login", { replace: true });
  }

  // Effect to restore session on reload (already handled by initialState)
  useEffect(() => {
    if (!isAuthenticated && sessionStorage.getItem("token")) {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const token = sessionStorage.getItem("token");

      // Restore user and token into state
      dispatch({ type: "login", payload: { user, token } });
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");

  return context;
}

export { AuthProvider, useAuth };
