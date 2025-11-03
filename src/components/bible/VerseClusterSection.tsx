
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { useVerseClusters } from '@/hooks/useVerseClusters';
import ErrorBoundary from '@/components/ErrorBoundary';
import { VerseClusterList } from './VerseClusterList';
import { VerseClusterEmpty } from './VerseClusterEmpty';
import { VerseClusterLoading } from './VerseClusterLoading';

interface VerseClusterSectionProps {
  className?: string;
}

const VerseClusterSectionContent = ({ className = '' }: VerseClusterSectionProps) => {
  // We'll show clusters from all chapters, so we use empty values and load all clusters
  const { clusters, isLoading, deleteCluster, reorderClusters, isReordering } = useVerseClusters('', '');

  const handleRemoveCluster = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteCluster(id);
  };

  const handleReorder = async (orderedIds: string[]) => {
    await reorderClusters(orderedIds);
  };

  if (isLoading) {
    return <VerseClusterLoading className={className} />;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Favorite Verses
          </div>
          <Badge variant="secondary" className="text-xs">
            {clusters?.length || 0}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!clusters || clusters.length === 0 ? (
          <VerseClusterEmpty />
        ) : (
          <VerseClusterList 
            clusters={clusters} 
            onRemoveCluster={handleRemoveCluster}
            onReorder={handleReorder}
            isReordering={isReordering}
          />
        )}
      </CardContent>
    </Card>
  );
};

const VerseClusterSection = ({ className = '' }: VerseClusterSectionProps) => {
  return (
    <ErrorBoundary>
      <VerseClusterSectionContent className={className} />
    </ErrorBoundary>
  );
};

export default VerseClusterSection;
