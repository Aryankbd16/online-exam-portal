import React, { useState } from 'react';
import '../App.css'; // Import the CSS file

function Instructions() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      {/* Header Bar at the Top */}
      <div className="instructions-header">
        Instructions
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
            <li>Fullscreen mode – Must stay on; exiting may end your exam.</li>
            <li>No tab switching – Switching apps/tabs will be flagged.</li>
            <li>No copy-paste – Keyboard shortcuts are disabled.</li>
            <li>No multiple persons – AI detects extra faces, leading to warnings.</li>
            <li>Time-bound – Timer cannot be paused or extended.</li>
            <li>Voice detection – Talking or background noise may trigger warnings.</li>
          </ul>

          <p className="rules-footer">Submit before time runs out. All the best for the exams!!</p>

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

          {/* Submit Button */}
          <button className="Submit-button" disabled={!isChecked}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
