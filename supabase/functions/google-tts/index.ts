
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_CLOUD_TTS_API_KEY = Deno.env.get('GOOGLE_CLOUD_TTS_API_KEY') || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helpers for base64 <-> Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000; // process in chunks to avoid stack limits
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

function splitTextIntoChunks(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current = '';
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length > maxChars) {
      if (current) chunks.push(current);
      current = w;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function synthesizeWithGoogle(text: string): Promise<string> {
  const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_CLOUD_TTS_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text },
      voice: {
        languageCode: "en-US",
        name: "en-US-Chirp3-HD-Charon",
      },
      audioConfig: { audioEncoding: "MP3" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Google Cloud TTS API error:", errorText);
    throw new Error(`Google Cloud TTS API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.audioContent as string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, messageId } = await req.json();

    if (!text) {
      throw new Error("No text provided for speech synthesis");
    }

    console.log(`Generating speech for text: "${text.substring(0, 50)}..."`);
    console.log(`Using Google Cloud Text-to-Speech API with voice: en-US-Chirp3-HD-Charon`);

    // Progressive chunking for long texts
    const MAX_CHARS = 4500; // keep a margin under API limits
    let finalBase64 = '';

    if (text.length <= MAX_CHARS) {
      finalBase64 = await synthesizeWithGoogle(text);
    } else {
      const parts = splitTextIntoChunks(text, MAX_CHARS);
      console.log(`Text split into ${parts.length} chunks for synthesis.`);
      const audioParts: Uint8Array[] = [];
      for (let i = 0; i < parts.length; i++) {
        console.log(`Synthesizing chunk ${i + 1}/${parts.length} (length: ${parts[i].length})`);
        const partBase64 = await synthesizeWithGoogle(parts[i]);
        audioParts.push(base64ToUint8Array(partBase64));
      }
      const totalLength = audioParts.reduce((acc, cur) => acc + cur.length, 0);
      const merged = new Uint8Array(totalLength);
      let offset = 0;
      for (const p of audioParts) { merged.set(p, offset); offset += p.length; }
      finalBase64 = uint8ArrayToBase64(merged);
    }

    // Return the base64 encoded audio
    return new Response(JSON.stringify({ 
      audioContent: finalBase64,
      messageId
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in google-tts function:", error);
    
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
