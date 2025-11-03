
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Pause, Play, RotateCcw, Copy } from "lucide-react";
import { toast } from "sonner";

interface MessageControlsProps {
  sender: "user" | "bot";
  content: string;
  id: string;
  isFavorite?: boolean;
  isCurrentlySpeaking: boolean;
  isPaused?: boolean;
  onSpeak: (text: string) => void;
  onFavorite: (id: string) => void;
  onPause?: () => void;
  onResume?: () => void;
  onRestart?: () => void;
  visible: boolean;
}

const MessageControls = ({
  sender,
  content,
  id,
  isFavorite,
  isCurrentlySpeaking,
  isPaused = false,
  onSpeak,
  onFavorite,
  onPause,
  onResume,
  onRestart,
  visible
}: MessageControlsProps) => {
  
  // Handle copy text to clipboard
  const handleCopyText = () => {
    navigator.clipboard.writeText(content)
      .then(() => {
        toast.success("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy text");
      });
  };
  
  // Only show controls for bot messages
  if (sender !== "bot") {
    return null;
  }
  
  return (
    <>
      {isCurrentlySpeaking ? (
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 rounded-full p-0" 
          onClick={onPause}
          title="Pause speech"
        >
          <Pause className="h-4 w-4" />
        </Button>
      ) : (
        <>
          {isPaused ? (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 rounded-full p-0" 
              onClick={onResume}
              title="Resume speech"
            >
              <Play className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 rounded-full p-0" 
              onClick={() => onSpeak(content)}
              title="Listen to message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </Button>
          )}
        </>
      )}
      
      {isCurrentlySpeaking && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 rounded-full p-0" 
          onClick={onRestart}
          title="Play from beginning"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
      
      <Button 
        size="sm" 
        variant="ghost" 
        className="h-8 w-8 rounded-full p-0" 
        onClick={handleCopyText}
        title="Copy text"
      >
        <Copy className="h-4 w-4" />
      </Button>
      
      <Button 
        size="sm" 
        variant="ghost" 
        className={`h-8 w-8 rounded-full p-0 ${isFavorite ? "text-pastor-orange" : ""}`} 
        onClick={() => onFavorite(id)}
        title="Save to favorites"
      >
        <Heart className="h-4 w-4" />
      </Button>
    </>
  );
};

export default MessageControls;
