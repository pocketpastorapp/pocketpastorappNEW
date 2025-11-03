import { supabase } from "@/integrations/supabase/client";
import { ChatBubbleColors, DEFAULT_BUBBLE_COLORS } from "@/components/chat/ChatSettings";

export const PreferencesService = {
  // Load user preferences from Supabase
  loadPreferences: async (): Promise<ChatBubbleColors | null> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('bubble_colors')
        .eq('user_id', user.user.id)
        .single();
      
      if (error) {
        console.error("Error loading preferences:", error);
        return DEFAULT_BUBBLE_COLORS;
      }
      
      return data?.bubble_colors as ChatBubbleColors || DEFAULT_BUBBLE_COLORS;
    } catch (error) {
      console.error("Error fetching preferences:", error);
      return DEFAULT_BUBBLE_COLORS;
    }
  },
  
  // Save user preferences to Supabase
  savePreferences: async (bubbleColors: ChatBubbleColors): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;
      
      // First check if the user already has preferences
      const { data: existingData } = await supabase
        .from('user_preferences')
        .select('user_id')
        .eq('user_id', user.user.id)
        .single();
      
      if (existingData) {
        // Update existing preferences
        const { error } = await supabase
          .from('user_preferences')
          .update({ 
            bubble_colors: bubbleColors,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.user.id);
        
        if (error) {
          console.error("Error updating preferences:", error);
          return false;
        }
      } else {
        // Insert new preferences
        const { error } = await supabase
          .from('user_preferences')
          .insert({ 
            user_id: user.user.id,
            bubble_colors: bubbleColors
          });
        
        if (error) {
          console.error("Error inserting preferences:", error);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error saving preferences:", error);
      return false;
    }
  },

  // Load theme preference from Supabase
  loadThemePreference: async (): Promise<string | null> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('theme')
        .eq('user_id', user.user.id)
        .single();
      
      if (error) {
        console.log("No theme preference found or error:", error);
        return null;
      }
      
      return data?.theme || null;
    } catch (error) {
      console.error("Error fetching theme preference:", error);
      return null;
    }
  },

  // Save theme preference to Supabase
  saveThemePreference: async (theme: string): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;
      
      // First check if the user already has preferences
      const { data: existingData } = await supabase
        .from('user_preferences')
        .select('user_id')
        .eq('user_id', user.user.id)
        .single();
      
      if (existingData) {
        // Update existing preferences
        const { error } = await supabase
          .from('user_preferences')
          .update({ 
            theme: theme,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.user.id);
        
        if (error) {
          console.error("Error updating theme preference:", error);
          return false;
        }
      } else {
        // Insert new preferences
        const { error } = await supabase
          .from('user_preferences')
          .insert({ 
            user_id: user.user.id,
            theme: theme
          });
        
        if (error) {
          console.error("Error inserting theme preference:", error);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error saving theme preference:", error);
      return false;
    }
  },

  // Get current session ID from database
  getCurrentSessionId: async (): Promise<string | null> => {
    try {
      console.log("=== GET CURRENT SESSION START ===");
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.log("No authenticated user found");
        return null;
      }

      console.log("Getting current session for user:", user.user.id);

      const { data, error } = await supabase
        .from('user_preferences')
        .select('current_session_id')
        .eq('user_id', user.user.id)
        .single();

      console.log("Database query result:", { data, error });

      if (error) {
        console.log("Error or no preferences found:", error.message);
        return null;
      }

      const sessionId = data?.current_session_id || null;
      console.log("Retrieved session ID:", sessionId);
      console.log("=== GET CURRENT SESSION END ===");
      return sessionId;
    } catch (error) {
      console.error("Exception in getCurrentSessionId:", error);
      return null;
    }
  },

  // Set current session ID in database
  setCurrentSessionId: async (sessionId: string): Promise<boolean> => {
    try {
      console.log("=== SET CURRENT SESSION START ===");
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.log("No authenticated user found");
        return false;
      }

      console.log("Setting current session for user:", user.user.id);
      console.log("Session ID to set:", sessionId);

      // Check if preferences exist
      const { data: existingData, error: selectError } = await supabase
        .from('user_preferences')
        .select('user_id')
        .eq('user_id', user.user.id)
        .single();

      console.log("Existing preferences check:", { existingData, selectError });

      if (existingData) {
        console.log("Updating existing preferences...");
        // Update existing preferences
        const { error } = await supabase
          .from('user_preferences')
          .update({ 
            current_session_id: sessionId,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.user.id);

        if (error) {
          console.error("Error updating current session:", error);
          return false;
        }
        console.log("Successfully updated current session");
      } else {
        console.log("Creating new preferences record...");
        // Insert new preferences
        const { error } = await supabase
          .from('user_preferences')
          .insert({ 
            user_id: user.user.id,
            current_session_id: sessionId
          });

        if (error) {
          console.error("Error inserting current session:", error);
          return false;
        }
        console.log("Successfully created new preferences with session");
      }

      // Verify the session was actually saved
      const { data: verifyData, error: verifyError } = await supabase
        .from('user_preferences')
        .select('current_session_id')
        .eq('user_id', user.user.id)
        .single();

      console.log("Verification check:", { verifyData, verifyError });
      console.log("=== SET CURRENT SESSION END ===");

      return true;
    } catch (error) {
      console.error("Exception in setCurrentSessionId:", error);
      return false;
    }
  },

  // Clear current session ID from database
  clearCurrentSessionId: async (): Promise<boolean> => {
    try {
      console.log("=== CLEAR CURRENT SESSION START ===");
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.log("No authenticated user found");
        return false;
      }

      console.log("Clearing current session for user:", user.user.id);

      const { error } = await supabase
        .from('user_preferences')
        .update({ 
          current_session_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.user.id);

      if (error) {
        console.error("Error clearing current session:", error);
        return false;
      }

      console.log("Successfully cleared current session");
      console.log("=== CLEAR CURRENT SESSION END ===");
      return true;
    } catch (error) {
      console.error("Exception in clearCurrentSessionId:", error);
      return false;
    }
  }
};
