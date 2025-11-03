
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Loader2 } from "lucide-react";
import { CreditService } from "@/services/credits";

interface GiftCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function GiftCodeModal({ open, onOpenChange, onSuccess }: GiftCodeModalProps) {
  const [giftCode, setGiftCode] = useState("");
  const [isRedeemingGift, setIsRedeemingGift] = useState(false);

  const handleRedeemGiftCode = async () => {
    if (!giftCode.trim()) {
      return;
    }

    setIsRedeemingGift(true);
    
    try {
      const success = await CreditService.redeemGiftCode(giftCode);
      if (success) {
        setGiftCode("");
        onSuccess?.();
        onOpenChange(false);
      }
    } finally {
      setIsRedeemingGift(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" style={{ color: "#184482" }} />
            Redeem Gift Code
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Enter your gift code below to redeem free credits
          </p>
          <div className="grid gap-2">
            <Label htmlFor="giftCode">
              Gift Code
            </Label>
            <Input
              id="giftCode"
              placeholder="Enter gift code"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
              disabled={isRedeemingGift}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isRedeemingGift && giftCode.trim()) {
                  handleRedeemGiftCode();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRedeemingGift}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRedeemGiftCode}
            disabled={isRedeemingGift || !giftCode.trim()}
            className="bg-[#1D6AD7] hover:bg-[#1D6AD7]/90"
          >
            {isRedeemingGift ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redeeming...
              </>
            ) : (
              "Redeem"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
