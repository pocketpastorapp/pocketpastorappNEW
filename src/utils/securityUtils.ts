// Security utilities for authentication and monitoring
import { logError } from "@/utils/productionConfig";

interface SecurityEvent {
  type: 'login_attempt' | 'login_success' | 'login_failure' | 'registration_attempt' | 'registration_success' | 'logout' | 'suspicious_activity' | 'data_access';
  email?: string;
  timestamp: number;
  userAgent?: string;
  ip?: string;
  details?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high';
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Keep last 1000 events in memory

  logEvent(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      severity: event.severity || 'low'
    };

    this.events.push(securityEvent);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Enhanced security logging with real-time alerts
    if (event.type === 'login_failure') {
      logError(new Error(`Login failure for ${event.email}`), 'SECURITY');
      this.triggerSecurityAlert(securityEvent, 'Login failure detected');
    }
    
    if (event.type === 'suspicious_activity') {
      logError(new Error(`Suspicious activity detected: ${event.details?.reason}`), 'SECURITY');
      this.triggerSecurityAlert(securityEvent, 'Suspicious activity detected');
    }

    // Monitor for critical severity events
    if (event.severity === 'high') {
      this.triggerSecurityAlert(securityEvent, 'High severity security event');
    }

    // Store in localStorage for persistence across sessions
    try {
      localStorage.setItem('pocket-pastor-security-events', JSON.stringify(this.events.slice(-100)));
    } catch (error) {
      console.warn('Failed to store security events:', error);
    }
  }

  // Real-time security alerting system
  private triggerSecurityAlert(event: SecurityEvent, message: string) {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn(`🚨 SECURITY ALERT: ${message}`, event);
    }

    // You can extend this to send alerts to monitoring services
    // Example: Send to a monitoring endpoint, display toast notification, etc.
    try {
      // Store critical events separately for admin review
      const criticalEvents = JSON.parse(localStorage.getItem('pocket-pastor-critical-events') || '[]');
      criticalEvents.push({ ...event, alertMessage: message });
      
      // Keep only last 50 critical events
      const recentCritical = criticalEvents.slice(-50);
      localStorage.setItem('pocket-pastor-critical-events', JSON.stringify(recentCritical));
    } catch (error) {
      console.warn('Failed to store critical security event:', error);
    }
  }

  // Get critical events for admin dashboard
  getCriticalEvents(): Array<SecurityEvent & { alertMessage: string }> {
    try {
      return JSON.parse(localStorage.getItem('pocket-pastor-critical-events') || '[]');
    } catch {
      return [];
    }
  }

// Enhanced threat detection with improved security monitoring
detectSuspiciousActivity(email: string): boolean {
  const recentEvents = this.events.filter(event => 
    event.email === email && 
    event.timestamp > Date.now() - (5 * 60 * 1000) // Last 5 minutes
  );

  // Check for rapid login attempts (reduced threshold)
  const loginAttempts = recentEvents.filter(e => e.type === 'login_attempt').length;
  if (loginAttempts > 5) {
    this.logEvent({
      type: 'suspicious_activity',
      email,
      severity: 'high',
      details: { reason: 'rapid_login_attempts', count: loginAttempts }
    });
    return true;
  }

  // Check for user agent changes (more sensitive)
  const userAgents = new Set(recentEvents.map(e => e.userAgent));
  if (userAgents.size > 2) {
    this.logEvent({
      type: 'suspicious_activity',
      email,
      severity: 'medium',
      details: { reason: 'multiple_user_agents', count: userAgents.size }
    });
    return true;
  }

  // Check for failed login patterns
  const failedLogins = recentEvents.filter(e => e.type === 'login_failure').length;
  if (failedLogins > 3) {
    this.logEvent({
      type: 'suspicious_activity',
      email,
      severity: 'medium',
      details: { reason: 'multiple_login_failures', count: failedLogins }
    });
    return true;
  }

  return false;
}

  getRecentFailures(email: string, timeWindow: number = 15 * 60 * 1000): number {
    const cutoff = Date.now() - timeWindow;
    return this.events.filter(event => 
      event.type === 'login_failure' && 
      event.email === email && 
      event.timestamp > cutoff
    ).length;
  }

  isRateLimited(email: string): boolean {
    const recentFailures = this.getRecentFailures(email);
    return recentFailures >= 5; // Rate limit after 5 failures in 15 minutes
  }

  clearUserEvents(email: string) {
    this.events = this.events.filter(event => event.email !== email);
  }

  // Load events from localStorage on initialization
  loadStoredEvents() {
    try {
      const stored = localStorage.getItem('pocket-pastor-security-events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load stored security events:', error);
    }
  }
}

export const securityLogger = new SecurityLogger();

// Initialize stored events
securityLogger.loadStoredEvents();

// Password strength validation
export const validatePasswordStrength = (password: string): { 
  isValid: boolean; 
  issues: string[] 
} => {
  const issues: string[] = [];
  
  // Enhanced password requirements
  if (password.length < 12) {
    issues.push("At least 12 characters required for better security");
  }
  
  if (!/[a-z]/.test(password)) {
    issues.push("At least one lowercase letter required");
  }
  
  if (!/[A-Z]/.test(password)) {
    issues.push("At least one uppercase letter required");
  }
  
  if (!/\d/.test(password)) {
    issues.push("At least one number required");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    issues.push("At least one special character required");
  }

  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    issues.push("Avoid repeating characters");
  }

  // Check for sequential patterns
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789)/i.test(password)) {
    issues.push("Avoid sequential characters or numbers");
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};

// Session security helpers
export const generateSessionId = (): string => {
  return crypto.randomUUID();
};

export const isSessionExpired = (lastActivity: number, timeoutMinutes: number = 30): boolean => {
  const now = Date.now();
  const timeout = timeoutMinutes * 60 * 1000; // Convert to milliseconds
  return (now - lastActivity) > timeout;
};

// Activity tracking for session management
export const updateLastActivity = () => {
  localStorage.setItem('pocket-pastor-last-activity', Date.now().toString());
};

export const getLastActivity = (): number => {
  const stored = localStorage.getItem('pocket-pastor-last-activity');
  return stored ? parseInt(stored) : Date.now();
};

// Initialize activity tracking
updateLastActivity();

// Enhanced input sanitization and validation
export const sanitizeInput = (input: string): string => {
  return input.trim()
    .replace(/[<>]/g, '') // Remove potential XSS vectors
    .replace(/['"]/g, '') // Remove quotes to prevent injection
    .replace(/javascript:/gi, '') // Remove javascript protocols
    .replace(/data:/gi, '') // Remove data URIs
    .substring(0, 1000); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254 && email.length >= 5;
};

export const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol) && url.length <= 2048;
  } catch {
    return false;
  }
};

export const validateSessionToken = (token: string): boolean => {
  // Basic token format validation
  return typeof token === 'string' && token.length > 20 && /^[A-Za-z0-9._-]+$/.test(token);
};

// Set up activity listeners
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
  document.addEventListener(event, updateLastActivity, { passive: true });
});
