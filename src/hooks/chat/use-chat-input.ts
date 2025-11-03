
import { useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export const useChatInput = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { isListening, toggleSpeechRecognition } = useSpeechRecognition({
    onTranscript: setInputMessage
  });

  return {
    inputMessage,
    setInputMessage,
    isProcessing,
    setIsProcessing,
    isListening,
    toggleSpeechRecognition
  };
};
