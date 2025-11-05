
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
  // Bottom navigation height (h-20 = 80px)
  const BOTTOM_NAV_HEIGHT = 80;

  // Calculate proper bottom positioning for mobile
  const getBottomPosition = () => {
    if (!isMobile) return '0px';
    if (isKeyboardVisible && keyboardHeight > 0) {
      return `${keyboardHeight + BOTTOM_NAV_HEIGHT + 10}px`;
    }
    return `${BOTTOM_NAV_HEIGHT}px`;
  };

  // Calculate proper padding for chat container
  const getChatPadding = () => {
    if (!isMobile) {
      return (isSpeaking || isPaused) ? '200px' : '140px';
    }

    if (isKeyboardVisible && keyboardHeight > 0) {
      const inputContainerHeight = showPromptButtons ? 120 : 80;
      return `${keyboardHeight + inputContainerHeight + BOTTOM_NAV_HEIGHT + 20}px`;
    }

    return (isSpeaking || isPaused) ? `${200 + BOTTOM_NAV_HEIGHT}px` : `${120 + BOTTOM_NAV_HEIGHT}px`;
  };

  return {
    getBottomPosition,
    getChatPadding
  };
};
