import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";
import "../App.css";
import TabSwitchDetector from "../components/TabSwitchDetector ";
import FullScreenEnforcer from "../components/FullScreenEnforcer";
import VoiceDetectionComponent from "../components/VoiceDetectionComponent";

const shuffleQuestions = (array) => array.sort(() => Math.random() - 0.5);

function ExamQuestions() {
  const navigate = useNavigate();
  const location = useLocation();
  const webcamRef = useRef(null);

  const username = localStorage.getItem("username") || location.state?.username || "";
  const examName = localStorage.getItem("examName") || location.state?.exam || "Unknown Exam";

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [violationCount, setViolationCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isTabActive, setIsTabActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10-minute exam
  const [showViolationCard, setShowViolationCard] = useState(false);
  const [violationMessage, setViolationMessage] = useState("");
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [registeredPhoto, setRegisteredPhoto] = useState(null);

  useEffect(() => {
    setQuestions(shuffleQuestions([
      { id: 1, question: "What is the capital of France?", options: ["Paris", "London", "Rome", "Berlin"], correctAnswer: "Paris" },
      { id: 2, question: "Which is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correctAnswer: "Jupiter" },
      { id: 3, question: "What is 5 + 3?", options: ["5", "8", "10", "15"], correctAnswer: "8" },
      { id: 4, question: "Which element has the chemical symbol 'O'?", options: ["Gold", "Oxygen", "Silver", "Iron"], correctAnswer: "Oxygen" },
      { id: 5, question: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Hemingway", "Tolstoy", "Dickens"], correctAnswer: "Shakespeare" },
      { id: 6, question: "What is the square root of 64?", options: ["6", "7", "8", "9"], correctAnswer: "8" },
      { id: 7, question: "Which continent is known as the 'Dark Continent'?", options: ["Asia", "Europe", "Africa", "Australia"], correctAnswer: "Africa" },
      { id: 8, question: "Who invented the telephone?", options: ["Edison", "Tesla", "Bell", "Einstein"], correctAnswer: "Bell" },
      { id: 9, question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "400,000 km/s", "100,000 km/s"], correctAnswer: "300,000 km/s" },
      { id: 10, question: "What is the capital of Japan?", options: ["Beijing", "Seoul", "Tokyo", "Bangkok"], correctAnswer: "Tokyo" }
    ]));
  }, []);

  // Session Timer - Auto Submit when time is up
  useEffect(() => {
    if (timeLeft <= 0) {
      submitExam("Time's up! Exam auto-submitted.");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Fetch registered photo
  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/get-registered-photo?username=${username}`)
      .then(response => {
        if (response.data.photo) {
          const formattedPhoto = `data:image/jpeg;base64,${response.data.photo}`;
          setRegisteredPhoto(formattedPhoto);
        } else {
          console.error("Error: No registered photo found in response.");
        }
      })
      .catch(error => console.error("Error fetching registered photo:", error));
  }, [username]);

  // Capture Image Every 2.5 Seconds for Identity Verification
  useEffect(() => {
    const faceVerificationInterval = setInterval(() => {
      captureImage();
    }, 2500);

    return () => clearInterval(faceVerificationInterval);
  }, [registeredPhoto]);

  // Function to Capture Webcam Image
  const captureImage = async () => {
    if (!registeredPhoto) {
      console.error("Error: Registered photo is missing.");
      return;
    }
  
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
  
      if (!imageSrc) {
        console.error("Error: Failed to capture image.");
        return;
      }
  
      // ✅ Log captured image
      console.log("Captured Image (Base64 Format):", imageSrc.substring(0, 100) + "..."); // Show first 100 chars
  
      verifyFace(imageSrc);
    }
  };
  
  

  // Verify Face Identity
  const verifyFace = async (liveImage) => {
    if (!registeredPhoto || !liveImage) {
      console.error("Error: Registered photo or live image is missing.");
      return;
    }
  
    // ✅ Log Base64 length for debugging
    console.log("Registered Photo (Base64 Length):", registeredPhoto.length);
    console.log("Live Image (Base64 Length):", liveImage.length);
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/verify", {
        registeredPhoto,
        liveImage,
        studentId: username
      });
  
      if (!response.data.match) {
        setViolationMessage("⚠️ Possible cheating detected! Face does not match the registered student.");
        setShowViolationCard(true);
      }
    } catch (error) {
      console.error("Error verifying face:", error.response?.data || error.message);
    }
  };
  

  // Submit Exam (Only if Violations ≥ 10 or Time Ends)
  const submitExam = async (message) => {
    if (violationCount < 10 && timeLeft > 0) {
      return;
    }

    try {
      await axios.post("http://localhost:5000/submit-exam", {
        username,
        examName,
        violations: violationCount,
      });

      setIsExamSubmitted(true);
      setViolationMessage(message);
      setShowViolationCard(true);
      navigate("/Dashboard");
    } catch (error) {
      console.error("Failed to submit exam:", error);
    }
  };

  // Handle Answer Selection
  const handleAnswerChange = (questionId, selectedOption) => {
    if (isFullScreen && isTabActive) {
      setAnswers({ ...answers, [questionId]: selectedOption });
    } else {
      setViolationMessage("Please return to fullscreen and stay on this tab to select an answer!");
      setShowViolationCard(true);
    }
  };

  return (
    <div className="exam-container" style={{ userSelect: "none" }}>
      <TabSwitchDetector setViolationCount={setViolationCount} />
      <FullScreenEnforcer setViolationCount={setViolationCount} setIsFullScreen={setIsFullScreen} />

      <div className="webcam-container">
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width="100%" height="100%" />
      </div>

      {!isExamSubmitted && (
        <VoiceDetectionComponent
          setViolationMessage={setViolationMessage}
          setShowViolationCard={setShowViolationCard}
        />
      )}

      {showViolationCard && (
        <div className="violation-card">
          <div className="violation-message-box">
            <h2>Violation Alert</h2>
            <p>{violationMessage}</p>
            <button onClick={() => setShowViolationCard(false)}>Okay</button>
          </div>
        </div>
      )}

<div className="constant-box">
        <h3>Exam Info</h3>
        <p>Exam Name: {examName}</p>
        <p>Username: {username}</p>
        <p>Total Questions: {questions.length}</p>
        <p>Attempted: {Object.keys(answers).length}</p>
        <p><strong>Violation Count:</strong> {violationCount}</p>
        <p><strong>Time Left:</strong> {timeLeft} seconds</p>
      </div>

      {questions.length > 0 && (
        <div key={questions[currentQuestionIndex].id} className="question-card">
          <p><strong>Q{currentQuestionIndex + 1}:</strong> {questions[currentQuestionIndex].question}</p>
          {questions[currentQuestionIndex].options.map((option) => (
            <label key={option} style={{ display: "block", margin: "5px 0" }}>
              <input
                type="radio"
                name={`question-${questions[currentQuestionIndex].id}`}
                value={option}
                checked={answers[questions[currentQuestionIndex].id] === option}
                onChange={() => handleAnswerChange(questions[currentQuestionIndex].id, option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}

      <div className="navigation-buttons">
        {currentQuestionIndex > 0 && <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>Previous</button>}
        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>Next</button>
        ) : (
          <button onClick={() => submitExam("Exam submitted successfully!")}>Submit</button>
        )}
      </div>
    </div>
  );
}

export default ExamQuestions;
