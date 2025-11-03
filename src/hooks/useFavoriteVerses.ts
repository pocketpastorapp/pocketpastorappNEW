import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';

export interface FavoriteVerse {
  id: string;
  bible_id: string;
  chapter_id: string;
  verse_text: string;
  reference: string;
  verse_number: string;
  created_at: string;
}

export const useFavoriteVerses = () => {
  const { user } = useAuth();
  const [favoriteVerses, setFavoriteVerses] = useState<FavoriteVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorite verses
  useEffect(() => {
    console.log('useFavoriteVerses: useEffect triggered with user:', user?.id);
    if (user) {
      loadFavoriteVerses();
    } else {
      console.log('useFavoriteVerses: No user found, clearing verses');
      setFavoriteVerses([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadFavoriteVerses = async () => {
    try {
      console.log('useFavoriteVerses: Loading favorite verses for user:', user?.id);
      setIsLoading(true);
      
      console.log('useFavoriteVerses: Making Supabase query...');
      const { data, error } = await supabase
        .from('favorite_verses')
        .select('id, bible_id, chapter_id, verse_text, reference, verse_number, created_at')
        .order('created_at', { ascending: false });

      console.log('useFavoriteVerses: Supabase query response:', { data, error });

      if (error) {
        console.error('useFavoriteVerses: Error loading favorite verses:', error);
        toast.error('Failed to load favorite verses');
      } else {
        console.log('useFavoriteVerses: Successfully loaded verses:', data);
        console.log('useFavoriteVerses: Number of verses loaded:', data?.length || 0);
        setFavoriteVerses(data || []);
      }
    } catch (error) {
      console.error('useFavoriteVerses: Error in loadFavoriteVerses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavoriteVerse = async (
    bibleId: string,
    chapterId: string,
    verseText: string,
    reference: string
  ) => {
    if (!user) {
      toast.error('Please log in to save favorite verses');
      return false;
    }

    try {
      console.log('useFavoriteVerses: Adding favorite verse:', { bibleId, chapterId, verseText, reference });
      
      // Extract verse number from the reference
      let verseNumber = '1'; // Default to verse 1
      const match = reference.match(/:(\d+)$/);
      if (match) {
        verseNumber = match[1];
      } else {
        // Try to extract from verse text if it starts with a number
        const textMatch = verseText.match(/^(\d+)\s/);
        if (textMatch) {
          verseNumber = textMatch[1];
        }
      }
      
      console.log('useFavoriteVerses: Extracted verse number:', verseNumber);
      
      const { data, error } = await supabase
        .from('favorite_verses')
        .insert({
          user_id: user.id,
          bible_id: bibleId,
          chapter_id: chapterId,
          verse_text: verseText,
          reference: reference,
          verse_number: verseNumber
        })
        .select('id, bible_id, chapter_id, verse_text, reference, verse_number, created_at')
        .single();

      console.log('useFavoriteVerses: Add verse response:', { data, error });

      if (error) {
        console.error('Error adding favorite verse:', error);
        toast.error('Failed to add favorite verse');
        return false;
      }

      if (data) {
        setFavoriteVerses(prev => [data, ...prev]);
        toast.success('Verse added to favorites');
        console.log('useFavoriteVerses: Verse successfully added to state');
        return true;
      }
    } catch (error) {
      console.error('Error in addFavoriteVerse:', error);
      toast.error('Failed to add favorite verse');
    }
    return false;
  };

  const removeFavoriteVerse = async (id: string) => {
    try {
      console.log('useFavoriteVerses: Removing favorite verse:', id);
      
      const { error } = await supabase
        .from('favorite_verses')
        .delete()
        .eq('id', id);

      console.log('useFavoriteVerses: Remove verse response:', { error });

      if (error) {
        console.error('Error removing favorite verse:', error);
        toast.error('Failed to remove favorite verse');
        return false;
      }

      setFavoriteVerses(prev => prev.filter(verse => verse.id !== id));
      toast.success('Verse removed from favorites');
      console.log('useFavoriteVerses: Verse successfully removed from state');
      return true;
    } catch (error) {
      console.error('Error in removeFavoriteVerse:', error);
      toast.error('Failed to remove favorite verse');
      return false;
    }
  };

  return {
    favoriteVerses,
    isLoading,
    addFavoriteVerse,
    removeFavoriteVerse,
    loadFavoriteVerses
  };
};
