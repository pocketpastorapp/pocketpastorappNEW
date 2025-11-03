
import { useState, useEffect, useRef } from 'react';

export const useMobileKeyboard = (isMobile: boolean) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isMobile) {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
      return;
    }

    // Debounced function to update keyboard state
    const updateKeyboardState = (height: number, isVisible: boolean) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        setKeyboardHeight(height);
        setIsKeyboardVisible(isVisible);
        console.log('Keyboard state updated:', { height, isVisible });
      }, 50); // Small debounce to prevent rapid updates
    };

    // Use visualViewport if available (most reliable)
    if (window.visualViewport) {
      const handleViewportChange = () => {
        const windowHeight = window.innerHeight;
        const viewportHeight = window.visualViewport!.height;
        const heightDifference = windowHeight - viewportHeight;
        
        const keyboardThreshold = 150; // More conservative threshold
        const isVisible = heightDifference > keyboardThreshold;
        const calculatedHeight = isVisible ? heightDifference : 0;
        
        updateKeyboardState(calculatedHeight, isVisible);
      };

      window.visualViewport.addEventListener('resize', handleViewportChange);
      
      // Initial check
      handleViewportChange();
      
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        window.visualViewport!.removeEventListener('resize', handleViewportChange);
      };
    } else {
      // Fallback for browsers without visualViewport
      const initialHeight = window.innerHeight;
      
      const handleResize = () => {
        const currentHeight = window.innerHeight;
        const heightDifference = initialHeight - currentHeight;
        
        const keyboardThreshold = 150;
        const isVisible = heightDifference > keyboardThreshold;
        const calculatedHeight = isVisible ? heightDifference : 0;
        
        updateKeyboardState(calculatedHeight, isVisible);
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isMobile]);

  return {
    isKeyboardVisible,
    keyboardHeight
  };
};
