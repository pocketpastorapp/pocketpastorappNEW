
import { bibleAPIClient } from './apiClient';
import { BibleVerse, BibleAPIError } from './types';

export class BibleVersesService {
  async getVerse(bibleId: string, verseId: string): Promise<BibleVerse | null> {
    try {
      const response = await bibleAPIClient.callBibleAPI(`/bibles/${bibleId}/verses/${verseId}`);
      return response.data || null;
    } catch (error) {
      console.error('Error loading verse:', error);
      if (error instanceof BibleAPIError) {
        throw error;
      }
      throw new BibleAPIError('Failed to load verse. Please try again later.');
    }
  }

  async searchVerses(bibleId: string, query: string): Promise<BibleVerse[]> {
    try {
      const response = await bibleAPIClient.callBibleAPI(`/bibles/${bibleId}/search`, {
        query,
        limit: '50'
      });
      return response.data?.verses || [];
    } catch (error) {
      console.error('Error searching verses:', error);
      if (error instanceof BibleAPIError) {
        throw error;
      }
      throw new BibleAPIError('Failed to search verses. Please try again later.');
    }
  }
}

export const bibleVersesService = new BibleVersesService();
