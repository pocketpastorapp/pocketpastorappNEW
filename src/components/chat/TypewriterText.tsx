
import React, { useState, useEffect, useRef, useMemo } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number; // Speed in milliseconds per character
  onComplete?: () => void;
  skipAnimation?: boolean; // New prop to skip animation for previously shown messages
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 30,  // Default typing speed (ms per character)
  onComplete,
  skipAnimation = false // Default to performing animation
}) => {
  // If skipAnimation is true, set full text immediately
  const [displayedText, setDisplayedText] = useState(skipAnimation ? text : "");
  const [isComplete, setIsComplete] = useState(skipAnimation);
  const textRef = useRef(text);
  const indexRef = useRef(0);
  
  useEffect(() => {
    // If we're skipping animation, just show the full text and mark as complete
    if (skipAnimation) {
      setDisplayedText(text);
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }
    
    // Reset if text content changes
    if (textRef.current !== text) {
      textRef.current = text;
      setDisplayedText("");
      indexRef.current = 0;
      setIsComplete(false);
    }

    // Return early if animation is already complete
    if (isComplete) return;

    // Handle typing animation
    const intervalId = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(prevText => {
          // Get next character
          const nextChar = text[indexRef.current];
          
          // Increment index for next iteration
          indexRef.current += 1;
          
          // Return new displayed text
          return prevText + nextChar;
        });
      } else {
        clearInterval(intervalId);
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, isComplete, onComplete, skipAnimation]);

  const rendered = useMemo(() => {
    if (!displayedText) return null;
    const parts = displayedText.split("\n");
    return parts.map((paragraph, index) => (
      <span key={index}>
        {paragraph}
        {index < parts.length - 1 && <br />}
      </span>
    ));
  }, [displayedText]);

  return <>{rendered}</>;
};

export default TypewriterText;
