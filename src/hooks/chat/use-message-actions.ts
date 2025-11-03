
import { toast } from "sonner";
import { ChatService } from "@/services/chatService";
import { ChatMessage } from "@/types/chat-types";
import { useAuth } from "@/context/auth-context";
import { CreditService } from "@/services/credits";
import { prefetchSpeech } from "@/services/speech";

interface UseMessageActionsProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToBottom: () => void;
  currentSessionId?: string | null;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useMessageActions = ({
  messages,
  setMessages,
  inputMessage,
  setInputMessage,
  isProcessing,
  setIsProcessing,
  scrollToBottom,
  currentSessionId,
  setError
}: UseMessageActionsProps) => {
  const { user } = useAuth();

  const handleSendMessage = async (e?: React.FormEvent) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
    }
    
    if (!inputMessage.trim() || isProcessing) return;
    
    // Reset any previous errors
    if (setError) setError(null);
    
    // Credit check for authenticated users
    if (user) {
      try {
        const hasCredits = await CreditService.useCredit();
        if (!hasCredits) {
          if (setError) setError("You don't have enough credits to send a message.");
          return;
        }
      } catch (error) {
        console.error("Error checking credits:", error);
        if (setError) setError("Unable to verify credits. Please try again.");
        toast.error("Error checking credits. Please try again.");
        return;
      }
    }
    
    // Get current session ID from localStorage or use the one from props
    const sessionId = currentSessionId || localStorage.getItem('currentChatSessionId');
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
      sessionId: sessionId || undefined
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsProcessing(true);
    scrollToBottom();
    
    try {
      // Save user message to database with optimized batching
      let userMessageId = userMessage.id;
      if (user && sessionId) {
        const savedId = await ChatService.saveMessage({
          ...userMessage,
          sessionId: sessionId
        });
        if (savedId) {
          userMessageId = savedId;
        }
      }
      
      // Get AI response with conversation context
      const response = await ChatService.sendMessage(
        inputMessage, 
        user?.id, 
        sessionId || undefined
      );
      
      const botMessage: ChatMessage = {
        id: response.id,
        content: response.text,
        sender: "bot",
        timestamp: response.createdAt,
        sessionId: sessionId || undefined
      };
      
      // Save bot message to database with optimized batching
      if (user && sessionId) {
        const savedId = await ChatService.saveMessage({
          ...botMessage,
          sessionId: sessionId
        });
        if (savedId) {
          botMessage.id = savedId;
        }
      }
      
      setMessages((prev) => {
        // Update the user message with the real ID if it was saved
        const updatedMessages = prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, id: userMessageId } : msg
        );
        return [...updatedMessages, botMessage];
      });
      
      scrollToBottom();

      // Prefetch TTS audio in the background for faster playback next time
      void prefetchSpeech(botMessage.content, botMessage.id);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Unable to get a response. Please try again.");
      if (setError) setError("Failed to get a response. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const toggleFavorite = async (id: string, newFavoriteStatus: boolean) => {
    // Update UI optimistically
    setMessages(messages.map(message => 
      message.id === id 
        ? { ...message, isFavorite: newFavoriteStatus } 
        : message
    ));
    
    // Save to Supabase if user is authenticated
    if (user) {
      const success = await ChatService.updateMessageFavorite(id, newFavoriteStatus);
      if (success) {
        toast.success(newFavoriteStatus ? "Message saved to favorites" : "Message removed from favorites");
      } else {
        // Revert UI change if save failed
        setMessages(messages.map(message => 
          message.id === id 
            ? { ...message, isFavorite: !newFavoriteStatus } 
            : message
        ));
        toast.error("Failed to update favorite status");
      }
    } else {
      // For non-authenticated users, just use localStorage
      toast.success(newFavoriteStatus ? "Message saved to favorites" : "Message removed from favorites");
      
      // Save to localStorage with optimized storage
      const favorites = JSON.parse(localStorage.getItem("pocketPastorFavorites") || "[]");
      if (newFavoriteStatus) {
        const messageToSave = messages.find(m => m.id === id);
        if (messageToSave) {
          favorites.push(messageToSave);
        }
      } else {
        const index = favorites.findIndex((m: any) => m.id === id);
        if (index !== -1) {
          favorites.splice(index, 1);
        }
      }
      localStorage.setItem("pocketPastorFavorites", JSON.stringify(favorites));
    }
  };

  return {
    handleSendMessage,
    toggleFavorite,
  };
};
