
import React from "react";
import ChatMessage from "./ChatMessage";
import { ChatBubbleColors } from "./ChatSettings";
import { MessageSquare, Loader } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
  isFavorite?: boolean;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  onSpeak: (text: string, messageId: string) => void;
  onFavorite: (id: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  bubbleColors?: ChatBubbleColors;
  isTyping?: boolean;
  isSpeaking?: boolean;
  currentSpeakingId?: string;
  onPause?: () => void;
  onResume?: () => void;
  onSkipForward?: () => void;
  onSkipBackward?: () => void;
}

const ChatMessageList = ({
  messages,
  onSpeak,
  onFavorite,
  messagesEndRef,
  bubbleColors,
  isTyping = false,
  isSpeaking = false,
  currentSpeakingId,
  onPause,
  onResume,
  onSkipForward,
  onSkipBackward
}: ChatMessageListProps) => {
  // Default colors
  const defaultColors = {
    userBubble: "#D8CF21", // User bubble color
    botBubble: "#21A1D8"   // Pocket Pastor bubble color
  };
  
  // Use the provided colors or fallback to defaults
  const colors = bubbleColors || defaultColors;

  return (
    <div className="flex-1 h-full">
      <div className="pb-2">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            id={message.id}
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
            isFavorite={message.isFavorite}
            onSpeak={() => onSpeak(message.content, message.id)}
            onFavorite={onFavorite}
            bubbleColors={colors}
            isSpeaking={isSpeaking}
            currentSpeakingId={currentSpeakingId}
            onPause={onPause}
            onResume={onResume}
            onSkipForward={onSkipForward}
            onSkipBackward={onSkipBackward}
          />
        ))}
        
        {isTyping && (
          <div 
            className="chat-message-container w-[85%] bot-message text-black font-medium animate-pulse"
            style={{ backgroundColor: colors.botBubble }}
          >
            <div className="flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span>Pocket Pastor is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default React.memo(ChatMessageList);
