
import { useMessageActions } from "./chat/use-message-actions";
import { useSpeechActions } from "./chat/use-speech-actions";

interface UseChatActionsProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  isSpeaking: boolean;
  setIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>;
  currentSpeakingId: string | null;
  setCurrentSpeakingId: React.Dispatch<React.SetStateAction<string | null>>;
  scrollToBottom: () => void;
  currentSessionId?: string | null;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useChatActions = (props: UseChatActionsProps) => {
  // Use the message actions hook
  const { handleSendMessage, toggleFavorite } = useMessageActions({
    messages: props.messages,
    setMessages: props.setMessages,
    inputMessage: props.inputMessage,
    setInputMessage: props.setInputMessage,
    isProcessing: props.isProcessing,
    setIsProcessing: props.setIsProcessing,
    scrollToBottom: props.scrollToBottom,
    currentSessionId: props.currentSessionId,
    setError: props.setError
  });

  // Use the speech actions hook
  const { 
    handleSpeak, 
    handlePause, 
    handleResume, 
    handleSkipForward, 
    handleSkipBackward,
    handleSeek,
    audioDuration,
    audioProgress,
    isPaused
  } = useSpeechActions({
    setIsSpeaking: props.setIsSpeaking,
    setCurrentSpeakingId: props.setCurrentSpeakingId
  });

  return {
    // Message related actions
    handleSendMessage,
    toggleFavorite,
    
    // Speech related actions
    handleSpeak,
    handlePause,
    handleResume,
    handleSkipForward,
    handleSkipBackward,
    handleSeek,
    
    // Audio state
    audioDuration,
    audioProgress,
    isPaused
  };
};

// Add the import for ChatMessage
import { ChatMessage } from "@/types/chat-types";
