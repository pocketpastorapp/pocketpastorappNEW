/**
 * Shared rate limiting utilities for Supabase Edge Functions
 * 
 * Provides in-memory rate limiting to protect against abuse and DoS attacks.
 * 
 * Usage:
 * ```typescript
 * import { checkRateLimit, RateLimitConfig } from '../_shared/rateLimiting.ts';
 * 
 * const config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 };
 * if (!checkRateLimit(identifier, config)) {
 *   return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
 * }
 * ```
 */

export interface RateLimitConfig {
  maxRequests: number;  // Maximum requests allowed
  windowMs: number;     // Time window in milliseconds
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limits
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns true if request is allowed, false if rate limited
 */
export const checkRateLimit = (
  identifier: string,
  config: RateLimitConfig = { maxRequests: 60, windowMs: 60000 }
): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  
  // Clean up old entries periodically
  if (rateLimitStore.size > 10000) {
    cleanupExpiredEntries(now);
  }
  
  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return true;
  }
  
  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return false;
  }
  
  // Increment counter
  entry.count++;
  return true;
};

/**
 * Get remaining requests for an identifier
 * @param identifier - Unique identifier
 * @param config - Rate limit configuration
 * @returns Number of requests remaining in current window
 */
export const getRemainingRequests = (
  identifier: string,
  config: RateLimitConfig = { maxRequests: 60, windowMs: 60000 }
): number => {
  const entry = rateLimitStore.get(identifier);
  const now = Date.now();
  
  if (!entry || now > entry.resetTime) {
    return config.maxRequests;
  }
  
  return Math.max(0, config.maxRequests - entry.count);
};

/**
 * Reset rate limit for an identifier
 * @param identifier - Unique identifier to reset
 */
export const resetRateLimit = (identifier: string): void => {
  rateLimitStore.delete(identifier);
};

/**
 * Clean up expired entries from the store
 * @param currentTime - Current timestamp
 */
const cleanupExpiredEntries = (currentTime: number): void => {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (currentTime > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
};

/**
 * Get rate limit headers for response
 * @param identifier - Unique identifier
 * @param config - Rate limit configuration
 * @returns Headers object with rate limit information
 */
export const getRateLimitHeaders = (
  identifier: string,
  config: RateLimitConfig = { maxRequests: 60, windowMs: 60000 }
): Record<string, string> => {
  const remaining = getRemainingRequests(identifier, config);
  const entry = rateLimitStore.get(identifier);
  const resetTime = entry?.resetTime || Date.now() + config.windowMs;
  
  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString()
  };
};

/**
 * Common rate limit configurations
 */
export const RATE_LIMIT_PRESETS = {
  // Very strict - for sensitive operations
  STRICT: { maxRequests: 5, windowMs: 60000 },      // 5 per minute
  
  // Standard - for normal API endpoints
  STANDARD: { maxRequests: 60, windowMs: 60000 },   // 60 per minute
  
  // Relaxed - for read-only operations
  RELAXED: { maxRequests: 120, windowMs: 60000 },   // 120 per minute
  
  // Generous - for high-traffic endpoints
  GENEROUS: { maxRequests: 300, windowMs: 60000 },  // 300 per minute
};

/**
 * Extract client identifier from request
 * @param req - Request object
 * @returns Client identifier (IP address or 'unknown')
 */
export const getClientIdentifier = (req: Request): string => {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
};
