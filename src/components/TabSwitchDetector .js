import React, { useEffect } from "react";

const TabSwitchDetector = ({ setShowViolationCard, setViolationMessage, setViolationCount }) => {
  
    // Detect when the user switches tabs or minimizes the window
    const handleVisibilityChange = () => {
        if (document.hidden) {
            setShowViolationCard(true);
            setViolationMessage("⚠️ Tab switch detected! Please stay on the exam page.");
            setViolationCount((prev) => prev + 1);
        }
    };

    // Detect when the user clicks outside the browser (window loses focus)
    const handleWindowBlur = () => {
        setShowViolationCard(true);
        setViolationMessage("⚠️ Window focus lost! Please stay on the exam page.");
        setViolationCount((prev) => prev + 1);
    };

    // Listen for tab switch and focus loss events
    useEffect(() => {
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleWindowBlur); // Detects when user leaves the tab

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleWindowBlur);
        };
    }, []);

    return null; // This component doesn't render UI
};

export default TabSwitchDetector;
