
import { supabase } from '@/integrations/supabase/client';
import { VerseCluster, CreateVerseData } from './types';

export class ClusterCreationService {
  async createVerseCluster(
    bibleId: string,
    chapterId: string,
    reference: string,
    verses: CreateVerseData[],
    clusterName?: string
  ): Promise<VerseCluster | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      // Create the cluster
      const { data: cluster, error: clusterError } = await supabase
        .from('verse_clusters')
        .insert({
          user_id: user.id,
          bible_id: bibleId,
          chapter_id: chapterId,
          reference: reference,
          cluster_name: clusterName
        })
        .select()
        .single();

      if (clusterError || !cluster) {
        return null;
      }

      // Add verses to the cluster
      const versesToInsert = verses.map(verse => ({
        cluster_id: cluster.id,
        verse_number: verse.verseNumber,
        verse_text: verse.verseText,
        verse_reference: verse.verseReference
      }));

      const { data: clusterVerses, error: versesError } = await supabase
        .from('cluster_verses')
        .insert(versesToInsert)
        .select();

      if (versesError) {
        // Clean up the cluster if verse insertion failed
        await supabase.from('verse_clusters').delete().eq('id', cluster.id);
        return null;
      }

      return {
        ...cluster,
        verses: clusterVerses || []
      };
    } catch (error) {
      return null;
    }
  }
}

export const clusterCreationService = new ClusterCreationService();
