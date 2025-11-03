
import { supabase } from "@/integrations/supabase/client";
import { PreferencesService } from "@/services/preferencesService";

// Generate a new session ID based on current timestamp
export const generateSessionId = (): string => {
  return `session-${new Date().getTime()}`;
};

// Get current session ID or create a new one from database
export const getCurrentOrNewSessionId = async (userId: string): Promise<string> => {
  try {
    console.log("=== GETTING CURRENT OR NEW SESSION ===");
    
    // First check database for current session
    const currentSessionId = await PreferencesService.getCurrentSessionId();
    console.log("Current session from database:", currentSessionId);
    
    if (currentSessionId) {
      // Verify this session exists in the database with actual messages
      const { data, error } = await supabase
        .from('chat_messages')
        .select('session_id')
        .eq('user_id', userId)
        .eq('session_id', currentSessionId)
        .limit(1);
      
      if (!error && data && data.length > 0) {
        console.log("Found valid current session with messages in database:", currentSessionId);
        return currentSessionId;
      } else {
        console.log("Current session has no messages in database:", currentSessionId);
        // Session exists in preferences but no messages in database
        // This means it's a valid session that just hasn't been used yet
        return currentSessionId;
      }
    }
    
    // No current session, check for most recent session in database
    console.log("No current session, checking for most recent session in database");
    const { data, error } = await supabase
      .from('chat_messages')
      .select('session_id')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error("Error getting recent session:", error);
      return generateSessionId();
    }
    
    // If we found a recent session, DON'T automatically use it as current
    // Instead, create a new session since no current session exists
    if (data && data.length > 0) {
      console.log("Found recent session in database but creating new current session");
      return generateSessionId();
    }
    
    // No existing sessions, generate a new one
    console.log("No existing sessions found, generating new session");
    return generateSessionId();
  } catch (error) {
    console.error("Error getting current session:", error);
    return generateSessionId(); // Default to new session on error
  }
};
