
import React from 'react';
import { BookOpen, Navigation, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import HybridBibleReader from '@/components/bible/HybridBibleReader';
import HybridBibleNavigation from '@/components/bible/HybridBibleNavigation';

interface BibleReadTabsProps {
  selectedChapter: {
    bibleId: string;
    chapterId: string;
    reference: string;
    searchHighlight?: string;
    highlightVerse?: string;
  } | null;
  onChapterSelect: (bibleId: string, chapterId: string, reference: string) => void;
  onHighlight: (text: string, reference: string) => void;
  onAddNote: (text: string, reference: string) => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const BibleReadTabs = ({
  selectedChapter,
  onChapterSelect,
  onHighlight,
  onAddNote,
  onPrevChapter,
  onNextChapter,
  canNavigatePrev,
  canNavigateNext,
  activeTab,
  onTabChange
}: BibleReadTabsProps) => {
  const isMobile = useIsMobile();

  const handleChapterSelectFromNavigation = (bibleId: string, chapterId: string, reference: string) => {
    // Only switch to read tab if user explicitly clicked the "Read" button
    // Not when just selecting different navigation options
    onChapterSelect(bibleId, chapterId, reference);
  };

  const handleReadButtonClick = (bibleId: string, chapterId: string, reference: string) => {
    // Only this function should switch to read tab
    onChapterSelect(bibleId, chapterId, reference);
    onTabChange("read");
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-2">
          {/* Previous Chapter Button */}
          <Button
            variant="outline"
            size={isMobile ? "icon" : "sm"}
            onClick={onPrevChapter}
            disabled={!canNavigatePrev}
            className="shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
            {!isMobile && <span className="ml-1">Previous</span>}
          </Button>

          {/* Tabs */}
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="read" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Read
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Navigation
            </TabsTrigger>
          </TabsList>

          {/* Next Chapter Button */}
          <Button
            variant="outline"
            size={isMobile ? "icon" : "sm"}
            onClick={onNextChapter}
            disabled={!canNavigateNext}
            className="shrink-0"
          >
            {!isMobile && <span className="mr-1">Next</span>}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TabsContent value="read" className="mt-0">
        {selectedChapter ? (
          <HybridBibleReader
            bibleId={selectedChapter.bibleId}
            chapterId={selectedChapter.chapterId}
            reference={selectedChapter.reference}
            searchHighlight={selectedChapter.searchHighlight}
            highlightVerse={selectedChapter.highlightVerse}
            onHighlight={onHighlight}
            onAddNote={onAddNote}
          />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Switch to Navigation tab to select a chapter to read</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="navigation" className="mt-0">
        <HybridBibleNavigation 
          onChapterSelect={handleChapterSelectFromNavigation}
          onReadButtonClick={handleReadButtonClick}
          currentSelection={selectedChapter}
        />
      </TabsContent>
    </Tabs>
  );
};

export default BibleReadTabs;
