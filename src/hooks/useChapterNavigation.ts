
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hybridBibleService, HybridBibleChapter, BibleAPIError } from '@/services/hybridBibleService';

export const useChapterNavigation = (bibleId: string, currentChapterId: string) => {
  const [chapters, setChapters] = useState<HybridBibleChapter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (bibleId && currentChapterId) {
      loadChaptersForBook();
    }
  }, [bibleId, currentChapterId]);

  const loadChaptersForBook = async () => {
    try {
      setIsLoading(true);
      // Extract book ID from chapter ID (e.g., "GEN.6" -> "GEN")
      const bookId = currentChapterId.split('.')[0];
      const chapterData = await hybridBibleService.getChapters(bibleId, bookId);
      setChapters(chapterData);
    } catch (error) {
      console.error('Error loading chapters for navigation:', error);
      setChapters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToChapter = (direction: 'prev' | 'next') => {
    console.log('Navigating to chapter:', direction, 'Current chapters:', chapters.length);
    const currentIndex = chapters.findIndex(c => c.id === currentChapterId);
    console.log('Current index:', currentIndex, 'Current chapter ID:', currentChapterId);
    
    if (currentIndex === -1) {
      console.log('Current chapter not found in chapters array');
      return;
    }

    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    console.log('New index:', newIndex);
    
    if (newIndex >= 0 && newIndex < chapters.length) {
      const newChapter = chapters[newIndex];
      console.log('Navigating to new chapter:', newChapter);
      
      const params = new URLSearchParams();
      params.set('bibleId', bibleId);
      params.set('chapterId', newChapter.id);
      params.set('reference', newChapter.reference);
      
      // Use standard navigation without replace to ensure proper URL updates
      navigate(`/bible/read?${params.toString()}`);
    } else {
      console.log('Cannot navigate - index out of bounds');
    }
  };

  const canNavigatePrev = () => {
    const currentIndex = chapters.findIndex(c => c.id === currentChapterId);
    return currentIndex > 0;
  };

  const canNavigateNext = () => {
    const currentIndex = chapters.findIndex(c => c.id === currentChapterId);
    return currentIndex >= 0 && currentIndex < chapters.length - 1;
  };

  return {
    navigateToChapter,
    canNavigatePrev: canNavigatePrev(),
    canNavigateNext: canNavigateNext(),
    isLoading
  };
};
