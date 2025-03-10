import React, { useState } from 'react';
import '../App.css'; // Import the CSS file

function Settings() {
  // State for toggles
  const [notifications, setNotifications] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

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
      </div>
    </div>
  );
}

export default Settings;
