import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Import the CSS file
import backIcon from '../icons8-double-left-48.png'; // Import the logo
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function Profile() {
  const navigate = useNavigate(); // Navigation hook
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    console.log("Retrieved Username:", storedUsername); // Debugging log

    if (!storedUsername || storedUsername === "undefined" || storedUsername.trim() === "") {
      setError("No logged-in user found.");
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/getUser/${encodeURIComponent(storedUsername)}`)
      .then((response) => {
        console.log("Fetched User Data:", response.data); // Debugging log
        if (response.data && response.data.username) {
          setUser(response.data);
        } else {
          setError("User data not found.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Profile</h2>

        {loading ? (
          <p>Loading user data...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="profile-field">
              <label>Full Name</label>
              <p className="profile-text">{user.fullName || "Not Available"}</p>
            </div>

            <div className="profile-field">
              <label>Enrollment No</label>
              <p className="profile-text">{user.enrollmentNo || "Not Available"}</p>
            </div>

            <div className="profile-field">
              <label>Username</label>
              <p className="profile-text">{user.username || "Not Available"}</p>
            </div>

            <div className="profile-field">
              <label>Department</label>
              <p className="profile-text">{user.department || "Not Available"}</p>
            </div>
             {/* Back Icon & Last Page Label */}
        <div className="back-container">
          {/* Back Icon (Clickable) */}
          <img 
            src={backIcon} 
            alt="Go Back to Dashboard" 
            className="back-icon" 
            onClick={goToDashboard} 
          />
          
          {/* Last Page Label (Clickable) */}
          <label className="last-page-label" onClick={goToDashboard}>
            Last Page
          </label>
        </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
