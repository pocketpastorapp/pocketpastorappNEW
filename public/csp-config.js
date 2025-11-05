
// Enhanced Content Security Policy configuration
// SECURITY NOTE: unsafe-inline for scripts should be removed when implementing nonce-based CSP
const cspConfig = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // TODO: Remove when nonce-based CSP is implemented in Vite
    "https://tsgbptmfvyhpfpefdbsn.supabase.co",
    "https://pagead2.googlesyndication.com", // Google AdSense
    "https://cdn.gpteng.co" // GPT Engineer analytics
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS and Tailwind
    "https://fonts.googleapis.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "blob:",
    "https:",
    "*.lovableproject.com",
    "*.supabase.co"
  ],
  'connect-src': [
    "'self'",
    "https://tsgbptmfvyhpfpefdbsn.supabase.co",
    "wss://tsgbptmfvyhpfpefdbsn.supabase.co",
    "https://api.openai.com"
  ],
  'media-src': [
    "'self'",
    "blob:",
    "data:",
    "*.supabase.co"
  ],
  'worker-src': [
    "'self'",
    "blob:"
  ],
  'manifest-src': ["'self'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'object-src': ["'none'"],
  'upgrade-insecure-requests': []
};

// Additional security headers
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
};

// Generate CSP header string
const generateCSPHeader = () => {
  return Object.entries(cspConfig)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

// Export for use in service worker
if (typeof self !== 'undefined') {
  self.CSP_HEADER = generateCSPHeader();
  self.SECURITY_HEADERS = securityHeaders;
}
