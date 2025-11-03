
import { supabase } from "@/integrations/supabase/client";
import { UserCredits } from "@/types/user-credit-types";
import { toast } from "sonner";

export const CreditBaseService = {
  /**
   * Gets the current user's credits
   */
  async getUserCredits(): Promise<UserCredits | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.error("User not authenticated");
        return null;
      }

      const { data, error } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user credits:", error);
        return null;
      }

      if (!data) {
        console.log("No credit data found for user");
        return null;
      }

      // Check if we need to refresh daily credits
      const today = new Date().toISOString().split('T')[0];
      const lastCreditDate = data.last_free_credit_date;
      
      if (lastCreditDate < today) {
        // Refresh free credits for the new day
        const { data: updatedData, error: updateError } = await supabase
          .from("user_credits")
          .update({
            free_credits: 2,
            last_free_credit_date: today
          })
          .eq("user_id", userData.user.id)
          .select()
          .single();

        if (updateError) {
          console.error("Error refreshing daily credits:", updateError);
          // Continue with old data rather than failing
        } else if (updatedData) {
          console.log("Daily credits refreshed!");
          return {
            id: updatedData.id,
            userId: updatedData.user_id,
            totalCredits: updatedData.total_credits,
            freeCredits: updatedData.free_credits,
            lastFreeCreditDate: updatedData.last_free_credit_date,
            hasUnlimitedCredits: updatedData.has_unlimited_credits
          };
        }
      }

      return {
        id: data.id,
        userId: data.user_id,
        totalCredits: data.total_credits,
        freeCredits: data.free_credits,
        lastFreeCreditDate: data.last_free_credit_date,
        hasUnlimitedCredits: data.has_unlimited_credits
      };
    } catch (error) {
      console.error("Error in getUserCredits:", error);
      return null;
    }
  },

  /**
   * Initialize credits for a new user
   */
  async initializeUserCredits(userId?: string): Promise<boolean> {
    try {
      let resolvedUserId = userId;
      if (!resolvedUserId) {
        const { data: userData } = await supabase.auth.getUser();
        resolvedUserId = userData.user?.id;
      }
      if (!resolvedUserId) {
        console.error("User not authenticated");
        return false;
      }

      // Ensure Supabase auth session is established before attempting RLS-protected writes
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id || session.user.id !== resolvedUserId) {
        console.warn("Credits init deferred: auth session not ready or mismatched user");
        return false;
      }

      const { error } = await supabase
        .from("user_credits")
        .upsert({
          user_id: resolvedUserId,
          total_credits: 20,
          free_credits: 2,
          last_free_credit_date: new Date().toISOString().split('T')[0],
          has_unlimited_credits: false
        }, { onConflict: 'user_id' });

      if (error) {
        console.error("Error initializing user credits", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in initializeUserCredits:", error);
      return false;
    }
  }
};
