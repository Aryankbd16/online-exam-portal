import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import '../App.css'; // Import the CSS file
import backIcon from '../icons8-double-left-48.png'; // Import the logo

function Settings() {
  const navigate = useNavigate(); // Navigation hook

  // State for toggles
  const [notifications, setNotifications] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  // Function to navigate to the dashboard
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2 className="settings-title">Settings</h2>

        {/* Notification Toggle */}
        <div className="settings-field">
          <label>Notifications</label>
          <label className="switch">
            <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Theme Toggle */}
        <div className="settings-field">
          <label>Choose Theme</label>
          <label className="switch">
            <input type="checkbox" checked={darkTheme} onChange={() => setDarkTheme(!darkTheme)} />
            <span className="slider round"></span>
          </label>
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
      </div>
    </div>
  );
}

export default Settings;
