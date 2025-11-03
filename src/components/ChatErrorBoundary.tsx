
import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatErrorBoundaryProps {
  children: ReactNode;
}

const ChatErrorFallback = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-background border border-destructive/20 rounded-lg mx-4">
    <MessageSquare className="h-10 w-10 text-destructive mb-4" />
    <h3 className="text-lg font-semibold mb-2">Chat Error</h3>
    <p className="text-sm text-muted-foreground text-center mb-4">
      There was an issue with the chat interface. Please refresh to continue your conversation.
    </p>
    <Button onClick={() => window.location.reload()} size="sm">
      <RefreshCw className="h-4 w-4 mr-2" />
      Refresh Chat
    </Button>
  </div>
);

const ChatErrorBoundary = ({ children }: ChatErrorBoundaryProps) => {
  return (
    <ErrorBoundary fallback={<ChatErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
};

export default ChatErrorBoundary;
