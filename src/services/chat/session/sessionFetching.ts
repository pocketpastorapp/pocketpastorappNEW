
import { supabase } from "@/integrations/supabase/client";

// Check if a session exists
export const sessionExists = async (userId: string, sessionId: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('session_id', sessionId);
    
    if (error) {
      console.error("Error checking if session exists:", error);
      return false;
    }
    
    return count !== null && count > 0;
  } catch (error) {
    console.error("Error in sessionExists check:", error);
    return false;
  }
};

// Get session messages for a specific session
export const getSessionMessages = async (userId: string, sessionId: string): Promise<any[]> => {
  try {
    console.log("=== FETCHING SESSION MESSAGES ===");
    console.log("User ID:", userId);
    console.log("Session ID:", sessionId);
    
    // Get messages directly by session ID
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error("Error loading session messages:", error);
      return [];
    }

    console.log(`Found ${data?.length || 0} messages in database for session ${sessionId}`);
    
    if (data && data.length > 0) {
      const mappedMessages = data.map(message => ({
        id: message.id,
        content: message.content,
        sender: message.sender,
        timestamp: message.timestamp,
        isFavorite: message.is_favorite
      }));
      
      console.log("Session messages:", mappedMessages.map(m => `${m.sender}: ${m.content.substring(0, 50)}...`));
      return mappedMessages;
    }
    
    console.log("No messages found for this session");
    return [];
  } catch (error) {
    console.error("Error in getSessionMessages:", error);
    return [];
  }
};
