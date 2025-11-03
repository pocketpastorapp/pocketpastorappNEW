
import { useState, useCallback } from 'react';

export const useSelectionState = () => {
  const [selectedVerses, setSelectedVerses] = useState<Set<string>>(new Set());
  const [lastSelectedVerse, setLastSelectedVerse] = useState<{
    text: string;
    element: HTMLElement | null;
    range: Range | null;
  } | null>(null);
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  const getSelectedText = useCallback(() => {
    if (selectedVerses.size > 0) {
      // Return combined text from all selected verses
      const verseElements = Array.from(selectedVerses).map(verseId => {
        const verseNumber = verseId.replace('verse-', '');
        return document.querySelector(`.verse[data-verse="${verseNumber}"]`) as HTMLElement;
      }).filter(Boolean);
      
      return verseElements.map(el => {
        const verseNumber = el.querySelector('.verse-number');
        return Array.from(el.childNodes)
          .filter(node => node !== verseNumber)
          .map(node => node.textContent)
          .join('')
          .trim();
      }).join(' ');
    }
    
    return lastSelectedVerse?.text || '';
  }, [selectedVerses, lastSelectedVerse]);

  return {
    selectedVerses,
    setSelectedVerses,
    lastSelectedVerse,
    setLastSelectedVerse,
    showFloatingButtons,
    setShowFloatingButtons,
    buttonPosition,
    setButtonPosition,
    selectedText: getSelectedText()
  };
};
