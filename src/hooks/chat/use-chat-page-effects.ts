
import { useEffect } from "react";

interface UseChatPageEffectsProps {
  setInputMessage: (message: string) => void;
  inputMessage: string;
  setShowPromptButtons: (show: boolean) => void;
  isMobile: boolean;
  isKeyboardVisible: boolean;
  keyboardHeight: number;
}

export const useChatPageEffects = ({
  setInputMessage,
  inputMessage,
  setShowPromptButtons,
  isMobile,
  isKeyboardVisible,
  keyboardHeight
}: UseChatPageEffectsProps) => {
  // Check for initial verse message from sessionStorage and show prompt buttons
  useEffect(() => {
    const initialMessage = sessionStorage.getItem('chatInitialMessage');
    if (initialMessage) {
      setInputMessage(initialMessage);
      setShowPromptButtons(true);
      sessionStorage.removeItem('chatInitialMessage');
    }
  }, [setInputMessage, setShowPromptButtons]);

  // Show prompt buttons when inputMessage contains verse-like content
  useEffect(() => {
    if (inputMessage.includes('"') && inputMessage.includes('-')) {
      setShowPromptButtons(true);
    } else if (!inputMessage.trim()) {
      setShowPromptButtons(false);
    }
  }, [inputMessage, setShowPromptButtons]);

  // Log keyboard state for debugging
  useEffect(() => {
    if (isMobile) {
      console.log('Mobile keyboard state:', { isKeyboardVisible, keyboardHeight });
    }
  }, [isMobile, isKeyboardVisible, keyboardHeight]);
};
