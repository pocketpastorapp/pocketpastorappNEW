
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, BookOpen, Heart, Edit3 } from 'lucide-react';

interface VersePromptButtonsProps {
  verseText: string;
  onPromptSelect: (prompt: string) => void;
  onDismiss: () => void;
}

const VersePromptButtons = ({ verseText, onPromptSelect, onDismiss }: VersePromptButtonsProps) => {
  const handlePromptClick = (promptType: string) => {
    let prompt = '';
    
    switch (promptType) {
      case 'explain':
        prompt = `${verseText}\n\nExplain the meaning of these verses.`;
        break;
      case 'similar':
        prompt = `${verseText}\n\nGive me similar verses.`;
        break;
      case 'apply':
        prompt = `${verseText}\n\nHow can I apply this to my life?`;
        break;
      case 'other':
        prompt = `${verseText}\n\n`;
        break;
    }
    
    onPromptSelect(prompt);
  };

  return (
    <div className="mb-4 p-4 bg-muted rounded-lg border">
      <div className="mb-3">
        <p className="text-sm text-muted-foreground mb-2">Selected verses:</p>
        <p className="text-sm bg-background p-2 rounded border italic">{verseText}</p>
      </div>
      
      <div className="mb-3">
        <p className="text-sm font-medium mb-2">Choose a prompt or start typing your own:</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePromptClick('explain')}
            className="flex items-center gap-2 text-left justify-start"
          >
            <MessageSquare className="h-4 w-4" />
            Explain the meaning
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePromptClick('similar')}
            className="flex items-center gap-2 text-left justify-start"
          >
            <BookOpen className="h-4 w-4" />
            Find similar verses
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePromptClick('apply')}
            className="flex items-center gap-2 text-left justify-start"
          >
            <Heart className="h-4 w-4" />
            How to apply
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePromptClick('other')}
            className="flex items-center gap-2 text-left justify-start"
          >
            <Edit3 className="h-4 w-4" />
            Other...
          </Button>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onDismiss}
        className="text-muted-foreground"
      >
        Dismiss
      </Button>
    </div>
  );
};

export default VersePromptButtons;
