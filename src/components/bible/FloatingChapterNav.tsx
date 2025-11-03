
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingChapterNavProps {
  isVisible: boolean;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
}

const FloatingChapterNav = ({
  isVisible,
  onPrevChapter,
  onNextChapter,
  canNavigatePrev,
  canNavigateNext
}: FloatingChapterNavProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg px-4 py-2 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevChapter}
          disabled={!canNavigatePrev}
          className="flex items-center gap-2 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="w-px h-6 bg-border" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextChapter}
          disabled={!canNavigateNext}
          className="flex items-center gap-2 rounded-full"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FloatingChapterNav;
