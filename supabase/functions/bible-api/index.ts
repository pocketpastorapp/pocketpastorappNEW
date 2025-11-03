
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security validation helpers
const validateEndpoint = (endpoint: string): boolean => {
  // Only allow specific Bible API endpoints
  const allowedPaths = ['/bibles', '/verses', '/chapters', '/books', '/search'];
  return allowedPaths.some(path => endpoint.startsWith(path)) && 
         endpoint.length < 200 &&
         !/[<>;"'`]/.test(endpoint);
};

const validateParams = (params: any): boolean => {
  if (!params || typeof params !== 'object') return true;
  
  // Validate param values
  for (const [key, value] of Object.entries(params)) {
    if (typeof value !== 'string' && typeof value !== 'number') return false;
    if (typeof value === 'string' && value.length > 500) return false;
    if (typeof key === 'string' && key.length > 50) return false;
  }
  return true;
};

const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const limit = rateLimitStore.get(identifier);
  
  if (!limit || now > limit.resetTime) {
    // Reset limit every minute
    rateLimitStore.set(identifier, { count: 1, resetTime: now + 60000 });
    return true;
  }
  
  if (limit.count >= 60) { // 60 requests per minute
    return false;
  }
  
  limit.count++;
  return true;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { endpoint, params } = await req.json();
    
    // Input validation
    if (!endpoint || typeof endpoint !== 'string') {
      console.warn(`Invalid endpoint provided: ${endpoint}`);
      return new Response(
        JSON.stringify({ error: 'Invalid endpoint' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validateEndpoint(endpoint)) {
      console.warn(`Security: Rejected invalid endpoint: ${endpoint}`);
      return new Response(
        JSON.stringify({ error: 'Invalid endpoint format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validateParams(params)) {
      console.warn(`Security: Invalid parameters provided`);
      return new Response(
        JSON.stringify({ error: 'Invalid parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('BIBLE_API_KEY');
    if (!apiKey) {
      console.error('Bible API key is not configured');
      return new Response(
        JSON.stringify({ error: 'Bible API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const baseUrl = 'https://api.scripture.api.bible/v1';
    const url = new URL(`${baseUrl}${endpoint}`);
    
    // Add query parameters
    if (params) {
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });
    }

    console.log(`Bible API request: ${endpoint} from IP: ${clientIp}`);

    const response = await fetch(url.toString(), {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error calling Bible API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
