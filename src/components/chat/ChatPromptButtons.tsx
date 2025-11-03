
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, BookOpen, Heart, Edit3 } from 'lucide-react';

interface ChatPromptButtonsProps {
  onPromptSelect: (prompt: string) => void;
}

const ChatPromptButtons = ({ onPromptSelect }: ChatPromptButtonsProps) => {
  const prompts = [
    {
      id: 'explain',
      text: 'Explain the meaning of these verses.',
      icon: MessageSquare,
      label: 'Explain meaning'
    },
    {
      id: 'similar',
      text: 'Give me similar verses.',
      icon: BookOpen,
      label: 'Similar verses'
    },
    {
      id: 'apply',
      text: 'How can I apply this to my life?',
      icon: Heart,
      label: 'How to apply'
    },
    {
      id: 'other',
      text: '',
      icon: Edit3,
      label: 'Other...'
    }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
      {prompts.map((prompt) => {
        const Icon = prompt.icon;
        return (
          <Button
            key={prompt.id}
            variant="outline"
            size="sm"
            onClick={() => onPromptSelect(prompt.text)}
            className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <Icon className="h-4 w-4" />
            {prompt.label}
          </Button>
        );
      })}
    </div>
  );
};

export default ChatPromptButtons;
