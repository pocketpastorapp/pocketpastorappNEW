
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreditBaseService } from "./creditBaseService";

export const CreditAddService = {
  /**
   * Add credits to the user's account
   */
  async addCredits(amount: number): Promise<boolean> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.error("User not authenticated");
        return false;
      }

      const credits = await CreditBaseService.getUserCredits();
      if (!credits) {
        // Try to initialize first
        const initialized = await CreditBaseService.initializeUserCredits();
        if (!initialized) {
          toast.error("Unable to initialize credits. Please try again.");
          return false;
        }
        // Now add credits to the newly initialized account
        return this.addCredits(amount);
      }

      const { error } = await supabase
        .from("user_credits")
        .update({
          total_credits: credits.totalCredits + amount
        })
        .eq("user_id", userData.user.id);

      if (error) {
        console.error("Error adding credits:", error);
        return false;
      }

      toast(`${amount} credits have been added to your account.`);

      return true;
    } catch (error) {
      console.error("Error in addCredits:", error);
      return false;
    }
  },

  /**
   * Add credits from watching an ad (specifically 2 credits)
   */
  async addCreditsFromAd(): Promise<boolean> {
    // This would be integrated with an ad provider in a real implementation
    return this.addCredits(2);
  }
};
