
// Define types used across speech services
export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender?: 'male' | 'female';
  accent?: string;
  age?: string;
}

export interface SpeechGenerationResult {
  url: string;
  buffer: ArrayBuffer;
}
