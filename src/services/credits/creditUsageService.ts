
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreditBaseService } from "./creditBaseService";

export const CreditUsageService = {
  /**
   * Use a single credit for an interaction with enhanced security validation
   * Returns true if successful, false if not enough credits
   */
  async useCredit(): Promise<boolean> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.error("User not authenticated");
        return false;
      }

      // First get current credits
      const credits = await CreditBaseService.getUserCredits();
      if (!credits) {
        // Try to initialize credits if they don't exist
        const initialized = await CreditBaseService.initializeUserCredits();
        if (!initialized) {
          toast.error("Unable to retrieve your credits. Please try again.");
          return false;
        }
        // Fetch the newly initialized credits
        const newCredits = await CreditBaseService.getUserCredits();
        if (!newCredits) {
          toast.error("Unable to retrieve your credits. Please try again.");
          return false;
        }
        // Use the newly initialized credits
        return this.useCredit();
      }
      
      // If user has unlimited credits, allow the action without decreasing credits
      if (credits.hasUnlimitedCredits) {
        // Still log the usage for audit purposes
        console.log(`Credit used by unlimited user: ${userData.user.id}`);
        return true;
      }

      // Check if user has enough credits
      if (credits.freeCredits <= 0 && credits.totalCredits <= 0) {
        toast.error("You don't have enough credits to send a message.");
        return false;
      }

      // Use free credits first, then paid credits
      let updatedFreeCredits = credits.freeCredits;
      let updatedTotalCredits = credits.totalCredits;

      if (updatedFreeCredits > 0) {
        updatedFreeCredits -= 1;
      } else {
        updatedTotalCredits -= 1;
      }

      // Update the database - the trigger will handle validation and logging
      const { error } = await supabase
        .from("user_credits")
        .update({
          free_credits: updatedFreeCredits,
          total_credits: updatedTotalCredits
        })
        .eq("user_id", userData.user.id);

      if (error) {
        console.error("Error updating credits:", error);
        // Check if it's a validation error from our trigger
        if (error.message.includes('Credit operation validation failed')) {
          console.warn("Credit operation blocked by security validation");
          toast.error("Credit operation blocked for security reasons.");
        } else {
          toast.error("Failed to update credits. Please try again.");
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in useCredit:", error);
      return false;
    }
  }
};
