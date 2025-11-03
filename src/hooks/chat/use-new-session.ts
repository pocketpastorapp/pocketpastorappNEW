
import { PreferencesService } from "@/services/preferencesService";
import { ChatMessage } from "@/types/chat-types";

interface UseNewSessionProps {
  user: any;
  currentSessionId: string | null;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setMessages: (value: ChatMessage[]) => void;
  setCurrentSessionId: (value: string | null) => void;
  startNewSession: () => Promise<string | null>;
  saveMessage: (message: ChatMessage) => Promise<void>;
  createWelcomeMessage: (sessionId?: string) => ChatMessage;
  scrollToBottom: () => void;
}

export const useNewSession = ({
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
}: UseNewSessionProps) => {
  // Enhanced new session handler - transfers current chat to history using database
  const handleStartNewSession = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("=== STARTING NEW CHAT SESSION ===");
      
      // Clear the current session from database so it moves to history
      const previousSessionId = currentSessionId;
      if (previousSessionId) {
        console.log("Previous session will now be available in history:", previousSessionId);
        await PreferencesService.clearCurrentSessionId();
      }
      
      // Start new session and get the new session ID
      const newSessionId = await startNewSession();
      
      if (newSessionId) {
        console.log("=== NEW SESSION CREATED ===");
        console.log("New session ID:", newSessionId);
        
        // Update the current session ID in state
        setCurrentSessionId(newSessionId);
        
        // Reset messages with just the welcome message for the new session
        const welcomeMessage = createWelcomeMessage(newSessionId);
        setMessages([welcomeMessage]);
        
        // Save welcome message to database
        await saveMessage(welcomeMessage);
        
        console.log("New chat started successfully - previous chat moved to history");
        
        // Scroll to the welcome message
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error("Error starting new session:", error);
      setError("Failed to start a new chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleStartNewSession };
};
