
import React, { createContext, useContext } from "react";
import { useChatState } from "@/hooks/use-chat-state";
import { useChatActions } from "@/hooks/use-chat-actions";
import { ChatContextType } from "@/types/chat-types";

// Create the context with a default value that matches the expected structure
const ChatContext = createContext<ChatContextType>({
  messages: [],
  inputMessage: "",
  setInputMessage: () => {},
  isProcessing: false,
  isSpeaking: false,
  isListening: false,
  currentSpeakingId: null,
  isLoading: false,
  messagesEndRef: { current: null },
  chatContainerRef: { current: null },
  handleSendMessage: async () => {},
  toggleFavorite: async () => {},
  toggleSpeechRecognition: () => {},
  handleSpeak: () => {},
  handlePause: () => {},
  handleResume: () => {},
  handleSkipForward: () => {},
  handleSkipBackward: () => {},
  handleSeek: () => {},
  audioDuration: 0,
  audioProgress: 0,
  isPaused: false,
  currentSessionId: null,
  startNewSession: async () => {},
  error: null,
  setError: () => {}
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isProcessing,
    setIsProcessing,
    isSpeaking,
    setIsSpeaking,
    currentSpeakingId,
    setCurrentSpeakingId,
    isLoading,
    isListening,
    messagesEndRef,
    chatContainerRef,
    scrollToBottom,
    toggleSpeechRecognition,
    currentSessionId,
    startNewSession,
    error,
    setError
  } = useChatState();

  const {
    handleSendMessage,
    toggleFavorite,
    handleSpeak,
    handlePause,
    handleResume,
    handleSkipForward,
    handleSkipBackward,
    handleSeek,
    audioDuration,
    audioProgress,
    isPaused
  } = useChatActions({
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isProcessing,
    setIsProcessing,
    isSpeaking,
    setIsSpeaking,
    currentSpeakingId,
    setCurrentSpeakingId,
    scrollToBottom,
    currentSessionId,
    setError
  });

  // Create the context value object with all required properties
  const value: ChatContextType = {
    messages,
    inputMessage,
    setInputMessage,
    isProcessing,
    isSpeaking,
    isListening,
    currentSpeakingId,
    isLoading,
    messagesEndRef,
    chatContainerRef,
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
    currentSessionId,
    startNewSession,
    error,
    setError
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// The useChat hook that components will use to access the context
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

// Re-export types for easier imports
export type { ChatMessage } from "@/types/chat-types";
