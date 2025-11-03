
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { BookOpen, Bookmark, MoreHorizontal, Trash2, Palette } from 'lucide-react';
import { useBibleBookmarks, BibleBookmark } from '@/hooks/useBibleBookmarks';

interface BookmarksSectionProps {
  onBookmarkSelect?: (bibleId: string, chapterId: string, reference: string) => void;
  className?: string;
}

const DEFAULT_COLORS = [
  { color: '#3B82F6', name: 'Blue' },
  { color: '#EF4444', name: 'Red' },
  { color: '#10B981', name: 'Green' },
  { color: '#F59E0B', name: 'Yellow' },
  { color: '#8B5CF6', name: 'Purple' },
];

const BookmarksSection = ({ onBookmarkSelect, className = '' }: BookmarksSectionProps) => {
  const { bookmarks, isLoading, removeBookmark, updateBookmarkColor, availableColors } = useBibleBookmarks();
  const navigate = useNavigate();

  const handleBookmarkClick = (bookmark: BibleBookmark) => {
    // Navigate to the bible read page with the bookmark parameters
    const params = new URLSearchParams();
    params.set('bibleId', bookmark.bible_id);
    params.set('chapterId', bookmark.chapter_id);
    params.set('reference', bookmark.reference);
    navigate(`/bible/read?${params.toString()}`);
    
    // Also call the optional callback if provided
    if (onBookmarkSelect) {
      onBookmarkSelect(bookmark.bible_id, bookmark.chapter_id, bookmark.reference);
    }
  };

  const handleColorChange = (bookmarkId: string, color: string) => {
    updateBookmarkColor(bookmarkId, color);
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    removeBookmark(bookmarkId);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Bookmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            My Bookmarks
          </div>
          <Badge variant="secondary" className="text-xs">
            {bookmarks.length}/5
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Save your favorite chapters for quick access
            </p>
            <p className="text-xs text-muted-foreground">
              Use the bookmark button while reading to add chapters here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookmarks.map((bookmark) => {
              const colorInfo = DEFAULT_COLORS.find(c => c.color === bookmark.color);
              const availableColorsForChange = availableColors.concat(bookmark.color);
              
              return (
                <div
                  key={bookmark.id}
                  className="group relative flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer"
                  onClick={() => handleBookmarkClick(bookmark)}
                >
                  {/* Color indicator with tooltip */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: bookmark.color }}
                          />
                          <div className="text-xs text-muted-foreground font-medium">
                            {colorInfo?.name?.charAt(0) || '?'}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>{colorInfo?.name || 'Custom'} bookmark</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Bookmark content */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      {bookmark.reference}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Added {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* 3-dot menu - shown on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="w-48 bg-popover border shadow-md"
                        style={{ zIndex: 50 }}
                      >
                        {/* Change Color Submenu */}
                        {availableColorsForChange.length > 1 ? (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <Palette className="h-4 w-4 mr-2" />
                              Change Color
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="bg-popover border shadow-md">
                              {availableColorsForChange
                                .filter(color => color !== bookmark.color)
                                .map((color) => {
                                  const colorInfo = DEFAULT_COLORS.find(c => c.color === color);
                                  return (
                                    <DropdownMenuItem
                                      key={color}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleColorChange(bookmark.id, color);
                                      }}
                                      className="flex items-center gap-2"
                                    >
                                      <div
                                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                                        style={{ backgroundColor: color }}
                                      />
                                      {colorInfo?.name || 'Color'}
                                    </DropdownMenuItem>
                                  );
                                })}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        ) : (
                          <DropdownMenuItem disabled>
                            <Palette className="h-4 w-4 mr-2" />
                            No other colors available
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        {/* Delete Bookmark */}
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveBookmark(bookmark.id);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Bookmark
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Usage tip at bottom */}
        {bookmarks.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              You can have up to 5 bookmarks. Remove old ones to add new chapters.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookmarksSection;
