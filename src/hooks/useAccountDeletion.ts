
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { AccountService } from "@/services/accountService";
import { toast } from "sonner";

export const useAccountDeletion = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setDeleteLoading(true);
    try {
      await AccountService.deleteAccount(
        user.id, 
        user.email || "", 
        profile?.name || user.user_metadata?.name
      );
      
      toast.success("Account deleted successfully");
      
      // Immediately logout and redirect, don't wait
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete account. Please try again.");
      
      // Even if deletion fails, log out the user for security
      try {
        await logout();
        navigate('/');
      } catch (logoutError) {
        console.error("Failed to logout after deletion error:", logoutError);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    deleteLoading,
    handleDeleteAccount
  };
};
