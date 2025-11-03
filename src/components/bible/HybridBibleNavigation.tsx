
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useHybridBibleNavigation } from '@/hooks/useHybridBibleNavigation';
import { useBibleSelectionSync } from '@/hooks/useBibleSelectionSync';
import BibleLanguageSelector from './BibleLanguageSelector';
import BibleVersionSelector from './BibleVersionSelector';
import BibleBookSelector from './BibleBookSelector';
import BibleChapterSelector from './BibleChapterSelector';
import BibleNavigationButtons from './BibleNavigationButtons';
import BibleNavigationError from './BibleNavigationError';

interface HybridBibleNavigationProps {
  onChapterSelect: (bibleId: string, chapterId: string, reference: string) => void;
  onReadButtonClick?: (bibleId: string, chapterId: string, reference: string) => void;
  className?: string;
  currentSelection?: {
    bibleId: string;
    chapterId: string;
    reference: string;
  } | null;
}

const HybridBibleNavigation = ({ 
  onChapterSelect, 
  onReadButtonClick,
  className = '', 
  currentSelection 
}: HybridBibleNavigationProps) => {
  const navigation = useHybridBibleNavigation({ onChapterSelect, currentSelection });

  // Sync current selection with navigation state
  useBibleSelectionSync({
    currentSelection,
    selectedVersion: navigation.selectedVersion,
    selectedBook: navigation.selectedBook,
    selectedChapter: navigation.selectedChapter,
    setSelectedVersion: navigation.handleVersionChange,
    setSelectedBook: navigation.handleBookChange,
    setSelectedChapter: navigation.handleChapterSelect,
    userInitiatedChange: navigation.userInitiatedChange
  });

  // Override the handleReadClick if onReadButtonClick is provided
  const handleReadClick = onReadButtonClick ? () => {
    if (navigation.selectedChapter && navigation.selectedVersion) {
      const chapter = navigation.chapters.find(c => c.id === navigation.selectedChapter);
      if (chapter) {
        onReadButtonClick(navigation.selectedVersion, navigation.selectedChapter, chapter.reference);
      }
    }
  } : navigation.handleReadClick;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Bible Navigation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BibleNavigationError error={navigation.error} />

        <BibleLanguageSelector
          languages={navigation.languages}
          selectedLanguage={navigation.selectedLanguage}
          onLanguageChange={navigation.handleLanguageChange}
          isLoading={navigation.isLoading}
        />

        <BibleVersionSelector
          versions={navigation.versions}
          selectedVersion={navigation.selectedVersion}
          onVersionChange={navigation.handleVersionChange}
          isLoading={navigation.isLoading}
        />

        <BibleBookSelector
          books={navigation.books}
          selectedBook={navigation.selectedBook}
          onBookChange={navigation.handleBookChange}
          isLoading={navigation.isLoading}
          selectedVersion={navigation.selectedVersion}
        />

        <BibleChapterSelector
          chapters={navigation.chapters}
          selectedChapter={navigation.selectedChapter}
          onChapterChange={navigation.handleChapterSelect}
          isLoading={navigation.isLoading}
          selectedBook={navigation.selectedBook}
        />

        <BibleNavigationButtons
          selectedChapter={navigation.selectedChapter}
          chapters={navigation.chapters}
          onNavigateChapter={navigation.navigateChapter}
          onReadClick={handleReadClick}
          canNavigatePrev={navigation.canNavigatePrev}
          canNavigateNext={navigation.canNavigateNext}
        />
      </CardContent>
    </Card>
  );
};

export default HybridBibleNavigation;
