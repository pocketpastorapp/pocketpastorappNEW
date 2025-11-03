
import { useCredits } from "@/hooks/useCredits";
import { Coins, Infinity, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import PurchaseCreditsModal from "@/components/PurchaseCreditsModal";

export const CreditDisplay = () => {
  const { credits, isLoading, refreshCredits } = useCredits();
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const handlePurchaseClick = () => {
    setPurchaseModalOpen(true);
    setPopoverOpen(false); // Close popover after action
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center" aria-label="Loading credits">
        <Coins className="h-4 w-4 mr-2" aria-hidden="true" />
        <Skeleton className="h-4 w-12" />
      </div>
    );
  }
  
  if (!credits) {
    return null;
  }
  
  const totalAvailableCredits = credits.freeCredits + credits.totalCredits;
  const hasUnlimitedCredits = credits.hasUnlimitedCredits;

  const creditDisplayText = hasUnlimitedCredits 
    ? "Unlimited credits available"
    : `${totalAvailableCredits} credits available`;

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center px-2 py-2 gap-1"
            aria-label={creditDisplayText}
            aria-expanded={popoverOpen}
            aria-haspopup="dialog"
          >
            <Coins className="h-4 w-4" aria-hidden="true" />
            {hasUnlimitedCredits ? (
              <Infinity className="h-4 w-4" aria-hidden="true" />
            ) : (
              <>
                <span className="font-medium">{totalAvailableCredits}</span>
                <span className="text-xs text-muted-foreground">credits</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-64"
          role="dialog"
          aria-label="Credit details and actions"
        >
          <div className="text-sm p-1">
            {hasUnlimitedCredits ? (
              <p>You have unlimited credits!</p>
            ) : (
              <>
                <p>Free daily: <span className="font-medium">{credits.freeCredits}</span></p>
                <p>Total available: <span className="font-medium">{credits.totalCredits}</span></p>
                <div className="flex flex-col gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handlePurchaseClick} 
                    className="w-full"
                    aria-label="Purchase more credits"
                  >
                    <PlusCircle className="h-3 w-3 mr-1" aria-hidden="true" /> 
                    Purchase Credits
                  </Button>
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Purchase Credits Modal */}
      <PurchaseCreditsModal 
        open={purchaseModalOpen} 
        onOpenChange={setPurchaseModalOpen} 
        onSuccess={refreshCredits}
      />
    </>
  );
};
