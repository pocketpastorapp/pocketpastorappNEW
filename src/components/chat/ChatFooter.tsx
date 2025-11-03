
import React from "react";
import ChatInput from "./ChatInput";
import AudioPlayer from "./AudioPlayer";

interface ChatFooterProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e?: React.FormEvent) => void;
  isProcessing: boolean;
  isListening: boolean;
  toggleSpeechRecognition: () => void;
  isMobile: boolean;
  showPromptButtons: boolean;
  isKeyboardVisible: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  audioDuration: number;
  audioProgress: number;
  onPause: () => void;
  onResume: () => void;
  onSeek: (position: number) => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  bottomPosition: string;
}

const ChatFooter = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isProcessing,
  isListening,
  toggleSpeechRecognition,
  isMobile,
  showPromptButtons,
  isKeyboardVisible,
  isSpeaking,
  isPaused,
  audioDuration,
  audioProgress,
  onPause,
  onResume,
  onSeek,
  onSkipBackward,
  onSkipForward,
  bottomPosition
}: ChatFooterProps) => {
  return (
    <div 
      className="fixed left-0 right-0 bg-background border-t transition-all duration-200 ease-out"
      style={{ 
        bottom: bottomPosition,
        zIndex: 30
      }}
    >
      {(isSpeaking || isPaused) && (
        <div className="relative z-10">
          <AudioPlayer 
            isPlaying={isSpeaking && !isPaused}
            duration={audioDuration}
            currentTime={audioProgress}
            onPause={onPause}
            onPlay={onResume}
            onSeek={onSeek}
            onSkipBackward={onSkipBackward}
            onSkipForward={onSkipForward}
          />
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-20">
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isProcessing={isProcessing}
          isListening={isListening}
          toggleSpeechRecognition={toggleSpeechRecognition}
          isMobile={isMobile}
          showPromptButtons={showPromptButtons}
          isKeyboardVisible={isKeyboardVisible}
        />
      </div>
    </div>
  );
};

export default ChatFooter;
