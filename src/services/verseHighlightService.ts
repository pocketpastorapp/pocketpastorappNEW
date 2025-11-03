
import { supabase } from '@/integrations/supabase/client';

export interface VerseHighlight {
  id: string;
  user_id: string;
  bible_id: string;
  chapter_id: string;
  verse_number: string;
  highlight_type: string;
  created_at: string;
  updated_at: string;
}

class VerseHighlightService {
  async saveHighlight(
    bibleId: string,
    chapterId: string,
    verseNumber: string,
    highlightType: string = 'permanent'
  ): Promise<VerseHighlight | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        return null;
      }

      const { data, error } = await supabase
        .from('verse_highlights')
        .upsert({
          user_id: user.id,
          bible_id: bibleId,
          chapter_id: chapterId,
          verse_number: verseNumber,
          highlight_type: highlightType,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving highlight:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error saving highlight:', error);
      return null;
    }
  }

  async removeHighlight(
    bibleId: string,
    chapterId: string,
    verseNumber: string
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        return false;
      }

      const { error } = await supabase
        .from('verse_highlights')
        .delete()
        .eq('user_id', user.id)
        .eq('bible_id', bibleId)
        .eq('chapter_id', chapterId)
        .eq('verse_number', verseNumber);

      if (error) {
        console.error('Error removing highlight:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error removing highlight:', error);
      return false;
    }
  }

  async getChapterHighlights(
    bibleId: string,
    chapterId: string
  ): Promise<VerseHighlight[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        return [];
      }

      const { data, error } = await supabase
        .from('verse_highlights')
        .select('*')
        .eq('user_id', user.id)
        .eq('bible_id', bibleId)
        .eq('chapter_id', chapterId);

      if (error) {
        console.error('Error fetching highlights:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching highlights:', error);
      return [];
    }
  }

  async isVerseHighlighted(
    bibleId: string,
    chapterId: string,
    verseNumber: string
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        return false;
      }

      const { data, error } = await supabase
        .from('verse_highlights')
        .select('id')
        .eq('user_id', user.id)
        .eq('bible_id', bibleId)
        .eq('chapter_id', chapterId)
        .eq('verse_number', verseNumber)
        .maybeSingle();

      if (error) {
        console.error('Error checking highlight:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking highlight:', error);
      return false;
    }
  }
}

export const verseHighlightService = new VerseHighlightService();
