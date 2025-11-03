
// Re-export everything from our speech service modules
export * from './speechTypes';
export * from './voiceOptions';
export * from './googleTtsService';
export * from './fallbackSpeech';

// Main speech service interface
export { generateSpeech } from './googleTtsService';
export { availableVoices, defaultVoice } from './voiceOptions';
export { initializeSpeechVoices, getBritishMaleVoice } from './fallbackSpeech';
