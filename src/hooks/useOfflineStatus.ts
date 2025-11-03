
import { useState, useEffect } from 'react';
import { getOfflineStatus, setupOfflineListeners, OfflineStatus } from '@/utils/offlineUtils';

export const useOfflineStatus = () => {
  const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>({
    isOnline: navigator.onLine,
    hasServiceWorker: false,
    cachedBibleBooks: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const updateOfflineStatus = async () => {
      try {
        const status = await getOfflineStatus();
        setOfflineStatus(status);
      } catch (error) {
        console.error('Failed to update offline status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleOnline = () => {
      updateOfflineStatus();
    };

    const handleOffline = () => {
      setOfflineStatus(prev => ({
        ...prev,
        isOnline: false
      }));
    };

    // Initial status check
    updateOfflineStatus();

    // Setup listeners
    cleanup = setupOfflineListeners(handleOnline, handleOffline);

    return cleanup;
  }, []);

  const refreshStatus = async () => {
    setIsLoading(true);
    try {
      const status = await getOfflineStatus();
      setOfflineStatus(status);
    } catch (error) {
      console.error('Failed to refresh offline status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...offlineStatus,
    isLoading,
    refreshStatus
  };
};
