import { useEffect } from "react";

const TabFocus = ({ submitExam }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "F11" || // Prevent full-screen toggle
        (event.ctrlKey && event.key === "w") || // Prevent closing tab
        (event.ctrlKey && event.key === "Tab") || // Prevent tab switching
        (event.altKey && event.key === "Tab") || // Prevent Alt+Tab
        (event.metaKey && event.key === "ArrowLeft") || // Prevent Cmd+Left (Mac)
        (event.metaKey && event.key === "ArrowRight") || // Prevent Cmd+Right (Mac)
        (event.metaKey && event.key === "q") // Prevent Cmd+Q (Mac quit browser)
      ) {
        event.preventDefault();
        submitExam("Shortcut detected! Exam auto-submitted.");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [submitExam]);

  return null;
};

export default TabFocus;
