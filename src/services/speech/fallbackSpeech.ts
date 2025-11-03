
// Initialize Web Speech API voices for fallback purposes only
export const initializeSpeechVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    // Check if voices are already loaded
    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      return resolve(voices);
    }
    
    // If not loaded yet, wait for the voiceschanged event
    const voicesChangedHandler = () => {
      voices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
      resolve(voices);
    };
    
    window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
  });
};

// Legacy fallback function - only used if Google Cloud TTS API fails
export const getBritishMaleVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  
  console.log("Available fallback voices:", voices.map(v => `${v.name} (${v.lang})`));
  
  const anyEnglishVoice = voices.find(voice => voice.lang.startsWith('en-'));
  
  if (anyEnglishVoice) {
    console.log("Using fallback voice:", anyEnglishVoice.name);
  } else {
    console.log("No suitable fallback voice found, will use browser default");
  }
  
  return anyEnglishVoice || null;
};
