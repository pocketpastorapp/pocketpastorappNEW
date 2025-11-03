
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/integrations/supabase/client';

interface HomePageSettings {
  showLargeLogo: boolean;
  showWelcomeMessage: boolean;
  showInformationCards: boolean;
  showFavoriteVersesSection: boolean;
  showNotepadSection: boolean;
}

export const useHomePageSettings = () => {
  const { user } = useAuth();
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  
  const [homeSettings, setHomeSettings] = useState<HomePageSettings>({
    showLargeLogo: true,
    showWelcomeMessage: true,
    showInformationCards: true,
    showFavoriteVersesSection: true,
    showNotepadSection: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        return;
      }
      
      setIsLoadingSettings(true);
      
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('home_page_settings')
          .eq('user_id', user.id)
          .single();
        
        if (data?.home_page_settings) {
          const settings = data.home_page_settings as Record<string, any>;
          setHomeSettings({
            showLargeLogo: settings.showLargeLogo ?? true,
            showWelcomeMessage: settings.showWelcomeMessage ?? true,
            showInformationCards: settings.showInformationCards ?? true,
            showFavoriteVersesSection: settings.showFavoriteVersesSection ?? true,
            showNotepadSection: settings.showNotepadSection ?? true,
          });
        }
      } catch (error) {
        console.error("Failed to load home page settings:", error);
      } finally {
        setIsLoadingSettings(false);
      }
    };
    
    loadSettings();
  }, [user]);

  return { homeSettings, isLoadingSettings };
};
