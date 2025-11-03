
import { useEffect } from 'react';
import { useVerseClusters } from '@/hooks/useVerseClusters';

interface VerseClusterHighlightsProps {
  processedChapterText: string;
  bibleId: string;
  chapterId: string;
}

const VerseClusterHighlights = ({ processedChapterText, bibleId, chapterId }: VerseClusterHighlightsProps) => {
  const { clusterVerseNumbers, clusters } = useVerseClusters(bibleId, chapterId);

  // Add red highlight to clustered verses
  useEffect(() => {
    if (processedChapterText && clusterVerseNumbers.size > 0) {
      console.log('Adding red highlights for clustered verses, bibleId:', bibleId, 'chapterId:', chapterId);
      console.log('Cluster verse numbers:', Array.from(clusterVerseNumbers));
      
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        const verseElements = document.querySelectorAll('[data-verse]');
        
        verseElements.forEach((element) => {
          const verseNumber = element.getAttribute('data-verse');
          if (verseNumber) {
            // Remove existing cluster highlight class
            element.classList.remove('favorite-verse-highlight');

            // Add red highlight if verse is in a cluster
            if (clusterVerseNumbers.has(verseNumber)) {
              console.log('Adding red highlight for clustered verse:', verseNumber);
              element.classList.add('favorite-verse-highlight');
            }
          }
        });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [processedChapterText, clusterVerseNumbers, clusters, bibleId, chapterId]);

  // Additional effect to handle immediate highlighting when clusters are created
  useEffect(() => {
    if (clusterVerseNumbers.size > 0) {
      console.log('Cluster verse numbers changed, applying immediate highlights');
      
      clusterVerseNumbers.forEach(verseNumber => {
        const verseElement = document.querySelector(`[data-verse="${verseNumber}"]`);
        if (verseElement) {
          console.log('Immediately highlighting clustered verse:', verseNumber);
          verseElement.classList.add('favorite-verse-highlight');
        }
      });
    }
  }, [clusterVerseNumbers]);

  return null; // This component only handles side effects
};

export default VerseClusterHighlights;
