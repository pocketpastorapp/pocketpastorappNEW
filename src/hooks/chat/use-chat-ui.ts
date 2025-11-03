
import { useRef, useEffect } from "react";

export const useChatUI = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return {
    messagesEndRef,
    chatContainerRef,
    scrollToBottom
  };
};
