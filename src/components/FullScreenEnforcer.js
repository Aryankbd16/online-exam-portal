import React, { useEffect, useState } from "react";

const FullScreenEnforcer = ({ setViolationCount, setIsFullScreen, setShowViolationCard, setViolationMessage }) => {
    const [showFullScreenPrompt, setShowFullScreenPrompt] = useState(false);

    // Detect when the user exits fullscreen
    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
            setShowViolationCard(true);
            setViolationMessage("⚠️ Fullscreen exit detected! Please stay in fullscreen mode.");
            setViolationCount((prev) => prev + 1);
            setShowFullScreenPrompt(true); // Show re-enter fullscreen prompt
            setIsFullScreen(false);
        } else {
            setIsFullScreen(true);
            setShowFullScreenPrompt(false); // Hide prompt if fullscreen is entered again
        }
    };

    // Listen for fullscreen change events
    useEffect(() => {
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("mozfullscreenchange", handleFullscreenChange);
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
            document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
        };
    }, []);

    // Function to re-enter fullscreen mode
    const enterFullScreen = () => {
        const elem = document.documentElement;

        if (elem.requestFullscreen) {
            elem.requestFullscreen().then(() => {
                setIsFullScreen(true);
                setShowFullScreenPrompt(false);
            }).catch(err => {
                console.error("Fullscreen request failed:", err);
            });
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        } else {
            alert("Your browser does not support full-screen mode.");
        }
    };

    return (
        <>
            {showFullScreenPrompt && (
                <div className="fullscreen-card">
                    <p>You must be in full-screen mode to continue the exam.</p>
                    <button className="fullscreen-button" onClick={enterFullScreen}>
                        Re-Enter Full Screen
                    </button>
                </div>
            )}
        </>
    );
};

export default FullScreenEnforcer;
