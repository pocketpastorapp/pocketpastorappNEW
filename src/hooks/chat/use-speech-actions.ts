import { useState } from "react";
import { 
  speakMessage, 
  pauseSpeaking, 
  resumeSpeaking, 
  skipForward, 
  skipBackward, 
  seekTo,
  getAudioState 
} from "@/utils/speechControls";

interface UseSpeechActionsProps {
  setIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentSpeakingId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useSpeechActions = ({
  setIsSpeaking,
  setCurrentSpeakingId
}: UseSpeechActionsProps) => {
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Speech related functions
  const handleSpeak = (messageId: string, text: string) => {
    setCurrentSpeakingId(messageId);
    setIsPaused(false);
    
    speakMessage(
      text, 
      messageId, 
      setIsSpeaking, 
      // On speech end
      () => {
        setCurrentSpeakingId(null);
        setAudioProgress(0);
        setAudioDuration(0);
        setIsPaused(false);
      },
      // On time update
      (currentTime, duration) => {
        setAudioProgress(currentTime);
        setAudioDuration(duration);
      }
    );
  };
  
  const handlePause = () => {
    pauseSpeaking();
    setIsPaused(true);
    // Don't set isSpeaking to false - keep the audio player visible
  };
  
  const handleResume = () => {
    resumeSpeaking();
    setIsPaused(false);
  };
  
  const handleSkipForward = () => {
    skipForward();
    const { currentTime } = getAudioState();
    setAudioProgress(currentTime);
  };
  
  const handleSkipBackward = () => {
    skipBackward();
    const { currentTime } = getAudioState();
    setAudioProgress(currentTime);
  };

  const handleSeek = (time: number) => {
    seekTo(time);
    setAudioProgress(time);
  };

  return {
    handleSpeak,
    handlePause,
    handleResume,
    handleSkipForward,
    handleSkipBackward,
    handleSeek,
    audioDuration,
    audioProgress,
    isPaused
  };
};
