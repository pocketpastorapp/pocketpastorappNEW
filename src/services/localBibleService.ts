
export interface LocalBibleData {
  [bookAbbreviation: string]: {
    [chapterNumber: string]: string[];
  };
}

export interface LocalBibleBook {
  id: string;
  name: string;
  abbreviation: string;
}

export interface LocalBibleChapter {
  id: string;
  number: string;
  reference: string;
}

// Book mappings for common abbreviations to full names
const BOOK_NAMES: { [key: string]: string } = {
  'GEN': 'Genesis',
  'EXO': 'Exodus', 
  'LEV': 'Leviticus',
  'NUM': 'Numbers',
  'DEU': 'Deuteronomy',
  'JOS': 'Joshua',
  'JDG': 'Judges',
  'RUT': 'Ruth',
  '1SA': '1 Samuel',
  '2SA': '2 Samuel',
  '1KI': '1 Kings',
  '2KI': '2 Kings',
  '1CH': '1 Chronicles',
  '2CH': '2 Chronicles',
  'EZR': 'Ezra',
  'NEH': 'Nehemiah',
  'EST': 'Esther',
  'JOB': 'Job',
  'PSA': 'Psalms',
  'PRO': 'Proverbs',
  'ECC': 'Ecclesiastes',
  'SNG': 'Song of Solomon',
  'ISA': 'Isaiah',
  'JER': 'Jeremiah',
  'LAM': 'Lamentations',
  'EZK': 'Ezekiel',
  'DAN': 'Daniel',
  'HOS': 'Hosea',
  'JOL': 'Joel',
  'AMO': 'Amos',
  'OBA': 'Obadiah',
  'JON': 'Jonah',
  'MIC': 'Micah',
  'NAM': 'Nahum',
  'HAB': 'Habakkuk',
  'ZEP': 'Zephaniah',
  'HAG': 'Haggai',
  'ZEC': 'Zechariah',
  'MAL': 'Malachi',
  'MAT': 'Matthew',
  'MRK': 'Mark',
  'LUK': 'Luke',
  'JHN': 'John',
  'ACT': 'Acts',
  'ROM': 'Romans',
  '1CO': '1 Corinthians',
  '2CO': '2 Corinthians',
  'GAL': 'Galatians',
  'EPH': 'Ephesians',
  'PHP': 'Philippians',
  'COL': 'Colossians',
  '1TH': '1 Thessalonians',
  '2TH': '2 Thessalonians',
  '1TI': '1 Timothy',
  '2TI': '2 Timothy',
  'TIT': 'Titus',
  'PHM': 'Philemon',
  'HEB': 'Hebrews',
  'JAS': 'James',
  '1PE': '1 Peter',
  '2PE': '2 Peter',
  '1JN': '1 John',
  '2JN': '2 John',
  '3JN': '3 John',
  'JUD': 'Jude',
  'REV': 'Revelation'
};

import { completeNasbData } from '@/data/bible';

class LocalBibleService {
  private bibleData: LocalBibleData | null = null;

  // For now, we'll initialize with your Genesis sample data
  // You can replace this with your full NASB 2020 data
  setBibleData(data: LocalBibleData) {
    this.bibleData = data;
  }

  getBibleData(): LocalBibleData | null {
    return this.bibleData;
  }

  getBooks(): LocalBibleBook[] {
    if (!this.bibleData) return [];

    return Object.keys(this.bibleData).map(abbrev => ({
      id: abbrev,
      name: BOOK_NAMES[abbrev] || abbrev,
      abbreviation: abbrev
    }));
  }

  getChapters(bookId: string): LocalBibleChapter[] {
    if (!this.bibleData || !this.bibleData[bookId]) return [];

    const bookName = BOOK_NAMES[bookId] || bookId;
    return Object.keys(this.bibleData[bookId]).map(chapterNum => ({
      id: `${bookId}.${chapterNum}`,
      number: chapterNum,
      reference: `${bookName} ${chapterNum}`
    }));
  }

  getChapterText(bookId: string, chapterNumber: string): string {
    if (!this.bibleData || !this.bibleData[bookId] || !this.bibleData[bookId][chapterNumber]) {
      return '';
    }

    const verses = this.bibleData[bookId][chapterNumber];
    return verses.map((verse, index) => 
      `<sup>${index + 1}</sup> ${verse}`
    ).join(' ');
  }

  searchVerses(query: string, searchType: 'all' | 'exact' = 'all'): Array<{ reference: string; text: string }> {
    if (!this.bibleData) return [];

    const results: Array<{ reference: string; text: string }> = [];
    const searchTerms = query.toLowerCase().split(' ');

    Object.entries(this.bibleData).forEach(([bookId, book]) => {
      const bookName = BOOK_NAMES[bookId] || bookId;
      
      Object.entries(book).forEach(([chapterNum, verses]) => {
        verses.forEach((verse, verseIndex) => {
          const verseText = verse.toLowerCase();
          let isMatch = false;

          if (searchType === 'exact') {
            // Exact match: look for whole word boundaries
            const regex = new RegExp(`\\b${query.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            isMatch = regex.test(verse);
          } else {
            // All words: current behavior (partial matches)
            const matchesAll = searchTerms.every(term => verseText.includes(term));
            isMatch = matchesAll;
          }
          
          if (isMatch) {
            results.push({
              reference: `${bookName} ${chapterNum}:${verseIndex + 1}`,
              text: verse
            });
          }
        });
      });
    });

    return results.slice(0, 50); // Limit to 50 results
  }
}

export const localBibleService = new LocalBibleService();

// Initialize with the complete NASB data
localBibleService.setBibleData(completeNasbData);
