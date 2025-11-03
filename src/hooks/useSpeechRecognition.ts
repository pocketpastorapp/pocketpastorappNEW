
import { useRef, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseSpeechRecognitionProps {
  onTranscript: (transcript: string) => void;
}

// Instead of redeclaring the interface, we'll use a type that references the global one
type SpeechRecognitionType = typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;

export const useSpeechRecognition = ({ onTranscript }: UseSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const speechRecognition = useRef<SpeechRecognitionType | null>(null);
  const isCleanedUp = useRef(false);

  // Memoized cleanup function
  const cleanup = useCallback(() => {
    if (isCleanedUp.current) return;
    
    if (speechRecognition.current && isListening) {
      try {
        speechRecognition.current.stop();
      } catch (error) {
        console.warn('Error stopping speech recognition:', error);
      }
    }
    
    if (speechRecognition.current) {
      speechRecognition.current.onresult = null;
      speechRecognition.current.onerror = null;
      speechRecognition.current.onend = null;
      speechRecognition.current.onstart = null;
    }
    
    setIsListening(false);
    isCleanedUp.current = true;
  }, [isListening]);

  useEffect(() => {
    // Set up web speech API if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.webkitSpeechRecognition || window.SpeechRecognition;
      speechRecognition.current = new SpeechRecognitionAPI();
      
      if (speechRecognition.current) {
        speechRecognition.current.continuous = true;
        speechRecognition.current.interimResults = true;
        
        speechRecognition.current.onresult = (event: any) => {
          if (isCleanedUp.current) return;
          
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("");
            
          onTranscript(transcript);
        };
        
        speechRecognition.current.onerror = (event: any) => {
          if (isCleanedUp.current) return;
          
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          toast.error("Speech recognition error. Please try again.", {
            duration: 3000
          });
        };

        speechRecognition.current.onend = () => {
          if (isCleanedUp.current) return;
          setIsListening(false);
        };
      }
    }
    
    // Cleanup function
    return cleanup;
  }, [onTranscript, cleanup]);

  // Additional cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const toggleSpeechRecognition = useCallback(() => {
    if (isCleanedUp.current) return;
    
    if (!speechRecognition.current) {
      toast.error("Speech recognition is not supported in your browser.", {
        duration: 3000
      });
      return;
    }
    
    if (isListening) {
      speechRecognition.current.stop();
      setIsListening(false);
      toast.info("Recording stopped.", {
        duration: 3000
      });
    } else {
      try {
        speechRecognition.current.start();
        setIsListening(true);
        toast.info("Recording... Click the red button to stop.", {
          position: "top-center",
          duration: 3000
        });
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast.error("Failed to start recording. Please try again.", {
          duration: 3000
        });
      }
    }
  }, [isListening]);

  return {
    isListening,
    toggleSpeechRecognition,
    cleanup
  };
};
