
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useChapterNavigation } from '@/hooks/useChapterNavigation';
import BibleReadHeader from '@/components/bible/BibleReadHeader';
import BibleReadTabs from '@/components/bible/BibleReadTabs';
import FloatingChapterNav from '@/components/bible/FloatingChapterNav';
import FloatingTabsNavigation from '@/components/bible/FloatingTabsNavigation';

const BibleReadPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [showFloatingTabs, setShowFloatingTabs] = useState(false);
  const [activeTab, setActiveTab] = useState("read");
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const [selectedChapter, setSelectedChapter] = useState<{
    bibleId: string;
    chapterId: string;
    reference: string;
    searchHighlight?: string;
    highlightVerse?: string;
  } | null>(null);

  // Update selectedChapter when URL params change
  useEffect(() => {
    const bibleId = searchParams.get('bibleId');
    const chapterId = searchParams.get('chapterId');
    const reference = searchParams.get('reference');
    const searchHighlight = searchParams.get('searchHighlight');
    const highlightVerse = searchParams.get('highlightVerse');
    
    if (bibleId && chapterId && reference) {
      console.log('URL params changed, updating selectedChapter:', { bibleId, chapterId, reference, searchHighlight, highlightVerse });
      setSelectedChapter({ 
        bibleId, 
        chapterId, 
        reference,
        searchHighlight: searchHighlight || undefined,
        highlightVerse: highlightVerse || undefined
      });
    }
  }, [searchParams]);

  // Add scroll listener for floating navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show floating nav when user is near bottom (within 200px)
      const nearBottom = currentScrollY + windowHeight >= documentHeight - 200;
      setShowFloatingNav(nearBottom);

      // Show floating tabs when scrolling up (after scrolling past header)
      const scrollingUp = currentScrollY < lastScrollY;
      const scrolledPastHeader = currentScrollY > 100;
      
      setShowFloatingTabs(scrollingUp && scrolledPastHeader);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const { navigateToChapter, canNavigatePrev, canNavigateNext } = useChapterNavigation(
    selectedChapter?.bibleId || '',
    selectedChapter?.chapterId || ''
  );

  const handleChapterSelect = (bibleId: string, chapterId: string, reference: string) => {
    console.log('Chapter selected:', { bibleId, chapterId, reference });
    setSelectedChapter({ bibleId, chapterId, reference });
    // Update URL params - clear search highlights when manually navigating
    const params = new URLSearchParams();
    params.set('bibleId', bibleId);
    params.set('chapterId', chapterId);
    params.set('reference', reference);
    navigate(`/bible/read?${params.toString()}`, { replace: true });
  };

  const handleHighlight = (text: string, reference: string) => {
    // Remove toast notification - no feedback needed for highlighting
    console.log('Text highlighted:', text, reference);
  };

  const handleAddNote = (text: string, reference: string) => {
    console.log('Note added for:', text, reference);
  };

  const handlePrevChapter = () => {
    console.log('Previous chapter button clicked');
    navigateToChapter('prev');
  };

  const handleNextChapter = () => {
    console.log('Next chapter button clicked');
    navigateToChapter('next');
  };

  return (
    <div className="min-h-screen bg-background">
      <BibleReadHeader 
        reference={selectedChapter?.reference || null}
      />

      {/* Floating Tabs Navigation */}
      <FloatingTabsNavigation
        isVisible={showFloatingTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onPrevChapter={handlePrevChapter}
        onNextChapter={handleNextChapter}
        canNavigatePrev={canNavigatePrev}
        canNavigateNext={canNavigateNext}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 pb-24">
        <BibleReadTabs
          selectedChapter={selectedChapter}
          onChapterSelect={handleChapterSelect}
          onHighlight={handleHighlight}
          onAddNote={handleAddNote}
          onPrevChapter={handlePrevChapter}
          onNextChapter={handleNextChapter}
          canNavigatePrev={canNavigatePrev}
          canNavigateNext={canNavigateNext}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Floating Chapter Navigation */}
      {selectedChapter && (
        <FloatingChapterNav
          isVisible={showFloatingNav}
          onPrevChapter={handlePrevChapter}
          onNextChapter={handleNextChapter}
          canNavigatePrev={canNavigatePrev}
          canNavigateNext={canNavigateNext}
        />
      )}
    </div>
  );
};

export default BibleReadPage;
