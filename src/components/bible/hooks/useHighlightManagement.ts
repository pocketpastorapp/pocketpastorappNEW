
import { useState } from 'react';
import { checkIfElementIsHighlighted, checkIfRangeIsHighlighted } from '../utils/highlightUtils';
import { usePersistentHighlights } from './usePersistentHighlights';

interface UseHighlightManagementProps {
  bibleId: string;
  chapterId: string;
  reference: string;
}

export const useHighlightManagement = ({ bibleId, chapterId, reference }: UseHighlightManagementProps) => {
  const [isCurrentSelectionHighlighted, setIsCurrentSelectionHighlighted] = useState(false);
  const {
    highlights: persistentHighlights,
    isLoading: highlightsLoading,
    saveHighlight,
    removeHighlight: removePersistentHighlight,
    isHighlighted: isPersistentlyHighlighted
  } = usePersistentHighlights(bibleId, chapterId);

  const checkIfSelectionIsHighlighted = (element: HTMLElement | null, range: Range | null) => {
    if (element) {
      const verseNumber = element.getAttribute('data-verse');
      if (verseNumber) {
        const isHighlighted = isPersistentlyHighlighted(verseNumber) || checkIfElementIsHighlighted(element);
        setIsCurrentSelectionHighlighted(isHighlighted);
      } else {
        const isHighlighted = checkIfElementIsHighlighted(element);
        setIsCurrentSelectionHighlighted(isHighlighted);
      }
    } else if (range) {
      const isHighlighted = checkIfRangeIsHighlighted(range);
      setIsCurrentSelectionHighlighted(isHighlighted);
    } else {
      setIsCurrentSelectionHighlighted(false);
    }
  };

  const toggleHighlight = async (reference: string, selectedElement: HTMLElement | null, selectedRange: Range | null, selectedText: string, selectedVerses?: Set<string>) => {
    // Handle multiple verse highlighting
    if (selectedVerses && selectedVerses.size > 1) {
      // Check if any of the selected verses are already highlighted
      const verseNumbers = Array.from(selectedVerses).map(verseId => verseId.replace('verse-', ''));
      const anyHighlighted = verseNumbers.some(verseNumber => isPersistentlyHighlighted(verseNumber));

      // Toggle all selected verses
      for (const verseId of selectedVerses) {
        const verseNumber = verseId.replace('verse-', '');
        const verseElement = document.querySelector(`[data-verse="${verseNumber}"]`) as HTMLElement;
        
        if (verseElement) {
          if (anyHighlighted) {
            // Remove highlight
            verseElement.classList.remove('bg-yellow-200', 'dark:bg-yellow-800', 'transition-colors', 'duration-200');
            verseElement.removeAttribute('data-highlight-type');
            await removePersistentHighlight(verseNumber);
          } else {
            // Add highlight
            verseElement.classList.add('bg-yellow-200', 'dark:bg-yellow-800', 'transition-colors', 'duration-200');
            verseElement.setAttribute('data-highlight-type', 'permanent');
            await saveHighlight(verseNumber);
          }
        }
      }
      
      setIsCurrentSelectionHighlighted(!anyHighlighted);
      return;
    }

    // Handle single verse highlighting
    if (selectedElement) {
      const verseNumber = selectedElement.getAttribute('data-verse');
      
      if (verseNumber) {
        const isHighlighted = isPersistentlyHighlighted(verseNumber);
        
        if (isHighlighted) {
          // Remove highlight
          selectedElement.classList.remove('bg-yellow-200', 'dark:bg-yellow-800', 'transition-colors', 'duration-200');
          selectedElement.removeAttribute('data-highlight-type');
          await removePersistentHighlight(verseNumber);
        } else {
          // Add highlight
          selectedElement.classList.add('bg-yellow-200', 'dark:bg-yellow-800', 'transition-colors', 'duration-200');
          selectedElement.setAttribute('data-highlight-type', 'permanent');
          await saveHighlight(verseNumber);
        }
        
        setIsCurrentSelectionHighlighted(!isHighlighted);
      } else {
        // Fallback to local highlighting for non-verse elements
        const isAlreadyHighlighted = checkIfElementIsHighlighted(selectedElement);
        
        if (isAlreadyHighlighted) {
          selectedElement.classList.remove('bg-yellow-200', 'dark:bg-yellow-800', 'bg-blue-200', 'dark:bg-blue-800', 'transition-colors', 'duration-200');
          selectedElement.removeAttribute('data-highlight-type');
        } else {
          selectedElement.classList.remove('bg-blue-200', 'dark:bg-blue-800');
          selectedElement.classList.add('bg-yellow-200', 'dark:bg-yellow-800');
          selectedElement.setAttribute('data-highlight-type', 'permanent');
        }
        
        setIsCurrentSelectionHighlighted(!isAlreadyHighlighted);
      }
    } else if (selectedRange && selectedText) {
      // Handle text selection highlighting (local only)
      const tempHighlights = document.querySelectorAll('[data-highlight-type="temporary"]');
      const isAlreadyHighlighted = checkIfRangeIsHighlighted(selectedRange);
      
      if (isAlreadyHighlighted) {
        tempHighlights.forEach(highlight => {
          const parent = highlight.parentNode;
          if (parent) {
            parent.replaceChild(document.createTextNode(highlight.textContent || ''), highlight);
            parent.normalize();
          }
        });
      } else {
        tempHighlights.forEach(highlight => {
          const span = document.createElement('span');
          span.className = 'bg-yellow-200 dark:bg-yellow-800 transition-colors duration-200';
          span.setAttribute('data-highlight-type', 'permanent');
          span.textContent = highlight.textContent;
          highlight.parentNode?.replaceChild(span, highlight);
        });
      }
      
      setIsCurrentSelectionHighlighted(!isAlreadyHighlighted);
    }
  };

  const removeHighlight = async (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.getAttribute('data-highlight-type') === 'permanent') {
      const verseNumber = target.getAttribute('data-verse');
      
      if (verseNumber) {
        // Remove persistent highlight
        target.classList.remove('bg-yellow-200', 'dark:bg-yellow-800', 'transition-colors', 'duration-200');
        target.removeAttribute('data-highlight-type');
        await removePersistentHighlight(verseNumber);
      } else {
        // Remove local highlight
        if (target.classList.contains('bg-yellow-200') || target.classList.contains('dark:bg-yellow-800')) {
          target.classList.remove('bg-yellow-200', 'dark:bg-yellow-800', 'transition-colors', 'duration-200');
          target.removeAttribute('data-highlight-type');
        } else {
          const parent = target.parentNode;
          if (parent) {
            parent.replaceChild(document.createTextNode(target.textContent || ''), target);
            parent.normalize();
          }
        }
      }
      
      event.stopPropagation();
    }
  };

  return {
    highlightedVerses: persistentHighlights,
    isCurrentSelectionHighlighted,
    highlightsLoading,
    checkIfSelectionIsHighlighted,
    toggleHighlight,
    removeHighlight,
    isPersistentlyHighlighted
  };
};
