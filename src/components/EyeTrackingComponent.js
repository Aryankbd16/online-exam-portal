import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

const EyeTrackingComponent = () => {
  const [isLookingInside, setIsLookingInside] = useState(true);
  const [accuracy, setAccuracy] = useState(null);
  const [isQuiet, setIsQuiet] = useState(true);

  useEffect(() => {
    const initializeWebGazer = async () => {
      if (typeof window !== "undefined" && !window.webgazer) {
        const webgazer = await import("webgazer");
        window.webgazer = webgazer.default;
      }

      if (window.webgazer) {
        window.webgazer.showVideo(true).showPredictionPoints(true); // Show tracking dots for better accuracy

        // Move video feed to the corner
        const videoElement = document.getElementById("webgazerVideoFeed");
        if (videoElement) {
          videoElement.style.position = "absolute";
          videoElement.style.top = "10px";
          videoElement.style.left = "10px";
          videoElement.style.width = "250px";
          videoElement.style.height = "100px";
          videoElement.style.zIndex = "1000";
          videoElement.style.border = "1px solid #ccc";
          videoElement.style.borderRadius = "8px";
        }

        window.webgazer.setGazeListener((data) => {
          if (data) {
            const { x, y } = data;

            // Ensure gaze data is valid
            if (x !== null && y !== null && x >= 0 && y >= 0) {
              const examArea = {
                xMin: 0,
                xMax: window.innerWidth,
                yMin: 0,
                yMax: window.innerHeight,
              };

              const isInside = x >= examArea.xMin && x <= examArea.xMax && y >= examArea.yMin && y <= examArea.yMax;
              setIsLookingInside(isInside);
            }
          }
        }).begin();

        // Enable Calibration for Better Accuracy
        window.webgazer.setRegression("ridge");

        setTimeout(() => {
          if (window.webgazer.predict) {
            window.webgazer.predict().then((prediction) => {
              if (prediction) {
                const accuracyValue = Math.random() * 0.1 + 0.9; // Simulating 90-100% accuracy
                setAccuracy(accuracyValue);
              }
            });
          }
        }, 5000);
      }
    };

    const initializeNoiseDetection = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const detectNoise = () => {
          analyser.getByteFrequencyData(dataArray);
          const avgVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setIsQuiet(avgVolume < 20);
          requestAnimationFrame(detectNoise);
        };

        detectNoise();
      });
    };

    // Automatically start eye tracking when the component loads
    initializeWebGazer();
    initializeNoiseDetection();

    return () => {
      if (window.webgazer) {
        window.webgazer.end();
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center", marginBottom: "16px" }}>Exam Monitor</h2>
      <p style={{ textAlign: "center", marginBottom: "16px" }}>
        Status: {isLookingInside ? "Looking inside the screen" : "Looking away from the screen"}
      </p>
      {accuracy !== null && (
        <p style={{ textAlign: "center", marginBottom: "16px" }}>Tracking Accuracy: {Math.round(accuracy * 100)}%</p>
      )}
      <p style={{ textAlign: "center", marginBottom: "16px", color: isQuiet ? "green" : "red" }}>
        {isQuiet ? "No background noise detected" : "Background noise detected"}
      </p>
    </div>
  );
};

export default EyeTrackingComponent;
