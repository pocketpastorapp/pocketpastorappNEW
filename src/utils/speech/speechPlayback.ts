
import { toast } from 'sonner';

// Audio state management
export interface AudioState {
  currentAudio: HTMLAudioElement | null;
  audioDuration: number;
  audioCurrentTime: number;
  audioUpdateCallback: ((time: number, duration: number) => void) | null;
  isAudioPaused: boolean;
  currentToastId: string | number | null;
}

export const createAudioState = (): AudioState => ({
  currentAudio: null,
  audioDuration: 0,
  audioCurrentTime: 0,
  audioUpdateCallback: null,
  isAudioPaused: false,
  currentToastId: null
});

// Cleanup function to prevent memory leaks
export const cleanupAudio = (audioState: AudioState): void => {
  if (audioState.currentAudio) {
    // Remove all event listeners to prevent memory leaks
    audioState.currentAudio.onended = null;
    audioState.currentAudio.onerror = null;
    audioState.currentAudio.onloadedmetadata = null;
    audioState.currentAudio.ontimeupdate = null;
    audioState.currentAudio.onplay = null;
    audioState.currentAudio.onpause = null;
    
    // Pause and reset the audio
    audioState.currentAudio.pause();
    audioState.currentAudio.currentTime = 0;
    
    // Revoke the object URL if it exists to free memory
    if (audioState.currentAudio.src && audioState.currentAudio.src.startsWith('blob:')) {
      URL.revokeObjectURL(audioState.currentAudio.src);
    }
    
    audioState.currentAudio = null;
  }
  
  // Reset state variables
  audioState.audioDuration = 0;
  audioState.audioCurrentTime = 0;
  audioState.audioUpdateCallback = null;
  audioState.isAudioPaused = false;
};

export const setupAudioEventHandlers = (
  audio: HTMLAudioElement,
  audioState: AudioState,
  text: string,
  setIsSpeaking: (speaking: boolean) => void,
  onSpeechEnd?: () => void
): void => {
  audio.onended = () => {
    if (audioState.currentAudio === audio) {
      setIsSpeaking(false);
      audioState.isAudioPaused = false;
      audioState.audioCurrentTime = 0;
      if (onSpeechEnd) onSpeechEnd();
      cleanupAudio(audioState);
    }
  };
  
  audio.onerror = (e) => {
    if (audioState.currentAudio === audio) {
      console.error("Audio playback error:", e);
      toast.error("Error playing audio", { duration: 3000 });
      setIsSpeaking(false);
      audioState.isAudioPaused = false;
      cleanupAudio(audioState);
    }
  };
  
  audio.onloadedmetadata = () => {
    if (audioState.currentAudio === audio) {
      audioState.audioDuration = audio.duration;
      
      console.log("Audio loaded - Duration:", audioState.audioDuration);
      
      if (audioState.audioUpdateCallback) {
        audioState.audioUpdateCallback(0, audioState.audioDuration);
      }
    }
  };
  
  audio.ontimeupdate = () => {
    if (audioState.currentAudio === audio) {
      audioState.audioCurrentTime = audio.currentTime;
      
      if (audioState.audioUpdateCallback) {
        audioState.audioUpdateCallback(audioState.audioCurrentTime, audioState.audioDuration);
      }
    }
  };
};

export const pauseAudio = (audioState: AudioState): void => {
  if (audioState.currentAudio) {
    audioState.currentAudio.pause();
    audioState.isAudioPaused = true;
  }
};

export const resumeAudio = (audioState: AudioState): void => {
  if (audioState.currentAudio) {
    audioState.currentAudio.play()
      .then(() => {
        audioState.isAudioPaused = false;
      })
      .catch(err => console.error("Failed to resume audio:", err));
  }
};

export const seekAudio = (audioState: AudioState, time: number): void => {
  if (audioState.currentAudio) {
    audioState.currentAudio.currentTime = Math.min(Math.max(0, time), audioState.currentAudio.duration);
    audioState.audioCurrentTime = audioState.currentAudio.currentTime;
  }
};

export const skipAudioForward = (audioState: AudioState): void => {
  if (audioState.currentAudio) {
    const newTime = Math.min(audioState.currentAudio.duration, audioState.currentAudio.currentTime + 5);
    audioState.currentAudio.currentTime = newTime;
    audioState.audioCurrentTime = newTime;
  }
};

export const skipAudioBackward = (audioState: AudioState): void => {
  if (audioState.currentAudio) {
    const newTime = Math.max(0, audioState.currentAudio.currentTime - 5);
    audioState.currentAudio.currentTime = newTime;
    audioState.audioCurrentTime = newTime;
  }
};
