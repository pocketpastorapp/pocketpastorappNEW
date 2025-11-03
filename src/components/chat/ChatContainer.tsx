
import React from "react";
import ChatMessageList from "./ChatMessageList";
import { ChatBubbleColors } from "./ChatSettings";
import { ChatMessage } from "@/types/chat-types";
import { Loader } from "lucide-react";

interface ChatContainerProps {
  messages: ChatMessage[];
  onSpeak: (text: string, messageId: string) => void;
  onFavorite: (messageId: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  bubbleColors: ChatBubbleColors;
  isLoading: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  currentSpeakingId?: string;
  onPause?: () => void;
  onResume?: () => void;
  onSkipForward?: () => void;
  onSkipBackward?: () => void;
  chatPadding: string;
}

const ChatContainer = ({
  messages,
  onSpeak,
  onFavorite,
  messagesEndRef,
  chatContainerRef,
  bubbleColors,
  isLoading,
  isProcessing,
  isSpeaking,
  currentSpeakingId,
  onPause,
  onResume,
  onSkipForward,
  onSkipBackward,
  chatPadding
}: ChatContainerProps) => {
  return (
    <div 
      ref={chatContainerRef} 
      className="flex-1 overflow-y-auto mb-4 scroll-smooth"
      style={{ 
        paddingBottom: chatPadding,
        overscrollBehavior: 'contain'
      }}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-32 mt-8">
          <Loader className="h-6 w-6 animate-spin mb-2" />
          <p className="text-sm text-muted-foreground">Loading chat messages...</p>
        </div>
      ) : (
        <ChatMessageList 
          messages={messages}
          onSpeak={onSpeak}
          onFavorite={onFavorite}
          messagesEndRef={messagesEndRef}
          bubbleColors={bubbleColors}
          isTyping={isProcessing}
          isSpeaking={isSpeaking}
          currentSpeakingId={currentSpeakingId}
          onPause={onPause}
          onResume={onResume}
          onSkipForward={onSkipForward}
          onSkipBackward={onSkipBackward}
        />
      )}
    </div>
  );
};

export default React.memo(ChatContainer);
