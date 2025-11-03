
// Approved languages configuration
export const APPROVED_LANGUAGES = {
  'eng': 'English',
  'cmn': 'Mandarin Chinese (Simplified Chinese)', 
  'spa': 'Spanish',
  'hin': 'Hindi',
  'fra': 'French',
  'arb': 'Modern Standard Arabic',
  'ben': 'Bengali',
  'por': 'Portuguese',
  'rus': 'Russian',
  'urd': 'Urdu',
  'jpn': 'Japanese',
  'deu': 'German',
  'tur': 'Turkish',
  'vie': 'Vietnamese',
  'kor': 'Korean',
  'fas': 'Persian (Farsi)',
  'ita': 'Italian',
  'tha': 'Thai',
  'pol': 'Polish',
  'swa': 'Swahili'
} as const;

// Alternative language codes that might be used by different APIs
export const LANGUAGE_CODE_MAPPINGS = {
  'en': 'eng',
  'zh': 'cmn',
  'zh-cn': 'cmn',
  'es': 'spa',
  'hi': 'hin',
  'fr': 'fra',
  'ar': 'arb',
  'bn': 'ben',
  'pt': 'por',
  'ru': 'rus',
  'ur': 'urd',
  'ja': 'jpn',
  'de': 'deu',
  'tr': 'tur',
  'vi': 'vie',
  'ko': 'kor',
  'fa': 'fas',
  'it': 'ita',
  'th': 'tha',
  'pl': 'pol',
  'sw': 'swa'
} as const;

export type ApprovedLanguageCode = keyof typeof APPROVED_LANGUAGES;

export const isLanguageApproved = (languageId: string): boolean => {
  // Check direct match with approved languages
  if (languageId in APPROVED_LANGUAGES) {
    return true;
  }
  
  // Check alternative mappings
  if (languageId in LANGUAGE_CODE_MAPPINGS) {
    return true;
  }
  
  // Check by name (case-insensitive partial match)
  const languageName = languageId.toLowerCase();
  return Object.values(APPROVED_LANGUAGES).some(approvedName => 
    approvedName.toLowerCase().includes(languageName) || 
    languageName.includes(approvedName.toLowerCase())
  );
};

export const normalizeLanguageCode = (languageId: string): string => {
  // Return direct match if it exists
  if (languageId in APPROVED_LANGUAGES) {
    return languageId;
  }
  
  // Return mapped code if alternative exists
  if (languageId in LANGUAGE_CODE_MAPPINGS) {
    return LANGUAGE_CODE_MAPPINGS[languageId as keyof typeof LANGUAGE_CODE_MAPPINGS];
  }
  
  return languageId;
};
