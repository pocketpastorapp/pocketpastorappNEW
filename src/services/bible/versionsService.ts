
import { bibleAPIClient } from './apiClient';
import { BibleVersion, BibleLanguage, BibleAPIError } from './types';
import { isLanguageApproved, normalizeLanguageCode, APPROVED_LANGUAGES } from './languageFilter';

export class BibleVersionsService {
  async getBibleVersions(): Promise<BibleVersion[]> {
    try {
      const response = await bibleAPIClient.callBibleAPI('/bibles');
      const allVersions = response.data || [];
      
      // Filter versions to only include approved languages
      const filteredVersions = allVersions.filter(version => 
        isLanguageApproved(version.language.id) || 
        isLanguageApproved(version.language.name)
      );

      // Comprehensive deduplication by ID, name, and abbreviation to catch similar versions
      const uniqueVersions = filteredVersions.reduce((acc: BibleVersion[], version: BibleVersion) => {
        const existingVersion = acc.find(v => 
          v.id === version.id || 
          (v.abbreviation === version.abbreviation && v.name === version.name)
        );
        if (!existingVersion) {
          acc.push(version);
        }
        return acc;
      }, []);

      return uniqueVersions;
    } catch (error) {
      console.error('Error loading Bible versions:', error);
      if (error instanceof BibleAPIError) {
        throw error;
      }
      throw new BibleAPIError('Failed to load Bible versions. Please try again later.');
    }
  }

  async getLanguages(): Promise<BibleLanguage[]> {
    try {
      const versions = await this.getBibleVersions();
      const languageMap = new Map<string, BibleLanguage>();
      
      versions.forEach(version => {
        const normalizedId = normalizeLanguageCode(version.language.id);
        
        // Only include if language is approved
        if (isLanguageApproved(version.language.id) || isLanguageApproved(version.language.name)) {
          if (!languageMap.has(normalizedId)) {
            languageMap.set(normalizedId, {
              ...version.language,
              id: normalizedId
            });
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
      console.error('Error loading languages:', error);
      if (error instanceof BibleAPIError) {
        throw error;
      }
      throw new BibleAPIError('Failed to load languages. Please try again later.');
    }
  }

  async getVersionsByLanguage(languageId: string): Promise<BibleVersion[]> {
    try {
      // Validate that the requested language is approved
      if (!isLanguageApproved(languageId)) {
        console.warn(`Language ${languageId} is not in the approved list`);
        return [];
      }
      
      const allVersions = await this.getBibleVersions();
      const normalizedLanguageId = normalizeLanguageCode(languageId);
      
      const filteredVersions = allVersions.filter(version => {
        const versionLangId = normalizeLanguageCode(version.language.id);
        return versionLangId === normalizedLanguageId || 
               version.language.id === languageId ||
               isLanguageApproved(version.language.name);
      });

      // Additional deduplication by version name and abbreviation to catch similar versions
      const uniqueVersions = filteredVersions.reduce((acc: BibleVersion[], version: BibleVersion) => {
        const existingVersion = acc.find(v => 
          v.id === version.id || 
          (v.abbreviation === version.abbreviation && v.name === version.name)
        );
        if (!existingVersion) {
          acc.push(version);
        }
        return acc;
      }, []);

      return uniqueVersions;
    } catch (error) {
      console.error('Error loading versions by language:', error);
      if (error instanceof BibleAPIError) {
        throw error;
      }
      throw new BibleAPIError('Failed to load Bible versions for the selected language. Please try again later.');
    }
  }
}

export const bibleVersionsService = new BibleVersionsService();
