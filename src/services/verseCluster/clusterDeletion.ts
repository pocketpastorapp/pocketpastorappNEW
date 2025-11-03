
import { supabase } from '@/integrations/supabase/client';

export class ClusterDeletionService {
  async deleteCluster(clusterId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('verse_clusters')
        .delete()
        .eq('id', clusterId);

      if (error) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async removeVerseFromCluster(
    bibleId: string,
    chapterId: string,
    verseNumber: string
  ): Promise<{ success: boolean; clusterDeleted?: boolean }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false };
      }

      // Find the cluster containing this verse
      const { data: clusters, error: clustersError } = await supabase
        .from('verse_clusters')
        .select(`
          id,
          cluster_verses (
            id,
            verse_number
          )
        `)
        .eq('user_id', user.id)
        .eq('bible_id', bibleId)
        .eq('chapter_id', chapterId);

      if (clustersError) {
        return { success: false };
      }

      const targetCluster = clusters?.find(cluster =>
        cluster.cluster_verses.some(verse => verse.verse_number === verseNumber)
      );

      if (!targetCluster) {
        return { success: false };
      }

      const verseToRemove = targetCluster.cluster_verses.find(
        verse => verse.verse_number === verseNumber
      );

      if (!verseToRemove) {
        return { success: false };
      }

      // Remove the verse from the cluster
      const { error: removeError } = await supabase
        .from('cluster_verses')
        .delete()
        .eq('id', verseToRemove.id);

      if (removeError) {
        return { success: false };
      }

      // Check if the cluster is now empty and delete it if so
      const remainingVerses = targetCluster.cluster_verses.filter(
        verse => verse.id !== verseToRemove.id
      );

      if (remainingVerses.length === 0) {
        const { error: deleteClusterError } = await supabase
          .from('verse_clusters')
          .delete()
          .eq('id', targetCluster.id);

        if (deleteClusterError) {
          return { success: false };
        }

        return { success: true, clusterDeleted: true };
      }

      return { success: true, clusterDeleted: false };
    } catch (error) {
      return { success: false };
    }
  }

  async removeMultipleVersesFromClusters(
    bibleId: string,
    chapterId: string,
    verseNumbers: string[]
  ): Promise<boolean> {
    try {
      const results = await Promise.all(
        verseNumbers.map(verseNumber =>
          this.removeVerseFromCluster(bibleId, chapterId, verseNumber)
        )
      );

      return results.every(result => result.success);
    } catch (error) {
      return false;
    }
  }
}

export const clusterDeletionService = new ClusterDeletionService();
