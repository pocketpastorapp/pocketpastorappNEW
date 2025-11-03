
import { useCallback } from 'react';
import { calculateOptimalPosition } from '../utils/positionUtils';

interface UseSelectionHandlersProps {
  selectedVerses: Set<string>;
  setSelectedVerses: React.Dispatch<React.SetStateAction<Set<string>>>;
  setLastSelectedVerse: React.Dispatch<React.SetStateAction<{
    text: string;
    element: HTMLElement | null;
    range: Range | null;
  } | null>>;
  setShowFloatingButtons: React.Dispatch<React.SetStateAction<boolean>>;
  setButtonPosition: React.Dispatch<React.SetStateAction<{ top: number; left: number }>>;
  clearSelection: () => void;
  checkIfSelectionIsHighlighted: (element: HTMLElement | null, range: Range | null) => void;
}

export const useSelectionHandlers = ({
  selectedVerses,
  setSelectedVerses,
  setLastSelectedVerse,
  setShowFloatingButtons,
  setButtonPosition,
  clearSelection,
  checkIfSelectionIsHighlighted
}: UseSelectionHandlersProps) => {

  const handleVerseClick = useCallback((event: React.MouseEvent) => {
    console.log('Verse click event triggered', {
      target: event.target,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      currentSelection: Array.from(selectedVerses)
    });
    
    const target = event.target as HTMLElement;
    
    // Check if clicking on a verse number span
    if (target.classList.contains('verse-number')) {
      console.log('Clicked on verse number:', target.textContent);
      const verseElement = target.closest('.verse') as HTMLElement;
      
      if (verseElement) {
        event.preventDefault();
        event.stopPropagation();
        console.log('Found verse element:', verseElement);
        
        // Get the verse text (excluding the verse number)
        const verseText = Array.from(verseElement.childNodes)
          .filter(node => !node.textContent?.match(/^\d+$/)) // Skip verse numbers
          .map(node => node.textContent)
          .join('')
          .trim();
        
        const verseNumber = target.getAttribute('data-verse-number') || target.textContent?.trim() || '';
        const verseId = `verse-${verseNumber}`;
        
        console.log('Verse selection:', { 
          verseNumber, 
          verseId, 
          verseText: verseText.substring(0, 50),
          currentSelectedCount: selectedVerses.size
        });
        
        if (verseText) {
          // Toggle selection of this verse (always multi-select behavior)
          setSelectedVerses(prev => {
            const newSelection = new Set(prev);
            console.log('Previous selection:', Array.from(prev));
            
            if (newSelection.has(verseId)) {
              // Remove from selection
              console.log('Removing verse from selection:', verseId);
              newSelection.delete(verseId);
              verseElement.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'border-2', 'border-blue-400', 'dark:border-blue-600');
              verseElement.removeAttribute('data-multi-select');
              
              if (newSelection.size === 0) {
                setLastSelectedVerse(null);
                setShowFloatingButtons(false);
                return newSelection;
              }
            } else {
              // Add to selection
              console.log('Adding verse to selection:', verseId);
              newSelection.add(verseId);
              verseElement.classList.add('bg-blue-100', 'dark:bg-blue-900', 'border-2', 'border-blue-400', 'dark:border-blue-600');
              verseElement.setAttribute('data-multi-select', 'true');
            }
            
            console.log('New selection:', Array.from(newSelection));
            return newSelection;
          });
          
          // Set this as the last selected verse for button positioning
          setLastSelectedVerse({
            text: verseText,
            element: verseElement,
            range: null
          });
          
          // Check if this verse is highlighted
          checkIfSelectionIsHighlighted(verseElement, null);
          
          // Calculate position for floating buttons with better positioning
          const rect = verseElement.getBoundingClientRect();
          console.log('Verse element rect:', rect);
          
          // Ensure we have a valid rect before calculating position
          if (rect.width > 0 && rect.height > 0) {
            const position = calculateOptimalPosition(rect);
            console.log('Setting button position:', position);
            setButtonPosition(position);
            setShowFloatingButtons(true);
          } else {
            console.warn('Invalid rect for positioning:', rect);
            // Fallback positioning
            setButtonPosition({ top: 100, left: 100 });
            setShowFloatingButtons(true);
          }
        }
        return;
      }
    }

    // Check if clicking on a verse div directly
    if (target.classList.contains('verse') || target.closest('.verse')) {
      const verseElement = target.classList.contains('verse') ? target : target.closest('.verse') as HTMLElement;
      const verseNumberSpan = verseElement?.querySelector('.verse-number') as HTMLElement;
      
      if (verseNumberSpan) {
        // Create a new click event that preserves the original event's modifier keys
        const syntheticEvent = {
          ...event,
          target: verseNumberSpan,
          currentTarget: verseNumberSpan,
          preventDefault: () => event.preventDefault(),
          stopPropagation: () => event.stopPropagation(),
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey
        } as React.MouseEvent;
        
        // Recursively call handleVerseClick with the verse number as target
        handleVerseClick(syntheticEvent);
        return;
      }
    }

    // Handle text selection (when not clicking on verse elements)
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const text = selection.toString().trim();
        
        console.log('Text selection:', { text: text.substring(0, 50), hasText: text.length > 0 });
        
        if (text && text.length > 0) {
          // Clear previous verse selections for text selection
          clearSelection();

          // Remove any existing temporary highlights
          const existingTempHighlights = document.querySelectorAll('[data-highlight-type="temporary"]');
          existingTempHighlights.forEach(highlight => {
            const parent = highlight.parentNode;
            if (parent) {
              parent.replaceChild(document.createTextNode(highlight.textContent || ''), highlight);
              parent.normalize();
            }
          });

          // Create temporary highlights for the selection
          try {
            const contents = range.extractContents();
            const span = document.createElement('span');
            span.className = 'bg-blue-200 dark:bg-blue-800 transition-colors duration-200';
            span.setAttribute('data-highlight-type', 'temporary');
            span.appendChild(contents);
            range.insertNode(span);
            
            setLastSelectedVerse({
              text,
              element: null,
              range: range.cloneRange()
            });
            
            // Check if this selection is highlighted
            checkIfSelectionIsHighlighted(null, range);
            
            // Calculate position for floating buttons
            const rect = span.getBoundingClientRect();
            console.log('Text selection rect:', rect);
            
            if (rect.width > 0 && rect.height > 0) {
              const position = calculateOptimalPosition(rect);
              console.log('Setting button position for text selection:', position);
              setButtonPosition(position);
              setShowFloatingButtons(true);
            } else {
              console.warn('Invalid rect for text selection positioning:', rect);
              setButtonPosition({ top: 100, left: 100 });
              setShowFloatingButtons(true);
            }
          } catch (error) {
            console.error('Error creating temporary highlight:', error);
          }
        } else {
          clearSelection();
        }
      }
    }, 10);
  }, [selectedVerses, setSelectedVerses, setLastSelectedVerse, setShowFloatingButtons, setButtonPosition, clearSelection, checkIfSelectionIsHighlighted]);

  return {
    handleVerseClick
  };
};
