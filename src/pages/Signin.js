import React from 'react';
import "../App.css"; // Import the CSS file

function Signin() {
  return (
    <div className="signin-container">
      <div className="signin-card increased-height">
        <h2 className="signin-title centered-title">Sign Up</h2>
        
        {/* Row for Full Name and Enrollment No */}
        <div className="signin-row">
          <input type="text" placeholder="Full Name" className="signin-input half-width" />
          <input type="text" placeholder="Enrollment No" className="signin-input half-width" />
        </div>

        {/* Row for Username and Password */}
        <div className="signin-row">
          <input type="text" placeholder="Username" className="signin-input half-width" />
          <input type="password" placeholder="Password" className="signin-input half-width" />
        </div>

        {/* Department Field */}
        <div className="signin-row">
          <input type="text" placeholder="Department" className="signin-input department-input" />
        </div>

        {/* Gender Selection */}
        <div className="gender-section">
          <label className="signin-label">Gender:</label>
          <div className="gender-options">
            <input type="radio" id="male" name="gender" value="male" />
            <label htmlFor="male" className="radio-label">Male</label>

            <input type="radio" id="female" name="gender" value="female" />
            <label htmlFor="female" className="radio-label">Female</label>

            <input type="radio" id="transgender" name="gender" value="transgender" />
            <label htmlFor="transgender" className="radio-label">Transgender</label>
          </div>
        </div>

        {/* File Upload Section (Label & Button in Same Row) */}
        <div className="signin-row file-upload-row">
          <label className="signin-label">Upload Student’s Image:</label>
          <div className="file-upload-container">
            <label className="file-upload-label" htmlFor="file-upload">Choose File</label>
            <input type="file" id="file-upload" className="signin-input file-input" />
          </div>
        </div>

        {/* Sign Up Button (Positioned at Bottom) */}
        <div className="signin-button-container">
          <button className="signin-button">Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default Signin;
