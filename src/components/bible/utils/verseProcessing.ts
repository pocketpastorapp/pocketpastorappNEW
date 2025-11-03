
// Enhanced verse processing utility for different Bible versions
export const processChapterText = (chapterText: string): string => {
  if (!chapterText) return '';

  const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;
  if (isDev) console.log('Processing chapter text, length:', chapterText.length);
  // Enhanced regex patterns for different Bible version formats
  // First, handle local data that uses <sup>n</sup> markup (e.g., NASB2020_LOCAL)
  let processedText = chapterText;
  const hasSuperscripts = /<sup>\d+<\/sup>/.test(chapterText);
  if (hasSuperscripts) {
    // Convert <sup>n</sup> to our standardized verse-number span
    processedText = chapterText.replace(/<sup>(\d+)<\/sup>\s*/g, (_m, n) => {
      return `<span class="verse-number" data-verse-number="${n}">${n}</span> `;
    });
  } else {
    const patterns = [
      // Unicode-aware: [1], (1), or number at verse start
      /(?:\[(\p{Nd}+)\]|\((\p{Nd}+)\)|^(\p{Nd}+)(?=\s))/gmu,
      // Bracketed numbers
      /\[(\p{Nd}+)\]/gu,
      // Inline number before an uppercase letter in any script (best-effort)
      /(\p{Nd}+)(?=\s\p{Lu})/gu,
      // Simple number at line start
      /^(\p{Nd}+)\s/gmu,
      // Fallback: number at start of line or after newline
      /(?:^|\n)(\p{Nd}+)(?=\s)/gu
    ];
  
    // Try each pattern and use the first one that finds matches
    for (const pattern of patterns) {
      const matches = chapterText.match(pattern);
      if (matches && matches.length > 0) {
        if (isDev) console.log(`Found ${matches.length} verse matches with pattern:`, pattern);
        
        // Process the text with the successful pattern
        processedText = chapterText.replace(pattern, (match, ...groups) => {
          // Extract the verse number from the capturing groups (Unicode digits aware)
          const verseNumber = groups.find(group => group && /^[\p{Nd}]+$/u.test(group));
          if (verseNumber) {
            return `<span class="verse-number" data-verse-number="${verseNumber}">${verseNumber}</span>`;
          }
          return match;
        });
        
        break; // Use the first successful pattern
      }
    }
  }
  
  // If no patterns worked, try a more aggressive approach
  if (processedText === chapterText) {
    if (isDev) console.log('No verse patterns matched, trying aggressive splitting');
    
    // Split by sentences and look for numbers at the beginning
    const sentences = chapterText.split(/(?<=[.!?])\s+/);
    const processedSentences = sentences.map(sentence => {
      const verseMatch = sentence.match(/^(\p{Nd}+)\s*/u);
      if (verseMatch) {
        const verseNumber = verseMatch[1];
        return sentence.replace(/^(\p{Nd}+)\s*/u, `<span class="verse-number" data-verse-number="${verseNumber}">${verseNumber}</span> `);
      }
      return sentence;
    });
    
    processedText = processedSentences.join(' ');
  }
  
  // Wrap each verse in a container for better selection
  const verses = processedText.split(/(?=<span class="verse-number")/);
  const wrappedVerses = verses.map((verse, index) => {
    if (verse.trim() && verse.includes('verse-number')) {
      const verseNumberMatch = verse.match(/data-verse-number="(\d+)"/);
      const verseNumber = verseNumberMatch ? verseNumberMatch[1] : index + 1;
      
      return `<div class="verse" data-verse="${verseNumber}">${verse.trim()}</div>`;
    }
    return verse;
  }).filter(verse => verse.trim());
  
  const finalText = wrappedVerses.join('\n');
  if (isDev) console.log('Final processed text preview:', finalText.substring(0, 200));
  
  return finalText;
};

// Enhanced function to extract verse number from various formats
export const extractVerseNumber = (text: string): string | null => {
  const patterns = [
    /\[(\p{Nd}+)\]/u, // [1]
    /\((\p{Nd}+)\)/u, // (1)
    /^(\p{Nd}+)\s/u, // 1 at start
    /data-verse-number="([\p{Nd}]+)"/u, // Already processed
    /(\p{Nd}+)(?=\s\p{Lu})/u // Number followed by capital letter
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

// Function to clean verse text by removing verse numbers
export const cleanVerseText = (text: string): string => {
  return text
    .replace(/\[(\p{Nd}+)\]/gu, '') // Remove [1]
    .replace(/\((\p{Nd}+)\)/gu, '') // Remove (1)
    .replace(/^(\p{Nd}+)\s/u, '') // Remove leading number
    .replace(/<span[^>]*class="verse-number"[^>]*>.*?<\/span>/gu, '') // Remove processed verse numbers
    .trim();
};
