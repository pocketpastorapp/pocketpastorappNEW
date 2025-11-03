
// This file now imports from the modular bible service structure
export { bibleService, BibleAPIError } from './bible';
export type {
  BibleBook,
  BibleChapter,
  BibleVerse,
  BibleLanguage,
  BibleVersion
} from './bible';

// Export language filtering utilities
export { 
  isLanguageApproved, 
  normalizeLanguageCode, 
  APPROVED_LANGUAGES 
} from './bible/languageFilter';
