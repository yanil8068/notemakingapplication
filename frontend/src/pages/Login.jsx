import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState("login"); // Toggle between "login" and "signup"

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        // Login flow
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}api/user/login`,
          {
            email,
            password,
          }
        );
        Cookies.set("Note", response.data.token, {
          expires: 7,
          path: "/",
          secure: true,
        });

        axios
          .get(`${import.meta.env.VITE_BACKEND_URL}api/user/me`, {
            headers: { Authorization: `Bearer ${response.data.token}` },
          })
          .then((response) => {
            console.log("user", response.data.user);
            login(response.data.user); // Save user data in context
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            Cookies.remove("Note");
          });

        navigate("/dashboard");
      } else {
        // Signup flow
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}api/user/register`,
          {
            name,
            email,
            password,
          }
        );
        alert("Signup successful! Please log in.");
        setMode("login"); // Switch to login mode after signup
      }
    } catch (error) {
      alert(`${mode === "login" ? "Login" : "Signup"} failed!`);
      console.error(error);
    }
  };
  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 ">
        <div
          className="card shadow-sm p-4"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h2 className="text-center mb-4">
            {mode === "login" ? "Login" : "Sign Up"}
          </h2>
          <form onSubmit={handleLogin}>
            {mode === "signup" && (
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="mb-1">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
