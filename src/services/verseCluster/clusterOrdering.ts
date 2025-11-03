
import { supabase } from '@/integrations/supabase/client';

export class ClusterOrderingService {
  async updateClusterOrder(order: { id: string; sort_order: number }[]): Promise<boolean> {
    try {
      // Perform updates individually to avoid needing full row data in upsert
      const results = await Promise.all(
        order.map(({ id, sort_order }) =>
          supabase.from('verse_clusters').update({ sort_order }).eq('id', id)
        )
      );

      const hasError = results.some(r => (r as any).error);
      if (hasError) {
        console.error('updateClusterOrder error:', results);
        return false;
      }
      return true;
    } catch (e) {
      console.error('updateClusterOrder exception:', e);
      return false;
    }
  }
}

export const clusterOrderingService = new ClusterOrderingService();
