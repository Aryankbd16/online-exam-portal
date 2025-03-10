import React from 'react';
import '../App.css'; // Import the CSS file

function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Profile</h2>

        <div className="profile-field">
          <label>Full Name</label>
          <p className="profile-text">Aryan Sanjay Gole</p>
        </div>

        <div className="profile-field">
          <label>Enrollment No</label>
          <p className="profile-text">1234567890</p>
        </div>

        <div className="profile-field">
          <label>Department</label>
          <p className="profile-text">Computer Engineering</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
