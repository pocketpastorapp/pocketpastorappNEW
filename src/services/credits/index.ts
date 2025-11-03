
import { CreditBaseService } from "./creditBaseService";
import { CreditUsageService } from "./creditUsageService";
import { CreditAddService } from "./creditAddService";
import { CreditGiftService } from "./creditGiftService";

// Export a unified API that matches the original CreditService
export const CreditService = {
  // Base operations
  getUserCredits: CreditBaseService.getUserCredits,
  initializeUserCredits: (userId?: string) => CreditBaseService.initializeUserCredits(userId),
  
  // Credit usage operations
  useCredit: CreditUsageService.useCredit,
  
  // Credit addition operations
  addCredits: CreditAddService.addCredits,
  addCreditsFromAd: CreditAddService.addCreditsFromAd,
  
  // Gift code operations
  redeemGiftCode: CreditGiftService.redeemGiftCode
};
