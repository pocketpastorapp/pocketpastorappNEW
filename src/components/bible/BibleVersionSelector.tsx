
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BibleVersion } from '@/services/bibleService';

interface BibleVersionSelectorProps {
  versions: BibleVersion[];
  selectedVersion: string;
  onVersionChange: (versionId: string) => void;
  isLoading: boolean;
}

const BibleVersionSelector = ({ 
  versions, 
  selectedVersion, 
  onVersionChange, 
  isLoading 
}: BibleVersionSelectorProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Version</label>
      <Select value={selectedVersion} onValueChange={onVersionChange} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue placeholder="Select Bible version" />
        </SelectTrigger>
        <SelectContent>
          {versions.map((version) => (
            <SelectItem key={version.id} value={version.id}>
              {version.abbreviation} - {version.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BibleVersionSelector;
