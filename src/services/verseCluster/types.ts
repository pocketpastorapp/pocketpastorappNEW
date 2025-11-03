
export interface VerseCluster {
  id: string;
  user_id: string;
  bible_id: string;
  chapter_id: string;
  reference: string;
  cluster_name?: string;
  created_at: string;
  verses: ClusterVerse[];
}

export interface ClusterVerse {
  id: string;
  cluster_id: string;
  verse_number: string;
  verse_text: string;
  verse_reference: string;
  created_at: string;
}

export interface CreateVerseData {
  verseNumber: string;
  verseText: string;
  verseReference: string;
}
