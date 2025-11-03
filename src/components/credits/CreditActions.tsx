
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { UserCredits } from "@/types/user-credit-types";

interface CreditActionsProps {
  credits: UserCredits | null;
  addCredits: (amount: number) => Promise<boolean>;
  addCreditsFromAd: () => Promise<boolean>;
  useCredit: () => Promise<boolean>;
  onPurchaseClick: () => void;
  refreshCredits: () => void;
}

const CreditActions = ({ 
  credits, 
  onPurchaseClick 
}: CreditActionsProps) => {
  const [isBuyLoading, setIsBuyLoading] = useState(false);

  if (!credits) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Get More Credits</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full" 
          onClick={onPurchaseClick}
          disabled={isBuyLoading || credits.hasUnlimitedCredits}
        >
          <PlusCircle className="mr-2" />
          {isBuyLoading ? "Processing..." : "Buy Credits"}
        </Button>
      </div>
    </div>
  );
};

export default CreditActions;
