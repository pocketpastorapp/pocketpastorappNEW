
import { generatePastorResponse, ChatResponse } from "./openaiService";
import { saveMessage, updateMessageFavorite, loadChatHistory } from "./messageService";
import { getSystemPrompt } from "./systemPromptService";
import { 
  getSessionMessages, 
  getCurrentOrNewSessionId, 
  deleteSession, 
  sessionExists,
  generateSessionId
} from "./session";

// Export the individual functions directly
export { deleteSession, sessionExists, generateSessionId };

export const ChatService = {
  sendMessage: async (message: string, userId?: string, sessionId?: string): Promise<ChatResponse> => {
    return generatePastorResponse(message, userId, sessionId);
  },
  
  saveMessage,
  updateMessageFavorite,
  loadChatHistory,
  getSessionMessages,
  getCurrentOrNewSessionId,
  getSystemPrompt,
  deleteSession,
  sessionExists,
  generateSessionId,
};
