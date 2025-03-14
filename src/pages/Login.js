import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for redirection
import "../App.css"; 

function Login() {
  const navigate = useNavigate(); // Initialize navigation hook
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const goToSignin = () => {
    navigate('/Signin');
  };

  const [errorMessage, setErrorMessage] = useState(""); // Store error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setErrorMessage(""); // Clear previous errors

    try {
      console.log("Sending Login Request:", formData); // Debugging

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed");
        return;
      }

      // ✅ Store username in localStorage correctly
      if (data.username) {
        localStorage.setItem("username", data.username);
        localStorage.setItem("authToken", "your_auth_token"); // Optional: Store auth token if needed
      } else {
        setErrorMessage("Invalid response from server. Try again.");
        return;
      }

      alert(data.message);
      console.log("Login successful, redirecting...");
      navigate("/Dashboard"); // Redirect on successful login

    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login To Your Account</h2>

        <input type="text" name="username" className="login-input" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" className="login-input" placeholder="Password" onChange={handleChange} required />

        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show error message */}

        <button className="login-button" onClick={handleLogin}>Login</button>
        <div>
        <label className="last-page-label" onClick={goToSignin}>
            Have no account Sign In Here
          </label>
        </div>
      </div>
    </div>
  );
}

export default Login;
