
import React from 'react';
import { useVerseClusters } from '@/hooks/useVerseClusters';

interface VerseFavoritesHandlerProps {
  bibleId: string;
  chapterId: string;
  reference: string;
  selectedVerses: Set<string>;
  selectedText: string;
}

export const useFavoritesHandler = ({
  bibleId,
  chapterId,
  reference,
  selectedVerses,
  selectedText
}: VerseFavoritesHandlerProps) => {
  const { createCluster, unfavoriteVerses, isVerseInCluster } = useVerseClusters(bibleId, chapterId);

  const handleAddToFavorites = async (text: string, verseReference: string) => {
    const selectedVerseNumbers = Array.from(selectedVerses).map(verseId => verseId.replace('verse-', ''));
    
    // Check if any of the selected verses are already favorited
    const anyFavorited = selectedVerseNumbers.some(verseNumber => isVerseInCluster(verseNumber));
    
    if (anyFavorited) {
      // If any verses are favorited, unfavorite all selected verses
      const success = await unfavoriteVerses(selectedVerseNumbers);
      
      if (success) {
        // Remove red highlights immediately
        selectedVerseNumbers.forEach(verseNumber => {
          const verseElement = document.querySelector(`[data-verse="${verseNumber}"]`);
          if (verseElement) {
            verseElement.classList.remove('favorite-verse-highlight');
          }
        });
      }
    } else {
      // Prepare verses for clustering
      const versesToCluster: Array<{
        verseNumber: string;
        verseText: string;
        verseReference: string;
      }> = [];

      if (selectedVerses.size > 1) {
        console.log('Adding multiple verses as a cluster:', Array.from(selectedVerses));
        
        // Collect all selected verses for clustering
        for (const verseId of selectedVerses) {
          const verseNumber = verseId.replace('verse-', '');
          const verseElement = document.querySelector(`[data-verse="${verseNumber}"]`) as HTMLElement;
          
          if (verseElement) {
            const verseText = verseElement.textContent || '';
            const completeReference = `${reference}:${verseNumber}`;
            
            versesToCluster.push({
              verseNumber,
              verseText,
              verseReference: completeReference
            });
            
            // Immediately add red highlight
            verseElement.classList.add('favorite-verse-highlight');
          }
        }
        
        // Create cluster with all verses
        if (versesToCluster.length > 0) {
          const clusterReference = `${reference}:${versesToCluster.map(v => v.verseNumber).join(',')}`;
          await createCluster(clusterReference, versesToCluster);
        }
      } else {
        // Handle single verse
        let completeReference = verseReference;
        let verseNumber = '1'; // Default
        
        // If we have selected verses, use the first one
        if (selectedVerses.size === 1) {
          const firstSelectedVerse = Array.from(selectedVerses)[0];
          verseNumber = firstSelectedVerse.replace('verse-', '');
          completeReference = `${reference}:${verseNumber}`;
        } else {
          // Try to extract from the currently selected element
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const container = range.commonAncestorContainer;
            const verseElement = container.nodeType === Node.TEXT_NODE 
              ? container.parentElement?.closest('[data-verse]')
              : (container as Element)?.closest('[data-verse]');
            
            if (verseElement) {
              const extractedVerseNumber = verseElement.getAttribute('data-verse');
              if (extractedVerseNumber) {
                verseNumber = extractedVerseNumber;
                completeReference = `${reference}:${verseNumber}`;
              }
            }
          }
        }
        
        // Get verse text
        const verseElement = document.querySelector(`[data-verse="${verseNumber}"]`) as HTMLElement;
        const verseText = verseElement ? verseElement.textContent || text : text;
        
        // Create single verse cluster
        // Immediately add red highlight for instant feedback
        if (verseElement) {
          verseElement.classList.add('favorite-verse-highlight');
        }
        
        await createCluster(completeReference, [{
          verseNumber,
          verseText,
          verseReference: completeReference
        }]);
        
        // Note: VerseClusterHighlights will reconcile classes based on cluster state
        // so no further DOM updates are required here.
      }
    }
  };

  return {
    handleAddToFavorites,
    isVerseInCluster
  };
};
