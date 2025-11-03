
// Mobile utility functions for enhanced mobile experience

export const isIOSDevice = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroidDevice = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

export const isMobileDevice = (): boolean => {
  return isIOSDevice() || isAndroidDevice();
};

export const supportsTouchEvents = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Check if running as iOS PWA (standalone mode)
export const isIOSPWA = (): boolean => {
  return isIOSDevice() && window.matchMedia('(display-mode: standalone)').matches;
};

// Check if running as any PWA
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

// Check if pull-to-refresh is supported
export const supportsPullToRefresh = (): boolean => {
  // iOS in standalone mode should support pull-to-refresh
  if (isIOSPWA()) {
    return true;
  }
  
  // Android PWAs typically support pull-to-refresh
  if (isAndroidDevice() && isPWA()) {
    return true;
  }
  
  // iOS Safari (not PWA) supports pull-to-refresh
  if (isIOSDevice() && !isPWA()) {
    return true;
  }
  
  return false;
};

// Manual refresh function for fallback
export const manualRefresh = (): void => {
  // First try to clear service worker cache if available
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = () => {
      window.location.reload();
    };
    
    navigator.serviceWorker.controller.postMessage(
      { type: 'CLEAR_CACHE' },
      [messageChannel.port2]
    );
  } else {
    // Fallback to regular reload
    window.location.reload();
  }
};

// Enable iOS-specific scroll optimizations
export const enableIOSScrollOptimizations = (): void => {
  if (isIOSDevice()) {
    // Add iOS-specific class to body
    document.body.classList.add('ios-device');
    
    // Ensure proper touch-action for scrolling
    document.body.style.touchAction = 'manipulation';
    
    // Enable momentum scrolling with type assertion for webkit properties
    const bodyStyle = document.body.style as any;
    bodyStyle.webkitOverflowScrolling = 'touch';
    document.body.style.overscrollBehaviorY = 'auto';
    
    // Apply to main containers
    const rootElement = document.getElementById('root');
    if (rootElement) {
      const rootStyle = rootElement.style as any;
      rootStyle.webkitOverflowScrolling = 'touch';
      rootElement.style.overscrollBehaviorY = 'auto';
    }
  }
};

// Haptic feedback utilities
export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },
  
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }
  },
  
  selection: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  },
  
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 10, 20]);
    }
  },
  
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([40, 20, 40, 20, 40]);
    }
  },
  
  refresh: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 5, 10]);
    }
  }
};

// Prevent zoom on input focus (iOS Safari)
export const preventZoomOnInput = () => {
  if (isIOSDevice()) {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      const content = viewportMeta.getAttribute('content');
      const newContent = content?.replace(/maximum-scale=[0-9.]+/, 'maximum-scale=1.0') || 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      viewportMeta.setAttribute('content', newContent);
    }
  }
};

// Safe area insets for devices with notches
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    top: style.getPropertyValue('--safe-area-inset-top') || '0px',
    bottom: style.getPropertyValue('--safe-area-inset-bottom') || '0px',
    left: style.getPropertyValue('--safe-area-inset-left') || '0px',
    right: style.getPropertyValue('--safe-area-inset-right') || '0px'
  };
};

// Optimized scroll behavior for mobile
export const enableSmoothScrolling = (element: HTMLElement) => {
  // Use type assertion to access webkit-specific properties
  const style = element.style as any;
  style.webkitOverflowScrolling = 'touch';
  style.scrollBehavior = 'smooth';
  style.overscrollBehaviorY = 'auto';
};
