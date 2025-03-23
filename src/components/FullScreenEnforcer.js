import React, { useEffect, useState } from "react";

const FullScreenEnforcer = ({ setViolationCount, setIsFullScreen }) => {
    const [showFullScreenPrompt, setShowFullScreenPrompt] = useState(false);

    useEffect(() => {
        const handleFullScreenChange = () => {
            if (!document.fullscreenElement) {
                setViolationCount(prev => {
                    const newCount = prev + 1;
                    alert(`Warning! You exited full-screen mode. Total violations: ${newCount}`);
                    return newCount;
                });
                setIsFullScreen(false);
                setShowFullScreenPrompt(true);
            }
        };

        document.addEventListener("fullscreenchange", handleFullScreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
        };
    }, [setViolationCount, setIsFullScreen]);

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
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, and Opera
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
