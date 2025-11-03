
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export const useDisclaimerModal = () => {
  const { user, profile, isLoading, updateDisclaimerAcceptance } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Only show modal if:
    // 1. Not loading auth state
    // 2. User is authenticated
    // 3. Profile is loaded
    // 4. User hasn't accepted disclaimer yet
    if (!isLoading && user && profile && !profile.disclaimer_accepted) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isLoading, user, profile]);

  const handleAcceptDisclaimer = async () => {
    try {
      const success = await updateDisclaimerAcceptance();
      if (success) {
        setShowModal(false);
        toast.success("Welcome to Pocket Pastor!");
      } else {
        toast.error("Failed to save agreement. Please try again.");
      }
    } catch (error) {
      console.error("Error accepting disclaimer:", error);
      toast.error("Failed to save agreement. Please try again.");
    }
  };

  return {
    showModal,
    handleAcceptDisclaimer,
  };
};
