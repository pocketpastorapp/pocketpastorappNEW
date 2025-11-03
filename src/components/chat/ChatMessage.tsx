
import React, { useState, useEffect } from "react";
import MessageContent from "./MessageContent";
import MessageControls from "./MessageControls";
import { ChatBubbleColors } from "./ChatSettings";
import { shouldUseWhiteText } from "./ColorPicker";

interface ChatMessageProps {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
  isFavorite?: boolean;
  onSpeak: (text: string) => void;
  onFavorite: (id: string) => void;
  bubbleColors?: ChatBubbleColors;
  isSpeaking?: boolean;
  currentSpeakingId?: string;
  onPause?: () => void;
  onResume?: () => void;
  onSkipForward?: () => void;
  onSkipBackward?: () => void;
  skipAnimation?: boolean;
  forceWhiteText?: boolean;
}

// Get animated messages from localStorage or initialize empty set
const getAnimatedMessages = (): Set<string> => {
  const stored = localStorage.getItem("animatedMessages");
  return stored ? new Set(JSON.parse(stored)) : new Set<string>();
};

// Track messages that have already been animated
const animatedMessages = getAnimatedMessages();

// Format timestamp to show time and date in user's timezone
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  const timeString = date.toLocaleTimeString('en-US', timeOptions).toLowerCase();
  
  if (isToday) {
    return timeString;
  } else {
    const dateString = date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit'
    });
    return `${timeString} ${dateString}`;
  }
};

const ChatMessage = ({
  id,
  content,
  sender,
  timestamp,
  isFavorite,
  onSpeak,
  onFavorite,
  bubbleColors,
  isSpeaking = false,
  currentSpeakingId,
  onPause,
  onResume,
  onSkipForward,
  onSkipBackward,
  skipAnimation = false,
  forceWhiteText = false
}: ChatMessageProps) => {
  // Check if this message was created more than 5 seconds ago (indicating it's from history)
  const messageAge = Date.now() - new Date(timestamp).getTime();
  const isFromHistory = messageAge > 5000; // 5 seconds threshold
  
  // Determine if animation should be skipped
  const shouldSkipAnimation = skipAnimation || sender === "user" || animatedMessages.has(id) || isFromHistory;
  
  // Animation is complete immediately for messages that should skip animation
  const [animationComplete, setAnimationComplete] = useState(shouldSkipAnimation);
  
  // Mark message as animated when animation completes
  useEffect(() => {
    if (animationComplete && sender === "bot" && !shouldSkipAnimation) {
      animatedMessages.add(id);
      // Save to localStorage when a new message is animated
      localStorage.setItem("animatedMessages", JSON.stringify(Array.from(animatedMessages)));
    }
  }, [animationComplete, id, sender, shouldSkipAnimation]);
  
  // Default colors
  const defaultColors = {
    userBubble: "#D8CF21",
    botBubble: "#21A1D8"
  };
  
  // Use custom colors if provided, otherwise use defaults
  const colors = bubbleColors || defaultColors;
  
  // Set the bubble color based on sender
  const bubbleColor = sender === "user" ? colors.userBubble : colors.botBubble;
  const isCurrentlySpeaking = isSpeaking && currentSpeakingId === id;
  const isPaused = !isSpeaking && currentSpeakingId === id;
  
  // Determine if text should be white based on bubble color or forceWhiteText
  const useWhiteText = forceWhiteText || shouldUseWhiteText(bubbleColor);
  
  // Check if this is the welcome message
  const isWelcomeMessage = id === "welcome";
  
  return (
    <div className="mb-4 relative flex flex-col">
      {/* Timestamp - only show for non-welcome messages */}
      {!isWelcomeMessage && (
        <div className={`text-xs text-gray-500 mb-1 ${sender === "user" ? "text-right" : "text-left"}`}>
          {formatTimestamp(timestamp)}
        </div>
      )}
      
      <div className="flex items-start gap-0">
        <div
          className={`chat-message-container w-[85%] ${
            sender === "user" ? "user-message" : "bot-message"
          } ${useWhiteText ? "text-white" : "text-black"} font-medium`}
          style={{ backgroundColor: bubbleColor }}
        >
          <MessageContent 
            content={content}
            sender={sender}
            animationComplete={animationComplete}
            skipAnimation={shouldSkipAnimation}
            onAnimationComplete={() => setAnimationComplete(true)}
          />
        </div>
        
        {/* Message controls now positioned directly adjacent to the bubble for bot messages */}
        {sender === "bot" && (
          <div className="flex flex-col gap-1 py-2 px-1">
            <MessageControls 
              sender={sender}
              content={content}
              id={id}
              isFavorite={isFavorite}
              isCurrentlySpeaking={isCurrentlySpeaking}
              isPaused={isPaused}
              onSpeak={onSpeak}
              onFavorite={onFavorite}
              onPause={onPause}
              onResume={onResume}
              onRestart={() => onSpeak(content)}
              visible={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
const areEqual = (prev: ChatMessageProps, next: ChatMessageProps) => {
  return (
    prev.id === next.id &&
    prev.content === next.content &&
    prev.sender === next.sender &&
    prev.timestamp === next.timestamp &&
    prev.isFavorite === next.isFavorite &&
    prev.isSpeaking === next.isSpeaking &&
    prev.currentSpeakingId === next.currentSpeakingId &&
    prev.skipAnimation === next.skipAnimation &&
    prev.forceWhiteText === next.forceWhiteText &&
    (prev.bubbleColors?.userBubble ?? '') === (next.bubbleColors?.userBubble ?? '') &&
    (prev.bubbleColors?.botBubble ?? '') === (next.bubbleColors?.botBubble ?? '')
  );
};

export default React.memo(ChatMessage, areEqual);
