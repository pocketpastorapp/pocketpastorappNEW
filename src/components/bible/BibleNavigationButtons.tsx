
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface BibleNavigationButtonsProps {
  selectedChapter: string;
  chapters: any[];
  onNavigateChapter: (direction: 'prev' | 'next') => void;
  onReadClick: () => void;
  canNavigatePrev: () => boolean;
  canNavigateNext: () => boolean;
}

const BibleNavigationButtons = ({
  selectedChapter,
  chapters,
  onNavigateChapter,
  onReadClick,
  canNavigatePrev,
  canNavigateNext
}: BibleNavigationButtonsProps) => {
  if (!selectedChapter || chapters.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 pt-4">
      <Button
        variant="outline"
        onClick={() => onNavigateChapter('prev')}
        disabled={!canNavigatePrev()}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      <Button
        variant="navy"
        onClick={onReadClick}
        className="flex items-center gap-2"
      >
        <BookOpen className="h-4 w-4" />
        Read
      </Button>
      
      <Button
        variant="outline"
        onClick={() => onNavigateChapter('next')}
        disabled={!canNavigateNext()}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BibleNavigationButtons;
