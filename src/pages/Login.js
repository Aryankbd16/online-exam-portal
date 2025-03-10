import React from 'react';
import "../App.css"; // Import Login-specific CSS

function Login() {
  const handleLogin =()=>{
    console.log("login is been attempted");
  }
  return (
      <div className="login-container"> {/* Centering wrapper */}
        <div className="login-card">
          <h2 className="login-title">Login To Your Account</h2>

          {/* Input Fields */}
          <input type="text" className="login-input" placeholder="Username" />
          <input type="password" className="login-input" placeholder="Password" />

          {/* Login Button */}
          <button className="login-button" onClick={handleLogin}>Login</button>
        </div>
      </div>
  );
}

export default Login;
