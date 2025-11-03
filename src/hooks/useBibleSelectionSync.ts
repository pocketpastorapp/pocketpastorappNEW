
import { useEffect, useRef } from 'react';

interface UseBibleSelectionSyncProps {
  currentSelection?: {
    bibleId: string;
    chapterId: string;
    reference: string;
  } | null;
  selectedVersion: string;
  selectedBook: string;
  selectedChapter: string;
  setSelectedVersion: (version: string) => void;
  setSelectedBook: (book: string) => void;
  setSelectedChapter: (chapter: string) => void;
  userInitiatedChange: React.MutableRefObject<boolean>;
}

export const useBibleSelectionSync = ({
  currentSelection,
  selectedVersion,
  selectedBook,
  selectedChapter,
  setSelectedVersion,
  setSelectedBook,
  setSelectedChapter,
  userInitiatedChange
}: UseBibleSelectionSyncProps) => {
  const lastSyncedKey = useRef<string | null>(null);

  useEffect(() => {
    if (!currentSelection || !currentSelection.bibleId || !currentSelection.chapterId) return;
    if (userInitiatedChange.current) return;

    const key = `${currentSelection.bibleId}|${currentSelection.chapterId}`;
    // Only perform auto-sync once per current selection to avoid overriding user choices
    if (lastSyncedKey.current === key) return;

    // Perform initial sync
    const bookId = currentSelection.chapterId.split('.')[0];

    if (selectedVersion !== currentSelection.bibleId) {
      setSelectedVersion(currentSelection.bibleId);
    }
    if (selectedBook !== bookId) {
      setSelectedBook(bookId);
    }
    if (selectedChapter !== currentSelection.chapterId) {
      setSelectedChapter(currentSelection.chapterId);
    }

    lastSyncedKey.current = key;
  }, [currentSelection?.bibleId, currentSelection?.chapterId]);
};
