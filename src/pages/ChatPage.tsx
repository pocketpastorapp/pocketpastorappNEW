
import React, { useRef } from "react";
import ChatLayout from "@/components/ChatLayout";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatFooter from "@/components/chat/ChatFooter";
import SpeechInitializer from "@/components/chat/SpeechInitializer";
import { useChat } from "@/context/chat-context";
import { useChatScroll } from "@/hooks/chat/use-chat-scroll";
import { useChatMobile } from "@/hooks/chat/use-chat-mobile";
import { useChatPageState } from "@/hooks/chat/use-chat-page-state";
import { useChatAdapters } from "@/hooks/chat/use-chat-adapters";
import { useChatPageEffects } from "@/hooks/chat/use-chat-page-effects";
import { useChatPageLayout } from "@/hooks/chat/use-chat-page-layout";
import { ChatBubbleColors } from "@/components/chat/ChatSettings";

interface ChatPageProps {
  bubbleColors?: ChatBubbleColors;
}

const ChatPage = ({ bubbleColors: defaultBubbleColors = {
  userBubble: "#D8CF21",
  botBubble: "#21A1D8"
} }: ChatPageProps) => {
  // Use the chat context hook
  const {
    messages,
    inputMessage,
    setInputMessage,
    isProcessing,
    isSpeaking,
    isListening,
    currentSpeakingId,
    messagesEndRef,
    chatContainerRef,
    isLoading,
    handleSendMessage,
    toggleFavorite,
    toggleSpeechRecognition,
    handleSpeak,
    handlePause,
    handleResume,
    handleSkipForward,
    handleSkipBackward,
    handleSeek,
    audioDuration,
    audioProgress,
    isPaused,
    startNewSession,
    error
  } = useChat();

  const pageRef = useRef<HTMLDivElement>(null);

  // Use mobile hook
  const { isMobile, isKeyboardVisible, keyboardHeight } = useChatMobile({
    isSpeaking,
    isPaused,
    showPromptButtons: false // Will be updated by page state hook
  });

  // Use page state hook for bubble colors and prompt buttons
  const { bubbleColors, showPromptButtons, setShowPromptButtons } = useChatPageState({
    defaultBubbleColors,
    setInputMessage
  });

  // Use layout calculations hook
  const { getBottomPosition, getChatPadding } = useChatPageLayout({
    isMobile,
    isKeyboardVisible,
    keyboardHeight,
    showPromptButtons,
    isSpeaking,
    isPaused
  });

  // Use effects hook
  useChatPageEffects({
    setInputMessage,
    inputMessage,
    setShowPromptButtons,
    isMobile,
    isKeyboardVisible,
    keyboardHeight
  });

  // Use the unified scroll hook that respects speech state
  const { userScrolled, setUserScrolled } = useChatScroll({
    isSpeaking,
    messagesEndRef,
    chatContainerRef,
    messages
  });

  // Use adapter functions hook
  const {
    handleFavoriteToggle,
    handleSendMessageAdapter,
    handleSpeakAdapter,
    handleStartNewSession
  } = useChatAdapters({
    messages,
    toggleFavorite,
    handleSendMessage,
    handleSpeak,
    startNewSession,
    setShowPromptButtons,
    setUserScrolled
  });
  
  return (
    <ChatLayout>
      <div ref={pageRef} className="flex flex-col h-full relative">
        <ChatHeader 
          error={error}
          onStartNewSession={handleStartNewSession}
        />
        
        <ChatContainer
          messages={messages}
          onSpeak={handleSpeakAdapter}
          onFavorite={handleFavoriteToggle}
          messagesEndRef={messagesEndRef}
          chatContainerRef={chatContainerRef}
          bubbleColors={bubbleColors}
          isLoading={isLoading}
          isProcessing={isProcessing}
          isSpeaking={isSpeaking}
          currentSpeakingId={currentSpeakingId || undefined}
          onPause={handlePause}
          onResume={handleResume}
          onSkipForward={handleSkipForward}
          onSkipBackward={handleSkipBackward}
          chatPadding={getChatPadding()}
        />
        
        <ChatFooter
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessageAdapter}
          isProcessing={isProcessing}
          isListening={isListening}
          toggleSpeechRecognition={toggleSpeechRecognition}
          isMobile={isMobile}
          showPromptButtons={showPromptButtons}
          isKeyboardVisible={isKeyboardVisible}
          isSpeaking={isSpeaking}
          isPaused={isPaused}
          audioDuration={audioDuration}
          audioProgress={audioProgress}
          onPause={handlePause}
          onResume={handleResume}
          onSeek={handleSeek}
          onSkipBackward={handleSkipBackward}
          onSkipForward={handleSkipForward}
          bottomPosition={getBottomPosition()}
        />
      </div>
      
      <SpeechInitializer />
    </ChatLayout>
  );
};

export default ChatPage;
