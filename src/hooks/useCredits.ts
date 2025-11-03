
import { useState, useEffect } from "react";
import { UserCredits } from "@/types/user-credit-types";
import { CreditService } from "@/services/credits";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useCredits = () => {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchCredits = async () => {
    if (!user) {
      setCredits(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const userCredits = await CreditService.getUserCredits();
      
      if (!userCredits) {
        console.log("No credits found for user, initializing default credits");
        // Ensure auth session is ready for RLS-protected insert
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.warn("Auth session not ready; deferring credits initialization");
          return;
        }
        const initialized = await CreditService.initializeUserCredits(session.user.id);
        if (initialized) {
          const freshCredits = await CreditService.getUserCredits();
          setCredits(freshCredits);
        } else {
          console.warn("Credit initialization skipped or failed; will retry later.");
        }
      } else {
        setCredits(userCredits);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
      toast.error("Unable to retrieve your credits. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCredits();
    } else {
      setCredits(null);
      setIsLoading(false);
    }
  }, [user]);

  const useCredit = async (): Promise<boolean> => {
    if (!credits && user) {
      await fetchCredits();
      // If still no credits after fetching, return false
      if (!credits) return false;
    }
    
    const success = await CreditService.useCredit();
    if (success) {
      await fetchCredits(); // Refresh credits after usage
    }
    return success;
  };

  const addCreditsFromAd = async (): Promise<boolean> => {
    const success = await CreditService.addCreditsFromAd();
    if (success) {
      await fetchCredits(); // Refresh credits after adding
    }
    return success;
  };

  const addCredits = async (amount: number): Promise<boolean> => {
    const success = await CreditService.addCredits(amount);
    if (success) {
      await fetchCredits(); // Refresh credits after adding
    }
    return success;
  };

  return {
    credits,
    isLoading,
    useCredit,
    addCredits,
    addCreditsFromAd,
    refreshCredits: fetchCredits
  };
};
