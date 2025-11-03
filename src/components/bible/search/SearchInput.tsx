
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchType: 'all' | 'exact';
  setSearchType: (type: 'all' | 'exact') => void;
  isSearching: boolean;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const SearchInput = ({
  searchQuery,
  setSearchQuery,
  searchType,
  setSearchType,
  isSearching,
  onSearch,
  onKeyPress
}: SearchInputProps) => {
  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div className="relative">
          <Input
            placeholder="Enter keywords, names, phrases, or verses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={onKeyPress}
            className="pr-10 w-full"
            disabled={isSearching}
          />
          {searchQuery.trim() && (
            <Search 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
              onClick={onSearch}
            />
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={searchType === 'exact' ? 'navy' : 'outline'}
            size="sm"
            onClick={() => setSearchType('exact')}
            disabled={isSearching}
          >
            Exact Match
          </Button>
          <Button
            variant={searchType === 'all' ? 'navy' : 'outline'}
            size="sm"
            onClick={() => setSearchType('all')}
            disabled={isSearching}
          >
            All Words
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchInput;
