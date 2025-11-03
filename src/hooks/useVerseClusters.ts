
import { useState, useEffect, useCallback } from 'react';
import { verseClusterService, VerseCluster } from '@/services/verseClusterService';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';

export const useVerseClusters = (bibleId: string, chapterId: string) => {
  const { user } = useAuth();
  const [clusters, setClusters] = useState<VerseCluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clusterVerseNumbers, setClusterVerseNumbers] = useState<Set<string>>(new Set());
  const [isReordering, setIsReordering] = useState(false);

  const loadClusters = useCallback(async () => {
    if (!user) {
      setClusters([]);
      setClusterVerseNumbers(new Set());
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('useVerseClusters: loadClusters called with:', { bibleId, chapterId });
      
      // If both bibleId and chapterId are empty or falsy, load all clusters for the user
      if (!bibleId && !chapterId) {
        console.log('useVerseClusters: Loading all user clusters');
        const allClusters = await verseClusterService.getAllUserClusters();
        console.log('useVerseClusters: Received all clusters:', allClusters);
        setClusters(allClusters);
        setClusterVerseNumbers(new Set()); // Don't set verse numbers for all clusters view
      } else if (bibleId && chapterId) {
        console.log('useVerseClusters: Loading chapter-specific clusters');
        // Load clusters for specific chapter
        const [clustersData, verseNumbers] = await Promise.all([
          verseClusterService.getChapterClusters(bibleId, chapterId),
          verseClusterService.getClusterVerseNumbers(bibleId, chapterId)
        ]);
        
        console.log('useVerseClusters: Received chapter clusters:', clustersData);
        setClusters(clustersData);
        setClusterVerseNumbers(verseNumbers);
      } else {
        console.log('useVerseClusters: Invalid combination, clearing clusters');
        // Invalid combination
        setClusters([]);
        setClusterVerseNumbers(new Set());
      }
    } catch (error) {
      console.error('useVerseClusters: Error loading clusters:', error);
      toast.error('Failed to load verse clusters');
    } finally {
      setIsLoading(false);
    }
  }, [user, bibleId, chapterId]);

  useEffect(() => {
    loadClusters();
  }, [loadClusters]);

  const createCluster = async (
    reference: string,
    verses: Array<{
      verseNumber: string;
      verseText: string;
      verseReference: string;
    }>,
    clusterName?: string
  ) => {
    if (!user) {
      return false;
    }

    try {
      const cluster = await verseClusterService.createVerseCluster(
        bibleId,
        chapterId,
        reference,
        verses,
        clusterName
      );

      if (cluster) {
        setClusters(prev => [cluster, ...prev]);
        
        // Update cluster verse numbers
        const newVerseNumbers = new Set(clusterVerseNumbers);
        verses.forEach(verse => newVerseNumbers.add(verse.verseNumber));
        setClusterVerseNumbers(newVerseNumbers);
        
        // Force refresh to get the latest data
        console.log('useVerseClusters: Forcing refresh after cluster creation');
        await loadClusters();
        
        return true;
      }
    } catch (error) {
      console.error('Error creating cluster:', error);
    }
    return false;
  };

  const deleteCluster = async (clusterId: string) => {
    try {
      const success = await verseClusterService.deleteCluster(clusterId);
      
      if (success) {
        const deletedCluster = clusters.find(c => c.id === clusterId);
        setClusters(prev => prev.filter(c => c.id !== clusterId));
        
        // Update cluster verse numbers
        if (deletedCluster) {
          const newVerseNumbers = new Set(clusterVerseNumbers);
          deletedCluster.verses.forEach(verse => {
            // Only remove if no other cluster contains this verse
            const isInOtherCluster = clusters.some(cluster => 
              cluster.id !== clusterId && 
              cluster.verses.some(v => v.verse_number === verse.verse_number)
            );
            if (!isInOtherCluster) {
              newVerseNumbers.delete(verse.verse_number);
            }
          });
          setClusterVerseNumbers(newVerseNumbers);
        }
        
        toast.success('Verse cluster removed');
        return true;
      }
    } catch (error) {
      console.error('Error deleting cluster:', error);
      toast.error('Failed to remove verse cluster');
    }
    return false;
  };

  const unfavoriteVerses = async (verseNumbers: string[]): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const success = await verseClusterService.removeMultipleVersesFromClusters(
        bibleId,
        chapterId,
        verseNumbers
      );

      if (success) {
        // Reload clusters to get updated state
        await loadClusters();
        return true;
      }
    } catch (error) {
      console.error('Error unfavoriting verses:', error);
    }
    return false;
  };

  const isVerseInCluster = (verseNumber: string): boolean => {
    return clusterVerseNumbers.has(verseNumber);
  };

  const reorderClusters = async (orderedIds: string[]) => {
    if (!user) return false;
    try {
      setIsReordering(true);
      const orderPayload = orderedIds.map((id, index) => ({ id, sort_order: index + 1 }));
      const success = await verseClusterService.updateClusterOrder(orderPayload as any);
      if (success) {
        const map = new Map(clusters.map(c => [c.id, c] as const));
        const newOrder = orderedIds.map(id => map.get(id)!).filter(Boolean);
        setClusters(newOrder);
        return true;
      }
    } catch (error) {
      console.error('useVerseClusters: Error reordering clusters', error);
    } finally {
      setIsReordering(false);
    }
    return false;
  };

  return {
    clusters,
    isLoading,
    createCluster,
    deleteCluster,
    unfavoriteVerses,
    isVerseInCluster,
    clusterVerseNumbers,
    loadClusters,
    reorderClusters,
    isReordering
  };
};
