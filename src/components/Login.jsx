// src/components/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore"; // Correct path to your AuthStore

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [studentName, setStudentName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!studentName || !username || !password) {
      setError("All fields are required!");
      return;
    }

    setLoading(true); // Show loading spinner

    // Simulate login process (can replace with real API call)
    setTimeout(() => {
      if (username === "user" && password === "user") {
        const userData = { studentName, username };
        
        login(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Persist login session
        
        navigate("/dashboard");
      } else {
        setError("Invalid username or password. Try again.");
      }
      setLoading(false); // Hide loading spinner
    }, 1000); // Simulating API delay
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Student Login</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleLogin} className="login-form">
        <div className="input-container">
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <div className="input-container">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
