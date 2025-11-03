
import { useState, useEffect } from 'react';
import { hybridBibleService } from '@/services/hybridBibleService';
import { toast } from 'sonner';

export const useBibleSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentBibleId, setCurrentBibleId] = useState<string>('');
  const [currentBibleName, setCurrentBibleName] = useState<string>('');
  const [searchType, setSearchType] = useState<'all' | 'exact'>('exact');

  // Load saved Bible selection from localStorage on mount
  useEffect(() => {
    const savedBibleId = localStorage.getItem('selectedBibleId');
    const savedBibleName = localStorage.getItem('selectedBibleName');
    
    if (savedBibleId && savedBibleName) {
      setCurrentBibleId(savedBibleId);
      setCurrentBibleName(savedBibleName);
    }
  }, []);

  // Save Bible selection to localStorage when it changes
  useEffect(() => {
    if (currentBibleId && currentBibleName) {
      localStorage.setItem('selectedBibleId', currentBibleId);
      localStorage.setItem('selectedBibleName', currentBibleName);
    }
  }, [currentBibleId, currentBibleName]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !currentBibleId) {
      if (!currentBibleId) {
        toast.error('Please select a Bible version first');
      }
      return;
    }

    setIsSearching(true);
    try {
      const results = await hybridBibleService.searchVerses(currentBibleId, searchQuery.trim(), searchType);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info('No results found for your search');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    currentBibleId,
    setCurrentBibleId,
    currentBibleName,
    setCurrentBibleName,
    searchType,
    setSearchType,
    handleSearch
  };
};
