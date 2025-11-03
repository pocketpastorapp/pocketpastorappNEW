
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHybridBibleLanguages } from '@/hooks/useHybridBibleLanguages';
import { useHybridBibleVersions } from '@/hooks/useHybridBibleVersions';
import { useHybridBibleBooks } from '@/hooks/useHybridBibleBooks';
import { useHybridBibleChapters } from '@/hooks/useHybridBibleChapters';
import { hybridBibleService } from '@/services/hybridBibleService';

interface UseHybridBibleNavigationProps {
  onChapterSelect: (bibleId: string, chapterId: string, reference: string) => void;
  currentSelection?: {
    bibleId: string;
    chapterId: string;
    reference: string;
  } | null;
}

export const useHybridBibleNavigation = ({ onChapterSelect, currentSelection }: UseHybridBibleNavigationProps) => {
  const navigate = useNavigate();
  const userInitiatedChange = useRef(false);
  
  const { languages, selectedLanguage, setSelectedLanguage, isLoading: languagesLoading, error: languagesError } = useHybridBibleLanguages();
  const { versions, selectedVersion, setSelectedVersion, isLoading: versionsLoading, error: versionsError } = useHybridBibleVersions(selectedLanguage);
  const { books, selectedBook, setSelectedBook, isLoading: booksLoading, error: booksError } = useHybridBibleBooks(selectedVersion);
  const { chapters, selectedChapter, setSelectedChapter, isLoading: chaptersLoading, error: chaptersError } = useHybridBibleChapters(selectedVersion, selectedBook);
  
  const [initializing, setInitializing] = useState(false);

  const isLoading = initializing || languagesLoading || versionsLoading || booksLoading || chaptersLoading;
  const error = languagesError || versionsError || booksError || chaptersError;

  const handleChapterSelect = (chapterId: string) => {
    userInitiatedChange.current = true;
    setSelectedChapter(chapterId);
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter && selectedVersion) {
      onChapterSelect(selectedVersion, chapterId, chapter.reference);
    }
    setTimeout(() => {
      userInitiatedChange.current = false;
    }, 100);
  };

  const handleLanguageChange = (languageId: string) => {
    userInitiatedChange.current = true;
    setSelectedLanguage(languageId);
    setSelectedVersion('');
    setSelectedBook('');
    setSelectedChapter('');
    setTimeout(() => {
      userInitiatedChange.current = false;
    }, 100);
  };

  const handleVersionChange = (versionId: string) => {
    userInitiatedChange.current = true;
    setSelectedVersion(versionId);
    setSelectedBook('');
    setSelectedChapter('');
    setTimeout(() => {
      userInitiatedChange.current = false;
    }, 100);
  };

  const handleBookChange = (bookId: string) => {
    console.log('Book changed to:', bookId);
    userInitiatedChange.current = true;
    setSelectedBook(bookId);
    setSelectedChapter('');
    setTimeout(() => {
      userInitiatedChange.current = false;
    }, 100);
  };

  // Initialize navigation state from current selection immediately and resolve language/version
  useEffect(() => {
    if (!currentSelection?.bibleId || userInitiatedChange.current) return;
    let cancelled = false;

    const init = async () => {
      setInitializing(true);
      try {
        // Ensure book/chapter reflect current selection ASAP
        const [bookId] = (currentSelection.chapterId || '').split('.');
        if (bookId && selectedBook !== bookId) setSelectedBook(bookId);
        if (selectedChapter !== currentSelection.chapterId) setSelectedChapter(currentSelection.chapterId);

        const allVersions = await hybridBibleService.getBibleVersions();
        const match = allVersions.find(v => v.id === currentSelection.bibleId);
        if (match && !cancelled) {
          if (selectedLanguage !== match.language.id) setSelectedLanguage(match.language.id);
          if (selectedVersion !== currentSelection.bibleId) setSelectedVersion(currentSelection.bibleId);
        }
      } catch (e) {
        console.warn('Initialization failed', e);
      } finally {
        if (!cancelled) setInitializing(false);
      }
    };

    init();
    return () => { cancelled = true; };
  }, [currentSelection?.bibleId, currentSelection?.chapterId]);
  const navigateChapter = (direction: 'prev' | 'next') => {
    const currentIndex = chapters.findIndex(c => c.id === selectedChapter);
    if (currentIndex === -1) return;

    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < chapters.length) {
      handleChapterSelect(chapters[newIndex].id);
    }
  };

  const handleReadClick = () => {
    // Instead of navigating to a new route, just trigger the chapter selection
    // This will update the current page's content
    if (selectedChapter && selectedVersion) {
      const chapter = chapters.find(c => c.id === selectedChapter);
      if (chapter) {
        onChapterSelect(selectedVersion, selectedChapter, chapter.reference);
      }
    }
  };

  const canNavigatePrev = () => {
    const currentIndex = chapters.findIndex(c => c.id === selectedChapter);
    return currentIndex > 0;
  };

  const canNavigateNext = () => {
    const currentIndex = chapters.findIndex(c => c.id === selectedChapter);
    return currentIndex >= 0 && currentIndex < chapters.length - 1;
  };

  // Sync language based on current selection's version
  useEffect(() => {
    const syncLanguage = async () => {
      if (!currentSelection?.bibleId || userInitiatedChange.current) return;
      try {
        const allVersions = await hybridBibleService.getBibleVersions();
        const match = allVersions.find(v => v.id === currentSelection.bibleId);
        if (match && match.language?.id && selectedLanguage !== match.language.id) {
          setSelectedLanguage(match.language.id);
        }
      } catch (e) {
        console.warn('Failed to resolve language from version id', e);
      }
    };
    syncLanguage();
  }, [currentSelection?.bibleId]);

  // Ensure the exact version from current selection is set once versions load
  useEffect(() => {
    if (!currentSelection?.bibleId || userInitiatedChange.current) return;
    if (versions.some(v => v.id === currentSelection.bibleId) && selectedVersion !== currentSelection.bibleId) {
      setSelectedVersion(currentSelection.bibleId);
    }
  }, [versions, currentSelection?.bibleId]);

  return {
    // State
    languages,
    selectedLanguage,
    versions,
    selectedVersion,
    books,
    selectedBook,
    chapters,
    selectedChapter,
    isLoading,
    error,
    userInitiatedChange,
    currentSelection,
    
    // Handlers
    handleChapterSelect,
    handleLanguageChange,
    handleVersionChange,
    handleBookChange,
    navigateChapter,
    handleReadClick,
    canNavigatePrev,
    canNavigateNext
  };
};
