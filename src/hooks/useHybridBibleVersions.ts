
import { useState, useEffect } from 'react';
import { hybridBibleService, HybridBibleVersion, BibleAPIError } from '@/services/hybridBibleService';

export const useHybridBibleVersions = (selectedLanguage: string) => {
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
          
          // Decide selection: keep current if valid; otherwise choose preferred
          setSelectedVersion(prev => {
            if (prev && versionData.some(v => v.id === prev)) {
              return prev; // preserve external/user selection
            }
            // Auto-select preferred version based on language
            let preferredVersion: HybridBibleVersion | undefined;
            
            if (selectedLanguage === 'eng') {
              // For English, prefer local NASB 2020 first, then API NASB 2020, then ASV
              preferredVersion = versionData.find(v => v.id === 'NASB2020_LOCAL') ||
                versionData.find(v => 
                  v.abbreviation === 'NASB2020' || 
                  (v.name.toLowerCase().includes('nasb') && v.name.includes('2020'))
                ) || versionData.find(v => 
                  v.abbreviation === 'ASV' || 
                  v.name.toLowerCase().includes('american standard')
                );
            }
            
            // Fallback to first version if no preferred version found
            const finalVersion = preferredVersion || versionData[0];
            return finalVersion ? finalVersion.id : '';
          });
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
