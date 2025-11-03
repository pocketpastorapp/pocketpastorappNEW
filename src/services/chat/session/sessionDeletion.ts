
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Delete a session and all its messages using the new database function
export const deleteSession = async (userId: string, sessionId: string): Promise<boolean> => {
  try {
    console.log(`Attempting to delete session ${sessionId} for user ${userId}`);
    
    // Use the new database function for reliable deletion
    const { data, error } = await supabase
      .rpc('delete_session_messages', {
        p_user_id: userId,
        p_session_id: sessionId
      });
    
    if (error) {
      console.error("Error deleting session messages:", error);
      toast({
        title: "Error",
        description: `Failed to delete chat history: ${error.message}`,
        variant: "destructive",
        duration: 5000
      });
      return false;
    }
    
    const deletedCount = data?.[0]?.deleted_count || 0;
    console.log(`Successfully deleted ${deletedCount} messages for session ${sessionId}`);
    
    if (deletedCount > 0) {
      toast({
        title: "Success",
        description: `Chat history deleted successfully (${deletedCount} messages removed)`,
        duration: 3000
      });
      return true;
    } else {
      // No messages found to delete, but this is still considered a success
      console.log("No messages found to delete for session", sessionId);
      toast({
        title: "Success",
        description: "Chat history deleted successfully",
        duration: 3000
      });
      return true;
    }
    
  } catch (error) {
    console.error("Unexpected error in deleteSession:", error);
    toast({
      title: "Error",
      description: "Failed to delete chat history due to an unexpected error",
      variant: "destructive",
      duration: 5000
    });
    return false;
  }
};
