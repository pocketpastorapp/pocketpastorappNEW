
import { bibleVersionsService } from './versionsService';
import { bibleBooksService } from './booksService';
import { bibleChaptersService } from './chaptersService';
import { bibleVersesService } from './versesService';

export class BibleService {
  // Delegate to version service
  async getBibleVersions() {
    return bibleVersionsService.getBibleVersions();
  }

  async getLanguages() {
    return bibleVersionsService.getLanguages();
  }

  async getVersionsByLanguage(languageId: string) {
    return bibleVersionsService.getVersionsByLanguage(languageId);
  }

  // Delegate to books service
  async getBooks(bibleId: string) {
    return bibleBooksService.getBooks(bibleId);
  }

  // Delegate to chapters service
  async getChapters(bibleId: string, bookId: string) {
    return bibleChaptersService.getChapters(bibleId, bookId);
  }

  async getChapterText(bibleId: string, chapterId: string) {
    return bibleChaptersService.getChapterText(bibleId, chapterId);
  }

  // Delegate to verses service
  async getVerse(bibleId: string, verseId: string) {
    return bibleVersesService.getVerse(bibleId, verseId);
  }

  async searchVerses(bibleId: string, query: string) {
    return bibleVersesService.searchVerses(bibleId, query);
  }
}

export const bibleService = new BibleService();

// Re-export types and error class for backward compatibility
export * from './types';
