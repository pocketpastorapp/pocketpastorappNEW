
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { ChatMessage } from "@/types/chat-types";
import { PreferencesService } from "@/services/preferencesService";

interface UseChatInitializationProps {
  hasInitialized: boolean;
  setHasInitialized: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setCurrentSessionId: (value: string | null) => void;
  setMessages: (value: ChatMessage[]) => void;
  loadSessionMessages: (userId: string, sessionId: string) => Promise<ChatMessage[]>;
  saveMessage: (message: ChatMessage) => Promise<void>;
  startNewSession: () => Promise<string | null>;
  createWelcomeMessage: (sessionId?: string) => ChatMessage;
}

export const useChatInitialization = ({
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
}: UseChatInitializationProps) => {
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const initializeChat = async () => {
      // Wait for auth to finish loading before initializing
      if (authLoading || hasInitialized) {
        console.log("Waiting for auth or already initialized:", { authLoading, hasInitialized });
        return;
      }
      
      setIsLoading(true);
      setHasInitialized(true);
      
      // Handle non-authenticated users
      if (!user) {
        console.log("=== NON-AUTHENTICATED USER INITIALIZATION ===");
        const welcomeMessage = createWelcomeMessage();
        setMessages([welcomeMessage]);
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("=== CHAT INITIALIZATION START ===");
        console.log("Initializing chat for user:", user.id);
        console.log("Current timestamp:", new Date().toISOString());
        
        // Get current session from database with detailed logging
        console.log("Attempting to retrieve current session from database...");
        const currentSessionFromDb = await PreferencesService.getCurrentSessionId();
        console.log("Current session retrieval result:", {
          sessionId: currentSessionFromDb,
          type: typeof currentSessionFromDb,
          isNull: currentSessionFromDb === null,
          isEmpty: currentSessionFromDb === ""
        });
        
        if (currentSessionFromDb) {
          console.log("=== RESTORING CURRENT SESSION FROM DATABASE ===");
          console.log("Found current session in database:", currentSessionFromDb);
          
          // Set the current session ID first - this is critical for state management
          setCurrentSessionId(currentSessionFromDb);
          console.log("Session ID set in state:", currentSessionFromDb);
          
          // Try to load messages for the current session
          console.log("Loading messages for current session...");
          const loadedMessages = await loadSessionMessages(user.id, currentSessionFromDb);
          console.log("Messages loading result:", {
            messageCount: loadedMessages?.length || 0,
            hasMessages: loadedMessages && loadedMessages.length > 0,
            firstMessage: loadedMessages?.[0] ? {
              id: loadedMessages[0].id,
              sender: loadedMessages[0].sender,
              contentPreview: loadedMessages[0].content.substring(0, 50) + "..."
            } : null
          });
          
          if (loadedMessages && loadedMessages.length > 0) {
            console.log("=== SUCCESSFULLY RESTORED SESSION WITH MESSAGES ===");
            console.log("Restored session with", loadedMessages.length, "messages");
            
            // Daily rollover: if last activity was on a previous day and there was any real chat, start a new session
            const lastMessage = loadedMessages[loadedMessages.length - 1];
            const lastDay = new Date(lastMessage.timestamp).toDateString();
            const today = new Date().toDateString();
            const hadConversation = loadedMessages.some(m => m.sender === 'user');
            
            if (hadConversation && lastDay !== today) {
              console.log("Detected day change with existing conversation. Starting a new session automatically.");
              const newSessionId = await startNewSession();
              if (newSessionId) {
                setCurrentSessionId(newSessionId);
                const welcomeMessage = createWelcomeMessage(newSessionId);
                setMessages([welcomeMessage]);
                try {
                  await saveMessage(welcomeMessage);
                  console.log("Welcome message saved for new daily session");
                } catch (saveError) {
                  console.error("Failed to save welcome message:", saveError);
                }
                console.log("=== DAILY ROLLOVER COMPLETE ===");
                return;
              }
            }
            
            setMessages(loadedMessages);
            console.log("Messages set in state, initialization complete");
          } else {
            console.log("=== SESSION EXISTS BUT NO MESSAGES - CREATING WELCOME ===");
            console.log("Session exists in preferences but no messages found");
            // Session exists but no messages - this is a valid current session, just add welcome
            const welcomeMessage = createWelcomeMessage(currentSessionFromDb);
            console.log("Created welcome message for existing session:", {
              id: welcomeMessage.id,
              sessionId: welcomeMessage.sessionId,
              sender: welcomeMessage.sender
            });
            setMessages([welcomeMessage]);
            // Save the welcome message to establish this session
            try {
              await saveMessage(welcomeMessage);
              console.log("Welcome message saved to database successfully");
            } catch (saveError) {
              console.error("Failed to save welcome message:", saveError);
            }
          }
          
          console.log("=== SESSION RESTORATION COMPLETE ===");
          return;
        }
        
        // No current session exists in database - create a new one
        console.log("=== NO CURRENT SESSION - CREATING NEW SESSION ===");
        console.log("No current session found in database, creating new session");
        const newSessionId = await startNewSession();
        console.log("New session creation result:", {
          sessionId: newSessionId,
          success: newSessionId !== null
        });
        
        if (newSessionId) {
          console.log("Setting new session as current:", newSessionId);
          setCurrentSessionId(newSessionId);
          const welcomeMessage = createWelcomeMessage(newSessionId);
          setMessages([welcomeMessage]);
          try {
            await saveMessage(welcomeMessage);
            console.log("New session initialized with welcome message saved");
          } catch (saveError) {
            console.error("Failed to save welcome message for new session:", saveError);
          }
        } else {
          console.log("=== FALLBACK: NO SESSION AVAILABLE ===");
          console.log("Failed to create new session, using fallback welcome message");
          const welcomeMessage = createWelcomeMessage();
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error("=== ERROR DURING INITIALIZATION ===");
        console.error("Error initializing chat:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        setError("Failed to initialize chat. Please try refreshing the page.");
        
        // Set fallback welcome message
        const welcomeMessage = createWelcomeMessage();
        setMessages([welcomeMessage]);
      } finally {
        console.log("=== CHAT INITIALIZATION END ===");
        console.log("Final timestamp:", new Date().toISOString());
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [user, authLoading, hasInitialized, loadSessionMessages, saveMessage, setMessages, setIsLoading, setError, setHasInitialized, setCurrentSessionId, startNewSession, createWelcomeMessage]);
};
