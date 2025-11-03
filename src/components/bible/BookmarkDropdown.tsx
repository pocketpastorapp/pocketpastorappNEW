
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Bookmark, BookmarkPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { BibleBookmark } from '@/hooks/useBibleBookmarks';

interface BookmarkDropdownProps {
  currentBookmark: BibleBookmark | undefined;
  bibleId: string;
  chapterId: string;
  reference: string;
  bookmarks: BibleBookmark[];
  onBookmarkWithColor: (color: string) => void;
  onRemoveBookmark: (bookmarkId: string) => void;
}

const DEFAULT_COLORS = [
  { color: '#3B82F6', name: 'Blue' },
  { color: '#EF4444', name: 'Red' },
  { color: '#10B981', name: 'Green' },
  { color: '#F59E0B', name: 'Yellow' },
  { color: '#8B5CF6', name: 'Purple' },
];

const BookmarkDropdown = ({
  currentBookmark,
  bibleId,
  chapterId,
  reference,
  bookmarks,
  onBookmarkWithColor,
  onRemoveBookmark
}: BookmarkDropdownProps) => {
  const { theme } = useTheme();
  
  // Get all available colors including those in use by other bookmarks
  const getAllAvailableColors = () => {
    if (currentBookmark) {
      // If current chapter is bookmarked, only show colors not used by other bookmarks
      const otherBookmarks = bookmarks.filter(b => b.id !== currentBookmark.id);
      const usedByOthers = otherBookmarks.map(b => b.color);
      return DEFAULT_COLORS.filter(color => !usedByOthers.includes(color.color));
    } else {
      // If current chapter is not bookmarked, show all colors
      return DEFAULT_COLORS;
    }
  };

  const getBookmarkToReplace = (color: string) => {
    return bookmarks.find(b => 
      b.color === color && 
      !(b.bible_id === bibleId && b.chapter_id === chapterId)
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={currentBookmark ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2"
          style={currentBookmark ? { backgroundColor: currentBookmark.color } : undefined}
        >
          {currentBookmark ? (
            <Bookmark className="h-4 w-4 fill-current" />
          ) : (
            <BookmarkPlus className="h-4 w-4" />
          )}
          {currentBookmark ? "Bookmarked" : "Bookmark"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56"
        style={theme === "dark" ? { backgroundColor: '#1E1E1E' } : undefined}
      >
        {currentBookmark ? (
          <>
            <DropdownMenuItem 
              onClick={() => onRemoveBookmark(currentBookmark.id)}
              className="text-destructive focus:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Remove Bookmark
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
              Change color:
            </div>
            {getAllAvailableColors()
              .filter(colorOption => colorOption.color !== currentBookmark.color)
              .map((colorOption) => {
                const bookmarkToReplace = getBookmarkToReplace(colorOption.color);
                return (
                  <DropdownMenuItem
                    key={colorOption.color}
                    onClick={() => onBookmarkWithColor(colorOption.color)}
                    className="flex flex-col items-start gap-1 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: colorOption.color }}
                      />
                      {colorOption.name}
                    </div>
                    {bookmarkToReplace && (
                      <div className="text-xs text-muted-foreground ml-6">
                        Will replace {bookmarkToReplace.reference}
                      </div>
                    )}
                  </DropdownMenuItem>
                );
              })}
          </>
        ) : (
          <>
            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
              Select bookmark color:
            </div>
            {getAllAvailableColors().map((colorOption) => {
              const bookmarkToReplace = getBookmarkToReplace(colorOption.color);
              return (
                <DropdownMenuItem
                  key={colorOption.color}
                  onClick={() => onBookmarkWithColor(colorOption.color)}
                  className="flex flex-col items-start gap-1 py-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colorOption.color }}
                    />
                    {colorOption.name}
                  </div>
                  {bookmarkToReplace && (
                    <div className="text-xs text-muted-foreground ml-6">
                      Will replace {bookmarkToReplace.reference}
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookmarkDropdown;
