import React, { useEffect } from "react";

const TabSwitchDetector = ({ setViolationCount }) => {
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setViolationCount(prev => {
                    const newCount = prev + 1;
                    alert(`Warning! You switched tabs. Total violations: ${newCount}`);
                    return newCount;
                });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [setViolationCount]);

    return null; // This component does not render anything
};

export default TabSwitchDetector;
