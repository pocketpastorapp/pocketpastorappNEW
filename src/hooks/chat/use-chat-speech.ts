
import { useState, useEffect } from "react";
import { stopSpeaking } from "@/utils/speechControls";

export const useChatSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);
  
  // Clean up speech when component unmounts
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        stopSpeaking();
      }
    };
  }, [isSpeaking]);

  return {
    isSpeaking,
    setIsSpeaking,
    currentSpeakingId,
    setCurrentSpeakingId
  };
};
