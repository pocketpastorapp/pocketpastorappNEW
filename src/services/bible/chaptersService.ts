
import { bibleAPIClient } from './apiClient';
import { BibleChapter, BibleAPIError } from './types';

export class BibleChaptersService {
  async getChapters(bibleId: string, bookId: string): Promise<BibleChapter[]> {
    try {
      const response = await bibleAPIClient.callBibleAPI(`/bibles/${bibleId}/books/${bookId}/chapters`);
      return response.data || [];
    } catch (error) {
      console.error('Error loading chapters:', error);
      if (error instanceof BibleAPIError) {
        throw error;
      }
      throw new BibleAPIError('Failed to load Bible chapters. Please try again later.');
    }
  }

  async getChapterText(bibleId: string, chapterId: string): Promise<string> {
    try {
      const response = await bibleAPIClient.callBibleAPI(`/bibles/${bibleId}/chapters/${chapterId}`, {
        'content-type': 'text',
        'include-notes': 'false',
        'include-titles': 'false',
        'include-chapter-numbers': 'false',
        'include-verse-numbers': 'true'
      });
      return response.data?.content || '';
    } catch (error) {
      console.error('Error loading chapter text:', error);
      if (error instanceof BibleAPIError) {
        throw error;
      }
      throw new BibleAPIError('Failed to load chapter text. Please try again later.');
    }
  }
}

export const bibleChaptersService = new BibleChaptersService();
