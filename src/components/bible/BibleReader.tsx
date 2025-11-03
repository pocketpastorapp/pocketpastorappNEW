
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Highlighter, BookOpen, Plus, AlertCircle } from 'lucide-react';
import { bibleService, BibleAPIError } from '@/services/bibleService';
import sanitizeHtml from '@/utils/sanitizeHtml';

interface BibleReaderProps {
  bibleId: string;
  chapterId: string;
  reference: string;
  onHighlight?: (text: string, reference: string) => void;
  onAddNote?: (text: string, reference: string) => void;
  className?: string;
}

const BibleReader = ({ 
  bibleId, 
  chapterId, 
  reference, 
  onHighlight, 
  onAddNote,
  className = '' 
}: BibleReaderProps) => {
  const [chapterText, setChapterText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (bibleId && chapterId) {
      loadChapter();
    }
  }, [bibleId, chapterId]);

  const loadChapter = async () => {
    try {
      setIsLoading(true);
      setError('');
      const text = await bibleService.getChapterText(bibleId, chapterId);
      setChapterText(text);
    } catch (error) {
      console.error('Error loading chapter:', error);
      if (error instanceof BibleAPIError) {
        setError(error.message);
      } else {
        setError('Error loading chapter. Please try again.');
      }
      setChapterText('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  const handleHighlight = () => {
    if (selectedText && onHighlight) {
      onHighlight(selectedText, reference);
      setSelectedText('');
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleAddNote = () => {
    if (selectedText && onAddNote) {
      onAddNote(selectedText, reference);
      setSelectedText('');
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {reference || 'Bible Reader'}
          </div>
          {selectedText && (
            <div className="flex gap-2">
              {onHighlight && (
                <Button variant="outline" size="sm" onClick={handleHighlight}>
                  <Highlighter className="h-4 w-4 mr-1" />
                  Highlight
                </Button>
              )}
              {onAddNote && (
                <Button variant="outline" size="sm" onClick={handleAddNote}>
                  <Plus className="h-4 w-4 mr-1" />
                  Note
                </Button>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading chapter...</p>
          </div>
        ) : chapterText ? (
          <div 
            className="prose prose-sm max-w-none leading-relaxed"
            onMouseUp={handleTextSelection}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(chapterText) }}
          />
        ) : !error && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No content available for this chapter.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BibleReader;
