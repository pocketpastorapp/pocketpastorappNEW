
interface UseChatPageLayoutProps {
  isMobile: boolean;
  isKeyboardVisible: boolean;
  keyboardHeight: number;
  showPromptButtons: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
}

export const useChatPageLayout = ({
  isMobile,
  isKeyboardVisible,
  keyboardHeight,
  showPromptButtons,
  isSpeaking,
  isPaused
}: UseChatPageLayoutProps) => {
  // Calculate proper bottom positioning for mobile
  const getBottomPosition = () => {
    if (!isMobile) return '0px';
    if (isKeyboardVisible && keyboardHeight > 0) {
      return `${keyboardHeight + 10}px`;
    }
    return '0px';
  };

  // Calculate proper padding for chat container
  const getChatPadding = () => {
    if (!isMobile) {
      return (isSpeaking || isPaused) ? '200px' : '140px';
    }
    
    if (isKeyboardVisible && keyboardHeight > 0) {
      const inputContainerHeight = showPromptButtons ? 120 : 80;
      return `${keyboardHeight + inputContainerHeight + 20}px`;
    }
    
    return (isSpeaking || isPaused) ? '200px' : '120px';
  };

  return {
    getBottomPosition,
    getChatPadding
  };
};
