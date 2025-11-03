
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "@/types/chat-types";
import { getSessionMessages, deleteSession } from "@/services/chat/session";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useSessionDetails = (sessionId: string | undefined) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const channelRef = useRef<any>(null);

  const fetchSessionMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!sessionId) {
        setMessages([]);
        setIsLoading(false);
        return;
      }

      // Get current user ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.error("User not authenticated");
        setMessages([]);
        setIsLoading(false);
        navigate('/login');
        return;
      }

      // Simple check if session exists
      const { data, count } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact' })
        .eq('user_id', userData.user.id)
        .eq('session_id', sessionId)
        .limit(1);
      
      if (!data || data.length === 0) {
        console.log("Session not found, redirecting to history");
        toast({
          description: "No messages found for this conversation. Redirecting to history.",
        });
        navigate('/history');
        return;
      }

      // Use the modified getSessionMessages function
      const sessionMessages = await getSessionMessages(userData.user.id, sessionId);
      setMessages(sessionMessages);
    } catch (error) {
      console.error("Error in fetchSessionMessages:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation messages",
        variant: "destructive"
      });
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, navigate]);

  useEffect(() => {
    fetchSessionMessages();

    if (!sessionId) {
      // ensure any previous channel is removed when sessionId becomes undefined
      if (channelRef.current) {
        console.log("Unsubscribed Session channel (no sessionId):", channelRef.current.topic);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    let refreshTimer: NodeJS.Timeout | null = null;

    const debouncedRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        fetchSessionMessages();
      }, 500);
    };

    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Remove any existing channel to dedupe
      if (channelRef.current) {
        console.log("Unsubscribed Session channel (pre-replace):", channelRef.current.topic);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const topic = `session_${sessionId}_${userData.user.id}`;
      const ch = supabase
        .channel(topic)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}&user_id=eq.${userData.user.id}` },
          () => { console.log(`Session ${sessionId} INSERT detected`); debouncedRefresh(); }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}&user_id=eq.${userData.user.id}` },
          () => { console.log(`Session ${sessionId} UPDATE detected`); debouncedRefresh(); }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}&user_id=eq.${userData.user.id}` },
          () => { console.log(`Session ${sessionId} DELETE detected`); debouncedRefresh(); }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log("Subscribed Session details channel:", topic);
          }
        });

      channelRef.current = ch;
    };

    init();

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      if (channelRef.current) {
        console.log("Unsubscribed Session channel (cleanup):", channelRef.current.topic);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [sessionId, fetchSessionMessages]);

  const handleDeleteSession = async () => {
    if (!sessionId) return;
    setIsDeleting(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Error",
          description: "You must be logged in to delete chat history",
          variant: "destructive"
        });
        setIsDeleting(false);
        return;
      }
      
      // Execute the improved deletion function
      const success = await deleteSession(userData.user.id, sessionId);
      
      if (success) {
        navigate('/history');
      } else {
        // Show a specific failure message but still navigate back
        toast({
          title: "Warning",
          description: "There was an issue deleting some messages. You can try again from the history page.",
          variant: "destructive",
          duration: 8000
        });
        
        // Still navigate back to history page after a short delay
        setTimeout(() => navigate('/history'), 1000);
      }
    } catch (error) {
      console.error("Error in handleDeleteSession:", error);
      toast({
        title: "Error",
        description: "Failed to delete chat history",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Get first user message for the title
  const firstUserMessage = messages.find(msg => msg.sender === 'user');
  const sessionTitle = firstUserMessage?.content || "Conversation";

  return {
    messages,
    isLoading,
    isDeleting,
    sessionTitle,
    handleDeleteSession,
  };
};
