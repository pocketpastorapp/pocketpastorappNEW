import { toast } from 'sonner';
import { generateSpeech, defaultVoice } from '@/services/speech';
import { 
  createAudioState, 
  cleanupAudio,
  setupAudioEventHandlers,
  pauseAudio,
  resumeAudio,
  seekAudio,
  skipAudioForward,
  skipAudioBackward,
  AudioState
} from './speech/speechPlayback';

// Global state instance
let audioState: AudioState = createAudioState();

export const speakMessage = (
  text: string,
  messageId: string, 
  setIsSpeaking: (speaking: boolean) => void,
  onSpeechEnd?: () => void,
  onTimeUpdate?: (currentTime: number, duration: number) => void
): void => {
  // Stop any current speech and cleanup
  stopSpeaking();
  
  setIsSpeaking(true);
  audioState.isAudioPaused = false;
  
  // Create audio element immediately to maintain user interaction context
  const audio = new Audio();
  audioState.currentAudio = audio;
  
  // Show toast and keep reference to dismiss it later
  audioState.currentToastId = toast.info("Generating speech...", { 
    duration: Infinity,
    dismissible: false
  });
  
  // Store callbacks for time updates
  audioState.audioUpdateCallback = onTimeUpdate || null;
  
  generateSpeech(text, messageId, defaultVoice.id)
    .then(({ url, buffer }) => {
      // Check if audio was cleaned up while generating
      if (!audioState.currentAudio) return;
      
      // Dismiss the generating toast now that we have the audio
      if (audioState.currentToastId) {
        toast.dismiss(audioState.currentToastId);
        audioState.currentToastId = null;
      }
      
      // Set the audio source and set up event handlers
      audio.src = url;
      
      // Set up event handlers with cleanup awareness
      setupAudioEventHandlers(
        audio, 
        audioState, 
        text, 
        setIsSpeaking, 
        onSpeechEnd
      );
      
      // Start playback immediately if audio hasn't been cleaned up
      if (audioState.currentAudio === audio) {
        audio.play()
          .catch(err => {
            console.error("Failed to play audio:", err);
            toast.error("Failed to play audio. Please try again.", { duration: 3000 });
            setIsSpeaking(false);
            audioState.isAudioPaused = false;
            cleanupAudio(audioState);
          });
      }
      
      console.log("Playing speech with Google Cloud TTS");
    })
    .catch((error) => {
      console.error("Speech synthesis error:", error);
      
      // Dismiss the generating toast on error
      if (audioState.currentToastId) {
        toast.dismiss(audioState.currentToastId);
        audioState.currentToastId = null;
      }
      
      setIsSpeaking(false);
      audioState.isAudioPaused = false;
      cleanupAudio(audioState);
      toast.error("Failed to generate speech", { duration: 3000 });
    });
};

export const pauseSpeaking = (): void => {
  pauseAudio(audioState);
};

export const resumeSpeaking = (): void => {
  resumeAudio(audioState);
};

export const stopSpeaking = (): void => {
  // Dismiss any active generating toast
  if (audioState.currentToastId) {
    toast.dismiss(audioState.currentToastId);
    audioState.currentToastId = null;
  }
  
  cleanupAudio(audioState);
};

export const skipForward = (): void => {
  skipAudioForward(audioState);
};

export const skipBackward = (): void => {
  skipAudioBackward(audioState);
};

export const seekTo = (time: number): void => {
  seekAudio(audioState, time);
};

export const getAudioState = (): { currentTime: number, duration: number, isPaused: boolean } => {
  return { 
    currentTime: audioState.audioCurrentTime,
    duration: audioState.audioDuration,
    isPaused: audioState.isAudioPaused
  };
};

export const cleanupSpeechControls = (): void => {
  cleanupAudio(audioState);
  if (audioState.currentToastId) {
    toast.dismiss(audioState.currentToastId);
    audioState.currentToastId = null;
  }
};
