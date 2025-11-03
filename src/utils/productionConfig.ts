
// Production configuration and environment checks
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

// App configuration
export const APP_CONFIG = {
  name: 'Pocket Pastor',
  version: '1.0.0',
  description: 'AI-powered spiritual guidance and Bible study tools',
  
  // URLs (update these with your actual domain)
  siteUrl: isProduction ? 'https://your-domain.com' : 'http://localhost:5173',
  apiUrl: 'https://tsgbptmfvyhpfpefdbsn.supabase.co',
  
  // Features
  features: {
    analytics: isProduction,
    errorReporting: isProduction,
    debugMode: isDevelopment,
  },
  
  // Limits
  limits: {
    maxMessageLength: 4000,
    maxNotesPerUser: 1000,
    maxFavoritesPerUser: 500,
  },
  
  // Contact
  support: {
    email: 'support@your-domain.com', // Update with your support email
  }
};

// Performance monitoring
export const performanceConfig = {
  // Core Web Vitals thresholds
  thresholds: {
    FCP: 1800, // First Contentful Paint (ms)
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100,  // First Input Delay (ms)
    CLS: 0.1,  // Cumulative Layout Shift
  }
};

// Security configuration
export const securityConfig = {
  // Content Security Policy (implement in your hosting platform)
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://tsgbptmfvyhpfpefdbsn.supabase.co"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://tsgbptmfvyhpfpefdbsn.supabase.co"],
  }
};

// Logging configuration
export const loggingConfig = {
  level: isProduction ? 'error' : 'debug',
  enableConsole: isDevelopment,
  enableRemote: isProduction,
};

// Helper function to log errors in production
export const logError = (error: Error, context?: string) => {
  if (isDevelopment) {
    console.error('Error:', error, 'Context:', context);
  }
  
  if (isProduction) {
    // In production, send to error reporting service
    // Example: Sentry.captureException(error, { extra: { context } });
    console.error('Production Error:', error.message);
  }
};

// Helper function to log analytics events
export const logAnalyticsEvent = (eventName: string, properties?: Record<string, any>) => {
  if (APP_CONFIG.features.analytics) {
    // Send to analytics service
    window.dispatchEvent(new CustomEvent('analytics-event', {
      detail: { name: eventName, properties }
    }));
  }
};
