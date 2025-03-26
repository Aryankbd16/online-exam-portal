import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios";
import "../App.css";
import menuIcon from "../icons8-menu-50.png";
import closeIcon from "../left-arrow-in-circular-button-black-symbol.png";

function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState({ username: "", image: "", givenExams: [], notGivenExams: [] });

  // Session Timeout - 2 hours
  const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;
  let sessionTimer;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = localStorage.getItem("username"); // ✅ Get username dynamically
        if (!storedUsername) {
          console.error("No user found in localStorage");
          return;
        }
  
        const response = await axios.get(`http://localhost:5000/getUser/${storedUsername}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });
  
        console.log("Fetched user data:", response.data); // Debugging log
  
        // Convert image to Base64 format and store it in localStorage
        if (response.data.image) {
          const base64Image = `data:image/png;base64,${response.data.image}`;
          localStorage.setItem("userPhoto", base64Image); // ✅ Save to localStorage
        }
  
        setUser({
          ...response.data,
          image: response.data.image ? `data:image/png;base64,${response.data.image}` : ""
        });

        resetSessionTimer(); // ✅ Keep session timer functionality
      } catch (error) {
        console.error("Error fetching user data:", error);
        handleLogout();
      }
    };
  
    fetchUserData(); // ✅ Call the function inside useEffect

    // Reset session timer on user activity
    const resetTimer = () => resetSessionTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      clearTimeout(sessionTimer); // ✅ Ensure session timer is cleared
    };

  }, []); // ✅ Closing bracket and dependency array

  // Function to reset session timer
  const resetSessionTimer = () => {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => {
      handleLogout();
    }, SESSION_TIMEOUT);
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username"); // ✅ Ensure username is cleared on logout
    localStorage.removeItem("userPhoto"); // ✅ Clear stored user photo on logout
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Menu */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul>
          <li><Link to="/Profile" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>Profile</Link></li>
          <li><Link to="/Settings" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>Settings</Link></li>
        </ul>
        <img src={closeIcon} alt="Close Menu" className="close-icon" onClick={() => setIsSidebarOpen(false)} />
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <div className="top-bar">
          <div className="left-section">
            <img src={menuIcon} alt="Menu" className="menu-icon" onClick={() => setIsSidebarOpen(true)} />
            <h1 className="dashboard-title">Dashboard</h1>
          </div>

          {/* User Photo & Logout Button */}
          <div className="dashboard-user-container">
            <div className="user-box">
              {user.image ? (
                <img src={user.image} alt="User" className="user-photo" />
              ) : (
                <p>No Image Available</p>
              )}
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* Exams Frames */}
        <div className="frames-container">
          {/* Upcoming Exams Frame */}
          <div className="exam-frame upcoming">
            <h2>Upcoming Exams</h2>
            <ul>
              {user.notGivenExams.length > 0 ? user.notGivenExams.map((exam, index) => (
                <li key={index}>
                  <span className="exam-name" onClick={() => navigate("/Instructions", { state: { exam } })}>
                    {exam}
                  </span>
                </li>
              )) : <li>No upcoming exams</li>}
            </ul>
          </div>

          {/* Completed Exams Frame */}
          <div className="exam-frame completed">
            <h2>Completed Exams</h2>
            <ul>
              {user.givenExams.length > 0 ? user.givenExams.map((exam, index) => <li key={index}>{exam}</li>) : <li>No completed exams</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
