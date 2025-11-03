
import { useState, useEffect } from "react";
import { ChatBubbleColors } from "@/components/chat/ChatSettings";
import { PreferencesService } from "@/services/preferencesService";

interface UseChatPageStateProps {
  defaultBubbleColors: ChatBubbleColors;
  setInputMessage: (message: string) => void;
}

export const useChatPageState = ({ defaultBubbleColors, setInputMessage }: UseChatPageStateProps) => {
  const [bubbleColors, setBubbleColors] = useState<ChatBubbleColors>(defaultBubbleColors);
  const [showPromptButtons, setShowPromptButtons] = useState(false);

  // Load user preferences for bubble colors
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await PreferencesService.loadPreferences();
        if (prefs) {
          setBubbleColors(prefs);
        }
      } catch (error) {
        console.error("Error loading bubble color preferences:", error);
      }
    };
    
    loadPreferences();
  }, []);

  // Check for initial verse message from sessionStorage and show prompt buttons
  useEffect(() => {
    const initialMessage = sessionStorage.getItem('chatInitialMessage');
    if (initialMessage) {
      setInputMessage(initialMessage);
      setShowPromptButtons(true);
      sessionStorage.removeItem('chatInitialMessage');
    }
  }, [setInputMessage]);

  return {
    bubbleColors,
    showPromptButtons,
    setShowPromptButtons
  };
};
