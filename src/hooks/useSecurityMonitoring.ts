import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { securityLogger } from '@/utils/securityUtils';

export const useSecurityMonitoring = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Monitor for suspicious page access patterns
    const handleVisibilityChange = () => {
      if (document.hidden) {
        securityLogger.logEvent({
          type: 'data_access',
          email: user.email,
          details: { action: 'page_hidden', page: window.location.pathname }
        });
      }
    };

    // Monitor for rapid navigation changes
    let lastNavigationTime = Date.now();
    const handleNavigation = () => {
      const now = Date.now();
      if (now - lastNavigationTime < 100) { // Very rapid navigation
        securityLogger.logEvent({
          type: 'suspicious_activity',
          email: user.email,
          severity: 'medium',
          details: { 
            reason: 'rapid_navigation', 
            interval: now - lastNavigationTime,
            page: window.location.pathname
          }
        });
      }
      lastNavigationTime = now;
    };

    // Monitor for console access (potential tampering)
    const originalConsole = window.console.log;
    window.console.log = function(...args) {
      if (args.some(arg => typeof arg === 'string' && arg.includes('auth'))) {
        securityLogger.logEvent({
          type: 'suspicious_activity',
          email: user.email,
          severity: 'high',
          details: { reason: 'console_auth_access' }
        });
      }
      return originalConsole.apply(console, args);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handleNavigation);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handleNavigation);
      window.console.log = originalConsole;
    };
  }, [user]);

  // Expose security utilities for components
  return {
    logSecurityEvent: (type: string, details?: Record<string, any>) => {
      if (user) {
        securityLogger.logEvent({
          type: type as any,
          email: user.email,
          details
        });
      }
    }
  };
};