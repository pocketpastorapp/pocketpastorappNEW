
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BibleChapter } from '@/services/bibleService';

interface BibleChapterSelectorProps {
  chapters: BibleChapter[];
  selectedChapter: string;
  onChapterChange: (chapterId: string) => void;
  isLoading: boolean;
  selectedBook: string;
}

const BibleChapterSelector = ({ 
  chapters, 
  selectedChapter, 
  onChapterChange, 
  isLoading, 
  selectedBook 
}: BibleChapterSelectorProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Chapter</label>
      <Select value={selectedChapter} onValueChange={onChapterChange} disabled={isLoading || !selectedBook}>
        <SelectTrigger>
          <SelectValue placeholder="Select chapter" />
        </SelectTrigger>
        <SelectContent>
          {chapters.map((chapter) => (
            <SelectItem key={chapter.id} value={chapter.id}>
              Chapter {chapter.number}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BibleChapterSelector;
