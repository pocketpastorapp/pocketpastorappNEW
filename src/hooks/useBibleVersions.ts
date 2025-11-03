
import { useState, useEffect } from 'react';
import { hybridBibleService, HybridBibleVersion, BibleAPIError } from '@/services/hybridBibleService';

export const useBibleVersions = (selectedLanguage: string) => {
  const [versions, setVersions] = useState<HybridBibleVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (selectedLanguage) {
      const loadVersions = async () => {
        try {
          setIsLoading(true);
          setError('');
          const versionData = await hybridBibleService.getVersionsByLanguage(selectedLanguage);
          setVersions(versionData);
          
          // Auto-select preferred version based on language
          let preferredVersion: HybridBibleVersion | undefined;
          
          if (selectedLanguage === 'eng') {
            // For English, prefer NASB 2020 Local first, then NASB 2020, then ASV, then first available
            preferredVersion = versionData.find(v => 
              v.id === 'NASB2020_LOCAL'
            ) || versionData.find(v => 
              v.abbreviation === 'NASB2020' || 
              v.name.toLowerCase().includes('nasb') && v.name.includes('2020')
            ) || versionData.find(v => 
              v.abbreviation === 'ASV' || 
              v.name.toLowerCase().includes('american standard')
            );
          }
          
          // Fallback to first version if no preferred version found
          const finalVersion = preferredVersion || versionData[0];
          
          if (finalVersion) {
            setSelectedVersion(finalVersion.id);
          } else {
            setSelectedVersion('');
          }
        } catch (error) {
          console.error('Error loading Bible versions:', error);
          if (error instanceof BibleAPIError) {
            setError(error.message);
          } else {
            setError('Failed to load Bible versions. Please try again.');
          }
        } finally {
          setIsLoading(false);
        }
      };

      loadVersions();
    } else {
      setVersions([]);
      setSelectedVersion('');
    }
  }, [selectedLanguage]);

  return {
    versions,
    selectedVersion,
    setSelectedVersion,
    isLoading,
    error
  };
};
