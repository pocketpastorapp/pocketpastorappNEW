
import React from "react";

export const formatMessageContent = (content: string): React.ReactNode => {
  // Extract and format scripture references - Fixed regex pattern
  const parts = content.split(/\[([\w\s\d:,-]+)\]/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.match(/[\w\s\d:,-]+/) && (index % 2 === 1)) {
          // This is a scripture reference - Fixed regex pattern
          return (
            <span key={index} className="scripture-reference">
              {part}
            </span>
          );
        } else {
          // Regular text - preserve line breaks like TypewriterText does
          return part.split("\n").map((line, lineIndex) => (
            <span key={`${index}-${lineIndex}`}>
              {line}
              {lineIndex < part.split("\n").length - 1 && <br />}
            </span>
          ));
        }
      })}
    </>
  );
};
