
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useChatMessages, createWelcomeMessage } from "./chat/use-chat-messages";
import { useChatSession } from "./chat/use-chat-session";
import { useChatInput } from "./chat/use-chat-input";
import { useChatSpeech } from "./chat/use-chat-speech";
import { useChatUI } from "./chat/use-chat-ui";
import { useChatInitialization } from "./chat/use-chat-initialization";
import { useNewSession } from "./chat/use-new-session";

export const useChatState = () => {
  const { user } = useAuth();
  const userId = user?.id;
  
  const {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    error,
    setError,
    loadSessionMessages,
    saveMessage
  } = useChatMessages();
  
  const {
    inputMessage,
    setInputMessage,
    isProcessing,
    setIsProcessing,
    isListening,
    toggleSpeechRecognition
  } = useChatInput();
  
  const {
    currentSessionId,
    setCurrentSessionId,
    hasInitialized,
    setHasInitialized,
    startNewSession,
    initializeSession
  } = useChatSession(userId);
  
  const {
    isSpeaking,
    setIsSpeaking,
    currentSpeakingId,
    setCurrentSpeakingId
  } = useChatSpeech();
  
  const {
    messagesEndRef,
    chatContainerRef,
    scrollToBottom
  } = useChatUI();

  // Initialize chat using the dedicated initialization hook
  useChatInitialization({
    hasInitialized,
    setHasInitialized,
    setIsLoading,
    setError,
    setCurrentSessionId,
    setMessages,
    loadSessionMessages,
    saveMessage,
    startNewSession,
    createWelcomeMessage
  });
  
  // REMOVED: The problematic auto-scroll effect that was conflicting with the speech-aware scroll system
  // The scrolling is now handled entirely by the useChatScroll hook in ChatPage
  
  // Use the new session hook with setCurrentSessionId
  const { handleStartNewSession } = useNewSession({
    user,
    currentSessionId,
    setIsLoading,
    setError,
    setMessages,
    setCurrentSessionId,
    startNewSession,
    saveMessage,
    createWelcomeMessage,
    scrollToBottom
  });

  return {
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
    startNewSession: handleStartNewSession,
    error,
    setError
  };
};
