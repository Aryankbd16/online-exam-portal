import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for redirection
import "../App.css";

function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    enrollmentNo: "",
    username: "",
    password: "",
    department: "",
    gender: "",
    image: null,
  });
 
  const goToLogin = () => {
    navigate('/Login');
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (!formData.fullName || !formData.enrollmentNo || !formData.username || 
        !formData.password || !formData.department || !formData.gender || !formData.image) {
      alert("All fields including the image are required!");
      return;
    }

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    console.log("Sending Form Data:", formData); // Debugging log

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        console.log("Signup successful, redirecting to login...");
        navigate("/login"); // Redirect after successful signup
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card increased-height">
        <h2 className="signin-title centered-title">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="signin-row">
            <input type="text" name="fullName" placeholder="Full Name" className="signin-input half-width" onChange={handleChange} required />
            <input type="text" name="enrollmentNo" placeholder="Enrollment No" className="signin-input half-width" onChange={handleChange} required />
          </div>

          <div className="signin-row">
            <input type="text" name="username" placeholder="Username" className="signin-input half-width" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" className="signin-input half-width" onChange={handleChange} required />
          </div>

          <div className="signin-row">
            <input type="text" name="department" placeholder="Department" className="signin-input department-input" onChange={handleChange} required />
          </div>

          <div className="gender-section">
            <label className="signin-label">Gender:</label>
            <div className="gender-options">
              <input type="radio" id="male" name="gender" value="male" onChange={handleChange} required />
              <label htmlFor="male" className="radio-label">Male</label>

              <input type="radio" id="female" name="gender" value="female" onChange={handleChange} required />
              <label htmlFor="female" className="radio-label">Female</label>

              <input type="radio" id="transgender" name="gender" value="transgender" onChange={handleChange} required />
              <label htmlFor="transgender" className="radio-label">Transgender</label>
            </div>
          </div>

          <div className="signin-row file-upload-row">
            <label className="signin-label">Upload Student’s Image:</label>
            <div className="file-upload-container">
              <label className="file-upload-label" htmlFor="file-upload">Choose File</label>
              <input type="file" id="file-upload" className="signin-input file-input" onChange={handleFileChange} required />
            </div>
          </div>

          <div className="signin-button-container">
            <button type="submit" className="signin-button">Sign Up</button>
          </div>
          <div>
        <label className="last-page-label" onClick={goToLogin}>
            Already have an aacount Login Here
          </label>
        </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
