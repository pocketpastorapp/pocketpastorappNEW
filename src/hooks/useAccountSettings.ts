
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { AccountService, HomePageSettings, UserAccountData } from "@/services/accountService";
import { toast } from "sonner";

export const useAccountSettings = () => {
  const { user, profile } = useAuth();
  
  // Home page layout settings
  const [homeSettings, setHomeSettings] = useState<HomePageSettings>({
    showLargeLogo: true,
    showWelcomeMessage: true,
    showInformationCards: true,
    showFavoriteVersesSection: true,
    showNotepadSection: true,
  });

  // Account data
  const [accountData, setAccountData] = useState<UserAccountData>({
    name: "",
    email: "",
    password: "",
    gender: "",
  });

  // Store original account data for cancel functionality
  const [originalAccountData, setOriginalAccountData] = useState<UserAccountData>({
    name: "",
    email: "",
    password: "",
    gender: "",
  });

  const [accountLoading, setAccountLoading] = useState(false);

  // Load user's settings and account data
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      try {
        // Load home page settings
        const settings = await AccountService.loadHomePageSettings(user.id);
        setHomeSettings(settings);

        // Load account data
        const initialAccountData = await AccountService.loadAccountData(user.id, user.email || "");
        setAccountData(initialAccountData);
        setOriginalAccountData(initialAccountData);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    
    loadSettings();
  }, [user, profile]);

  const handleHomeSettingsChange = async (setting: keyof HomePageSettings, value: boolean) => {
    const newSettings = { ...homeSettings, [setting]: value };
    setHomeSettings(newSettings);
    
    if (!user) return;
    
    try {
      await AccountService.saveHomePageSettings(user.id, newSettings);
      toast.success("Home page settings updated");
    } catch (error) {
      console.error("Failed to save home page settings:", error);
      toast.error("Failed to save settings");
    }
  };

  const handleAccountDataChange = (field: keyof UserAccountData, value: string) => {
    setAccountData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancelAccountData = () => {
    setAccountData(originalAccountData);
  };

  const handleSaveAccountData = async () => {
    if (!user) return;
    
    setAccountLoading(true);
    try {
      await AccountService.updateAccountData(user.id, accountData, user.email || "", profile?.name);

      // Clear password field after successful update
      const updatedAccountData = { ...accountData, password: "" };
      setAccountData(updatedAccountData);
      setOriginalAccountData(updatedAccountData);
      
      toast.success("Account information updated successfully");
    } catch (error: any) {
      console.error("Failed to update account:", error);
      toast.error(error.message || "Failed to update account information");
    } finally {
      setAccountLoading(false);
    }
  };

  return {
    homeSettings,
    accountData,
    originalAccountData,
    accountLoading,
    handleHomeSettingsChange,
    handleAccountDataChange,
    handleCancelAccountData,
    handleSaveAccountData
  };
};
