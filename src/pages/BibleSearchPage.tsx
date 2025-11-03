
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBibleSearch } from '@/hooks/useBibleSearch';
import SearchHeader from '@/components/bible/search/SearchHeader';
import SearchInput from '@/components/bible/search/SearchInput';
import SearchResults from '@/components/bible/search/SearchResults';
import SearchInstructions from '@/components/bible/search/SearchInstructions';
import BibleVersionSelection from '@/components/bible/BibleVersionSelection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen } from 'lucide-react';

const BibleSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSearch, setShowSearch] = useState(false);
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    currentBibleId,
    currentBibleName,
    searchType,
    setSearchType,
    handleSearch,
    setCurrentBibleId,
    setCurrentBibleName
  } = useBibleSearch();

  // Check URL parameters for Bible version info when component mounts
  useEffect(() => {
    const bibleId = searchParams.get('bibleId');
    const reference = searchParams.get('reference');
    
    if (bibleId) {
      // If we have a Bible ID from URL, use it and show search immediately
      let bibleName = '';
      
      if (bibleId === 'NASB2020_LOCAL') {
        bibleName = 'NASB 2020';
      } else {
        // For API versions, use reference or construct name
        bibleName = reference ? `Bible (${reference})` : 'Selected Bible Version';
      }
      
      setCurrentBibleId(bibleId);
      setCurrentBibleName(bibleName);
      setShowSearch(true);
    }
  }, [searchParams, setCurrentBibleId, setCurrentBibleName]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleVersionSelected = (bibleId: string, bibleName: string) => {
    setCurrentBibleId(bibleId);
    setCurrentBibleName(bibleName);
    setShowSearch(true);
  };

  // If no version selected or showSearch is false, show version selection
  if (!currentBibleId || !showSearch) {
    return (
      <div className="min-h-screen bg-background">
        <SearchHeader currentBibleName="Select Bible Version" />

        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <Alert>
              <BookOpen className="h-4 w-4" />
              <AlertDescription>
                Please select a Bible version to begin searching.
              </AlertDescription>
            </Alert>

            <BibleVersionSelection
              onVersionSelected={handleVersionSelected}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show search interface once version is selected
  return (
    <div className="min-h-screen bg-background">
      <SearchHeader currentBibleName={currentBibleName || "Bible Search"} />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchType={searchType}
            setSearchType={setSearchType}
            isSearching={isSearching}
            onSearch={handleSearch}
            onKeyPress={handleKeyPress}
          />

          <SearchResults
            searchResults={searchResults}
            searchQuery={searchQuery}
            currentBibleId={currentBibleId}
          />

          {searchResults.length === 0 && !isSearching && currentBibleId && (
            <SearchInstructions />
          )}
        </div>
      </div>
    </div>
  );
};

export default BibleSearchPage;
