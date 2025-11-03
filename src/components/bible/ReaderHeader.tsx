
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import BookmarkDropdown from './BookmarkDropdown';
import { BibleBookmark } from '@/hooks/useBibleBookmarks';

interface ReaderHeaderProps {
  reference: string;
  currentBookmark: BibleBookmark | undefined;
  bibleId: string;
  chapterId: string;
  bookmarks: BibleBookmark[];
  onBookmarkWithColor: (color: string) => void;
  onRemoveBookmark: (bookmarkId: string) => void;
}

const ReaderHeader = ({
  reference,
  currentBookmark,
  bibleId,
  chapterId,
  bookmarks,
  onBookmarkWithColor,
  onRemoveBookmark
}: ReaderHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {reference || 'Bible Reader'}
        </div>
        <div className="flex items-center gap-2">
          <BookmarkDropdown
            currentBookmark={currentBookmark}
            bibleId={bibleId}
            chapterId={chapterId}
            reference={reference}
            bookmarks={bookmarks}
            onBookmarkWithColor={onBookmarkWithColor}
            onRemoveBookmark={onRemoveBookmark}
          />
        </div>
      </CardTitle>
    </CardHeader>
  );
};

export default ReaderHeader;
