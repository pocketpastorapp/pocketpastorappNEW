
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VerseCluster } from '@/services/verseClusterService';
import { VerseClusterCard } from './VerseClusterCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface VerseClusterListProps {
  clusters: VerseCluster[];
  onRemoveCluster: (id: string, event: React.MouseEvent) => void;
  onReorder?: (orderedIds: string[]) => void;
  isReordering?: boolean;
}

export const VerseClusterList = ({ clusters, onRemoveCluster, onReorder, isReordering = false }: VerseClusterListProps) => {
  const isMobile = useIsMobile();
  const [ordered, setOrdered] = React.useState<VerseCluster[]>(clusters);
  const draggingIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    setOrdered(clusters);
  }, [clusters]);

  // Calculate dynamic height based on content and screen size
  const getScrollAreaHeight = () => {
    const maxVisibleItems = isMobile ? 2 : 5;
    const itemsToShow = Math.min(ordered.length, maxVisibleItems);
    if (itemsToShow === 0) return 'h-20';
    if (isMobile) {
      return ordered.length <= 2 ? 'h-fit' : 'h-80';
    } else {
      return ordered.length <= 5 ? 'h-fit max-h-[600px]' : 'h-96';
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    draggingIdRef.current = id;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, overId: string) => {
    e.preventDefault();
    const fromId = draggingIdRef.current;
    if (!fromId || fromId === overId) return;
    const fromIndex = ordered.findIndex(c => c.id === fromId);
    const toIndex = ordered.findIndex(c => c.id === overId);
    if (fromIndex === -1 || toIndex === -1) return;
    const updated = [...ordered];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setOrdered(updated);
  };

  const handleDrop = () => {
    if (!onReorder) return;
    const ids = ordered.map(c => c.id);
    onReorder(ids);
    draggingIdRef.current = null;
  };

  // Basic touch support for mobile long-press reordering
  const handleTouchStart = (id: string) => {
    draggingIdRef.current = id;
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!draggingIdRef.current) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
    const card = el?.closest('[data-cluster-id]') as HTMLElement | null;
    const overId = card?.getAttribute('data-cluster-id');
    if (!overId || overId === draggingIdRef.current) return;
    const fromIndex = ordered.findIndex(c => c.id === draggingIdRef.current);
    const toIndex = ordered.findIndex(c => c.id === overId);
    if (fromIndex === -1 || toIndex === -1) return;
    const updated = [...ordered];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setOrdered(updated);
    e.preventDefault();
  };
  const handleTouchEnd = () => {
    if (!onReorder) {
      draggingIdRef.current = null;
      return;
    }
    const ids = ordered.map(c => c.id);
    onReorder(ids);
    draggingIdRef.current = null;
  };

  return (
    <ScrollArea className={`${getScrollAreaHeight()} p-1`}>
      <div className="space-y-4 select-none">
        {ordered.map((cluster) => (
          <div
            key={cluster.id}
            data-cluster-id={cluster.id}
            draggable
            onDragStart={(e) => handleDragStart(e, cluster.id)}
            onDragOver={(e) => handleDragOver(e, cluster.id)}
            onDrop={handleDrop}
            onTouchStart={() => handleTouchStart(cluster.id)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            <VerseClusterCard
              cluster={cluster}
              onRemove={onRemoveCluster}
            />
          </div>
        ))}
        {isReordering && (
          <div className="text-xs text-muted-foreground px-2">Saving order...</div>
        )}
      </div>
    </ScrollArea>
  );
};
