
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileKeyboard } from "@/hooks/use-mobile-keyboard";

interface UseChatMobileProps {
  isSpeaking: boolean;
  isPaused: boolean;
  showPromptButtons: boolean;
}

export const useChatMobile = ({ isSpeaking, isPaused, showPromptButtons }: UseChatMobileProps) => {
  const isMobile = useIsMobile();
  const { isKeyboardVisible, keyboardHeight } = useMobileKeyboard(isMobile);

  return {
    isMobile,
    isKeyboardVisible,
    keyboardHeight
  };
};
