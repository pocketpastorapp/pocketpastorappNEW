
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BibleReadHeaderProps {
  reference: string | null;
  onSearch?: () => void;
}

const BibleReadHeader = ({ reference }: BibleReadHeaderProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSearchClick = () => {
    // Get current Bible reading context
    const bibleId = searchParams.get('bibleId');
    const chapterId = searchParams.get('chapterId');
    const currentReference = searchParams.get('reference');
    
    // Navigate to search page with current context
    const params = new URLSearchParams();
    if (bibleId) params.set('bibleId', bibleId);
    if (chapterId) params.set('chapterId', chapterId);
    if (currentReference) params.set('reference', currentReference);
    
    navigate(`/bible/search?${params.toString()}`);
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/bible')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold">
            {reference || 'Bible Reader'}
          </h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleSearchClick}
          className="shrink-0"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default BibleReadHeader;
