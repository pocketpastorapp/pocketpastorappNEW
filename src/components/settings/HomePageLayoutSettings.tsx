
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface HomePageSettings {
  showLargeLogo: boolean;
  showWelcomeMessage: boolean;
  showInformationCards: boolean;
  showFavoriteVersesSection: boolean;
  showNotepadSection: boolean;
}

interface HomePageLayoutSettingsProps {
  homeSettings: HomePageSettings;
  onSettingsChange: (setting: keyof HomePageSettings, value: boolean) => void;
}

export const HomePageLayoutSettings: React.FC<HomePageLayoutSettingsProps> = ({
  homeSettings,
  onSettingsChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Home Page Layout Settings</CardTitle>
        <CardDescription>
          Customize which sections appear on your home page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="large-logo">Large Logo</Label>
            <p className="text-sm text-muted-foreground">
              Show the large Pocket Pastor logo
            </p>
          </div>
          <Switch
            id="large-logo"
            checked={homeSettings.showLargeLogo}
            onCheckedChange={(value) => onSettingsChange('showLargeLogo', value)}
            style={{
              backgroundColor: homeSettings.showLargeLogo ? "#184482" : undefined
            }}
            className="data-[state=checked]:bg-[#184482]"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="welcome-message">Welcome Message</Label>
            <p className="text-sm text-muted-foreground">
              Display the welcome title text
            </p>
          </div>
          <Switch
            id="welcome-message"
            checked={homeSettings.showWelcomeMessage}
            onCheckedChange={(value) => onSettingsChange('showWelcomeMessage', value)}
            style={{
              backgroundColor: homeSettings.showWelcomeMessage ? "#184482" : undefined
            }}
            className="data-[state=checked]:bg-[#184482]"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="information-cards">Information Cards</Label>
            <p className="text-sm text-muted-foreground">
              Show the three feature cards (Biblical Guidance, Scripture Study, Prayer Support)
            </p>
          </div>
          <Switch
            id="information-cards"
            checked={homeSettings.showInformationCards}
            onCheckedChange={(value) => onSettingsChange('showInformationCards', value)}
            style={{
              backgroundColor: homeSettings.showInformationCards ? "#184482" : undefined
            }}
            className="data-[state=checked]:bg-[#184482]"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="favorite-verses">Favorite Verses Section</Label>
            <p className="text-sm text-muted-foreground">
              Display your saved favorite verses on the home page
            </p>
          </div>
          <Switch
            id="favorite-verses"
            checked={homeSettings.showFavoriteVersesSection}
            onCheckedChange={(value) => onSettingsChange('showFavoriteVersesSection', value)}
            style={{
              backgroundColor: homeSettings.showFavoriteVersesSection ? "#184482" : undefined
            }}
            className="data-[state=checked]:bg-[#184482]"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notepad-section">Notepad Section</Label>
            <p className="text-sm text-muted-foreground">
              Show your personal notepad with quick note access
            </p>
          </div>
          <Switch
            id="notepad-section"
            checked={homeSettings.showNotepadSection}
            onCheckedChange={(value) => onSettingsChange('showNotepadSection', value)}
            style={{
              backgroundColor: homeSettings.showNotepadSection ? "#184482" : undefined
            }}
            className="data-[state=checked]:bg-[#184482]"
          />
        </div>
      </CardContent>
    </Card>
  );
};
