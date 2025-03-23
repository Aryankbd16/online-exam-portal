import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css"; // Import the CSS file for styling
import backIcon from "../icons8-double-left-48.png"; // Import back icon
import FullScreenEnforcer from "../components/FullScreenEnforcer"; // Import FullScreenEnforcer component

function Verification() {
  const [backendImage, setBackendImage] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFullScreenButton, setShowFullScreenButton] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const storedUsername = localStorage.getItem("username");

  useEffect(() => {
    const fetchBackendImage = async () => {
      try {
        if (!storedUsername) {
          console.error("No user found in localStorage");
          return;
        }

        const response = await axios.get(`http://localhost:5000/getUser/${storedUsername}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });

        if (response.data.image) {
          const compressedImage = await compressImage(`data:image/png;base64,${response.data.image}`);
          setBackendImage(compressedImage);
          console.log("Compressed Registered Image Size:", compressedImage.length / 1024, "KB");
        } else {
          console.log("No image found for the user.");
        }
      } catch (error) {
        console.error("Error fetching backend image:", error);
      }
    };

    fetchBackendImage();

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    const context = canvas.getContext("2d");
    const maxWidth = 250;
    const scaleFactor = maxWidth / video.videoWidth;

    canvas.width = maxWidth;
    canvas.height = video.videoHeight * scaleFactor;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const compressedLiveImage = canvas.toDataURL("image/jpeg", 0.3);
    console.log("Compressed Live Image Size:", compressedLiveImage.length / 1024, "KB");

    return compressedLiveImage;
  };

  const compressImage = async (base64Str) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 250;
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.4));
      };
    });
  };

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => {
        setIsFullScreen(true);
        setShowFullScreenButton(false);
        setTimeout(() => navigate("/ExamQuestions"), 2000);
      }).catch((error) => {
        console.error("Full-screen request failed:", error);
        alert("Full-screen mode is required to continue.");
      });
    } else {
      alert("Your browser does not support full-screen mode.");
    }
  };

  const handleVerificationClick = async () => {
    if (!backendImage) {
      alert("No registered image found. Please contact support.");
      return;
    }

    const liveImage = captureFrame();
    if (!liveImage) {
      alert("Failed to capture image from webcam. Try again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/verify",
        {
          registeredPhoto: backendImage,
          liveImage: liveImage,
          studentId: storedUsername
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          }
        }
      );

      console.log("Verification response:", response.data);

      if (response.data.match) {
        alert("Verification successful! Please enter full-screen mode.");
        setIsExamStarted(true);
        setShowFullScreenButton(true);
      } else {
        alert("Face verification failed. Please contact support.");
        setVerificationStatus("Face verification failed.");
      }
    } catch (error) {
      console.error("Error verifying image:", error);
      alert("An error occurred during verification. Please try again.");
    }
  };

  const handleBackClick = () => {
    navigate("/Instructions");
  };

  return (
    <div className="img-verification-container">
      <div className="img-verification-header">
        <h1>Image Verification</h1>
        <div className="back-button" onClick={handleBackClick}>
          <img src={backIcon} alt="Back" className="back-icon" />
          <span className="back-text">Back</span>
        </div>
      </div>

      {isExamStarted && (
        <FullScreenEnforcer setViolationCount={setViolationCount} setIsFullScreen={setIsFullScreen} />
      )}

      <div className="img-verification-content">
        <div className="camera-section">
          <h2>Live Camera</h2>
          <video ref={videoRef} autoPlay className="camera-video" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <div className="backend-image-section">
          <h2>Registered Image</h2>
          {backendImage ? (
            <img src={backendImage} alt="Backend" className="backend-image" />
          ) : (
            <p>Loading registered image...</p>
          )}
        </div>
      </div>

      {showFullScreenButton && (
        <div className="fullscreen-card">
          <h2>Exam Requires Full-Screen Mode</h2>
          <p>Click below to enter full-screen mode.</p>
          <button className="fullscreen-button" onClick={enterFullScreen}>Enter Full-Screen</button>
        </div>
      )}

      <div className="button-container">
        <button className="verification-button" onClick={handleVerificationClick}>
          Start Exam
        </button>
      </div>

      {verificationStatus && <p className="error-message">{verificationStatus}</p>}
    </div>
  );
}

export default Verification;
