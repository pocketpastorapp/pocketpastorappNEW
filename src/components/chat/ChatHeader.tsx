
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, PlusCircle } from "lucide-react";

interface ChatHeaderProps {
  error?: string | null;
  onStartNewSession: () => void;
}

const ChatHeader = ({ error, onStartNewSession }: ChatHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Chat with Pocket Pastor</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onStartNewSession}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Chat</span>
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ChatHeader;
