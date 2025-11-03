
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => Promise<void>;
}

const DisclaimerModal = ({ isOpen, onAccept }: DisclaimerModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept();
    } catch (error) {
      console.error("Error accepting disclaimer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogContent 
        className="max-w-md"
        announceOnOpen="Important disclaimer for first-time users"
        hideClose
      >
        <DialogHeader className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#184482" }}>
              <img src="/lovable-uploads/da3313b1-8f4a-4b1d-979d-2f574837ec3d.png" alt="Pocket Pastor Logo" className="h-8 w-8" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            Welcome to Pocket Pastor
          </DialogTitle>
          <DialogDescription className="text-center text-base leading-relaxed space-y-4">
            <p>
              Pocket Pastor's guidance is for inspirational purposes only and is not a replacement for a relationship with God, the Word of God, and professional pastoral care.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleAccept}
            disabled={isLoading}
            className="w-full sm:w-auto px-8"
            style={{ backgroundColor: "#184482" }}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "I Agree"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerModal;
