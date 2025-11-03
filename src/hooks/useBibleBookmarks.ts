
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

export interface BibleBookmark {
  id: string;
  bible_id: string;
  chapter_id: string;
  reference: string;
  color: string;
  created_at: string;
}

const DEFAULT_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
];

export const useBibleBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BibleBookmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bible_bookmarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to load bookmarks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addBookmark = async (bibleId: string, chapterId: string, reference: string, selectedColor?: string) => {
    if (!user) return;

    if (bookmarks.length >= 5) {
      toast({
        title: "Bookmark Limit Reached",
        description: "You can only have up to 5 bookmarks. Please remove one to add a new bookmark.",
        variant: "destructive",
      });
      return;
    }

    // Check if bookmark already exists
    const existingBookmark = bookmarks.find(
      b => b.bible_id === bibleId && b.chapter_id === chapterId
    );

    if (existingBookmark) {
      toast({
        title: "Already Bookmarked",
        description: "This chapter is already bookmarked",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use the selected color or get next available color
      const usedColors = bookmarks.map(b => b.color);
      const color = selectedColor || DEFAULT_COLORS.find(color => !usedColors.includes(color)) || DEFAULT_COLORS[0];

      const { data, error } = await supabase
        .from('bible_bookmarks')
        .insert({
          user_id: user.id,
          bible_id: bibleId,
          chapter_id: chapterId,
          reference,
          color,
        })
        .select()
        .single();

      if (error) throw error;

      setBookmarks(prev => [data, ...prev]);
      toast({
        title: "Bookmark Added",
        description: `Added bookmark for ${reference}`,
      });
    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to add bookmark",
        variant: "destructive",
      });
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('bible_bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;

      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      toast({
        title: "Bookmark Removed",
        description: "Bookmark has been removed",
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive",
      });
    }
  };

  const updateBookmarkColor = async (bookmarkId: string, color: string) => {
    try {
      const { error } = await supabase
        .from('bible_bookmarks')
        .update({ color })
        .eq('id', bookmarkId);

      if (error) throw error;

      setBookmarks(prev => 
        prev.map(b => b.id === bookmarkId ? { ...b, color } : b)
      );
      toast({
        title: "Color Updated",
        description: "Bookmark color has been updated",
      });
    } catch (error) {
      console.error('Error updating bookmark color:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark color",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    updateBookmarkColor,
    canAddBookmark: bookmarks.length < 5,
    availableColors: DEFAULT_COLORS.filter(color => 
      !bookmarks.some(b => b.color === color)
    ),
  };
};
