
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RealtimeSubscriptionOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onEvent: () => void;
  debounceMs?: number;
  enabled?: boolean;
}

export const useOptimizedRealtime = (options: RealtimeSubscriptionOptions) => {
  const {
    table,
    event = '*',
    filter,
    onEvent,
    debounceMs = 1000,
    enabled = true
  } = options;
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);
  
  useEffect(() => {
    if (!enabled) return;
    
    const debouncedCallback = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onEvent();
      }, debounceMs);
    };
    
    const setupSubscription = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      
      // Create unique channel name to avoid conflicts
      const channelName = `${table}_${event}_${userData.user.id}_${Date.now()}`;
      
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes' as any,
          {
            event,
            schema: 'public',
            table,
            filter: filter || `user_id=eq.${userData.user.id}`
          },
          () => {
            console.log(`Optimized realtime: ${table} ${event} detected`);
            debouncedCallback();
          }
        )
        .subscribe();
      
      channelRef.current = channel;
    };
    
    setupSubscription();
    
    // Cleanup function
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, event, filter, onEvent, debounceMs, enabled]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);
};
