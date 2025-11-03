
import { supabase } from "@/integrations/supabase/client";

/**
 * Prunes chat sessions older than `days` (defaults to 30) for the current user.
 * Returns the number of deleted messages (across all old sessions).
 * Silent on error: logs and returns 0.
 */
export const pruneOldSessions = async (days: number = 30): Promise<number> => {
  // Ensure user is authenticated
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    console.warn("pruneOldSessions skipped: no authenticated user");
    return 0;
  }

  console.log(`Invoking delete_old_chat_sessions RPC for user ${userData.user.id} with cutoff ${days} days`);
  const { data, error } = await supabase.rpc('delete_old_chat_sessions', { p_days: days });

  if (error) {
    console.error("Failed to prune old chat sessions:", error);
    return 0;
  }

  // Function returns TABLE(deleted_count integer) -> array with single row
  const deletedCount = Array.isArray(data) ? (data[0]?.deleted_count ?? 0) : 0;
  console.log(`Pruned ${deletedCount} old chat messages (sessions older than ${days} days)`);
  return deletedCount;
};
