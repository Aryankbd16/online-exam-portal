import React from "react";
import "../App.css"; // Import the same CSS file for styling

function Verification() {
  return (
    <div>
      {/* Header Bar at the Top */}
      <div className="instructions-header">
        <span>Verification Process</span>
      </div>

      {/* Main Flex Container for Square & Main Card */}
      <div className="verification-wrapper">
        {/* Left Square with Black Dotted Border */}
        <div className="verification-square"></div>

        {/* Main Content Card (Unchanged Size) */}
        <div className="rules-container">
          <div className="instructions-content">
            {/* Box with Dark Black Dotted Border */}
            <div className="verification-box">
              <p>Verification Box</p>
            </div>

            {/* Proceed Button Directly Below the Box */}
            <div className="button-container">
              <button className="Submit-button">Proceed to Verification</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verification;
