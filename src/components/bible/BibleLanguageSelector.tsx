
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BibleLanguage } from '@/services/bibleService';

interface BibleLanguageSelectorProps {
  languages: BibleLanguage[];
  selectedLanguage: string;
  onLanguageChange: (languageId: string) => void;
  isLoading: boolean;
}

const BibleLanguageSelector = ({ 
  languages, 
  selectedLanguage, 
  onLanguageChange, 
  isLoading 
}: BibleLanguageSelectorProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Language</label>
      <Select value={selectedLanguage} onValueChange={onLanguageChange} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.id} value={language.id}>
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BibleLanguageSelector;
