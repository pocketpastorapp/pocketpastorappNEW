
import { useState } from "react";
import { ChatMessage } from "@/types/chat-types";
import { ChatService } from "@/services/chatService";

export const createWelcomeMessage = (sessionId?: string): ChatMessage => {
  return {
    id: "welcome",
    content: "Welcome! I'm your Pocket Pastor. How can I help with your spiritual journey today?",
    sender: "bot",
    timestamp: new Date().toISOString(),
    sessionId: sessionId
  };
};

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to save a message to the database
  const saveMessage = async (message: ChatMessage) => {
    if (!message.sessionId) {
      console.warn("Attempted to save message without sessionId:", message);
      return;
    }
    
    try {
      console.log("Saving message to database:", message);
      await ChatService.saveMessage(message);
      console.log("Message saved successfully");
    } catch (error) {
      console.error("Error saving message:", error);
      setError("Failed to save message. Please check your connection.");
    }
  };
  
  // Load messages for a specific session
  const loadSessionMessages = async (userId: string, sessionId: string) => {
    console.log("=== LOAD SESSION MESSAGES START ===");
    console.log("Loading messages for userId:", userId, "sessionId:", sessionId);
    
    setError(null);
    
    try {
      const sessionMessages = await ChatService.getSessionMessages(userId, sessionId);
      console.log("Raw session messages from service:", sessionMessages);
      
      if (sessionMessages && sessionMessages.length > 0) {
        console.log("Found", sessionMessages.length, "messages for session", sessionId);
        
        // Map database messages to ChatMessage format and ensure sessionId is included
        const mappedMessages = sessionMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender as "user" | "bot",
          timestamp: msg.timestamp,
          isFavorite: msg.isFavorite,
          sessionId: sessionId // Ensure sessionId is always included
        }));
        
        console.log("Mapped messages with sessionId:", mappedMessages);
        return mappedMessages;
      } else {
        console.log("No messages found for session", sessionId);
        return [];
      }
    } catch (error) {
      console.error("Error loading session messages:", error);
      setError("Failed to load chat messages. Please try refreshing.");
      return [];
    }
  };

  return {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    error,
    setError,
    loadSessionMessages,
    saveMessage
  };
};
