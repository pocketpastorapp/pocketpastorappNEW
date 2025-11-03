
import React from 'react';

interface VerseClickHandlerProps {
  children: React.ReactNode;
  searchHighlight?: string;
  onVerseClick: (event: React.MouseEvent) => void;
  onRemoveHighlight: (event: React.MouseEvent) => void;
}

const VerseClickHandler = ({
  children,
  searchHighlight,
  onVerseClick,
  onRemoveHighlight
}: VerseClickHandlerProps) => {
  // Enhanced click handler to remove temporary highlights when clicking on them
  const handleVerseClickWithHighlightRemoval = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    
    // Check if clicking on a temporary search highlight
    if (target.classList.contains('temporary-search-highlight')) {
      console.log('Removing temporary search highlight');
      const parent = target.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(target.textContent || ''), target);
        parent.normalize();
      }
      return; // Don't proceed with normal verse click handling
    }
    
    const verseElement = target.closest('[data-verse]');
    
    if (verseElement && searchHighlight) {
      // Remove temporary highlights from the clicked verse
      const highlights = verseElement.querySelectorAll('.temporary-search-highlight');
      highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(highlight.textContent || ''), highlight);
          parent.normalize();
        }
      });
    }
    
    // Call the original verse click handler
    onVerseClick(event);
  };

  return (
    <div 
      id="chapter-content"
      className="prose prose-sm max-w-none leading-relaxed cursor-pointer select-text"
      onClick={handleVerseClickWithHighlightRemoval}
      onDoubleClick={onRemoveHighlight}
    >
      {children}
    </div>
  );
};

export default VerseClickHandler;
