
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Ellipsis, Trash2 } from 'lucide-react';
import { VerseCluster } from '@/services/verseClusterService';
import { useTheme } from '@/components/theme-provider';

interface VerseClusterCardProps {
  cluster: VerseCluster;
  onRemove: (id: string, event: React.MouseEvent) => void;
}

export const VerseClusterCard = ({ cluster, onRemove }: VerseClusterCardProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleClusterClick = (cluster: VerseCluster) => {
    try {
      // Extract just the chapter reference (without verse numbers)
      const chapterReference = cluster.reference.split(':')[0];
      
      // Navigate to the Bible read page with the cluster's chapter
      const params = new URLSearchParams();
      params.set('bibleId', cluster.bible_id);
      params.set('chapterId', cluster.chapter_id);
      params.set('reference', chapterReference);
      
      // Add favorite verse highlight parameter with all verse numbers from the cluster
      if (cluster.verses.length > 0) {
        const verseNumbers = cluster.verses.map(v => v.verse_number).join(',');
        params.set('highlightFavorite', verseNumbers);
      }
      
      navigate(`/bible/read?${params.toString()}`);
    } catch (error) {
      console.error("Error navigating to cluster:", error);
    }
  };

  const getVerseRange = (cluster: VerseCluster) => {
    try {
      const verseNumbers = cluster.verses.map(v => parseInt(v.verse_number)).sort((a, b) => a - b);
      if (verseNumbers.length === 1) {
        return `v${verseNumbers[0]}`;
      }
      const first = verseNumbers[0];
      const last = verseNumbers[verseNumbers.length - 1];
      return `v${first}-${last}`;
    } catch (error) {
      console.error("Error getting verse range:", error);
      return "v?";
    }
  };

  return (
    <div
      className="group relative p-3 border rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer touch-pan-y"
      onClick={() => handleClusterClick(cluster)}
    >
      {/* Reference with verse count */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-medium">
            {cluster.reference.split(':')[0]}
          </Badge>
          {cluster.verses.length > 0 && (
            <>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                {getVerseRange(cluster)}
              </Badge>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                {cluster.verses.length}
              </Badge>
            </>
          )}
        </div>
        
        {/* 3 dots dropdown menu - always visible */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Ellipsis className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end"
            style={theme === "dark" ? { backgroundColor: '#1E1E1E' } : undefined}
          >
            <DropdownMenuItem
              onClick={(e) => onRemove(cluster.id, e)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cluster name if provided */}
      {cluster.cluster_name && (
        <div className="text-sm font-medium mb-3 text-primary">
          {cluster.cluster_name}
        </div>
      )}

      {/* Individual verses display - showing full text without truncation */}
      {cluster.verses.length > 0 ? (
        <div className="space-y-2">
          {cluster.verses.map((verse) => (
            <div key={verse.id} className="text-sm leading-relaxed">
              <span className="whitespace-pre-line">{verse.verse_text}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground italic">
          No verse content available
        </div>
      )}
    </div>
  );
};
