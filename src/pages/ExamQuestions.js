import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../App.css";
import TabSwitchDetector from "../components/TabSwitchDetector ";
import FullScreenEnforcer from "../components/FullScreenEnforcer";
import EyeTrackingComponent from "../components/EyeTrackingComponent";

const shuffleQuestions = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

function ExamQuestions() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || location.state?.username || "";
  const examName = localStorage.getItem("examName") || location.state?.exam || "Unknown Exam";

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [violationCount, setViolationCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isTabActive, setIsTabActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showViolationCard, setShowViolationCard] = useState(false);
  const [violationMessage, setViolationMessage] = useState("");
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

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

  useEffect(() => {
    if (violationCount >= 10) {
      handleAutoSubmit("Exam auto-submitted due to multiple violations.");
    }
  }, [violationCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          handleAutoSubmit("Exam auto-submitted due to time limit.");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAutoSubmit = async (message) => {
    try {
      await axios.post("http://localhost:5000/submit-exam", {
        username,
        examName,
        violations: violationCount
      });

      setIsExamSubmitted(true); // Hide EyeTrackingComponent
      alert(message);
      navigate("/Dashboard");
    } catch (error) {
      alert("Failed to submit exam.");
    }
  };

  const handleViolation = (message) => {
    setViolationMessage(message);
    setShowViolationCard(true);
    setViolationCount((prev) => prev + 1);
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    if (isFullScreen && isTabActive) {
      setAnswers({ ...answers, [questionId]: selectedOption });
    } else {
      handleViolation("Please return to fullscreen and stay on this tab to select an answer!");
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isAnswered = (questionId) => {
    return answers.hasOwnProperty(questionId);
  };

  return (
    <div className="exam-container" style={{ userSelect: "none" }}>
      <TabSwitchDetector setViolationCount={setViolationCount} />
      <FullScreenEnforcer setViolationCount={setViolationCount} setIsFullScreen={setIsFullScreen} />
      
      {!isExamSubmitted && <EyeTrackingComponent />} {/* Hide after submission */}

      <div className="constant-box">
        <h3>Exam Info</h3>
        <p>Exam Name: {examName}</p>
        <p>Username: {username}</p>
        <p>Total Questions: {questions.length}</p>
        <p>Attempted: {Object.keys(answers).length}</p>
        <p><strong>Violation Count:</strong> {violationCount}</p>
        <p><strong>Time Left:</strong> {timeLeft} seconds</p>
      </div>

      {showViolationCard && (
        <div className="violation-card">
          <p>{violationMessage}</p>
          <button onClick={() => setShowViolationCard(false)}>Okay</button>
        </div>
      )}

      <h1>Exam Questions</h1>

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
        {currentQuestionIndex > 0 && <button onClick={goToPreviousQuestion}>Previous</button>}
        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={goToNextQuestion}>Next</button>
        ) : (
          <button onClick={() => handleAutoSubmit("Exam submitted successfully!")}>Submit</button>
        )}
      </div>
    </div>
  );
}

export default ExamQuestions;
