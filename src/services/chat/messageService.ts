
import { supabase } from "@/integrations/supabase/client";
import { DbMessage } from "./messageTypes";
import { getCurrentOrNewSessionId } from "./session";
import { PreferencesService } from "@/services/preferencesService";

// Save a message to the database
export const saveMessage = async (message: { 
  content: string, 
  sender: 'user' | 'bot', 
  timestamp: string, 
  isFavorite?: boolean,
  sessionId?: string 
}): Promise<string | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      console.error("User not authenticated");
      return null;
    }
    
    // Get session ID from parameter or create new one
    const sessionId = message.sessionId || await getCurrentOrNewSessionId(userData.user.id);
    
    // Store current session ID in database
    await PreferencesService.setCurrentSessionId(sessionId);
    
    const dbMessage: DbMessage = {
      user_id: userData.user.id,
      content: message.content,
      sender: message.sender,
      timestamp: message.timestamp,
      is_favorite: message.isFavorite || false,
      session_id: sessionId
    };
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(dbMessage)
      .select('id')
      .single();
    
    if (error) {
      console.error("Error saving message:", error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error("Error in saveMessage:", error);
    return null;
  }
};

// Update message favorite status
export const updateMessageFavorite = async (id: string, isFavorite: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .update({ is_favorite: isFavorite })
      .eq('id', id);
    
    if (error) {
      console.error("Error updating favorite status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateMessageFavorite:", error);
    return false;
  }
};

// Load all chat history
export const loadChatHistory = async (): Promise<any[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      console.error("User not authenticated");
      return [];
    }
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error("Error loading chat history:", error);
      return [];
    }
    
    return data.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender,
      timestamp: msg.timestamp,
      isFavorite: msg.is_favorite,
      sessionId: msg.session_id
    }));
  } catch (error) {
    console.error("Error in loadChatHistory:", error);
    return [];
  }
};
