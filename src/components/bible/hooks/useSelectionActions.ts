
import { useCallback } from 'react';

interface UseSelectionActionsProps {
  setSelectedVerses: React.Dispatch<React.SetStateAction<Set<string>>>;
  setLastSelectedVerse: React.Dispatch<React.SetStateAction<{
    text: string;
    element: HTMLElement | null;
    range: Range | null;
  } | null>>;
  setShowFloatingButtons: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useSelectionActions = ({
  setSelectedVerses,
  setLastSelectedVerse,
  setShowFloatingButtons
}: UseSelectionActionsProps) => {
  
  const clearSelection = useCallback(() => {
    console.log('Clearing selection');
    setSelectedVerses(new Set());
    setLastSelectedVerse(null);
    setShowFloatingButtons(false);
    
    // Clear browser selection
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
    
    // Remove temporary highlights
    const tempHighlights = document.querySelectorAll('[data-highlight-type="temporary"]');
    tempHighlights.forEach(highlight => {
      const parent = highlight.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(highlight.textContent || ''), highlight);
        parent.normalize();
      }
    });

    // Remove multi-selection highlights
    const multiSelectHighlights = document.querySelectorAll('[data-multi-select="true"]');
    multiSelectHighlights.forEach(highlight => {
      highlight.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'border-2', 'border-blue-400', 'dark:border-blue-600');
      highlight.removeAttribute('data-multi-select');
    });
  }, [setSelectedVerses, setLastSelectedVerse, setShowFloatingButtons]);

  return {
    clearSelection
  };
};
