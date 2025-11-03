
import { useEffect } from "react";
import { initializeSpeechVoices } from "@/services/speech";

const SpeechInitializer = () => {
  // Initialize speech synthesis voices when component mounts
  useEffect(() => {
    const initializeVoices = async () => {
      try {
        await initializeSpeechVoices();
      } catch (error) {
        console.error("Error initializing speech voices:", error);
      }
    };
    
    initializeVoices();
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default SpeechInitializer;
