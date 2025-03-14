import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css";
import logo from "../oeplogo.png"; // Import your logo image

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <p className="portal-name">Online Exam Portal</p>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {/* <li><Link to="/Instructions">Instructions</Link></li> */}
        <li><Link to="/About">About Us</Link></li>
        <li>
          <Link to="/Signin">
            <button className="nav-button">Sign in</button>
          </Link>
        </li>
        <li>
          <Link to="/Login">
            <button className="nav-button">Login</button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
