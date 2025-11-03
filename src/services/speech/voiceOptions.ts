
import { VoiceOption } from './speechTypes';

// Available voice options for text-to-speech
export const availableVoices: VoiceOption[] = [
  { 
    id: "en-US-Chirp3-HD-Charon", 
    name: "Pastor Voice", 
    description: "The default Pastor voice - warm, clear, and trustworthy", 
    gender: "male", 
    accent: "American", 
    age: "Middle-aged"
  },
  { 
    id: "en-US-Journey-O", 
    name: "Journey", 
    description: "Mature American male voice with authoritative tone", 
    gender: "male", 
    accent: "American", 
    age: "Middle-aged"
  },
  {
    id: "en-US-Tenor-F", 
    name: "Tenor", 
    description: "Warm American male voice with medium pitch", 
    gender: "male", 
    accent: "American", 
    age: "Middle-aged"
  }
];

// Default voice
export const defaultVoice = availableVoices[0];
