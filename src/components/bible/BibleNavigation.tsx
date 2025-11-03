
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { BookOpen, AlertCircle, Book } from 'lucide-react';
import { useHybridBibleLanguages } from '@/hooks/useHybridBibleLanguages';
import { useHybridBibleVersions } from '@/hooks/useHybridBibleVersions';
import { useHybridBibleBooks } from '@/hooks/useHybridBibleBooks';
import { useHybridBibleChapters } from '@/hooks/useHybridBibleChapters';
import BibleLanguageSelector from './BibleLanguageSelector';
import BibleVersionSelector from './BibleVersionSelector';
import BibleBookSelector from './BibleBookSelector';
import BibleChapterSelector from './BibleChapterSelector';
import ChapterNavigation from './ChapterNavigation';

interface BibleNavigationProps {
  onChapterSelect: (bibleId: string, chapterId: string, reference: string) => void;
  className?: string;
}

const BibleNavigation = ({ onChapterSelect, className = '' }: BibleNavigationProps) => {
  const navigate = useNavigate();
  const { languages, selectedLanguage, setSelectedLanguage, isLoading: languagesLoading, error: languagesError } = useHybridBibleLanguages();
  const { versions, selectedVersion, setSelectedVersion, isLoading: versionsLoading, error: versionsError } = useHybridBibleVersions(selectedLanguage);
  const { books, selectedBook, setSelectedBook, isLoading: booksLoading, error: booksError } = useHybridBibleBooks(selectedVersion);
  const { chapters, selectedChapter, setSelectedChapter, isLoading: chaptersLoading, error: chaptersError } = useHybridBibleChapters(selectedVersion, selectedBook);

  const isLoading = languagesLoading || versionsLoading || booksLoading || chaptersLoading;
  const error = languagesError || versionsError || booksError || chaptersError;

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId);
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter && selectedVersion) {
      onChapterSelect(selectedVersion, chapterId, chapter.reference);
    }
  };

  const handleLanguageChange = (languageId: string) => {
    setSelectedLanguage(languageId);
    setSelectedVersion('');
    setSelectedBook('');
    setSelectedChapter('');
  };

  const handleVersionChange = (versionId: string) => {
    setSelectedVersion(versionId);
    setSelectedBook('');
    setSelectedChapter('');
  };

  const handleBookChange = (bookId: string) => {
    setSelectedBook(bookId);
    setSelectedChapter('');
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    const currentIndex = chapters.findIndex(c => c.id === selectedChapter);
    if (currentIndex === -1) return;

    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < chapters.length) {
      handleChapterSelect(chapters[newIndex].id);
    }
  };

  const handleReadChapter = () => {
    if (selectedChapter && selectedVersion) {
      const chapter = chapters.find(c => c.id === selectedChapter);
      if (chapter) {
        const params = new URLSearchParams();
        params.set('bibleId', selectedVersion);
        params.set('chapterId', selectedChapter);
        params.set('reference', chapter.reference);
        navigate(`/bible/read?${params.toString()}`);
      }
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Bible Navigation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Language Selector */}
        <BibleLanguageSelector
          languages={languages}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          isLoading={isLoading}
        />

        {/* Bible Version Selector */}
        <BibleVersionSelector
          versions={versions}
          selectedVersion={selectedVersion}
          onVersionChange={handleVersionChange}
          isLoading={isLoading}
        />

        {/* Book Selector */}
        <BibleBookSelector
          books={books}
          selectedBook={selectedBook}
          onBookChange={handleBookChange}
          isLoading={isLoading}
          selectedVersion={selectedVersion}
        />

        {/* Chapter Selector */}
        <BibleChapterSelector
          chapters={chapters}
          selectedChapter={selectedChapter}
          onChapterChange={handleChapterSelect}
          isLoading={isLoading}
          selectedBook={selectedBook}
        />

        {/* Enhanced Chapter Navigation with Read Button */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => navigateChapter('prev')}
            disabled={!selectedChapter || chapters.findIndex(c => c.id === selectedChapter) === 0}
            className="flex-1"
          >
            Previous
          </Button>
          
          <Button
            variant="default"
            onClick={handleReadChapter}
            disabled={!selectedChapter}
            className="mx-2 flex-1 bg-[#184482] hover:bg-[#184482]/90"
          >
            <Book className="h-4 w-4 mr-2" />
            Read
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigateChapter('next')}
            disabled={!selectedChapter || chapters.findIndex(c => c.id === selectedChapter) === chapters.length - 1}
            className="flex-1"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BibleNavigation;
