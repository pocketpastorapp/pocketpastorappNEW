
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ELEVEN_LABS_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY') || "";
const ELEVEN_LABS_SECRET_KEY = Deno.env.get('ELEVEN_LABS_SECRET_KEY') || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceId = "gnsUUdDlDou1W0TIbt5q", model = "eleven_monolingual_v1" } = await req.json();

    if (!text) {
      throw new Error("No text provided for speech synthesis");
    }

    console.log(`Generating speech for text: "${text.substring(0, 50)}..."`);
    console.log(`Using voice ID: ${voiceId}`);
    console.log(`Using model: ${model}`);

    // Make request to Eleven Labs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVEN_LABS_API_KEY,
        "xi-secret-key": ELEVEN_LABS_SECRET_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.15,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Eleven Labs API error:", errorText);
      throw new Error(`Eleven Labs API error: ${response.status} - ${errorText}`);
    }

    // Get the audio buffer and convert it to base64
    const audioBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(audioBuffer);
    
    // Convert to base64
    let binary = '';
    for (let i = 0; i < uint8Array.byteLength; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64Data = btoa(binary);
    
    // Return the base64 encoded audio
    return new Response(base64Data, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error in eleven-tts function:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
