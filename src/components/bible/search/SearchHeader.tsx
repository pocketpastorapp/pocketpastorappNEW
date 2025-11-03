
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchHeaderProps {
  currentBibleName: string;
}

const SearchHeader = ({ currentBibleName }: SearchHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-lg font-semibold">Bible Search</h1>
            {currentBibleName && (
              <p className="text-sm text-muted-foreground">{currentBibleName}</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
