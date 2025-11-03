# Security Documentation

## Overview
This document outlines the security measures, best practices, and important considerations for the Pocket Pastor application.

## Current Security Status: B+ (Good)

### ✅ Strong Security Measures

1. **Session Security**
   - Secure JWT-based authentication via Supabase
   - Auto-refresh tokens enabled
   - Session persistence with localStorage
   - Activity tracking and timeout monitoring

2. **Input Validation**
   - Client-side validation using Zod schemas
   - HTML sanitization with DOMPurify
   - Enhanced security utilities in `src/utils/securityUtils.ts`
   - Edge function input validation with rate limiting

3. **Row Level Security (RLS)**
   - Comprehensive RLS policies on all user tables
   - User-specific data isolation
   - Proper foreign key constraints
   - Security definer functions for privilege escalation prevention

4. **No Hardcoded Secrets**
   - All API keys stored in Supabase secrets
   - Environment variables properly managed
   - No credentials in codebase

5. **Content Security**
   - CSP configuration in `public/csp-config.js`
   - XSS protection headers
   - Frame protection (X-Frame-Options: DENY)
   - Content type sniffing prevention

6. **Monitoring & Logging**
   - Security event logging system
   - Suspicious activity detection
   - Rate limiting on authentication attempts
   - Real-time security alerts

## ⚠️ Critical Actions Required

### 1. Enable Leaked Password Protection (IMMEDIATE)
**Risk Level:** HIGH

Supabase provides built-in protection against compromised passwords from known data breaches.

**Action Steps:**
1. Go to [Supabase Authentication Settings](https://supabase.com/dashboard/project/tsgbptmfvyhpfpefdbsn/auth/providers)
2. Navigate to "Authentication" → "Settings"
3. Enable "Leaked Password Protection"
4. Save changes

**Impact:** Prevents users from setting passwords that have been exposed in data breaches.

### 2. Upgrade PostgreSQL Version
**Risk Level:** HIGH

Your database is running an outdated PostgreSQL version with known security vulnerabilities.

**Action Steps:**
1. Check current version in Supabase Dashboard
2. Review upgrade documentation
3. Schedule maintenance window
4. Perform database upgrade
5. Test all functionality post-upgrade

### 3. Review Email Data Exposure
**Risk Level:** MEDIUM

The `profiles` table contains user emails with RLS enabled, but consider if this exposure is necessary.

**Considerations:**
- Are emails needed for app functionality?
- Could you use user IDs instead?
- Are RLS policies sufficient for your use case?

**Current RLS on profiles table:**
```sql
-- Users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING ((id = auth.uid()) AND (auth.uid() IS NOT NULL));
```

## 🔒 Security Best Practices

### Authentication
- **Password Requirements:** Minimum 12 characters with complexity requirements
- **Rate Limiting:** 5 failed attempts in 15 minutes triggers rate limiting
- **Session Timeout:** 30 minutes of inactivity
- **Multi-device Detection:** Monitors for suspicious user agent changes

### Edge Functions Security

#### Public Functions (JWT Disabled)
1. **process-payment**: Properly secured with Stripe webhook signature verification
2. **bible-api**: Enhanced with:
   - Rate limiting (60 requests/minute per IP)
   - Input validation and sanitization
   - Allowed endpoint whitelist
   - Request size limits

#### Protected Functions (JWT Required)
- create-checkout
- verify-payment
- increment-credits
- openai-chat
- google-tts
- eleven-tts
- send-email
- set-bible-api-key
- set-secret

### Data Protection
1. **User Data Isolation**: All user tables have RLS policies
2. **PII Protection**: Sensitive data (emails, names) restricted by RLS
3. **Credit Validation**: Database functions validate credit operations
4. **Purchase Integrity**: Triggers validate purchase amounts and prevent duplicates

### Input Sanitization
All user inputs are sanitized using:
- `sanitizeInput()` - Removes XSS vectors, quotes, and protocols
- `validateEmail()` - RFC-compliant email validation
- `validateUrl()` - Ensures only HTTP/HTTPS protocols
- DOMPurify - Sanitizes HTML content

## 🚨 Security Monitoring

### Automatic Detection
The system automatically detects:
- Rapid login attempts (>5 in 5 minutes)
- Multiple user agent changes
- Failed login patterns (>3 in 5 minutes)
- Rapid navigation changes
- Console tampering attempts

### Security Events Logged
- `login_attempt`
- `login_success`
- `login_failure`
- `registration_attempt`
- `registration_success`
- `logout`
- `suspicious_activity`
- `data_access`

### Severity Levels
- **Low**: Normal authentication events
- **Medium**: Failed logins, user agent changes
- **High**: Rapid attempts, console tampering

## 📊 Monitoring Dashboard

Critical security events are stored separately for admin review:
```javascript
securityLogger.getCriticalEvents()
```

Events are kept in localStorage:
- Last 100 security events: `pocket-pastor-security-events`
- Last 50 critical events: `pocket-pastor-critical-events`

## 🔧 Security Utilities

### Available Functions
```typescript
// Password validation
validatePasswordStrength(password: string): { isValid: boolean; issues: string[] }

// Input sanitization
sanitizeInput(input: string): string
validateEmail(email: string): boolean
validateUrl(url: string): boolean
validateSessionToken(token: string): boolean

// Session management
generateSessionId(): string
isSessionExpired(lastActivity: number, timeoutMinutes?: number): boolean
updateLastActivity(): void
getLastActivity(): number

// Security logging
securityLogger.logEvent(event)
securityLogger.detectSuspiciousActivity(email: string): boolean
securityLogger.isRateLimited(email: string): boolean
```

## 🛡️ Threat Prevention

### SQL Injection
- ✅ Using Supabase client methods (no raw SQL in edge functions)
- ✅ Parameterized queries
- ✅ RLS policies prevent unauthorized access

### XSS (Cross-Site Scripting)
- ✅ DOMPurify sanitization
- ✅ CSP headers
- ✅ Input validation
- ✅ Content-Type headers

### CSRF (Cross-Site Request Forgery)
- ✅ JWT token validation
- ✅ CORS configuration
- ✅ Supabase built-in protection

### Brute Force Attacks
- ✅ Rate limiting
- ✅ Account lockout after failures
- ✅ Suspicious activity detection

### Session Hijacking
- ✅ Secure token storage
- ✅ Auto-refresh tokens
- ✅ Activity monitoring
- ✅ Session timeout

## 📝 Security Checklist

### Before Deployment
- [ ] Enable Leaked Password Protection in Supabase
- [ ] Upgrade PostgreSQL to latest version
- [ ] Review all RLS policies
- [ ] Test authentication flows
- [ ] Verify rate limiting works
- [ ] Check CSP configuration
- [ ] Review edge function security
- [ ] Test input validation
- [ ] Verify error messages don't leak sensitive info

### Regular Maintenance
- [ ] Review security logs weekly
- [ ] Update dependencies monthly
- [ ] Review RLS policies quarterly
- [ ] Audit user permissions quarterly
- [ ] Test disaster recovery annually

### Incident Response
1. Detect: Monitor security alerts and logs
2. Contain: Rate limit or disable affected endpoints
3. Investigate: Review security events and logs
4. Remediate: Apply fixes and patches
5. Learn: Document and update procedures

## 🔗 Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [Edge Functions Security](https://supabase.com/docs/guides/functions/security)

## 📞 Security Contact

For security concerns or to report vulnerabilities, please follow responsible disclosure practices.

---

**Last Updated:** 2025
**Security Review Date:** 2025-01-31
**Next Review:** 2025-07-31
