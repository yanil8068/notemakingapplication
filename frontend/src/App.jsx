import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useAuth } from "./context/AuthContext";
import Cookies from "js-cookie";

import "./App.css";

function App() {
  const { user, login } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state

  const token = Cookies.get("Note") || null; // Retrieve token from cookies
  console.log("token", token);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "true") {
      setIsDarkMode(true);
    }

    if (token && !user) {
      axios
        .get(`http://localhost:8000/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("user", response.data.user);
          login(response.data.user); // Save user data in context
          // Fetch and initialize cart after successful login
          setLoading(false); // Set loading to false when data is fetched
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // Clear token if invalid
          Cookies.remove("Note");
          setLoading(false); // Set loading to false when data is fetched
        });
    } else {
      setLoading(false); // Stop loading if no token is found
    }
  }, [user, token]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode); // Save to localStorage
      return newMode;
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 ">
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    ); // You can replace this with a spinner or any loading indicator
  }

  return (
    <div className={isDarkMode ? "dark-mode" : "light-mode"}>
      <div className="d-flex justify-content-center">
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <Routes>
        <Route path="/" element={<Login />} />

        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          <></>
        )}
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
