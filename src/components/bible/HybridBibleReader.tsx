
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { hybridBibleService } from '@/services/hybridBibleService';
import { useBibleBookmarks } from '@/hooks/useBibleBookmarks';
import { useFavoriteVerses } from '@/hooks/useFavoriteVerses';
import { useNavigate } from 'react-router-dom';
import ReaderHeader from './ReaderHeader';
import ReaderContent from './ReaderContent';

interface HybridBibleReaderProps {
  bibleId: string;
  chapterId: string;
  reference: string;
  searchHighlight?: string;
  highlightVerse?: string;
  onHighlight?: (text: string, reference: string) => void;
  onAddNote?: (text: string, reference: string) => void;
  className?: string;
}

const HybridBibleReader = ({ 
  bibleId, 
  chapterId, 
  reference,
  searchHighlight,
  highlightVerse,
  onHighlight, 
  onAddNote,
  className = '' 
}: HybridBibleReaderProps) => {
  const [chapterText, setChapterText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  
  const { bookmarks, addBookmark, removeBookmark } = useBibleBookmarks();
  const { addFavoriteVerse } = useFavoriteVerses();

  // Check if current chapter is bookmarked and get its color
  const currentBookmark = bookmarks.find(
    b => b.bible_id === bibleId && b.chapter_id === chapterId
  );

  useEffect(() => {
    if (bibleId && chapterId) {
      loadChapter();
    }
  }, [bibleId, chapterId]);

  const loadChapter = async () => {
    try {
      setIsLoading(true);
      setError('');
      const text = await hybridBibleService.getChapterText(bibleId, chapterId);
      setChapterText(text);
    } catch (error) {
      console.error('Error loading chapter:', error);
      setError('Error loading chapter. Please try again.');
      setChapterText('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkWithColor = (color: string) => {
    // Check if this color is already used by another bookmark
    const existingBookmark = bookmarks.find(b => 
      b.color === color && 
      !(b.bible_id === bibleId && b.chapter_id === chapterId)
    );

    if (existingBookmark) {
      // Remove the existing bookmark first, then add the new one
      removeBookmark(existingBookmark.id);
    }

    addBookmark(bibleId, chapterId, reference, color);
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    removeBookmark(bookmarkId);
  };

  const handleAddToFavorites = async (text: string, verseReference: string) => {
    await addFavoriteVerse(bibleId, chapterId, text, verseReference);
  };

  const handleAskAI = (text: string, verseReference: string) => {
    // Navigate to chat page with the verse context
    const chatMessage = `Please help me understand this verse: "${text}" from ${verseReference}`;
    navigate('/chat', { 
      state: { 
        initialMessage: chatMessage,
        context: { verse: text, reference: verseReference }
      }
    });
  };

  return (
    <Card className={className}>
      <ReaderHeader
        reference={reference}
        currentBookmark={currentBookmark}
        bibleId={bibleId}
        chapterId={chapterId}
        bookmarks={bookmarks}
        onBookmarkWithColor={handleBookmarkWithColor}
        onRemoveBookmark={handleRemoveBookmark}
      />
      <ReaderContent
        error={error}
        isLoading={isLoading}
        chapterText={chapterText}
        reference={reference}
        bibleId={bibleId}
        chapterId={chapterId}
        searchHighlight={searchHighlight}
        highlightVerse={highlightVerse}
        onHighlight={onHighlight}
        onAddToFavorites={handleAddToFavorites}
        onAskAI={handleAskAI}
      />
    </Card>
  );
};

export default HybridBibleReader;
