
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ChatSession } from "@/types/chat-types";
import { deleteSession } from "@/services/chat/session";
import { PreferencesService } from "@/services/preferencesService";
import { pruneOldSessions } from "@/services/chat/session";

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const channelRef = useRef<any>(null);
  
  const fetchChatSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setSessions([]);
        setIsLoading(false);
        return;
      }

      // Get the current active session ID from database
      const currentSessionId = await PreferencesService.getCurrentSessionId();
      console.log("Current active session ID from database:", currentSessionId);

      // Get all messages with session_id information
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error("Error fetching chat history:", error);
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive"
        });
        setSessions([]);
        setIsLoading(false);
        return;
      }

      // Group messages by session_id, but exclude the current active session
      const sessionMap = new Map<string, {
        messages: any[],
        date: string,
        lastMessageTime: string
      }>();
      
      if (data && data.length > 0) {
        data.forEach((message) => {
          if (!message.session_id) return; // Skip messages without session_id
          
          // Skip the current active session - it should not appear in history
          if (message.session_id === currentSessionId) {
            console.log("Excluding current active session from history:", message.session_id);
            return;
          }
          
          if (!sessionMap.has(message.session_id)) {
            sessionMap.set(message.session_id, {
              messages: [],
              date: message.timestamp,
              lastMessageTime: message.timestamp
            });
          }
          
          sessionMap.get(message.session_id)?.messages.push(message);
          
          // Update lastMessageTime if this message is newer
          const currentLastTime = new Date(sessionMap.get(message.session_id)!.lastMessageTime);
          const messageTime = new Date(message.timestamp);
          if (messageTime > currentLastTime) {
            sessionMap.get(message.session_id)!.lastMessageTime = message.timestamp;
          }
        });
      }
      
      // Convert sessions to array format, excluding sessions without any user messages (e.g., welcome-only)
      const sessionArray: ChatSession[] = Array.from(sessionMap.entries())
        .map(([id, session]) => {
          const hasUserMessage = session.messages.some((msg) => msg.sender === 'user');
          if (!hasUserMessage) return null;

          // Find the first user message to use as preview
          const firstUserMessage = session.messages.find((msg) => msg.sender === 'user');

          return {
            id,
            preview: firstUserMessage?.content || 'Conversation',
            date: session.date,
            messages: session.messages.length,
            lastMessageTime: session.lastMessageTime,
          } as ChatSession;
        })
        .filter((v): v is ChatSession => v !== null);
      
      // Sort sessions by date (newest first)
      sessionArray.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
      
      console.log(`Loaded ${sessionArray.length} chat sessions (excluding current active session and welcome-only)`);
      setSessions(sessionArray);
    } catch (error) {
      console.error("Error in fetchChatSessions:", error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive"
      });
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to session detail
    if (isDeleting) return; // Prevent multiple deletion attempts
    
    setIsDeleting(sessionId);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Error",
          description: "You must be logged in to delete chat history",
          variant: "destructive"
        });
        setIsDeleting(null);
        return;
      }
      
      console.log(`Starting deletion process for session: ${sessionId}`);
      
      // Optimistically update UI for better user experience
      setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
      
      // Perform the actual deletion
      const success = await deleteSession(userData.user.id, sessionId);
      
      if (!success) {
        console.log("Deletion operation failed, reverting UI and refreshing session list");
        // If deletion failed, refresh the sessions list to ensure UI is accurate
        await fetchChatSessions();
      } else {
        console.log("Deletion successful, session removed from list");
      }
    } catch (error) {
      console.error("Error in handleDeleteSession:", error);
      toast({
        title: "Error",
        description: "Failed to delete chat history. Please try again.",
        variant: "destructive"
      });
      // Refresh the sessions list in case of error
      await fetchChatSessions();
    } finally {
      setIsDeleting(null);
    }
  };

  // Silent, once-per-day pruning of sessions older than 60 days
  const pruneIfStale = useCallback(async () => {
    const key = "pp_last_history_prune_at";
    const last = localStorage.getItem(key);
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (!last || now - Number(last) > oneDayMs) {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      console.log("Running automatic old session cleanup (60+ days)...");
      const deleted = await pruneOldSessions(60);
      console.log(`Automatic cleanup deleted ${deleted} messages`);
      localStorage.setItem(key, String(now));
    }
  }, []);

  // Fetch sessions on component mount (after automatic cleanup)
  useEffect(() => {
    // Always run cleanup when visiting history page, then fetch sessions
    const runCleanupAndFetch = async () => {
      console.log("Running automatic cleanup of sessions older than 30 days...");
      const deleted = await pruneOldSessions(30);
      if (deleted > 0) {
        console.log(`Automatic cleanup deleted ${deleted} old messages`);
      }
      await fetchChatSessions();
    };
    
    runCleanupAndFetch();
    
    // Single channel with user-specific filtering and debounced refresh
    let refreshTimer: NodeJS.Timeout | null = null;
    
    const debouncedRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        fetchChatSessions();
      }, 1000);
    };
    
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Remove any existing channel to dedupe
      if (channelRef.current) {
        console.log("Unsubscribed History channel (pre-replace):", channelRef.current.topic);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const topic = `chat_sessions_${userData.user.id}`;
      const ch = supabase
        .channel(topic)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `user_id=eq.${userData.user.id}` },
          () => { console.log('History INSERT detected'); debouncedRefresh(); }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'chat_messages', filter: `user_id=eq.${userData.user.id}` },
          () => { console.log('History DELETE detected'); debouncedRefresh(); }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log("Subscribed History channel:", topic);
          }
        });

      channelRef.current = ch;
    };

    init();

    // Cleanup
    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      if (channelRef.current) {
        console.log("Unsubscribed History channel (cleanup):", channelRef.current.topic);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchChatSessions, pruneIfStale]);
  
  return {
    sessions,
    isLoading,
    isDeleting,
    fetchChatSessions,
    handleDeleteSession
  };
};
