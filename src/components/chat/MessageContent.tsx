
import React, { useMemo } from "react";
import { formatMessageContent } from "@/utils/messageFormatting";
import TypewriterText from "./TypewriterText";

interface MessageContentProps {
  content: string;
  sender?: "user" | "bot";
  animationComplete?: boolean;
  skipAnimation?: boolean;
  onAnimationComplete?: () => void;
}

const MessageContent = ({
  content,
  sender = "bot",
  animationComplete = true,
  skipAnimation = true,
  onAnimationComplete = () => {}
}: MessageContentProps) => {
  const formatted = useMemo(() => formatMessageContent(content), [content]);
  return (
    <div className="text-base">
      {sender === "bot" && !skipAnimation ? (
        <TypewriterText 
          text={content} 
          speed={30} 
          skipAnimation={skipAnimation}
          onComplete={onAnimationComplete}
        />
      ) : (
        formatted
      )}
    </div>
  );
};

export default MessageContent;
