
// Offline utility functions for better PWA support

export interface OfflineStatus {
  isOnline: boolean;
  hasServiceWorker: boolean;
  cachedBibleBooks: string[];
}

// Check if the app is currently online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Get offline status including cached content
export const getOfflineStatus = async (): Promise<OfflineStatus> => {
  const status: OfflineStatus = {
    isOnline: navigator.onLine,
    hasServiceWorker: 'serviceWorker' in navigator,
    cachedBibleBooks: []
  };

  if (status.hasServiceWorker && navigator.serviceWorker.controller) {
    try {
      const messageChannel = new MessageChannel();
      const response = await new Promise<any>((resolve) => {
        messageChannel.port1.onmessage = (event) => resolve(event.data);
        navigator.serviceWorker.controller!.postMessage(
          { type: 'CHECK_OFFLINE_STATUS' },
          [messageChannel.port2]
        );
      });
      
      if (response.success) {
        status.cachedBibleBooks = response.cachedBooks || [];
      }
    } catch (error) {
      console.warn('Failed to check offline status:', error);
    }
  }

  return status;
};

// Cache a Bible book for offline reading
export const cacheBibleBook = async (bookPath: string): Promise<boolean> => {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return false;
  }

  try {
    const messageChannel = new MessageChannel();
    const response = await new Promise<any>((resolve) => {
      messageChannel.port1.onmessage = (event) => resolve(event.data);
      navigator.serviceWorker.controller!.postMessage(
        { type: 'CACHE_BIBLE_BOOK', bookPath },
        [messageChannel.port2]
      );
    });
    
    return response.success || false;
  } catch (error) {
    console.error('Failed to cache Bible book:', error);
    return false;
  }
};

// Listen for online/offline events
export const setupOfflineListeners = (
  onOnline?: () => void,
  onOffline?: () => void
): (() => void) => {
  const handleOnline = () => {
    console.log('App came online');
    onOnline?.();
  };

  const handleOffline = () => {
    console.log('App went offline');
    onOffline?.();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// Show appropriate offline message based on context
export const getOfflineMessage = (context: 'bible' | 'chat' | 'general'): string => {
  switch (context) {
    case 'bible':
      return 'You\'re offline. Only cached Bible books are available for reading.';
    case 'chat':
      return 'You\'re offline. Chat features require an internet connection.';
    default:
      return 'You\'re currently offline. Some features may not be available.';
  }
};

// Check if a specific feature is available offline
export const isFeatureAvailableOffline = (feature: string): boolean => {
  const offlineFeatures = [
    'bible-reading', // If books are cached
    'notes-viewing', // If notes are cached locally
    'favorites-viewing' // If favorites are cached locally
  ];
  
  return offlineFeatures.includes(feature);
};
