
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cacheBibleBook } from '@/utils/offlineUtils';
import { toast } from 'sonner';
import { useState } from 'react';

interface OfflineIndicatorProps {
  context?: 'bible' | 'chat' | 'general';
  currentBibleBook?: string;
  showCacheOption?: boolean;
}

export const OfflineIndicator = ({ 
  context = 'general', 
  currentBibleBook,
  showCacheOption = false 
}: OfflineIndicatorProps) => {
  const { isOnline, isLoading, cachedBibleBooks } = useOfflineStatus();
  const [isCaching, setIsCaching] = useState(false);

  const handleCacheBibleBook = async () => {
    if (!currentBibleBook) return;
    
    setIsCaching(true);
    try {
      const success = await cacheBibleBook(currentBibleBook);
      if (success) {
        toast.success('Bible book cached for offline reading', {
          duration: 3000
        });
      } else {
        toast.error('Failed to cache Bible book', {
          duration: 3000
        });
      }
    } catch (error) {
      toast.error('Error caching Bible book', {
        duration: 3000
      });
    } finally {
      setIsCaching(false);
    }
  };

  if (isLoading) {
    return null;
  }

  const getContextMessage = () => {
    if (isOnline) {
      return 'Connected - All features available';
    }

    switch (context) {
      case 'bible':
        const isCached = currentBibleBook && cachedBibleBooks.some(book => 
          book.includes(currentBibleBook)
        );
        return isCached 
          ? 'Offline - This Bible book is available for reading'
          : 'Offline - This Bible book is not cached';
      case 'chat':
        return 'Offline - Chat features require internet connection';
      default:
        return 'Offline - Some features may be limited';
    }
  };

  const getVariant = () => {
    if (isOnline) return 'default';
    if (context === 'bible' && currentBibleBook && 
        cachedBibleBooks.some(book => book.includes(currentBibleBook))) {
      return 'default';
    }
    return 'destructive';
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isOnline ? (
            <Wifi className="h-4 w-4 mr-2" aria-hidden="true" />
          ) : (
            <WifiOff className="h-4 w-4 mr-2" aria-hidden="true" />
          )}
          <AlertDescription>
            {getContextMessage()}
          </AlertDescription>
        </div>
        
        {!isOnline && showCacheOption && currentBibleBook && 
         !cachedBibleBooks.some(book => book.includes(currentBibleBook)) && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleCacheBibleBook}
            disabled={isCaching}
            aria-label={`Cache ${currentBibleBook} for offline reading`}
          >
            <Download className="h-3 w-3 mr-1" aria-hidden="true" />
            {isCaching ? 'Caching...' : 'Cache'}
          </Button>
        )}
      </div>
    </Alert>
  );
};
