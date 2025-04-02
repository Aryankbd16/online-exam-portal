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

  const handleSendOTP = async () => {
    // Ensure all fields except the image and OTP are filled
    if (!formData.fullName || !formData.enrollmentNo || !formData.username || 
        !formData.password || !formData.department || !formData.gender || !formData.email) {
        alert("All fields except the image and OTP are required!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullName: formData.fullName,
                enrollmentNo: formData.enrollmentNo,
                username: formData.username,
                password: formData.password,
                department: formData.department,
                email: formData.email,
                gender: formData.gender,
                image:null
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("OTP sent to your email!");
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Failed to send OTP.");
    }
};

// Function to verify OTP when 'Verify OTP' button is clicked
const handleVerifyOTP = async () => {
    const { email, otp } = formData;

    if (!email || !otp) {
        alert("Email and OTP are required!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("OTP verified successfully!");
            // Proceed to the signup process or redirect to the next step
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        alert("Failed to verify OTP.");
    }
};

const handleSubmit = async (e) => {
  e.preventDefault();


   // Validate the password
   const password = formData.password;
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
 
   if (!passwordRegex.test(password)) {
     alert("Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
     return;
   }
   
  // Ensure all fields are filled
  if (!formData.fullName || !formData.enrollmentNo || !formData.username || 
      !formData.password || !formData.department || !formData.gender || !formData.image) {
    alert("All fields including the image are required!");
    return;
  }

  // Prepare the FormData object to send to the server
  const formDataObj = new FormData();
  Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
  });

  console.log("Sending Form Data:", formData); // Debugging log

  try {
      // Send form data including the image to the server
      const response = await fetch("http://localhost:5000/signup", {
          method: "POST",
          body: formDataObj,
      });

      const data = await response.json();
      alert(data.message);

      // If signup is successful, redirect to login page
      if (response.ok) {
          console.log("Signup successful, redirecting to login...");
          navigate("/login");
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

          <div className="signin-row">
            <input type="text" name="email" placeholder="Email" className="signin-input department-input" onChange={handleChange} required />
          </div>

          
          <div className="signin-button-container">
            <button type="button" className="signin-button"onClick={handleSendOTP} >Send OTP</button>
          </div>

          <div className="signin-row">
            <input type="text" name="otp" placeholder="OTP" className="signin-input department-input" onChange={handleChange} required />
          </div>

          <div className="signin-button-container">
            <button type="button" className="signin-button"onClick={handleVerifyOTP} >Verify OTP</button>
          </div>

          <div className="signin-row file-upload-row">
            <label className="signin-label">Upload Student’s Image:</label>
            <div className="file-upload-container">
              <label className="file-upload-label" htmlFor="file-upload">Choose File</label>
              <input type="file" id="file-upload" className="signin-input file-input" onChange={handleFileChange} required />
            </div>
          </div> 

          <div className="signin-button-container">
            <button type="button" className="signin-button" onClick={handleSubmit}>Sign In</button>
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
