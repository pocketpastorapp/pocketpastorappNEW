
import { useState, useEffect } from 'react';
import { useFavoriteVerses } from './useFavoriteVerses';

export const useFavoriteVerseCheck = (bibleId: string, chapterId: string) => {
  const { favoriteVerses } = useFavoriteVerses();
  const [favoriteVerseNumbers, setFavoriteVerseNumbers] = useState<Set<string>>(new Set());

  useEffect(() => {
    console.log('useFavoriteVerseCheck: Checking favorites for', { bibleId, chapterId });
    console.log('useFavoriteVerseCheck: All favorite verses:', favoriteVerses);

    if (!favoriteVerses || favoriteVerses.length === 0) {
      console.log('useFavoriteVerseCheck: No favorite verses found');
      setFavoriteVerseNumbers(new Set());
      return;
    }

    // Extract verse numbers from favorites for the current chapter
    const verseNumbers = new Set<string>();
    
    favoriteVerses.forEach(favorite => {
      console.log('useFavoriteVerseCheck: Processing favorite:', {
        reference: favorite.reference,
        verse_number: favorite.verse_number,
        bible_id: favorite.bible_id,
        chapter_id: favorite.chapter_id,
        matches: favorite.bible_id === bibleId && favorite.chapter_id === chapterId
      });

      if (favorite.bible_id === bibleId && favorite.chapter_id === chapterId) {
        // Use the stored verse_number directly
        const verseNumber = favorite.verse_number;
        
        console.log('useFavoriteVerseCheck: Using stored verse number:', verseNumber);
        
        if (verseNumber) {
          verseNumbers.add(verseNumber);
          console.log('useFavoriteVerseCheck: Added verse number to set:', verseNumber);
        } else {
          console.warn('useFavoriteVerseCheck: No verse number found for favorite:', favorite);
        }
      }
    });

    console.log('useFavoriteVerseCheck: Final verse numbers set:', Array.from(verseNumbers));
    setFavoriteVerseNumbers(verseNumbers);
  }, [favoriteVerses, bibleId, chapterId]);

  const isVerseFavorited = (verseNumber: string): boolean => {
    const result = favoriteVerseNumbers.has(verseNumber);
    console.log('useFavoriteVerseCheck: isVerseFavorited check:', { 
      verseNumber, 
      result, 
      favoriteVerseNumbers: Array.from(favoriteVerseNumbers) 
    });
    return result;
  };

  return { isVerseFavorited, favoriteVerseNumbers };
};
