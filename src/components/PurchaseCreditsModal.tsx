
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coins } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";
import { CreditPackageGrid } from "./CreditPackageGrid";
import { PurchaseModalFooter } from "./PurchaseModalFooter";
import { GiftCodeModal } from "./GiftCodeModal";

interface PurchaseCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const creditPackages = [
  {
    id: "small",
    name: "Small Package",
    price: "$1.99",
    credits: 20,
    description: "Best for casual users",
    color: "bg-green-100 dark:bg-green-900/20"
  },
  {
    id: "medium",
    name: "Medium Package",
    price: "$6.99",
    credits: 80,
    description: "Popular choice",
    color: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    id: "large",
    name: "Large Package",
    price: "$14.99",
    credits: 180,
    description: "Best value",
    color: "bg-purple-100 dark:bg-purple-900/20"
  }
];

export function PurchaseCreditsModal({ open, onOpenChange, onSuccess }: PurchaseCreditsModalProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [giftCodeModalOpen, setGiftCodeModalOpen] = useState(false);
  const { user } = useAuth();

  const handlePurchase = async (packageId: string) => {
    if (!user) {
      toast.error("You must be logged in to purchase credits");
      return;
    }

    setIsLoading(packageId);
    
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { packageId },
      });

      if (error) {
        console.error("Error creating checkout:", error);
        toast.error("Failed to create checkout session");
        return;
      }

      if (data?.url) {
        console.log("Redirecting to checkout URL:", data.url);
        
        // Direct window location change for more reliable redirection
        window.location.href = data.url;
      } else {
        console.error("Invalid response from checkout:", data);
        toast.error("Invalid response from checkout");
      }
    } catch (err) {
      console.error("Error during checkout:", err);
      toast.error("An error occurred during checkout");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-white" />
              Purchase Credits
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Credits are used for generating messages with our AI. Choose a package below:
            </p>

            <CreditPackageGrid
              packages={creditPackages}
              isLoading={isLoading}
              onPurchase={handlePurchase}
            />
          </div>

          <PurchaseModalFooter onGiftCodeClick={() => setGiftCodeModalOpen(true)} />
        </DialogContent>
      </Dialog>

      <GiftCodeModal 
        open={giftCodeModalOpen}
        onOpenChange={setGiftCodeModalOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}

export default PurchaseCreditsModal;
