
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useHybridBibleLanguages } from '@/hooks/useHybridBibleLanguages';
import { useHybridBibleVersions } from '@/hooks/useHybridBibleVersions';
import BibleLanguageSelector from './BibleLanguageSelector';
import BibleVersionSelector from './BibleVersionSelector';
import BibleNavigationError from './BibleNavigationError';

interface BibleVersionSelectionProps {
  onVersionSelected: (bibleId: string, bibleName: string) => void;
  className?: string;
}

const BibleVersionSelection = ({ 
  onVersionSelected,
  className = ''
}: BibleVersionSelectionProps) => {
  const { languages, selectedLanguage, setSelectedLanguage, isLoading: languagesLoading, error: languagesError } = useHybridBibleLanguages();
  const { versions, selectedVersion, setSelectedVersion, isLoading: versionsLoading, error: versionsError } = useHybridBibleVersions(selectedLanguage);

  const isLoading = languagesLoading || versionsLoading;
  const error = languagesError || versionsError;

  const handleSelect = () => {
    if (selectedVersion) {
      const selectedVersionData = versions.find(v => v.id === selectedVersion);
      if (selectedVersionData) {
        onVersionSelected(selectedVersion, `${selectedVersionData.abbreviation} - ${selectedVersionData.name}`);
      }
    }
  };

  const canSelect = selectedVersion && !isLoading;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Select Bible Version
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BibleNavigationError error={error} />

        <BibleLanguageSelector
          languages={languages}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          isLoading={isLoading}
        />

        <BibleVersionSelector
          versions={versions}
          selectedVersion={selectedVersion}
          onVersionChange={setSelectedVersion}
          isLoading={isLoading}
        />

        <Button 
          onClick={handleSelect}
          disabled={!canSelect}
          className="w-full"
          size="lg"
          variant="navy"
        >
          Select
        </Button>
      </CardContent>
    </Card>
  );
};

export default BibleVersionSelection;
