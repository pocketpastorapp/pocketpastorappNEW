
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import BibleNavigation from '@/components/bible/BibleNavigation';
import BookmarksSection from '@/components/bible/BookmarksSection';
import FavoriteVersesSection from '@/components/bible/FavoriteVersesSection';
import { useIsMobile } from '@/hooks/use-mobile';

const BiblePage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentBibleContext, setCurrentBibleContext] = useState<{
    bibleId?: string;
    chapterId?: string;
    reference?: string;
  }>({});

  const handleChapterSelect = (bibleId: string, chapterId: string, reference: string) => {
    // Update current context for search functionality
    setCurrentBibleContext({ bibleId, chapterId, reference });
    console.log('Chapter selected:', { bibleId, chapterId, reference });
  };

  const handleBookmarkSelect = (bibleId: string, chapterId: string, reference: string) => {
    // Update current context for search functionality
    setCurrentBibleContext({ bibleId, chapterId, reference });
    console.log('Bookmark selected:', { bibleId, chapterId, reference });
  };

  const handleSearchClick = () => {
    // Navigate to search page with current Bible context
    const params = new URLSearchParams();
    if (currentBibleContext.bibleId) params.set('bibleId', currentBibleContext.bibleId);
    if (currentBibleContext.chapterId) params.set('chapterId', currentBibleContext.chapterId);
    if (currentBibleContext.reference) params.set('reference', currentBibleContext.reference);
    
    navigate(`/bible/search?${params.toString()}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Bible
          </h1>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleSearchClick}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {isMobile ? (
          // Mobile layout: Bookmarks -> Navigation -> Favorite Verses
          <div className="space-y-6">
            <BookmarksSection onBookmarkSelect={handleBookmarkSelect} />
            <BibleNavigation onChapterSelect={handleChapterSelect} />
            <FavoriteVersesSection />
          </div>
        ) : (
          // Desktop layout: restructured with matching widths
          <div className="space-y-6">
            {/* Row 1: Bookmarks (wider sidebar) + Navigation (main area) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bookmarks - wider sidebar for better text display */}
              <div className="lg:col-span-1">
                <BookmarksSection onBookmarkSelect={handleBookmarkSelect} />
              </div>

              {/* Bible Navigation - takes remaining space */}
              <div className="lg:col-span-2">
                <BibleNavigation onChapterSelect={handleChapterSelect} />
              </div>
            </div>

            {/* Row 2: Favorite Verses - same grid structure for perfect alignment */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Empty space to match the bookmarks column */}
              <div className="lg:col-span-1"></div>
              
              {/* Favorite Verses - same column span as Bible Navigation */}
              <div className="lg:col-span-2">
                <FavoriteVersesSection />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BiblePage;
