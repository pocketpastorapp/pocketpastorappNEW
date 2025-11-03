
import { bibleAPIClient } from './apiClient';
import { BibleBook, BibleAPIError } from './types';

export class BibleBooksService {
  async getBooks(bibleId: string): Promise<BibleBook[]> {
    try {
      const response = await bibleAPIClient.callBibleAPI(`/bibles/${bibleId}/books`);
      return response.data || [];
    } catch (error) {
      console.error('Error loading books:', error);
      if (error instanceof BibleAPIError) {
        throw error;
      }
      throw new BibleAPIError('Failed to load Bible books. Please try again later.');
    }
  }
}

export const bibleBooksService = new BibleBooksService();
