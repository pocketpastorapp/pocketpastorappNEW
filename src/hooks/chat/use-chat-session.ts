
import { useState, useEffect } from "react";
import { generateSessionId, getCurrentOrNewSessionId } from "@/services/chat/session";
import { PreferencesService } from "@/services/preferencesService";

export const useChatSession = (userId: string | undefined) => {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Function to start a new session
  const startNewSession = async () => {
    if (!userId) {
      console.log("Cannot start new session: no userId");
      return null;
    }
    
    try {
      console.log("=== START NEW SESSION ===");
      console.log("Starting new session for user:", userId);
      
      // Generate a new session ID
      const newSessionId = generateSessionId();
      console.log("Generated new session ID:", newSessionId);
      
      // Update the session ID in the database
      const saveResult = await PreferencesService.setCurrentSessionId(newSessionId);
      console.log("Save session result:", saveResult);
      
      if (saveResult) {
        setCurrentSessionId(newSessionId);
        console.log("New chat session started with ID:", newSessionId);
        return newSessionId;
      } else {
        console.error("Failed to save session to database");
        return null;
      }
    } catch (error) {
      console.error("Error starting new session:", error);
      return null;
    }
  };
  
  // Initialize or retrieve the current session ID from database
  const initializeSession = async () => {
    if (!userId) {
      console.log("Cannot initialize session: no userId");
      return null;
    }
    
    try {
      console.log("=== INITIALIZING SESSION ===");
      console.log("Initializing session for user:", userId);
      
      // Get current session from database
      const currentSessionFromDb = await PreferencesService.getCurrentSessionId();
      console.log("Current session from database:", currentSessionFromDb);
      
      if (currentSessionFromDb) {
        console.log("=== USING DATABASE CURRENT SESSION ===");
        console.log("Setting database session as current:", currentSessionFromDb);
        setCurrentSessionId(currentSessionFromDb);
        return currentSessionFromDb;
      }
      
      // No current session in database, get or create new session
      console.log("=== NO CURRENT SESSION, GENERATING NEW ===");
      const sessionId = await getCurrentOrNewSessionId(userId);
      console.log("Generated new session ID:", sessionId);
      
      // Set this as the current session in database
      const saveResult = await PreferencesService.setCurrentSessionId(sessionId);
      console.log("Save new session result:", saveResult);
      
      if (saveResult) {
        setCurrentSessionId(sessionId);
        return sessionId;
      } else {
        console.error("Failed to save new session to database");
        setCurrentSessionId(sessionId);
        return sessionId;
      }
      
    } catch (error) {
      console.error("Error initializing session:", error);
      return null;
    }
  };

  return {
    currentSessionId,
    setCurrentSessionId,
    hasInitialized,
    setHasInitialized,
    startNewSession,
    initializeSession
  };
};
