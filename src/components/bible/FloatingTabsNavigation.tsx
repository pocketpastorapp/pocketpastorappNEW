
import React from 'react';
import { BookOpen, Navigation, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloatingTabsNavigationProps {
  isVisible: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
}

const FloatingTabsNavigation = ({
  isVisible,
  activeTab,
  onTabChange,
  onPrevChapter,
  onNextChapter,
  canNavigatePrev,
  canNavigateNext
}: FloatingTabsNavigationProps) => {
  const isMobile = useIsMobile();

  if (!isVisible) return null;

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in">
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg px-2 py-2">
        <div className="flex items-center gap-1">
          {/* Previous Chapter Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevChapter}
            disabled={!canNavigatePrev}
            className="shrink-0 h-8 w-8 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="grid grid-cols-2 bg-muted/50 rounded-full h-8">
              <TabsTrigger value="read" className="flex items-center gap-1 rounded-full h-6 px-3 text-xs">
                <BookOpen className="h-3 w-3" />
                {!isMobile && "Read"}
              </TabsTrigger>
              <TabsTrigger value="navigation" className="flex items-center gap-1 rounded-full h-6 px-3 text-xs">
                <Navigation className="h-3 w-3" />
                {!isMobile && "Navigation"}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Next Chapter Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onNextChapter}
            disabled={!canNavigateNext}
            className="shrink-0 h-8 w-8 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingTabsNavigation;
