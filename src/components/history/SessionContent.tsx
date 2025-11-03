
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import ChatMessage from "@/components/chat/ChatMessage";
import { ChatMessage as ChatMessageType } from "@/types/chat-types";
import { useNavigate } from "react-router-dom";

interface SessionContentProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  bubbleColors: {
    userBubble: string;
    botBubble: string;
  };
  speechActions?: {
    handleSpeak: (messageId: string, text: string) => void;
    handlePause: () => void;
    handleResume: () => void;
    handleSkipForward: () => void;
    handleSkipBackward: () => void;
    handleSeek: (position: number) => void;
    audioDuration: number;
    audioProgress: number;
    isPaused: boolean;
  };
  currentSpeakingId?: string | null;
}

const SessionContent = ({
  messages,
  isLoading,
  bubbleColors,
  speechActions,
  currentSpeakingId
}: SessionContentProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Speech and favorite handlers
  const handleSpeak = (messageId: string, text: string) => {
    if (speechActions) {
      speechActions.handleSpeak(messageId, text);
    } else {
      console.log("Speaking is not implemented in history view");
    }
  };
  
  const handleFavorite = (id: string) => {
    console.log("Favoriting is not implemented in history view");
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 w-full">
      {isLoading ? (
        <div className="flex justify-center py-20">
          <p className="text-muted-foreground">Loading conversation...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No messages found for this conversation.</p>
          <Button onClick={() => navigate("/history")} className="mt-4">
            Back to History
          </Button>
        </div>
      ) : (
        <div className="space-y-4 pb-20">
          {messages.map(message => (
            <ChatMessage 
              key={message.id} 
              id={message.id} 
              content={message.content} 
              sender={message.sender} 
              timestamp={message.timestamp} 
              onSpeak={(text: string) => handleSpeak(message.id, text)} 
              onFavorite={handleFavorite} 
              bubbleColors={bubbleColors}
              skipAnimation={true} // Skip animation for history view
              forceWhiteText={true} // Force white text for history pages
              isSpeaking={currentSpeakingId === message.id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default SessionContent;
