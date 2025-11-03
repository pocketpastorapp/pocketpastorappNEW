
import { useState, useEffect } from 'react';
import { hybridBibleService, BibleAPIError } from '@/services/hybridBibleService';
import { BibleLanguage } from '@/services/bibleService';

export const useBibleLanguages = () => {
  const [languages, setLanguages] = useState<BibleLanguage[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setIsLoading(true);
        setError('');
        const languageData = await hybridBibleService.getLanguages();
        setLanguages(languageData);
        
        // Auto-select English if available
        const englishLanguage = languageData.find(lang => 
          lang.id === 'eng' || lang.name.toLowerCase() === 'english'
        );
        
        if (englishLanguage) {
          setSelectedLanguage(englishLanguage.id);
        } else if (languageData.length > 0) {
          setSelectedLanguage(languageData[0].id);
        }
      } catch (error) {
        console.error('Error loading languages:', error);
        if (error instanceof BibleAPIError) {
          setError(error.message);
        } else {
          setError('Failed to load languages. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguages();
  }, []);

  return {
    languages,
    selectedLanguage,
    setSelectedLanguage,
    isLoading,
    error
  };
};
