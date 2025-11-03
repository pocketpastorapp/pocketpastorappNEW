
import { DialogFooter } from "@/components/ui/dialog";

interface PurchaseModalFooterProps {
  onGiftCodeClick: () => void;
}

export function PurchaseModalFooter({ onGiftCodeClick }: PurchaseModalFooterProps) {
  return (
    <DialogFooter className="flex-col sm:flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        Payments are processed securely through Stripe. Your purchase will be available immediately after payment.
      </p>
      <p className="text-xs text-muted-foreground">
        If you have a gift code you would like to redeem you can{" "}
        <button 
          onClick={onGiftCodeClick}
          className="text-[#1D6AD7] hover:underline cursor-pointer"
        >
          click here
        </button>
      </p>
    </DialogFooter>
  );
}
