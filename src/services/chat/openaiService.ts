
import { supabase } from "@/integrations/supabase/client";
import { getSessionMessages } from "./session";
import { updateUserNameIfDetected } from "./nameExtractionService";
import { aggregateContexts } from "./contextAggregator";

// Function to call the OpenAI API via Supabase Edge Function with conversation context
export const generatePastorResponse = async (message: string, userId?: string, sessionId?: string): Promise<ChatResponse> => {
  try {
    let conversationHistory: any[] = [];
    let userProfile: any = null;
    
    // Get user profile if userId is provided
    if (userId) {
      console.log("=== FETCHING USER PROFILE ===");
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', userId)
        .single();
      
      if (profile) {
        userProfile = profile;
        console.log("User profile loaded:", profile.name || profile.email);
        
        // Check if user is introducing themselves and update profile if needed
        await updateUserNameIfDetected(message, userId, profile.name);
      }
    }
    
    // Get conversation history if user and session are provided
    if (userId && sessionId) {
      console.log("=== LOADING CONVERSATION HISTORY ===");
      console.log("Loading conversation history for context...");
      console.log("User ID:", userId);
      console.log("Session ID:", sessionId);
      
      const rawHistory = await getSessionMessages(userId, sessionId);
      console.log(`Raw history from database:`, rawHistory);
      
      // Format conversation history for OpenAI - convert from database format
      if (rawHistory && rawHistory.length > 0) {
        // Limit to last 25 messages for context management
        const limitedHistory = rawHistory.slice(-25);
        
        conversationHistory = limitedHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
        
        console.log(`Limited conversation history to last 25 messages (from ${rawHistory.length} total)`);
        console.log(`Formatted ${conversationHistory.length} messages for OpenAI context:`);
        conversationHistory.forEach((msg, index) => {
          console.log(`Message ${index + 1}: ${msg.role} - ${msg.content.substring(0, 100)}...`);
        });
      } else {
        console.log("No previous messages found in this session");
      }
    }
    
    // Add the current user message to the conversation history
    const currentMessage = {
      role: 'user',
      content: message
    };
    
    conversationHistory.push(currentMessage);
    
    // Aggregate all contextual information
    console.log("=== AGGREGATING CONTEXTUAL INFORMATION ===");
    const aggregatedContext = await aggregateContexts(userId, message, userProfile);
    console.log("Time context:", aggregatedContext.timeContext);
    console.log("Spiritual context available:", !!aggregatedContext.spiritualContext);
    console.log("Emotional context:", aggregatedContext.emotionalContext);

    console.log(`=== SENDING TO OPENAI ===`);
    console.log(`Total messages in context: ${conversationHistory.length}`);
    console.log("Current message:", message);

    // Call the Supabase Edge Function with complete conversation history, user profile, and contexts
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: { 
        prompt: message,
        conversationHistory: conversationHistory,
        userProfile: userProfile,
        contextData: aggregatedContext
      }
    });

    if (error) {
      console.error("Error calling OpenAI through Edge Function:", error);
      throw new Error(error.message);
    }

    console.log("=== OPENAI RESPONSE RECEIVED ===");
    console.log("Response preview:", data.generatedText?.substring(0, 200) + "...");

    // Return the generated text with a unique ID
    return {
      id: Math.random().toString(36).substring(2, 15),
      text: data.generatedText,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error generating response:", error);
    return {
      id: Math.random().toString(36).substring(2, 15),
      text: "I apologize, but I'm having trouble connecting to my wisdom database right now. Please try again in a moment. Proverbs 16:9 tells us 'In their hearts humans plan their course, but the LORD establishes their steps.'",
      createdAt: new Date().toISOString(),
    };
  }
};

export interface ChatResponse {
  id: string;
  text: string;
  createdAt: string;
}
