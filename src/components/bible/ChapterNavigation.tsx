
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BibleChapter } from '@/services/bibleService';

interface ChapterNavigationProps {
  chapters: BibleChapter[];
  selectedChapter: string;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const ChapterNavigation = ({ chapters, selectedChapter, onNavigate }: ChapterNavigationProps) => {
  const currentIndex = chapters.findIndex(c => c.id === selectedChapter);
  
  if (!selectedChapter || currentIndex === -1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between pt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate('prev')}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate('next')}
        disabled={currentIndex === chapters.length - 1}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChapterNavigation;
