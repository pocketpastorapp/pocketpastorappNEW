
import { useEffect, useRef } from 'react';

interface VerseSearchHighlightsProps {
  processedChapterText: string;
  searchHighlight?: string;
  highlightVerse?: string;
}

const VerseSearchHighlights = ({ processedChapterText, searchHighlight, highlightVerse }: VerseSearchHighlightsProps) => {
  const hasAppliedHighlights = useRef(false);
  const userRemovedHighlights = useRef(false);

  // Add temporary search highlighting
  useEffect(() => {
    if (processedChapterText && searchHighlight && !userRemovedHighlights.current) {
      console.log('Adding temporary search highlighting for:', searchHighlight, 'verse:', highlightVerse);
      
      const timer = setTimeout(() => {
        // Apply new temporary highlights only if we haven't applied them before or user hasn't removed them
        if (!hasAppliedHighlights.current) {
          const verseElements = document.querySelectorAll('[data-verse]');
          const searchTerms = searchHighlight.toLowerCase().split(' ').filter(term => term.length > 0);
          
          verseElements.forEach((verseElement) => {
            const verseNumber = verseElement.getAttribute('data-verse');
            
            // If highlightVerse is specified, only highlight that verse
            if (highlightVerse && verseNumber !== highlightVerse) {
              return;
            }
            
            // Get all text nodes in the verse
            const walker = document.createTreeWalker(
              verseElement,
              NodeFilter.SHOW_TEXT,
              null
            );
            
            const textNodes: Text[] = [];
            let node;
            while (node = walker.nextNode()) {
              textNodes.push(node as Text);
            }
            
            // Apply highlighting to each text node
            textNodes.forEach(textNode => {
              let nodeText = textNode.textContent || '';
              let hasMatch = false;
              
              // Check if any search term is in this text node
              searchTerms.forEach(term => {
                if (nodeText.toLowerCase().includes(term)) {
                  hasMatch = true;
                  const regex = new RegExp(`(${term})`, 'gi');
                  nodeText = nodeText.replace(regex, `<span class="temporary-search-highlight" style="background-color: #184482; color: white; padding: 1px 2px; border-radius: 2px;">$1</span>`);
                }
              });
              
              if (hasMatch) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = nodeText;
                textNode.parentNode?.replaceChild(wrapper, textNode);
              }
            });
          });
          
          hasAppliedHighlights.current = true;
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [processedChapterText, searchHighlight, highlightVerse]);

  // Listen for when user manually removes highlights
  useEffect(() => {
    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Check if user clicked on a temporary highlight to remove it
      if (target.classList.contains('temporary-search-highlight')) {
        userRemovedHighlights.current = true;
        console.log('User manually removed search highlights');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null; // This component only handles side effects
};

export default VerseSearchHighlights;
