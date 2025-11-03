
// Calculate approximate word timings with much more aggressive timing for better sync
export const calculateWordTimings = (text: string, duration: number): { words: string[], timings: number[] } => {
  // Split text into words, preserving punctuation and spaces
  const words = text.split(/(\s+)/).filter(word => word.trim().length > 0);
  
  // Calculate syllable count for a word
  const countSyllables = (word: string): number => {
    if (!word || typeof word !== 'string') return 1;
    
    // Remove punctuation and convert to lowercase
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length === 0) return 0;
    
    // Count vowel groups (consecutive vowels count as one syllable)
    const vowelGroups = cleanWord.match(/[aeiouy]+/g);
    let syllableCount = vowelGroups ? vowelGroups.length : 1;
    
    // Adjust for common patterns
    if (cleanWord.endsWith('le') && cleanWord.length > 2) {
      const beforeLe = cleanWord[cleanWord.length - 3];
      if (!/[aeiouy]/.test(beforeLe)) {
        syllableCount += 1; // -ble, -ple, etc. add a syllable
      }
    }
    
    // Silent 'e' at the end usually doesn't add a syllable
    if (cleanWord.endsWith('e') && syllableCount > 1) {
      syllableCount -= 1;
    }
    
    // Minimum of 1 syllable per word
    return Math.max(1, syllableCount);
  };
  
  // Calculate total syllables and prepare word data
  const wordData = words.map(word => ({
    word,
    isActualWord: /\w/.test(word),
    syllables: /\w/.test(word) ? countSyllables(word) : 0,
    isPunctuation: /[.!?]/.test(word),
    isComma: /[,;:]/.test(word)
  }));
  
  const totalSyllables = wordData.reduce((sum, data) => sum + data.syllables, 0);
  
  if (totalSyllables === 0 || duration === 0) {
    return { words, timings: [] };
  }
  
  // Much more aggressive timing: use 85% of duration and much higher syllables per second
  const effectiveDuration = duration * 0.85;
  const baseSyllablesPerSecond = totalSyllables / effectiveDuration;
  
  // Generate timings for each word with ultra-simplified calculation
  const timings: number[] = [];
  let currentTime = 0;
  
  wordData.forEach((data, index) => {
    timings.push(currentTime);
    
    if (data.isActualWord && data.syllables > 0) {
      // Ultra-simplified duration calculation - minimal complexity
      const baseDuration = data.syllables / baseSyllablesPerSecond;
      
      // Minimal complexity adjustment
      const wordLength = data.word.length;
      const complexityMultiplier = Math.max(0.9, Math.min(1.1, wordLength / 8));
      
      const wordDuration = baseDuration * complexityMultiplier;
      currentTime += wordDuration;
      
    } else if (data.isPunctuation) {
      // Much shorter pause for sentence-ending punctuation
      currentTime += 0.08;
    } else if (data.isComma) {
      // Much shorter pause for commas and semicolons
      currentTime += 0.04;
    } else {
      // Minimal pause for spaces
      currentTime += 0.01;
    }
  });
  
  // Scale timings to fit within the effective duration more aggressively
  const maxCalculatedTime = Math.max(...timings);
  if (maxCalculatedTime > 0) {
    const scaleFactor = effectiveDuration / Math.max(maxCalculatedTime, currentTime);
    
    timings.forEach((time, index) => {
      timings[index] = time * scaleFactor;
    });
  }
  
  console.log("Ultra-aggressive timing calculation:", {
    totalWords: words.length,
    totalSyllables,
    duration: duration.toFixed(2),
    effectiveDuration: effectiveDuration.toFixed(2),
    avgSyllablesPerSecond: baseSyllablesPerSecond.toFixed(2),
    sampleWords: wordData.slice(0, 5).map(d => `${d.word}(${d.syllables})`),
    sampleTimings: timings.slice(0, 5).map(t => t.toFixed(2))
  });
  
  return { words, timings };
};
