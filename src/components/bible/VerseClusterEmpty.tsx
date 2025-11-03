
import React from 'react';
import { BookOpen } from 'lucide-react';

export const VerseClusterEmpty = () => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <BookOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No favorite verses yet</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Save meaningful verses for quick access
      </p>
      <p className="text-xs text-muted-foreground">
        Select verses and use the heart button to add to favorites
      </p>
    </div>
  );
};
