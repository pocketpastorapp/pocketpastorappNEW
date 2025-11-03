
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import sanitizeHtml from '@/utils/sanitizeHtml';

interface SearchResult {
  reference: string;
  text: string;
  bookName?: string;
  chapter?: string;
  verse?: string;
}

interface SearchResultsProps {
  searchResults: SearchResult[];
  searchQuery: string;
  currentBibleId: string;
}

const SearchResults = ({ searchResults, searchQuery, currentBibleId }: SearchResultsProps) => {
  const navigate = useNavigate();

  const highlightSearchTerms = (text: string, searchTerms: string) => {
    if (!searchTerms.trim()) return text;
    
    // Split search terms by spaces and filter out empty strings
    const terms = searchTerms.toLowerCase().split(' ').filter(term => term.length > 0);
    
    let highlightedText = text;
    
    // Highlight each term
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark style="background-color: #EBD811; color: #000;">$1</mark>');
    });
    
    return highlightedText;
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Search result clicked:', result);
    
    // Parse the reference to extract book, chapter, and verse
    // Expected format: "Book Chapter:Verse" (e.g., "Genesis 1:1", "1 Kings 2:3")
    const referenceMatch = result.reference.match(/^(.+?)\s+(\d+):(\d+)$/);
    
    if (!referenceMatch) {
      console.error('Could not parse reference:', result.reference);
      return;
    }
    
    const [, bookName, chapterNum, verseNum] = referenceMatch;
    console.log('Parsed reference:', { bookName, chapterNum, verseNum });
    
    // Map book names to abbreviations for chapter ID construction
    const bookAbbreviations: { [key: string]: string } = {
      'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM', 'Deuteronomy': 'DEU',
      'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
      '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
      'Ezra': 'EZR', 'Nehemiah': 'NEH', 'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA',
      'Proverbs': 'PRO', 'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA',
      'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN',
      'Hosea': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
      'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP',
      'Haggai': 'HAG', 'Zechariah': 'ZEC', 'Malachi': 'MAL', 'Matthew': 'MAT',
      'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN', 'Acts': 'ACT', 'Romans': 'ROM',
      '1 Corinthians': '1CO', '2 Corinthians': '2CO', 'Galatians': 'GAL', 'Ephesians': 'EPH',
      'Philippians': 'PHP', 'Colossians': 'COL', '1 Thessalonians': '1TH', '2 Thessalonians': '2TH',
      '1 Timothy': '1TI', '2 Timothy': '2TI', 'Titus': 'TIT', 'Philemon': 'PHM',
      'Hebrews': 'HEB', 'James': 'JAS', '1 Peter': '1PE', '2 Peter': '2PE',
      '1 John': '1JN', '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD', 'Revelation': 'REV'
    };
    
    const bookAbbrev = bookAbbreviations[bookName];
    if (!bookAbbrev) {
      console.error('Unknown book name:', bookName);
      return;
    }
    
    const chapterId = `${bookAbbrev}.${chapterNum}`;
    const chapterReference = `${bookName} ${chapterNum}`;
    
    console.log('Navigating to:', {
      bibleId: currentBibleId,
      chapterId,
      reference: chapterReference,
      searchHighlight: searchQuery.trim(),
      highlightVerse: verseNum
    });
    
    // Navigate to the Bible read page with all necessary parameters
    const params = new URLSearchParams();
    params.set('bibleId', currentBibleId);
    params.set('chapterId', chapterId);
    params.set('reference', chapterReference);
    
    // Add search query and verse number for highlighting
    if (searchQuery.trim()) {
      params.set('searchHighlight', searchQuery.trim());
    }
    if (verseNum) {
      params.set('highlightVerse', verseNum);
    }
    
    navigate(`/bible/read?${params.toString()}`);
  };

  if (searchResults.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Search Results ({searchResults.length} found)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleResultClick(result)}
            >
              <div className="font-medium text-sm mb-2 text-gray-600 dark:text-gray-400">
                {result.reference}
              </div>
              <div 
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: sanitizeHtml(highlightSearchTerms(result.text, searchQuery)) 
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResults;
