
import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Book, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BibleErrorBoundaryProps {
  children: ReactNode;
}

const BibleErrorFallback = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-background border border-destructive/20 rounded-lg mx-4">
    <Book className="h-10 w-10 text-destructive mb-4" />
    <h3 className="text-lg font-semibold mb-2">Bible Reader Error</h3>
    <p className="text-sm text-muted-foreground text-center mb-4">
      There was an issue loading the Bible content. Please try refreshing or selecting a different chapter.
    </p>
    <Button onClick={() => window.location.reload()} size="sm">
      <RefreshCw className="h-4 w-4 mr-2" />
      Refresh Bible
    </Button>
  </div>
);

const BibleErrorBoundary = ({ children }: BibleErrorBoundaryProps) => {
  return (
    <ErrorBoundary fallback={<BibleErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
};

export default BibleErrorBoundary;
