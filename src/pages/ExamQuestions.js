import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import axios from "axios";
import "../App.css"; 

const shuffleQuestions = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

function ExamQuestions() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure username and examName are properly retrieved and stored
  const [username, setUsername] = useState(() => {
    const storedUsername = localStorage.getItem("username");
    return storedUsername || location.state?.username || "";
  });

  const [examName, setExamName] = useState(() => {
    const storedExam = localStorage.getItem("examName");
    return storedExam || location.state?.exam || "Unknown Exam";
  });

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

    // Store values in localStorage for persistence
    if (location.state?.exam) {
      localStorage.setItem("examName", location.state.exam);
    }
    if (location.state?.username) {
      localStorage.setItem("username", location.state.username);
    }
  }, [location.state?.exam, location.state?.username]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers({ ...answers, [questionId]: selectedOption });
  };

  const isAnswered = (questionId) => answers[questionId] !== undefined;

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

  const handleSubmit = async () => {
    try {
      if (!username || !examName) {
        alert("Error: No username or exam name found.");
        return;
      }

      // Send API request to update user exam status
      await axios.post("http://localhost:5000/submit-exam", {
        username,
        examName,
      });

      alert("Exam Submitted Successfully!");
      navigate("/Dashboard"); // Redirect to Dashboard after submission
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Failed to submit exam.");
    }
  };

  return (
    <div className="exam-container">
      <div className="constant-box">
        <h3>Exam Info</h3>
        <p>Exam Name: {examName}</p> {/* Displays the selected exam name */}
        <p>Username: {username}</p> {/* Debugging purpose - Can be removed later */}
        <p>Total Questions: {questions.length}</p>
        <p>Attempted: {Object.keys(answers).length}</p>
      </div>

      <h1>Exam Questions</h1>

      {questions.length > 0 && (
        <div key={questions[currentQuestionIndex].id} className="question-card">
          <h2>Question {currentQuestionIndex + 1}</h2>
          <p>{questions[currentQuestionIndex].question}</p>

          {questions[currentQuestionIndex].options.map((option, idx) => (
            <div key={idx} className="option">
              <input
                type="radio"
                name={`question-${questions[currentQuestionIndex].id}`}
                value={option}
                checked={answers[questions[currentQuestionIndex].id] === option}
                onChange={() => handleAnswerChange(questions[currentQuestionIndex].id, option)}
              />
              <label>{option}</label>
            </div>
          ))}
        </div>
      )}

      <div className="navigation-buttons">
        {currentQuestionIndex > 0 && <button onClick={goToPreviousQuestion}>Previous</button>}
        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={goToNextQuestion}>Next</button>
        ) : (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>

      <div className="question-status">
        {questions.map((q, index) => (
          <span key={index} className={`status-box ${isAnswered(q.id) ? "answered" : "not-answered"}`}>
            {index + 1}
          </span>
        ))}
      </div>

      <div className="summary-card">
        <p>Attempted: {Object.keys(answers).length}</p>
        <p>Remaining: {questions.length - Object.keys(answers).length}</p>
      </div>
    </div>
  );
}

export default ExamQuestions;
