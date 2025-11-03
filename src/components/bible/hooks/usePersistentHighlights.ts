
import { useState, useEffect, useCallback } from 'react';
import { verseHighlightService, VerseHighlight } from '@/services/verseHighlightService';
import { useAuthState } from '@/hooks/useAuthState';

export const usePersistentHighlights = (bibleId: string, chapterId: string) => {
  const { user } = useAuthState();
  const [highlights, setHighlights] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Load highlights when chapter changes
  useEffect(() => {
    if (!user || !bibleId || !chapterId) {
      setHighlights(new Set());
      return;
    }

    const loadHighlights = async () => {
      setIsLoading(true);
      try {
        const chapterHighlights = await verseHighlightService.getChapterHighlights(bibleId, chapterId);
        const highlightSet = new Set(chapterHighlights.map(h => h.verse_number));
        setHighlights(highlightSet);
        
        // Apply highlights to DOM
        setTimeout(() => {
          applyHighlightsToDOM(highlightSet);
        }, 100);
      } catch (error) {
        console.error('Error loading highlights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHighlights();
  }, [user, bibleId, chapterId]);

  const applyHighlightsToDOM = useCallback((highlightSet: Set<string>) => {
    highlightSet.forEach(verseNumber => {
      const verseElement = document.querySelector(`[data-verse="${verseNumber}"]`) as HTMLElement;
      if (verseElement) {
        verseElement.classList.add('bg-yellow-200', 'dark:bg-yellow-800', 'transition-colors', 'duration-200');
        verseElement.setAttribute('data-highlight-type', 'permanent');
      }
    });
  }, []);

  const saveHighlight = useCallback(async (verseNumber: string): Promise<boolean> => {
    if (!user) {
      console.log('User not authenticated, cannot save highlight');
      return false;
    }

    const success = await verseHighlightService.saveHighlight(bibleId, chapterId, verseNumber);
    if (success) {
      setHighlights(prev => new Set([...prev, verseNumber]));
      return true;
    }
    return false;
  }, [user, bibleId, chapterId]);

  const removeHighlight = useCallback(async (verseNumber: string): Promise<boolean> => {
    if (!user) {
      console.log('User not authenticated, cannot remove highlight');
      return false;
    }

    const success = await verseHighlightService.removeHighlight(bibleId, chapterId, verseNumber);
    if (success) {
      setHighlights(prev => {
        const newSet = new Set(prev);
        newSet.delete(verseNumber);
        return newSet;
      });
      return true;
    }
    return false;
  }, [user, bibleId, chapterId]);

  const isHighlighted = useCallback((verseNumber: string): boolean => {
    return highlights.has(verseNumber);
  }, [highlights]);

  return {
    highlights,
    isLoading,
    saveHighlight,
    removeHighlight,
    isHighlighted,
    applyHighlightsToDOM
  };
};
