
import React, { useState, useEffect } from 'react';
import { processChapterText } from './utils/verseProcessing';
import { useVerseSelection } from './hooks/useVerseSelection';
import VerseFloatingButtons from './components/VerseFloatingButtons';
import VerseStyles from './components/VerseStyles';
import VerseAutoScroll from './components/VerseAutoScroll';
import VerseClusterHighlights from './components/VerseClusterHighlights';
import VerseSearchHighlights from './components/VerseSearchHighlights';
import VerseClickHandler from './components/VerseClickHandler';
import VerseChapterContent from './components/VerseChapterContent';
import { useFavoritesHandler } from './components/VerseFavoritesHandler';
import { useHighlightHandler } from './components/VerseHighlightHandler';
import { useSearchParams } from 'react-router-dom';

interface VerseSelectorProps {
  chapterText: string;
  reference: string;
  bibleId: string;
  chapterId: string;
  searchHighlight?: string;
  highlightVerse?: string;
  highlightFavorite?: string;
  onHighlight?: (text: string, reference: string) => void;
  onAddToFavorites?: (text: string, reference: string) => void;
  onAskAI?: (text: string, reference: string) => void;
  className?: string;
}

const VerseSelector = ({
  chapterText,
  reference,
  bibleId,
  chapterId,
  searchHighlight,
  highlightVerse,
  highlightFavorite,
  onHighlight,
  onAddToFavorites,
  onAskAI,
  className = ''
}: VerseSelectorProps) => {
  const [processedChapterText, setProcessedChapterText] = useState<string>('');
  const [searchParams] = useSearchParams();
  
  // Get highlightFavorite from URL params if not passed as prop
  const urlHighlightFavorite = searchParams.get('highlightFavorite');
  const effectiveHighlightFavorite = highlightFavorite || urlHighlightFavorite;
  
  const {
    selectedText,
    selectedVerses,
    showFloatingButtons,
    buttonPosition,
    isCurrentSelectionHighlighted,
    highlightsLoading,
    handleVerseClick,
    clearSelection,
    toggleHighlight,
    removeHighlight
  } = useVerseSelection({ bibleId, chapterId, reference });

  const { handleAddToFavorites: handleFavorites, isVerseInCluster } = useFavoritesHandler({
    bibleId,
    chapterId,
    reference,
    selectedVerses,
    selectedText
  });

  const { handleHighlight } = useHighlightHandler({
    selectedText,
    reference,
    isCurrentSelectionHighlighted,
    onHighlight,
    onToggleHighlight: toggleHighlight
  });

  // Process chapter text to add verse markers with enhanced processing
  useEffect(() => {
    if (chapterText) {
      console.log('Processing chapter text for Bible version:', bibleId);
      console.log('Original text preview:', chapterText.substring(0, 200));
      
      const processed = processChapterText(chapterText);
      setProcessedChapterText(processed);
      
      console.log('Processed text preview:', processed.substring(0, 200));
    }
  }, [chapterText, bibleId]);

  return (
    <div className={className}>
      {highlightsLoading && (
        <div className="text-sm text-muted-foreground mb-2">
          Loading highlights...
        </div>
      )}
      
      <VerseClickHandler
        searchHighlight={searchHighlight}
        onVerseClick={handleVerseClick}
        onRemoveHighlight={removeHighlight}
      >
        <VerseChapterContent
          processedChapterText={processedChapterText}
          chapterText={chapterText}
        />
      </VerseClickHandler>

      <VerseStyles />
      
      <VerseAutoScroll 
        processedChapterText={processedChapterText}
        highlightVerse={highlightVerse}
        searchHighlight={searchHighlight}
        highlightFavorite={effectiveHighlightFavorite}
      />
      
      <VerseClusterHighlights 
        processedChapterText={processedChapterText}
        bibleId={bibleId}
        chapterId={chapterId}
      />
      
      <VerseSearchHighlights 
        processedChapterText={processedChapterText}
        searchHighlight={searchHighlight}
        highlightVerse={highlightVerse}
      />

      {showFloatingButtons && (
        <VerseFloatingButtons
          selectedText={selectedText}
          reference={reference}
          position={{ top: buttonPosition.top, left: buttonPosition.left }}
          onCancel={clearSelection}
          onHighlight={handleHighlight}
          onAddToFavorites={handleFavorites}
          onAskAI={onAskAI}
          isHighlighted={isCurrentSelectionHighlighted}
          selectedCount={selectedVerses.size}
          isFavorited={selectedVerses.size > 0 && Array.from(selectedVerses)
            .map(verseId => verseId.replace('verse-', ''))
            .every(verseNumber => isVerseInCluster(verseNumber))}

        />
      )}
    </div>
  );
};

export default VerseSelector;
