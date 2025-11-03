
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BibleBook } from '@/services/bibleService';

interface BibleBookSelectorProps {
  books: BibleBook[];
  selectedBook: string;
  onBookChange: (bookId: string) => void;
  isLoading: boolean;
  selectedVersion: string;
}

const BibleBookSelector = ({ 
  books, 
  selectedBook, 
  onBookChange, 
  isLoading, 
  selectedVersion 
}: BibleBookSelectorProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Book</label>
      <Select value={selectedBook} onValueChange={onBookChange} disabled={isLoading || !selectedVersion}>
        <SelectTrigger>
          <SelectValue placeholder="Select book" />
        </SelectTrigger>
        <SelectContent>
          {books.map((book) => (
            <SelectItem key={book.id} value={book.id}>
              {book.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BibleBookSelector;
