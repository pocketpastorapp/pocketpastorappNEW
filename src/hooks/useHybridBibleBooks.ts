
import { useState, useEffect } from 'react';
import { hybridBibleService, HybridBibleBook, BibleAPIError } from '@/services/hybridBibleService';

export const useHybridBibleBooks = (selectedVersion: string) => {
  const [books, setBooks] = useState<HybridBibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (selectedVersion) {
      const loadBooks = async () => {
        try {
          setIsLoading(true);
          setError('');
          const bookData = await hybridBibleService.getBooks(selectedVersion);
          setBooks(bookData);
        } catch (error) {
          console.error('Error loading books:', error);
          if (error instanceof BibleAPIError) {
            setError(error.message);
          } else {
            setError('Failed to load books. Please try again.');
          }
        } finally {
          setIsLoading(false);
        }
      };

      loadBooks();
    }
  }, [selectedVersion]);

  return {
    books,
    selectedBook,
    setSelectedBook,
    isLoading,
    error
  };
};
