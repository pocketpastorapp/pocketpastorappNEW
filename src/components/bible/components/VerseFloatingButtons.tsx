
import React from 'react';
import { Button } from '@/components/ui/button';
import { Highlighter, Heart, MessageCircle, Copy, X, Eraser, HeartOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VerseFloatingButtonsProps {
  selectedText: string;
  reference: string;
  position: { top: number; left: number };
  onCancel: () => void;
  onHighlight: () => void;
  onAddToFavorites?: (text: string, reference: string) => Promise<void> | void;
  onAskAI?: (text: string, reference: string) => void;
  isHighlighted?: boolean;
  selectedCount?: number;
  isFavorited?: boolean;
}

const VerseFloatingButtons = ({
  selectedText,
  reference,
  position,
  onCancel,
  onHighlight,
  onAddToFavorites,
  onAskAI,
  isHighlighted = false,
  selectedCount = 1,
  isFavorited = false
}: VerseFloatingButtonsProps) => {
  const navigate = useNavigate();

  const handleAddToFavorites = async () => {
    if (selectedText && onAddToFavorites) {
      try {
        await onAddToFavorites(selectedText, reference);
        onCancel();
      } catch (error) {
        console.error('Error with favorites:', error);
      }
    }
  };

  const handleAskAI = () => {
    if (selectedText) {
      // Navigate to chat with selected verses as initial message
      const verseText = selectedCount > 1 
        ? `"${selectedText}" - ${reference} (${selectedCount} verses selected)`
        : `"${selectedText}" - ${reference}`;
      
      // Store the verse text in sessionStorage to be picked up by chat page
      sessionStorage.setItem('chatInitialMessage', verseText);
      navigate('/chat');
      onCancel();
    }
  };

  const handleCopy = async () => {
    if (selectedText) {
      try {
        const textToCopy = selectedCount > 1 
          ? `"${selectedText}" - ${reference} (${selectedCount} verses selected)`
          : `"${selectedText}" - ${reference}`;
        await navigator.clipboard.writeText(textToCopy);
        onCancel();
      } catch (error) {
        console.error('Failed to copy verse:', error);
      }
    }
  };

  const handleHighlight = () => {
    onHighlight();
    onCancel();
  };

  return (
    <div 
      className="absolute z-50 flex items-center gap-2 rounded-lg shadow-lg border p-2 bg-background border-border"
      style={{
        top: position.top,
        left: Math.min(position.left, window.innerWidth - 320),
      }}
    >
      {selectedCount > 1 && (
        <span className="text-xs text-muted-foreground px-2">
          {selectedCount} verses
        </span>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="p-2 hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleHighlight}
        className="p-2 hover:bg-muted"
      >
        {isHighlighted ? <Eraser className="h-4 w-4" /> : <Highlighter className="h-4 w-4" />}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddToFavorites}
        className="p-2 hover:bg-muted"
      >
        {isFavorited ? <HeartOff className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAskAI}
        className="p-2 hover:bg-muted"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="p-2 hover:bg-muted"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default VerseFloatingButtons;
