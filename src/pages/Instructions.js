import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation to get the exam name
import "../App.css"; // Import the CSS file
import backIcon from "../icons8-double-left-48.png"; // Import back icon

function Instructions() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get exam name from Dashboard (fallback to localStorage)
  const examName = location.state?.exam || localStorage.getItem("examName") || "Unknown Exam";
  const [isChecked, setIsChecked] = useState(false);

  // Store exam name in localStorage for persistence
  if (location.state?.exam) {
    localStorage.setItem("examName", location.state.exam);
  }

  // Function to navigate to Verification.js without fullscreen enforcement
  const handleStartVerification = () => {
    if (!isChecked) {
      alert("Please agree to the terms before proceeding.");
      return;
    }

    // Navigate to Verification page without forcing fullscreen
    navigate("/Verification", { state: { exam: examName } });
  };

  return (
    <div>
      {/* Header Bar at the Top */}
      <div className="instructions-header">
        <span>Instructions for {examName}</span>

        {/* Back Button (Icon + Text) */}
        <div className="back-button" onClick={() => navigate("/Dashboard")}>
          <img src={backIcon} alt="Back" className="back-icon" />
          <span className="back-text">Back</span>
        </div>
      </div>

      {/* Rules Content - Centered on the Page */}
      <div className="rules-container">
        <div className="instructions-content">
          <h2 className="rules-title">Follow these rules to avoid disqualification:</h2>

          <h3 className="rules-section-title">✅ General Rules</h3>
          <ul className="rules-list">
            <li>Use a laptop/desktop/phone with a webcam & mic.</li>
            <li>Sit alone in a quiet, well-lit room.</li>
            <li>Ensure a stable internet connection.</li>
          </ul>

          <h3 className="rules-section-title">🚫 Security & Anti-Cheating Measures</h3>
          <ul className="rules-list">
            <li>No multiple tabs – Opening new tabs is prohibited.</li>
            <li>Stay on the exam page – Switching apps/tabs will be flagged.</li>
            <li>No copy-paste – Keyboard shortcuts are disabled.</li>
            <li>No multiple persons – AI detects extra faces, leading to warnings.</li>
            <li>Time-bound – Timer cannot be paused or extended.</li>
            <li>Voice detection – Talking or background noise may trigger warnings.</li>
          </ul>

          <p className="rules-footer">Submit before time runs out. All the best for the {examName} exam!</p>

          {/* Checkbox for Agreement */}
          <div className="agree-container">
            <input
              type="checkbox"
              id="agree"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className="agree-checkbox"
            />
            <label htmlFor="agree" className="agree-label">Agree</label>
          </div>

          {/* Submit Button (Navigates Without Full-Screen) */}
          <button className="Submit-button" disabled={!isChecked} onClick={handleStartVerification}>
            Ready for verification
          </button>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
