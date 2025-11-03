
import React from 'react';
import { CardContent } from '@/components/ui/card';
import VerseSelector from './VerseSelector';

interface ReaderContentProps {
  error: string;
  isLoading: boolean;
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
}

const ReaderContent = ({
  error,
  isLoading,
  chapterText,
  reference,
  bibleId,
  chapterId,
  searchHighlight,
  highlightVerse,
  highlightFavorite,
  onHighlight,
  onAddToFavorites,
  onAskAI
}: ReaderContentProps) => {
  if (error) {
    return (
      <CardContent className="p-6">
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </CardContent>
    );
  }

  if (isLoading) {
    return (
      <CardContent className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </CardContent>
    );
  }

  if (!chapterText) {
    return (
      <CardContent className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No chapter selected</p>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-6">
      <VerseSelector
        chapterText={chapterText}
        reference={reference}
        bibleId={bibleId}
        chapterId={chapterId}
        searchHighlight={searchHighlight}
        highlightVerse={highlightVerse}
        highlightFavorite={highlightFavorite}
        onHighlight={onHighlight}
        onAddToFavorites={onAddToFavorites}
        onAskAI={onAskAI}
      />
    </CardContent>
  );
};

export default ReaderContent;
