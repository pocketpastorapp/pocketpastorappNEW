
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreditBaseService } from "./creditBaseService";

// Valid gift codes and their credit amounts
const VALID_GIFT_CODES = {
  "GODISLOVE": 20,
} as const;

export const CreditGiftService = {
  /**
   * Redeem a gift code for credits
   */
  async redeemGiftCode(giftCode: string): Promise<boolean> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.error("User not authenticated");
        toast.error("You must be logged in to redeem gift codes");
        return false;
      }

      // Normalize the gift code (uppercase, trim whitespace)
      const normalizedCode = giftCode.toUpperCase().trim();

      // Check if gift code is valid
      if (!(normalizedCode in VALID_GIFT_CODES)) {
        toast.error("Invalid gift code");
        return false;
      }

      const creditsToAward = VALID_GIFT_CODES[normalizedCode as keyof typeof VALID_GIFT_CODES];

      // Check if user has already redeemed this gift code
      const { data: existingRedemption, error: checkError } = await supabase
        .from("gift_code_redemptions")
        .select("id")
        .eq("user_id", userData.user.id)
        .eq("gift_code", normalizedCode)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking gift code redemption:", checkError);
        toast.error("Unable to verify gift code. Please try again.");
        return false;
      }

      if (existingRedemption) {
        toast.error("You have already redeemed this gift code");
        return false;
      }

      // Get current credits
      const credits = await CreditBaseService.getUserCredits();
      if (!credits) {
        // Try to initialize first
        const initialized = await CreditBaseService.initializeUserCredits();
        if (!initialized) {
          toast.error("Unable to initialize credits. Please try again.");
          return false;
        }
        // Retry getting credits after initialization
        const freshCredits = await CreditBaseService.getUserCredits();
        if (!freshCredits) {
          toast.error("Unable to retrieve credits. Please try again.");
          return false;
        }
      }

      // Record the gift code redemption
      const { error: redemptionError } = await supabase
        .from("gift_code_redemptions")
        .insert({
          user_id: userData.user.id,
          gift_code: normalizedCode,
          credits_awarded: creditsToAward
        });

      if (redemptionError) {
        console.error("Error recording gift code redemption:", redemptionError);
        toast.error("Unable to redeem gift code. Please try again.");
        return false;
      }

      // Add credits to user account
      const currentCredits = credits || await CreditBaseService.getUserCredits();
      if (!currentCredits) {
        toast.error("Unable to retrieve current credits. Please try again.");
        return false;
      }

      const { error: updateError } = await supabase
        .from("user_credits")
        .update({
          total_credits: currentCredits.totalCredits + creditsToAward
        })
        .eq("user_id", userData.user.id);

      if (updateError) {
        console.error("Error adding credits:", updateError);
        toast.error("Gift code redeemed but credits could not be added. Please contact support.");
        return false;
      }

      toast.success(`🎉 Gift code redeemed! ${creditsToAward} credits added to your account.`);
      return true;
    } catch (error) {
      console.error("Error in redeemGiftCode:", error);
      toast.error("An error occurred while redeeming the gift code");
      return false;
    }
  }
};
