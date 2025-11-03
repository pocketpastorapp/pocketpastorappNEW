
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "@/types/chat-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Volume, Trash, Copy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatMessageContent } from "@/utils/messageFormatting";
import { toast } from "sonner";
import AudioPlayer from "@/components/chat/AudioPlayer";

interface FavoriteDetailModalProps {
  message: ChatMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  // Audio player props
  audioDuration?: number;
  audioProgress?: number;
  isPaused?: boolean;
  onPause?: () => void;
  onPlay?: () => void;
  onSeek?: (time: number) => void;
  onSkipBackward?: () => void;
  onSkipForward?: () => void;
}

const FavoriteDetailModal = ({ 
  message, 
  isOpen, 
  onClose, 
  onRemove, 
  onSpeak,
  isSpeaking,
  audioDuration = 0,
  audioProgress = 0,
  isPaused = false,
  onPause = () => {},
  onPlay = () => {},
  onSeek = () => {},
  onSkipBackward = () => {},
  onSkipForward = () => {}
}: FavoriteDetailModalProps) => {
  const navigate = useNavigate();
  
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy text");
      });
  };

  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg flex flex-col max-h-[80vh] sm:rounded-[20px]">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="pr-8">
            <span className="text-sm font-normal text-muted-foreground">
              {new Date(message.timestamp).toLocaleDateString()} • {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-auto my-4">
          <div className="py-4 px-1">
            {formatMessageContent(message.content)}
          </div>
        </ScrollArea>
        
        {/* Audio Player - Show when speaking */}
        {isSpeaking && (
          <div className="border-t pt-4">
            <AudioPlayer
              isPlaying={!isPaused}
              duration={audioDuration}
              currentTime={audioProgress}
              onPause={onPause}
              onPlay={onPlay}
              onSeek={onSeek}
              onSkipBackward={onSkipBackward}
              onSkipForward={onSkipForward}
            />
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-auto pt-4 border-t">
          <Button 
            size="icon"
            variant="ghost"
            onClick={() => message && handleCopyText(message.content)}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy</span>
          </Button>
          
          <Button 
            size="icon"
            variant="ghost"
            onClick={() => message && onSpeak(message.content)}
          >
            <Volume className="h-4 w-4" />
            <span className="sr-only">Listen</span>
          </Button>
          
          <Button 
            size="icon"
            variant="ghost"
            onClick={() => message && onRemove(message.id)}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FavoriteDetailModal;
