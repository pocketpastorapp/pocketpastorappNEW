
import { useState, useEffect } from 'react';
import { hybridBibleService, HybridBibleChapter, BibleAPIError } from '@/services/hybridBibleService';

export const useHybridBibleChapters = (selectedVersion: string, selectedBook: string) => {
  const [chapters, setChapters] = useState<HybridBibleChapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (selectedVersion && selectedBook) {
      const loadChapters = async () => {
        try {
          setIsLoading(true);
          setError('');
          const chapterData = await hybridBibleService.getChapters(selectedVersion, selectedBook);
          setChapters(chapterData);
        } catch (error) {
          console.error('Error loading chapters:', error);
          if (error instanceof BibleAPIError) {
            setError(error.message);
          } else {
            setError('Failed to load chapters. Please try again.');
          }
        } finally {
          setIsLoading(false);
        }
      };

      loadChapters();
    }
  }, [selectedVersion, selectedBook]);

  return {
    chapters,
    selectedChapter,
    setSelectedChapter,
    isLoading,
    error
  };
};
