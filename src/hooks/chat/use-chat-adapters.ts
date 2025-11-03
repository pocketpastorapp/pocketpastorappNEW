
import { ChatMessage } from "@/types/chat-types";

interface UseChatAdaptersProps {
  messages: ChatMessage[];
  toggleFavorite: (id: string, isFavorite: boolean) => Promise<void>;
  handleSendMessage: (e?: React.FormEvent) => Promise<void>;
  handleSpeak: (id: string, text: string) => void;
  startNewSession?: () => Promise<void>;
  setShowPromptButtons: (show: boolean) => void;
  setUserScrolled: (scrolled: boolean) => void;
}

export const useChatAdapters = ({
  messages,
  toggleFavorite,
  handleSendMessage,
  handleSpeak,
  startNewSession,
  setShowPromptButtons,
  setUserScrolled
}: UseChatAdaptersProps) => {
  // Adapter function to match the expected signature for onFavorite
  const handleFavoriteToggle = (messageId: string) => {
    // Get the current favorite status from the message
    const message = messages.find(m => m.id === messageId);
    if (message) {
      // Toggle the current favorite status
      toggleFavorite(messageId, !message.isFavorite);
    }
  };
  
  // Adapter function to match the expected signature for handleSendMessage
  const handleSendMessageAdapter = (e?: React.FormEvent) => {
    // Hide prompt buttons when sending message
    setShowPromptButtons(false);
    // Reset user scroll state when sending new message
    setUserScrolled(false);
    // Pass the event to handleSendMessage if available
    handleSendMessage(e);
  };
  
  // Adapter function for handleSpeak to fix parameter order
  const handleSpeakAdapter = (text: string, messageId: string) => {
    // Call handleSpeak with parameters in the correct order: messageId first, then text
    handleSpeak(messageId, text);
  };

  const handleStartNewSession = () => {
    if (startNewSession) {
      startNewSession();
    }
    setShowPromptButtons(false);
    setUserScrolled(false);
  };

  return {
    handleFavoriteToggle,
    handleSendMessageAdapter,
    handleSpeakAdapter,
    handleStartNewSession
  };
};
