
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    const trackPageView = (path: string) => {
      // In production, you would integrate with analytics services like:
      // - Google Analytics 4
      // - Plausible
      // - Mixpanel
      // - Custom analytics
      
      if (process.env.NODE_ENV === 'production') {
        console.log('Page view tracked:', path);
        
        // Example Google Analytics 4 implementation:
        // if (typeof gtag !== 'undefined') {
        //   gtag('config', 'GA_MEASUREMENT_ID', {
        //     page_path: path,
        //   });
        // }
        
        // Example Plausible implementation:
        // if (typeof plausible !== 'undefined') {
        //   plausible('pageview');
        // }
      }
    };

    trackPageView(location.pathname);
  }, [location]);

  // Track custom events
  useEffect(() => {
    const trackEvent = (eventName: string, properties?: Record<string, any>) => {
      if (process.env.NODE_ENV === 'production') {
        console.log('Event tracked:', eventName, properties);
        
        // Example implementations:
        // gtag('event', eventName, properties);
        // plausible(eventName, { props: properties });
      }
    };

    // Listen for custom analytics events
    const handleAnalyticsEvent = (event: CustomEvent) => {
      trackEvent(event.detail.name, event.detail.properties);
    };

    window.addEventListener('analytics-event', handleAnalyticsEvent as EventListener);
    
    return () => {
      window.removeEventListener('analytics-event', handleAnalyticsEvent as EventListener);
    };
  }, []);

  return null; // This component doesn't render anything
};

// Helper function to track custom events from anywhere in the app
export const trackEvent = (name: string, properties?: Record<string, any>) => {
  window.dispatchEvent(new CustomEvent('analytics-event', {
    detail: { name, properties }
  }));
};

export default Analytics;
