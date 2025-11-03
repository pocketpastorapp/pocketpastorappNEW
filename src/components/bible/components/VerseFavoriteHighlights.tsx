
import { useEffect } from 'react';
import { useFavoriteVerseCheck } from '@/hooks/useFavoriteVerseCheck';
import { useFavoriteVerses } from '@/hooks/useFavoriteVerses';

interface VerseFavoriteHighlightsProps {
  processedChapterText: string;
  bibleId: string;
  chapterId: string;
}

const VerseFavoriteHighlights = ({ processedChapterText, bibleId, chapterId }: VerseFavoriteHighlightsProps) => {
  const { isVerseFavorited, favoriteVerseNumbers } = useFavoriteVerseCheck(bibleId, chapterId);
  const { favoriteVerses } = useFavoriteVerses();

  // Add red highlight to favorited verses - now with favoriteVerses as dependency to ensure immediate updates
  useEffect(() => {
    if (processedChapterText) {
      console.log('Adding red highlights for favorited verses, bibleId:', bibleId, 'chapterId:', chapterId);
      console.log('Favorite verse numbers:', Array.from(favoriteVerseNumbers));
      
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        const verseElements = document.querySelectorAll('[data-verse]');
        console.log('Found verse elements:', verseElements.length);
        
        verseElements.forEach((element) => {
          const verseNumber = element.getAttribute('data-verse');
          if (verseNumber) {
            console.log('Processing verse:', verseNumber, 'isFavorited:', isVerseFavorited(verseNumber));
            
            // Remove existing favorite highlight class
            element.classList.remove('favorite-verse-highlight');

            // Add red highlight if verse is favorited
            if (isVerseFavorited(verseNumber)) {
              console.log('Adding red highlight for favorited verse:', verseNumber);
              element.classList.add('favorite-verse-highlight');
            }
          }
        });
      }, 50); // Reduced delay for faster response

      return () => clearTimeout(timer);
    }
  }, [processedChapterText, isVerseFavorited, favoriteVerseNumbers, favoriteVerses, bibleId, chapterId]);

  // Additional effect to handle immediate highlighting when verses are added
  useEffect(() => {
    if (favoriteVerseNumbers.size > 0) {
      console.log('Favorite verse numbers changed, applying immediate highlights');
      
      favoriteVerseNumbers.forEach(verseNumber => {
        const verseElement = document.querySelector(`[data-verse="${verseNumber}"]`);
        if (verseElement) {
          console.log('Immediately highlighting verse:', verseNumber);
          verseElement.classList.add('favorite-verse-highlight');
        }
      });
    }
  }, [favoriteVerseNumbers]);

  return null; // This component only handles side effects
};

export default VerseFavoriteHighlights;
