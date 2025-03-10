import React, { useState } from "react";
import "../App.css"; // Import the CSS file
import menuIcon from "../icons8-menu-50.png"; // Import menu icon
import closeIcon from "../icons8-double-left-48.png"; // Import sidebar close icon
//import userPhoto from "../user-photo.png"; // Import user profile photo (replace with actual image)

function Dashboard() {
  // Sidebar visibility state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Exam lists (Can be modified dynamically)
  const [upcomingExams, setUpcomingExams] = useState(["Math Test", "Physics Quiz"]);
  const [completedExams, setCompletedExams] = useState(["Chemistry Midterm", "English Final"]);

  return (
    <div className="dashboard-container">
      {/* Sidebar Menu */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Sidebar Close Button */}
        <img
          src={closeIcon}
          alt="Close Menu"
          className="close-icon"
          onClick={() => setIsSidebarOpen(false)}
        />

        <ul>
          <li onClick={() => alert("Profile Clicked")}>Profile</li>
          <li onClick={() => alert("Settings Clicked")}>Settings</li>
        </ul>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Top Bar with Menu Icon, User Photo & Dotted Border */}
        <div className="top-bar">
          <div className="left-section">
            <img
              src={menuIcon}
              alt="Menu"
              className="menu-icon"
              onClick={() => setIsSidebarOpen(true)}
            />
            <h1 className="dashboard-title">Dashboard</h1>
          </div>

          {/* User Profile Box with Dotted Border */}
          <div className="user-box">
            {/* <img src={userPhoto} alt="User" className="user-photo" /> */}
            <p className="username">Aryan Sanjay Gole</p>
          </div>
        </div>

        {/* Two Frames Stacked Vertically */}
        <div className="frames-container">
          {/* Upcoming Exams Frame */}
          <div className="exam-frame upcoming">
            <h2>Upcoming Exams</h2>
            <ul>
              {upcomingExams.length > 0 ? (
                upcomingExams.map((exam, index) => <li key={index}>{exam}</li>)
              ) : (
                <li>No upcoming exams</li>
              )}
            </ul>
          </div>

          {/* Completed Exams Frame */}
          <div className="exam-frame completed">
            <h2>Completed Exams</h2>
            <ul>
              {completedExams.length > 0 ? (
                completedExams.map((exam, index) => <li key={index}>{exam}</li>)
              ) : (
                <li>No completed exams</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
