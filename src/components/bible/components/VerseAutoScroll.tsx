
import { useEffect } from 'react';

interface VerseAutoScrollProps {
  processedChapterText: string;
  highlightVerse?: string;
  searchHighlight?: string;
  highlightFavorite?: string;
}

const VerseAutoScroll = ({ processedChapterText, highlightVerse, searchHighlight, highlightFavorite }: VerseAutoScrollProps) => {
  // Auto-scroll to highlighted verse when coming from search results
  useEffect(() => {
    if (processedChapterText && highlightVerse && searchHighlight) {
      console.log('Auto-scrolling to highlighted verse:', highlightVerse);
      
      // Use a longer delay to ensure DOM is fully rendered and temporary highlights are applied
      const scrollTimer = setTimeout(() => {
        const verseElement = document.querySelector(`[data-verse="${highlightVerse}"]`);
        if (verseElement) {
          console.log('Found verse element, scrolling to center:', verseElement);
          verseElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        } else {
          console.log('Verse element not found for:', highlightVerse);
        }
      }, 300);

      return () => clearTimeout(scrollTimer);
    }
  }, [processedChapterText, highlightVerse, searchHighlight]);

  // Auto-scroll to favorite verse when coming from favorite verses section
  useEffect(() => {
    if (processedChapterText && highlightFavorite) {
      console.log('Auto-scrolling to favorite verses:', highlightFavorite);
      
      // Use a longer delay to ensure DOM is fully rendered and highlights are applied
      const scrollTimer = setTimeout(() => {
        // Handle multiple verse numbers separated by commas
        const verseNumbers = highlightFavorite.split(',').map(v => v.trim());
        const firstVerseNumber = verseNumbers[0];
        
        console.log('Looking for verse element with data-verse:', firstVerseNumber);
        const verseElement = document.querySelector(`[data-verse="${firstVerseNumber}"]`);
        
        if (verseElement) {
          console.log('Found favorite verse element, scrolling to center:', verseElement);
          verseElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        } else {
          console.log('Favorite verse element not found for:', firstVerseNumber);
          console.log('Available verse elements:', Array.from(document.querySelectorAll('[data-verse]')).map(el => el.getAttribute('data-verse')));
        }
      }, 500); // Increased delay to ensure highlights are applied first

      return () => clearTimeout(scrollTimer);
    }
  }, [processedChapterText, highlightFavorite]);

  return null; // This component only handles side effects
};

export default VerseAutoScroll;
