
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { NotepadSection } from "@/components/notepad/NotepadSection";
import VerseClusterSection from "@/components/bible/VerseClusterSection";
import { HomePageLogo } from "./HomePageLogo";
import { HomePageWelcome } from "./HomePageWelcome";
import { HomePageInfoCards } from "./HomePageInfoCards";
import { HomePageActions } from "./HomePageActions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface HomePageContentProps {
  isLoadingSettings: boolean;
  homeSettings: {
    showLargeLogo: boolean;
    showWelcomeMessage: boolean;
    showInformationCards: boolean;
    showFavoriteVersesSection: boolean;
    showNotepadSection: boolean;
  };
  isInstallable: boolean;
  onInstallClick: () => void;
}

export const HomePageContent = ({ 
  isLoadingSettings, 
  homeSettings, 
  isInstallable, 
  onInstallClick 
}: HomePageContentProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center gap-4 py-2 text-center min-h-screen">
      <div className="flex-1 w-full flex flex-col items-center gap-4">
        {/* Loading indicator for settings */}
        {isLoadingSettings && (
          <div className="w-full flex justify-center py-4">
            <LoadingSpinner size="sm" text="Loading your preferences..." />
          </div>
        )}

        {/* Large Logo Section */}
        <HomePageLogo show={homeSettings.showLargeLogo} />
        
        {/* Welcome Title Section */}
        <HomePageWelcome show={homeSettings.showWelcomeMessage} />
        
        {/* Action Buttons */}
        <HomePageActions isInstallable={isInstallable} onInstallClick={onInstallClick} />
        
        {/* Information Cards Section */}
        <HomePageInfoCards show={homeSettings.showInformationCards} />
        
        {/* Favorite Verses Section */}
        {homeSettings.showFavoriteVersesSection && (
          <div className="w-full max-w-3xl animate-fade-in-up" style={{
            animationDelay: "0.3s"
          }}>
            <ErrorBoundary>
              <VerseClusterSection />
            </ErrorBoundary>
          </div>
        )}
        
        {/* Notepad Section */}
        {homeSettings.showNotepadSection && (
          <div className="w-full max-w-3xl animate-fade-in-up" style={{
            animationDelay: "0.4s"
          }}>
            <ErrorBoundary>
              <NotepadSection />
            </ErrorBoundary>
          </div>
        )}
      </div>

      {/* Sign Out Button at Bottom - only show if user is logged in */}
      {user && (
        <div className="w-full flex justify-center pb-6 pt-8">
          <Button 
            variant="outline" 
            onClick={logout} 
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
};
