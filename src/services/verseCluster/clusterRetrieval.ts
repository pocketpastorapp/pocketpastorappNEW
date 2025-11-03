
import { supabase } from '@/integrations/supabase/client';
import { VerseCluster } from './types';

export class ClusterRetrievalService {
  async getAllUserClusters(): Promise<VerseCluster[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data: clusters, error: clustersError } = await supabase
        .from('verse_clusters')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });

      if (clustersError || !clusters || clusters.length === 0) {
        return [];
      }

      // Now fetch the verses for each cluster
      const clustersWithVerses = await Promise.all(
        clusters.map(async (cluster) => {
          const { data: verses, error: versesError } = await supabase
            .from('cluster_verses')
            .select('*')
            .eq('cluster_id', cluster.id)
            .order('created_at', { ascending: true });

          if (versesError) {
            return {
              ...cluster,
              verses: []
            };
          }

          return {
            ...cluster,
            verses: verses || []
          };
        })
      );

      return clustersWithVerses;
    } catch (error) {
      return [];
    }
  }

  async getChapterClusters(
    bibleId: string,
    chapterId: string
  ): Promise<VerseCluster[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data: clusters, error: clustersError } = await supabase
        .from('verse_clusters')
        .select(`
          *,
          cluster_verses (*)
        `)
        .eq('user_id', user.id)
        .eq('bible_id', bibleId)
        .eq('chapter_id', chapterId)
        .order('sort_order', { ascending: true, nullsFirst: false });

      if (clustersError) {
        return [];
      }

      return clusters?.map(cluster => ({
        ...cluster,
        verses: cluster.cluster_verses || []
      })) || [];
    } catch (error) {
      return [];
    }
  }

  async getClusterVerseNumbers(
    bibleId: string,
    chapterId: string
  ): Promise<Set<string>> {
    try {
      const clusters = await this.getChapterClusters(bibleId, chapterId);
      const verseNumbers = new Set<string>();
      
      clusters.forEach(cluster => {
        cluster.verses.forEach(verse => {
          verseNumbers.add(verse.verse_number);
        });
      });

      return verseNumbers;
    } catch (error) {
      return new Set();
    }
  }
}

export const clusterRetrievalService = new ClusterRetrievalService();
