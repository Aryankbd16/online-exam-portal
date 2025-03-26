import React, { useEffect, useState } from "react";

const VoiceDetectionComponent = ({ setViolationMessage, setShowViolationCard }) => {
  const [isQuiet, setIsQuiet] = useState(true);
  const [lastNoiseViolationTime, setLastNoiseViolationTime] = useState(0);

  useEffect(() => {
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
          const currentTime = Date.now();

          if (avgVolume >= 100) {
            setIsQuiet(false);

            // Show warning for background noise but DO NOT increase violation count
            if (currentTime - lastNoiseViolationTime >= 50000000000) {
              setViolationMessage("Warning: Background noise detected! Please ensure a quiet environment.");
              setShowViolationCard(true);
              setLastNoiseViolationTime(currentTime);
            }
          } else {
            setIsQuiet(true);
          }

          requestAnimationFrame(detectNoise);
        };

        detectNoise();
      }).catch((error) => {
        console.error("Microphone access denied:", error);
      });
    };

    initializeNoiseDetection();

    return () => {
      console.log("Stopping noise detection...");
    };
  }, [lastNoiseViolationTime, setViolationMessage, setShowViolationCard]);

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center", marginBottom: "16px" }}>Voice Monitor</h2>
      <p style={{ textAlign: "center", marginBottom: "16px", color: isQuiet ? "green" : "red" }}>
        {isQuiet ? "No background noise detected" : "Background noise detected"}
      </p>
    </div>
  );
};

export default VoiceDetectionComponent;
