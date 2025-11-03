
// Centralized query keys with optimized cache strategies
export const queryKeys = {
  // User-related queries - longer cache for relatively static data
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    credits: () => [...queryKeys.user.all, 'credits'] as const,
    preferences: () => [...queryKeys.user.all, 'preferences'] as const,
  },
  
  // Bible data - longer cache for static content
  bible: {
    all: ['bible'] as const,
    versions: () => [...queryKeys.bible.all, 'versions'] as const,
    languages: () => [...queryKeys.bible.all, 'languages'] as const,
    books: (bibleId: string) => [...queryKeys.bible.all, 'books', bibleId] as const,
    chapters: (bibleId: string, bookId: string) => [...queryKeys.bible.all, 'chapters', bibleId, bookId] as const,
    text: (bibleId: string, chapterId: string) => [...queryKeys.bible.all, 'text', bibleId, chapterId] as const,
    search: (bibleId: string, query: string) => [...queryKeys.bible.all, 'search', bibleId, query] as const,
  },
  
  // Chat data - shorter cache for dynamic content
  chat: {
    all: ['chat'] as const,
    sessions: () => [...queryKeys.chat.all, 'sessions'] as const,
    messages: (sessionId: string) => [...queryKeys.chat.all, 'messages', sessionId] as const,
    session: (sessionId: string) => [...queryKeys.chat.all, 'session', sessionId] as const,
  },
  
  // Favorites and highlights - medium cache for user-generated content
  favorites: {
    all: ['favorites'] as const,
    verses: () => [...queryKeys.favorites.all, 'verses'] as const,
    messages: () => [...queryKeys.favorites.all, 'messages'] as const,
  },
  
  highlights: {
    all: ['highlights'] as const,
    chapter: (bibleId: string, chapterId: string) => [...queryKeys.highlights.all, 'chapter', bibleId, chapterId] as const,
  },
  
  clusters: {
    all: ['clusters'] as const,
    user: () => [...queryKeys.clusters.all, 'user'] as const,
    chapter: (bibleId: string, chapterId: string) => [...queryKeys.clusters.all, 'chapter', bibleId, chapterId] as const,
  },
};

// Cache time configurations
export const cacheConfig = {
  // Static data - cache for 30 minutes
  static: {
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  },
  
  // User preferences - cache for 15 minutes
  userPrefs: {
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  },
  
  // Dynamic content - cache for 2 minutes
  dynamic: {
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  },
  
  // Real-time data - minimal cache
  realtime: {
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  },
};
