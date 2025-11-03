
import React from 'react';

interface VerseHighlightHandlerProps {
  selectedText: string;
  reference: string;
  isCurrentSelectionHighlighted: boolean;
  onHighlight?: (text: string, reference: string) => void;
  onToggleHighlight: (reference: string) => void;
}

export const useHighlightHandler = ({
  selectedText,
  reference,
  isCurrentSelectionHighlighted,
  onHighlight,
  onToggleHighlight
}: VerseHighlightHandlerProps) => {
  const handleHighlight = () => {
    onToggleHighlight(reference);
    if (onHighlight) {
      onHighlight(selectedText, reference);
    }
  };

  return {
    handleHighlight,
    isCurrentSelectionHighlighted
  };
};
