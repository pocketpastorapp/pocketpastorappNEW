
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SearchInstructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Search Examples:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• "love your neighbor"</li>
              <li>• faith hope love</li>
              <li>• David Goliath</li>
              <li>• John 3:16</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Search Types:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Exact:</strong> Exact phrase matches</li>
              <li>• <strong>All:</strong> Comprehensive search</li>
              <li>• <strong>Verses:</strong> Search by verse references</li>
              <li>• <strong>Names:</strong> Biblical names and places</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchInstructions;
