
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, StopCircle } from "lucide-react";
import ChatPromptButtons from "./ChatPromptButtons";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  isProcessing: boolean;
  isListening: boolean;
  toggleSpeechRecognition: () => void;
  isMobile?: boolean;
  showPromptButtons?: boolean;
  isKeyboardVisible?: boolean;
}

const ChatInput = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isProcessing,
  isListening,
  toggleSpeechRecognition,
  isMobile = false,
  showPromptButtons = false,
  isKeyboardVisible = false
}: ChatInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle sending message and stop recording if active
  const handleSendWithRecordingCheck = () => {
    // If currently listening, stop the recording
    if (isListening) {
      toggleSpeechRecognition();
    }
    
    // Then send the message
    handleSendMessage();
  };

  const handlePromptSelect = (prompt: string) => {
    if (prompt) {
      // Add the prompt after the existing message with a space
      const newMessage = inputMessage ? `${inputMessage} ${prompt}` : prompt;
      setInputMessage(newMessage);
    }
    // Focus the input and scroll to the end after adding the prompt
    if (inputRef.current) {
      inputRef.current.focus();
      // Use setTimeout to ensure the value is updated before scrolling
      setTimeout(() => {
        if (inputRef.current) {
          // Set cursor position to the end and scroll to show it
          inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
          inputRef.current.scrollLeft = inputRef.current.scrollWidth;
        }
      }, 0);
    }
  };
  
  return (
    <div className="space-y-2">
      {showPromptButtons && (
        <ChatPromptButtons onPromptSelect={handlePromptSelect} />
      )}
      
      <div className="flex gap-2 items-center py-3">
        <Button 
          size="icon" 
          variant={isListening ? "destructive" : "outline"} 
          onClick={toggleSpeechRecognition} 
          disabled={isProcessing} 
          className={isListening ? "animate-pulse" : ""}
        >
          {isListening ? (
            <StopCircle className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
        
        <Input 
          ref={inputRef} 
          value={inputMessage} 
          onChange={e => setInputMessage(e.target.value)} 
          placeholder="Type your message or question..." 
          className="flex-1" 
          onKeyDown={e => {
            if (e.key === "Enter") handleSendWithRecordingCheck();
          }} 
          disabled={isProcessing}
          style={isMobile ? {
            fontSize: '16px', // Prevents zoom on iOS
            minHeight: '44px'  // Ensures proper touch target size
          } : {}}
        />
        
        <Button 
          size="icon" 
          variant="navy" 
          onClick={handleSendWithRecordingCheck} 
          disabled={!inputMessage.trim() || isProcessing}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
