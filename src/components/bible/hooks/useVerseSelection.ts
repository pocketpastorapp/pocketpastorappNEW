
import { useCallback } from 'react';
import { useHighlightManagement } from './useHighlightManagement';
import { useSelectionState } from './useSelectionState';
import { useSelectionActions } from './useSelectionActions';
import { useSelectionHandlers } from './useSelectionHandlers';

interface UseVerseSelectionProps {
  bibleId: string;
  chapterId: string;
  reference: string;
}

export const useVerseSelection = ({ bibleId, chapterId, reference }: UseVerseSelectionProps) => {
  const {
    selectedVerses,
    setSelectedVerses,
    lastSelectedVerse,
    setLastSelectedVerse,
    showFloatingButtons,
    setShowFloatingButtons,
    buttonPosition,
    setButtonPosition,
    selectedText
  } = useSelectionState();

  const {
    isCurrentSelectionHighlighted,
    checkIfSelectionIsHighlighted,
    toggleHighlight,
    removeHighlight,
    highlightsLoading
  } = useHighlightManagement({ bibleId, chapterId, reference });

  const { clearSelection } = useSelectionActions({
    setSelectedVerses,
    setLastSelectedVerse,
    setShowFloatingButtons
  });

  const { handleVerseClick } = useSelectionHandlers({
    selectedVerses,
    setSelectedVerses,
    setLastSelectedVerse,
    setShowFloatingButtons,
    setButtonPosition,
    clearSelection,
    checkIfSelectionIsHighlighted
  });

  const handleToggleHighlight = useCallback((reference: string) => {
    if (selectedVerses.size > 1) {
      // Highlight multiple verses
      toggleHighlight(reference, null, null, '', selectedVerses);
    } else if (lastSelectedVerse) {
      // Highlight single verse or text selection
      toggleHighlight(reference, lastSelectedVerse.element, lastSelectedVerse.range, lastSelectedVerse.text);
    }
  }, [toggleHighlight, lastSelectedVerse, selectedVerses]);

  return {
    selectedText,
    selectedVerses,
    showFloatingButtons,
    buttonPosition,
    isCurrentSelectionHighlighted,
    highlightsLoading,
    handleVerseClick,
    clearSelection,
    toggleHighlight: handleToggleHighlight,
    removeHighlight
  };
};
