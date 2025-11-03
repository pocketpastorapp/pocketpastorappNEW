
export interface BibleBook {
  id: string;
  name: string;
  abbreviation: string;
}

export interface BibleChapter {
  id: string;
  number: string;
  reference: string;
}

export interface BibleVerse {
  id: string;
  orgId: string;
  bookId: string;
  chapterId: string;
  reference: string;
  text: string;
}

export interface BibleLanguage {
  id: string;
  name: string;
  nameLocal: string;
  script: string;
  scriptDirection: string;
}

export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  language: BibleLanguage;
}

export class BibleAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'BibleAPIError';
  }
}
