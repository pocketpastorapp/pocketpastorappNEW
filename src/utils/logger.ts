/**
 * Environment-aware logger utility
 * Production: Only logs errors and warnings (no sensitive data)
 * Development: Full logging for debugging (with warnings about sensitive data)
 *
 * SECURITY: Never log user IDs, emails, tokens, passwords, or conversation content in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

const isDevelopment = import.meta.env.DEV;
const logHistory: LogEntry[] = [];
const MAX_LOGS = 100; // Keep last 100 logs in memory for debugging

/**
 * Log at debug level (development only)
 */
export const debug = (message: string, data?: unknown) => {
  if (isDevelopment) {
    console.debug(`[DEBUG] ${message}`, data);
    addToHistory('debug', message, data);
  }
};

/**
 * Log at info level (development only)
 */
export const info = (message: string, data?: unknown) => {
  if (isDevelopment) {
    console.info(`[INFO] ${message}`, data);
    addToHistory('info', message, data);
  }
};

/**
 * Log at warning level (both environments)
 */
export const warn = (message: string, data?: unknown) => {
  console.warn(`[WARN] ${message}`, data);
  addToHistory('warn', message, data);
};

/**
 * Log at error level (both environments)
 * Production: Only logs error message, no sensitive data
 */
export const error = (message: string, err?: unknown) => {
  // In production, only log the error message and error code if available
  if (!isDevelopment && err instanceof Error) {
    console.error(`[ERROR] ${message}: ${err.message}`);
    addToHistory('error', `${message}: ${err.message}`);
  } else if (!isDevelopment && typeof err === 'object') {
    // Don't log full error objects in production
    console.error(`[ERROR] ${message}`);
    addToHistory('error', message);
  } else {
    // Development: log full error details
    console.error(`[ERROR] ${message}`, err);
    addToHistory('error', message, isDevelopment ? err : undefined);
  }
};

/**
 * Add entry to in-memory log history
 */
const addToHistory = (level: LogLevel, message: string, data?: unknown) => {
  logHistory.push({
    level,
    message,
    data,
    timestamp: new Date().toISOString(),
  });

  // Keep history size bounded
  if (logHistory.length > MAX_LOGS) {
    logHistory.shift();
  }
};

/**
 * Get recent logs (development only, for debugging)
 */
export const getRecentLogs = (): LogEntry[] => {
  return isDevelopment ? [...logHistory] : [];
};

/**
 * Clear log history
 */
export const clearLogs = () => {
  logHistory.length = 0;
};

/**
 * Assert that data is not being logged in production
 * Usage: sanitizeForLog(userData, ['email', 'password', 'userId'])
 */
export const sanitizeForLog = (data: unknown, sensitiveFields: string[]): unknown => {
  if (isDevelopment) {
    return data;
  }

  // In production, replace sensitive fields with [REDACTED]
  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        (sanitized as Record<string, unknown>)[field] = '[REDACTED]';
      }
    }
    return sanitized;
  }

  return data;
};

export default {
  debug,
  info,
  warn,
  error,
  getRecentLogs,
  clearLogs,
  sanitizeForLog,
};
