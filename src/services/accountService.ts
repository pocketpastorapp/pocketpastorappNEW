import { supabase } from "@/integrations/supabase/client";
import { EmailService } from "@/services/emailService";

export interface HomePageSettings {
  showLargeLogo: boolean;
  showWelcomeMessage: boolean;
  showInformationCards: boolean;
  showFavoriteVersesSection: boolean;
  showNotepadSection: boolean;
}

export interface UserAccountData {
  name: string;
  email: string;
  password: string;
  gender: string;
}

export const AccountService = {
  // Load user's home page preferences
  loadHomePageSettings: async (userId: string): Promise<HomePageSettings> => {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('home_page_settings')
      .eq('user_id', userId)
      .single();
    
    if (data?.home_page_settings) {
      const settings = data.home_page_settings as Record<string, any>;
      return {
        showLargeLogo: settings.showLargeLogo ?? true,
        showWelcomeMessage: settings.showWelcomeMessage ?? true,
        showInformationCards: settings.showInformationCards ?? true,
        showFavoriteVersesSection: settings.showFavoriteVersesSection ?? true,
        showNotepadSection: settings.showNotepadSection ?? true,
      };
    }
    
    return {
      showLargeLogo: true,
      showWelcomeMessage: true,
      showInformationCards: true,
      showFavoriteVersesSection: true,
      showNotepadSection: true,
    };
  },

  // Save home page settings
  saveHomePageSettings: async (userId: string, settings: HomePageSettings): Promise<void> => {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        home_page_settings: settings as any
      });
    
    if (error) throw error;
  },

  // Load fresh account data
  loadAccountData: async (userId: string, userEmail: string): Promise<UserAccountData> => {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('name, gender')
      .eq('id', userId)
      .single();

    return {
      name: profileData?.name || "",
      email: userEmail || "",
      password: "",
      gender: profileData?.gender || "",
    };
  },

  // Update account information
  updateAccountData: async (userId: string, accountData: UserAccountData, currentEmail: string, currentName?: string): Promise<void> => {
    // Update email if changed
    if (accountData.email !== currentEmail) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: accountData.email
      });
      if (emailError) throw emailError;
    }

    // Update password if provided
    if (accountData.password) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: accountData.password
      });
      if (passwordError) throw passwordError;
    }

    // Update name or gender in profile if changed
    const profileUpdates: any = {};
    if (accountData.name !== currentName) {
      profileUpdates.name = accountData.name;
    }
    if (accountData.gender) {
      profileUpdates.gender = accountData.gender;
    }

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', userId);
      if (profileError) throw profileError;
    }
  },

  // Delete user account and all associated data
  deleteAccount: async (userId: string, userEmail: string, userName?: string): Promise<void> => {
    console.log("Starting account deletion for user:", userId);

    // Send account deletion email first
    if (userEmail) {
      try {
        await EmailService.sendEmail(userEmail, 'account-deletion', {
          name: userName || userEmail.split('@')[0] || 'User'
        });
      } catch (emailError) {
        console.error("Failed to send deletion email:", emailError);
        // Continue with deletion even if email fails
      }
    }

    try {
      console.log("Calling database function to delete user account and all data...");

      // Use the improved database function that handles all data deletion
      const { error: deleteError } = await supabase.rpc('delete_user_account');
      
      if (deleteError) {
        console.error("Failed to delete user account:", deleteError);
        throw deleteError;
      }

      console.log("Account deletion completed successfully");
    } catch (error) {
      console.error("Error during account deletion:", error);
      throw error;
    }
  }
};
