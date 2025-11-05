
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatBubbleColors, DEFAULT_BUBBLE_COLORS } from "@/components/chat/ChatSettings";
import ColorPicker, { shouldUseWhiteText } from "@/components/chat/ColorPicker";
import { PreferencesService } from "@/services/preferencesService";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [userBubbleColor, setUserBubbleColor] = useState(DEFAULT_BUBBLE_COLORS.userBubble);
  const [botBubbleColor, setBotBubbleColor] = useState(DEFAULT_BUBBLE_COLORS.botBubble);
  
  // Predefined color options - new color palette
  const colorOptions = {
    "peach": "#FF927F",
    "yellow": "#EBD811",
    "green": "#56DD34",
    "teal": "#30D7CC",
    "blue": "#7B93FF",
    "purple": "#DB78FF",
    "gray": "#848484",
    "navy": "#184482",
    "red": "#831A1C",
    "olive": "#3B711C"
  };
  
  // Load user's current preferences
  useEffect(() => {
    const loadPreferences = async () => {
      setLoading(true);
      try {
        const prefs = await PreferencesService.loadPreferences();
        if (prefs) {
          setUserBubbleColor(prefs.userBubble);
          setBotBubbleColor(prefs.botBubble);
        } else {
          // If no preferences are found, use the default colors
          setUserBubbleColor(DEFAULT_BUBBLE_COLORS.userBubble);
          setBotBubbleColor(DEFAULT_BUBBLE_COLORS.botBubble);
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
        // If there's an error, fall back to the default colors
        setUserBubbleColor(DEFAULT_BUBBLE_COLORS.userBubble);
        setBotBubbleColor(DEFAULT_BUBBLE_COLORS.botBubble);
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, []);
  
  const handleSave = async () => {
    setLoading(true);
    try {
      const success = await PreferencesService.savePreferences({
        userBubble: userBubbleColor,
        botBubble: botBubbleColor
      });
      
      if (success) {
        toast({
          title: "Settings saved",
          description: "Your chat bubble colors have been updated.",
          duration: 3000
        });
        navigate("/chat");
      } else {
        toast({
          title: "Error saving settings",
          description: "Please try again.",
          variant: "destructive",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast({
        title: "Error saving settings",
        description: "Please try again.",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  // Preview component to show how bubbles will look
  const BubblePreview = () => (
    <div className="flex flex-col gap-2">
      <div 
        className="chat-message-container user-message font-medium max-w-[200px]"
        style={{ 
          backgroundColor: userBubbleColor,
          color: shouldUseWhiteText(userBubbleColor) ? 'white' : 'black'
        }}
      >
        Your message
      </div>
      <div 
        className="chat-message-container bot-message font-medium max-w-[200px]"
        style={{ 
          backgroundColor: botBubbleColor,
          color: shouldUseWhiteText(botBubbleColor) ? 'white' : 'black'
        }}
      >
        Pocket Pastor's message
      </div>
    </div>
  );
  
  const contentPadding = isMobile ? "p-3" : "p-4"; // 12px on mobile, 16px on desktop
  const containerPadding = isMobile ? "py-4" : "py-6"; // Reduced container padding
  
  return (
    <Layout showFooter={true}>
      <div className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <Tabs defaultValue="appearance">
          <TabsList className="mb-3">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4">
            <div className={`bg-card rounded-lg border ${contentPadding}`}>
              <h2 className="text-lg font-semibold mb-3">Chat Bubble Colors</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium mb-2">Your Messages</h3>
                  <ColorPicker 
                    colors={colorOptions}
                    selectedColor={userBubbleColor}
                    onSelectColor={setUserBubbleColor}
                  />
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Pocket Pastor's Messages</h3>
                  <ColorPicker 
                    colors={colorOptions}
                    selectedColor={botBubbleColor}
                    onSelectColor={setBotBubbleColor}
                  />
                </div>
                
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">Preview</h3>
                  <BubblePreview />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={loading}
                variant="navy"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
