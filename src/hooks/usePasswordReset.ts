
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const usePasswordReset = () => {
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handlePasswordReset = async (email: string) => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    setIsResettingPassword(true);
    try {
      // Use Supabase's built-in password reset with proper redirect to reset-password page
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error("Failed to send reset email. Please try again.");
        console.error("Password reset error:", error);
        return;
      }
      
      // Show success state in UI
      setResetEmailSent(true);
      toast.success("Password reset email sent! Check your inbox for the reset link.");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const resetPasswordResetState = () => {
    setResetEmailSent(false);
  };

  return {
    isResettingPassword,
    resetEmailSent,
    handlePasswordReset,
    resetPasswordResetState
  };
};
