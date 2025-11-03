
import { bibleService, BibleVersion, BibleLanguage, BibleBook, BibleChapter, BibleAPIError } from './bibleService';
import { localBibleService, LocalBibleBook, LocalBibleChapter } from './localBibleService';
import { isLanguageApproved } from './bible/languageFilter';

export interface HybridBibleVersion extends BibleVersion {
  isLocal?: boolean;
}

export interface HybridBibleBook extends BibleBook {
  isLocal?: boolean;
}

export interface HybridBibleChapter extends BibleChapter {
  isLocal?: boolean;
}

class HybridBibleService {
  // Simple in-memory cache to avoid repeated version fetches
  private versionsCache: HybridBibleVersion[] | null = null;

  // Get both API and local versions, filtered by approved languages
  async getBibleVersions(): Promise<HybridBibleVersion[]> {
    try {
      // Return cached list if available
      if (this.versionsCache) {
        return this.versionsCache;
      }

      const apiVersions = await bibleService.getBibleVersions();
      const localVersions: HybridBibleVersion[] = [];

      // Add NASB 2020 as a local version if we have data (English is approved)
      if (localBibleService.getBibleData()) {
        localVersions.push({
          id: 'NASB2020_LOCAL',
          name: 'New American Standard Bible 2020 (Local)',
          abbreviation: 'NASB2020',
          description: 'Local copy of NASB 2020',
          language: {
            id: 'eng',
            name: 'English',
            nameLocal: 'English',
            script: 'Latin',
            scriptDirection: 'LTR'
          },
          isLocal: true
        });
      }

      // Filter API versions to only include approved languages
      const filteredApiVersions = apiVersions.filter(version => 
        isLanguageApproved(version.language.id) || 
        isLanguageApproved(version.language.name)
      );

      const result = [...localVersions, ...filteredApiVersions];
      this.versionsCache = result;
      return result;
    } catch (error) {
      // If API fails, return cached versions if any
      if (this.versionsCache) return this.versionsCache;
      // If API fails, still return local versions (English is approved)
      const localVersions: HybridBibleVersion[] = [];
      if (localBibleService.getBibleData()) {
        localVersions.push({
          id: 'NASB2020_LOCAL',
          name: 'New American Standard Bible 2020 (Local)',
          abbreviation: 'NASB2020',
          description: 'Local copy of NASB 2020',
          language: {
            id: 'eng',
            name: 'English',
            nameLocal: 'English',
            script: 'Latin',
            scriptDirection: 'LTR'
          },
          isLocal: true
        });
      }
      this.versionsCache = localVersions;
      return localVersions;
    }
  }

  async getLanguages(): Promise<BibleLanguage[]> {
    try {
      const allVersions = await this.getBibleVersions();
      const languageMap = new Map<string, BibleLanguage>();
      
      allVersions.forEach(version => {
        // Only include approved languages
        if (isLanguageApproved(version.language.id) || isLanguageApproved(version.language.name)) {
          if (!languageMap.has(version.language.id)) {
            languageMap.set(version.language.id, version.language);
          }
        }
      });
      
      // Define popularity order for sorting
      const popularityOrder = [
        'eng',   // English
        'cmn',   // Mandarin Chinese (Simplified Chinese)
        'spa',   // Spanish
        'hin',   // Hindi
        'fra',   // French
        'arb',   // Modern Standard Arabic
        'ben',   // Bengali
        'por',   // Portuguese
        'rus',   // Russian
        'urd',   // Urdu
        'jpn',   // Japanese
        'deu',   // German
        'tur',   // Turkish
        'vie',   // Vietnamese
        'kor',   // Korean
        'fas',   // Persian (Farsi)
        'ita',   // Italian
        'tha',   // Thai
        'pol',   // Polish
        'swa'    // Swahili
      ];
      
      // Sort languages by popularity order, then alphabetically for any not in the list
      const sortedLanguages = Array.from(languageMap.values()).sort((a, b) => {
        const aIndex = popularityOrder.indexOf(a.id);
        const bIndex = popularityOrder.indexOf(b.id);
        
        // If both are in popularity order, sort by their order
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        // If only one is in popularity order, prioritize it
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        
        // If neither is in popularity order, sort alphabetically
        return a.name.localeCompare(b.name);
      });
      
      return sortedLanguages;
    } catch (error) {
      throw error;
    }
  }

  async getVersionsByLanguage(languageId: string): Promise<HybridBibleVersion[]> {
    try {
      // Validate that the requested language is approved
      if (!isLanguageApproved(languageId)) {
        console.warn(`Language ${languageId} is not in the approved list`);
        return [];
      }
      
      const allVersions = await this.getBibleVersions();
      return allVersions.filter(version => version.language.id === languageId);
    } catch (error) {
      throw error;
    }
  }

  async getBooks(bibleId: string): Promise<HybridBibleBook[]> {
    // Check if this is a local Bible
    if (bibleId === 'NASB2020_LOCAL') {
      const localBooks = localBibleService.getBooks();
      return localBooks.map(book => ({ ...book, isLocal: true }));
    }

    // Use API service for remote Bibles
    try {
      const apiBooks = await bibleService.getBooks(bibleId);
      return apiBooks.map(book => ({ ...book, isLocal: false }));
    } catch (error) {
      throw error;
    }
  }

  async getChapters(bibleId: string, bookId: string): Promise<HybridBibleChapter[]> {
    // Check if this is a local Bible
    if (bibleId === 'NASB2020_LOCAL') {
      const localChapters = localBibleService.getChapters(bookId);
      return localChapters.map(chapter => ({ ...chapter, isLocal: true }));
    }

    // Use API service for remote Bibles
    try {
      const apiChapters = await bibleService.getChapters(bibleId, bookId);
      return apiChapters.map(chapter => ({ ...chapter, isLocal: false }));
    } catch (error) {
      throw error;
    }
  }

  async getChapterText(bibleId: string, chapterId: string): Promise<string> {
    // Check if this is a local Bible
    if (bibleId === 'NASB2020_LOCAL') {
      // Parse the chapter ID to get book and chapter number
      const [bookId, chapterNumber] = chapterId.split('.');
      return localBibleService.getChapterText(bookId, chapterNumber);
    }

    // Use API service for remote Bibles
    try {
      return await bibleService.getChapterText(bibleId, chapterId);
    } catch (error) {
      throw error;
    }
  }

  async searchVerses(bibleId: string, query: string, searchType: 'all' | 'exact' = 'all'): Promise<any[]> {
    // Check if this is a local Bible
    if (bibleId === 'NASB2020_LOCAL') {
      const results = localBibleService.searchVerses(query, searchType);
      return results.map(result => ({
        id: `search_${Date.now()}_${Math.random()}`,
        orgId: result.reference,
        bookId: '',
        chapterId: '',
        reference: result.reference,
        text: result.text
      }));
    }

    // Use API service for remote Bibles
    try {
      return await bibleService.searchVerses(bibleId, query);
    } catch (error) {
      throw error;
    }
  }
}

export const hybridBibleService = new HybridBibleService();
export { BibleAPIError };
