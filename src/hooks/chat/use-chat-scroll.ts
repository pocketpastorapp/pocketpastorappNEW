
import { useRef, useState, useEffect } from "react";

interface UseChatScrollProps {
  isSpeaking: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  messages: any[];
}

export const useChatScroll = ({ isSpeaking, messagesEndRef, chatContainerRef, messages }: UseChatScrollProps) => {
  const [userScrolled, setUserScrolled] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor scroll position to detect user scrolling
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      
      if (!isAtBottom) {
        setUserScrolled(true);
        
        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        // During speech, don't auto-reset user scroll state - let them scroll freely
        if (!isSpeaking) {
          scrollTimeoutRef.current = setTimeout(() => {
            setUserScrolled(false);
          }, 2000);
        }
      } else {
        // Only reset userScrolled if not speaking, to prevent auto-scroll during speech
        if (!isSpeaking) {
          setUserScrolled(false);
        }
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      }
    };

    chatContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [chatContainerRef, isSpeaking]);
  
  // UNIFIED AUTO-SCROLL: Only auto-scroll for new messages when user hasn't scrolled AND speech is NOT active
  useEffect(() => {
    // COMPLETELY disable ANY auto-scroll during speech - this is the ONLY scroll control now
    if (isSpeaking) {
      console.log("Auto-scroll completely disabled: speech is playing - user can freely scroll");
      return;
    }
    
    // Don't auto-scroll if user has manually scrolled
    if (userScrolled) {
      console.log("Auto-scroll disabled: user has scrolled");
      return;
    }
    
    // Only auto-scroll for new messages when speech is NOT playing
    if (messagesEndRef.current) {
      console.log("Auto-scrolling to bottom - speech not active, user hasn't scrolled");
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, userScrolled, isSpeaking]);

  // Reset user scroll state when speech ends, but with a delay
  useEffect(() => {
    if (!isSpeaking && userScrolled) {
      // When speech ends and user had scrolled, reset after a longer delay
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        console.log("Resetting user scroll state after speech ended");
        setUserScrolled(false);
      }, 3000); // Longer delay after speech ends
    }
  }, [isSpeaking, userScrolled]);

  return {
    userScrolled,
    setUserScrolled
  };
};
