
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessage } from "@/types/chat-types";

interface FavoriteCardProps {
  message: ChatMessage;
  onClick: () => void;
}

const FavoriteCard = ({ message, onClick }: FavoriteCardProps) => {
  // Function to truncate text to a specific character count
  const truncateText = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };
  
  return (
    <Card 
      className="cursor-pointer hover:bg-secondary/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground mb-2">
          {new Date(message.timestamp).toLocaleDateString()} • {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        <div className="line-clamp-2 text-sm">
          {truncateText(message.content)}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoriteCard;
